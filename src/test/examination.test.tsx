import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Examination } from '../features/physical/Examination'
import { ScannerClock } from '../features/physical/ScannerClock'
import { clinicalSession } from '../state/clinical'
import { scannerRuntime } from '../state/scanner'
import { planScan } from '../features/physical/scanTimeline'

afterEach(()=>{act(()=>scannerRuntime.dispose());scannerRuntime.setCameraReady(true)})
function advance(seconds:number){act(()=>{for(let t=0;t<seconds;t+=.02)scannerRuntime.advance(Math.min(.02,seconds-t))})}
describe('patient examination lifecycle',()=>{
 it('completes only after the authoritative gantry return and clears the bed',()=>{
  render(<Examination crewId="timer-patient"/>)
  fireEvent.click(screen.getByRole('button',{name:'Prepare examination'}));expect(clinicalSession('timer-patient').examination).toBe('EXAMINATION_ACTIVE')
  fireEvent.click(screen.getByRole('button',{name:'Start demonstration scan'}))
  advance(5);expect(clinicalSession('timer-patient').examination).toBe('SCAN_ACTIVE');expect(scannerRuntime.current()!.offset).toBeGreaterThan(.5)
  advance(planScan('Full body').duration-5-.05);expect(clinicalSession('timer-patient').examination).toBe('SCAN_ACTIVE')
  advance(.1);expect(scannerRuntime.current()!.offset).toBe(0);expect(clinicalSession('timer-patient').examination).toBe('EXAMINATION_COMPLETE')
  expect(screen.getByRole('progressbar',{name:'Examination progress'})).toHaveAttribute('value','1')
  fireEvent.click(screen.getByRole('button',{name:'Clear examination'}));expect(clinicalSession('timer-patient').scanStartedAt).toBeNull();expect(clinicalSession('timer-patient').examination).toBe('EMPTY_BED')
 })
 it('continues on panel close and returns safely when the selected crew changes',()=>{
  const clock=render(<ScannerClock crewId="cancel-patient" region="Full body"/>)
  const view=render(<Examination crewId="cancel-patient"/>)
  fireEvent.click(screen.getByRole('button',{name:'Prepare examination'}));fireEvent.click(screen.getByRole('button',{name:'Start demonstration scan'}));advance(4)
  view.unmount();expect(clinicalSession('cancel-patient').examination).toBe('SCAN_ACTIVE')
  clock.rerender(<ScannerClock crewId="other-patient" region="Full body"/>);expect(scannerRuntime.current()!.phase).toBe('cancelling')
  advance(5);expect(scannerRuntime.current()!.offset).toBe(0);expect(clinicalSession('cancel-patient').examination).toBe('EXAMINATION_ACTIVE');expect(clinicalSession('other-patient').examination).toBe('PATIENT_READY')
  clock.unmount()
 })
 it('requires preparation, prevents overlap and keeps region selection disabled until cancellation returns',()=>{
  render(<Examination crewId="region-patient"/>)
  fireEvent.change(screen.getByRole('combobox',{name:'Examination region'}),{target:{value:'Chest'}})
  expect(screen.queryByRole('button',{name:'Start demonstration scan'})).not.toBeInTheDocument()
  act(()=>scannerRuntime.setCameraReady(false));fireEvent.click(screen.getByRole('button',{name:'Prepare examination'}))
  expect(screen.getByRole('button',{name:'Settling examination view…'})).toBeDisabled()
  act(()=>scannerRuntime.setCameraReady(true));fireEvent.click(screen.getByRole('button',{name:'Start demonstration scan'}));advance(3)
  expect(screen.getByRole('combobox',{name:'Examination region'})).toBeDisabled()
  fireEvent.click(screen.getByRole('button',{name:'Cancel scan and return'}));expect(screen.getByRole('button',{name:'Cancel scan and return'})).toBeDisabled()
  advance(5);expect(screen.getByTestId('scan-progress')).toHaveAttribute('data-phase','cancelled');expect(screen.getByRole('combobox',{name:'Examination region'})).toBeEnabled()
 })
})

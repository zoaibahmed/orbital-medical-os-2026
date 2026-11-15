import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Examination } from '../features/physical/Examination'
import { clinicalSession } from '../state/clinical'
afterEach(()=>vi.useRealTimers())
describe('patient examination lifecycle',()=>{
 it('times a scan from activation, completes once and clears the bed',()=>{
  vi.useFakeTimers();render(<Examination crewId="timer-patient"/>);
  fireEvent.click(screen.getByRole('button',{name:'Prepare examination'}));expect(clinicalSession('timer-patient').examination).toBe('PATIENT_READY')
  fireEvent.click(screen.getByRole('button',{name:'Start examination'}));fireEvent.click(screen.getByRole('button',{name:'Start demonstration scan'}))
  act(()=>vi.advanceTimersByTime(4999));expect(clinicalSession('timer-patient').examination).toBe('SCAN_ACTIVE')
  act(()=>vi.advanceTimersByTime(1));expect(clinicalSession('timer-patient').examination).toBe('EXAMINATION_COMPLETE')
  fireEvent.click(screen.getByRole('button',{name:'Clear examination'}));expect(clinicalSession('timer-patient').scanStartedAt).toBeNull()
 })
 it('cancels acquisition on exit without completing a different crew session',()=>{
  vi.useFakeTimers();const view=render(<Examination crewId="cancel-patient"/>);
  fireEvent.click(screen.getByRole('button',{name:'Prepare examination'}));fireEvent.click(screen.getByRole('button',{name:'Start examination'}));fireEvent.click(screen.getByRole('button',{name:'Start demonstration scan'}));view.unmount()
  act(()=>vi.advanceTimersByTime(6000));expect(clinicalSession('cancel-patient').examination).toBe('EXAMINATION_ACTIVE');expect(clinicalSession('other-patient').examination).toBe('PATIENT_READY')
 })
})

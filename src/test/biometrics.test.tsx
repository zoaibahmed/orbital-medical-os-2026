import {render,screen} from '@testing-library/react'
import {describe,expect,it} from 'vitest'
import {BiometricMonitor} from '../features/experience/BiometricMonitor'
import {crew,getFixtureSnapshot} from '../data/fixtures'

describe('biometric display quality',()=>{
 it('does not present invalid numeric heart rate or pressure as available data',()=>{
  const original=getFixtureSnapshot('crew-01')!
  const snapshot={...original,biometrics:{...original.biometrics,heartRate:{...original.biometrics.heartRate,quality:'invalid' as const},systolicPressure:{...original.biometrics.systolicPressure,quality:'missing' as const},heartRateVariability:{...original.biometrics.heartRateVariability,quality:'missing' as const}}}
  render(<BiometricMonitor snapshot={snapshot} astronaut={crew[0]!} onDetails={()=>{}} />)
  expect(screen.getAllByText('Unavailable')).toHaveLength(3)
  expect(screen.queryByText('118/76')).not.toBeInTheDocument()
  expect(screen.getByRole('img',{name:'Animated simulated ECG; illustrative signal, not a clinical recording'})).toBeInTheDocument()
 })
})

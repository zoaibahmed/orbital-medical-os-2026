import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { getFixtureSnapshot } from '../data/fixtures'
import { VitalsDashboard } from '../features/vitals/components/VitalsDashboard'
import { HeartRateTrend } from '../features/vitals/components/HeartRateTrend'
import { PhysicalAssessmentDashboard } from '../features/physical/components/PhysicalAssessmentDashboard'

const base = getFixtureSnapshot('crew-01')!
describe('integrated Faiz presentation', () => {
  it('retains missing values and unknown severity in the accepted instrument presentation', () => {
    render(<VitalsDashboard biometrics={{...base.biometrics,heartRateVariability:{...base.biometrics.heartRateVariability,value:null,quality:'missing'}}} sleep={base.sleep}/>)
    expect(screen.getByText('Unavailable')).toBeInTheDocument()
    expect(screen.queryByText('0 ms')).not.toBeInTheDocument()
    expect(screen.queryByText('Nominal')).not.toBeInTheDocument()
    expect(screen.getAllByText(/Not assessed/).length).toBeGreaterThan(0)
  })
  it('preserves gaps in the trace and an accessible timestamped history table', () => {
    const {container}=render(<HeartRateTrend samples={[{measuredAt:'2026-11-15T01:00:00Z',bpm:72},{measuredAt:'2026-11-15T01:00:01Z',bpm:null},{measuredAt:'2026-11-15T01:00:02Z',bpm:75}]}/>)
    expect(container.querySelector('path')?.getAttribute('d')?.match(/M/g)).toHaveLength(2)
    expect(screen.getByRole('table',{hidden:true})).toHaveTextContent('Unavailable')
  })
  it('keeps the eight draft SANS questions unscored and supports explicit unknown answers', async () => {
    render(<PhysicalAssessmentDashboard assessment={base.physical}/>)
    const user=userEvent.setup()
    await user.click(within(screen.getByRole('group',{name:'Distance vision looked blurry'})).getByRole('radio',{name:'Yes'}))
    expect(screen.getByRole('status')).toHaveTextContent('1 of 8 answered · 1 reported')
    await user.click(screen.getByRole('button',{name:'Start over'}))
    expect(screen.getByRole('status')).toHaveTextContent('0 of 8 answered · 0 reported')
  })
})

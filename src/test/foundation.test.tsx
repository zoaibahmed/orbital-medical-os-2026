import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AppRoutes } from '../app/App'
import { getFixtureSnapshot } from '../data/fixtures'
import { formatMeasurement } from '../domain/format'
import { createStationRegistry } from '../scene/interaction/stationRegistry'
import { getAssetUrl, type ModelAsset } from '../scene/assets/registry'

function renderRoute(path: string) { return render(<MemoryRouter initialEntries={[path]}><AppRoutes /></MemoryRouter>) }

describe('unified foundation workflows', () => {
  it('keeps the medical module index and boundary previews accessible without a renderer', async () => {
    renderRoute('/bay/overview?crew=crew-01')
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Medical index' }))
    expect(screen.getByRole('button', { name: /Crew biometrics & vitals/ })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Space radiation monitoring/ }))
    expect(await screen.findByRole('heading', { name: 'Space radiation monitoring' })).toBeInTheDocument()
    expect(await screen.findByText('18 µSv/h')).toBeInTheDocument()
  })
  it('switches crew in the URL and supplies the matching snapshot atomically', async () => {
    renderRoute('/bay/vitals?crew=crew-01')
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /Crew and display settings/ }))
    await user.selectOptions(screen.getByRole('combobox', { name: 'Astronaut' }), 'crew-02')
    await user.click(screen.getByRole('button', { name: 'Close mission view' }))
    await user.click(screen.getByRole('button', { name: /Biometrics/ }))
    await user.click(await screen.findByRole('button', { name: 'Open detailed biometrics' }))
    expect(await screen.findByText('81 bpm')).toBeInTheDocument()
    expect(screen.queryByText('72 bpm')).not.toBeInTheDocument()
  })
  it('keeps emergency rehearsal independent of WebGL', async () => {
    renderRoute('/bay/vitals?crew=crew-01')
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Emergency rehearsal' }))
    expect(screen.getByRole('heading', { name: 'Emergency interface rehearsal' })).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Return to station' }))
    await waitFor(() => expect(screen.queryByRole('heading', { name: 'Emergency interface rehearsal' })).not.toBeInTheDocument())
  })
  it.each(['/bay/unknown?crew=crew-01', '/bay/vitals?crew=unknown', '/unknown/vitals', '/dashboard/vitals?crew=unknown', '/bay/radiation?crew=unknown'])('recovers invalid address %s without replacing the shell', path => {
    renderRoute(path)
    expect(screen.getByRole('heading', { name: 'Station or crew unavailable' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Return to mission' })).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})

describe('contract boundaries', () => {
  it('does not turn missing or invalid measurements into zero', () => {
    const measurement = getFixtureSnapshot('crew-01')!.biometrics.heartRate
    expect(formatMeasurement({ ...measurement, value: null })).toBe('Unavailable')
    expect(formatMeasurement({ ...measurement, quality: 'invalid' })).toBe('Unavailable')
    expect(formatMeasurement({ ...measurement, quality: 'stale' })).toBe('72 bpm · Stale')
    expect(formatMeasurement({ ...measurement, value: 0 })).toBe('0 bpm')
    expect(getFixtureSnapshot('unknown')).toBeUndefined()
  })

  it('prevents duplicate station ownership and cleans registration', () => {
    const registry = createStationRegistry()
    const station = { stationId: 'vitals', nodeName: 'anchor_vitals', label: 'Vitals', anchor: [0, 0, 0] } as const
    const dispose = registry.register(station)
    expect(() => registry.register(station)).toThrow('already registered')
    dispose()
    expect(registry.get('vitals')).toBeUndefined()
  })

  it('rejects model paths outside the local asset boundary', () => {
    const asset: ModelAsset = { id: 'test', path: 'assets/models/test.glb', version: '1', bytes: 0, station: 'overview', tier: 'low', license: { source: '', author: '', name: '', attribution: '' }, animations: [] }
    expect(getAssetUrl(asset)).toBe('/assets/models/test.glb?v=1')
    expect(() => getAssetUrl({ ...asset, path: 'assets/models/../private.glb' })).toThrow('Invalid model path')
  })
})


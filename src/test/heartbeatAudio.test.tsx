import { AutomaticMonitoringAudio } from '../features/vitals/AutomaticMonitoringAudio'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getFixtureSnapshot } from '../data/fixtures'
import { HeartbeatAudio } from '../features/vitals/HeartbeatAudio'
import { createMonitoringFeed } from '../features/vitals/monitoring'

class FakeAudioParam {
  setValueAtTime = vi.fn()
  exponentialRampToValueAtTime = vi.fn()
}

class FakeGain {
  gain = new FakeAudioParam()
  connect = vi.fn()
  disconnect = vi.fn()
}

class FakeOscillator {
  type = 'sine'
  frequency = new FakeAudioParam()
  onended: (() => void) | null = null
  connect = vi.fn()
  disconnect = vi.fn()
  private endTimer: number | undefined
  private started = false
  private ended = false

  constructor(private readonly owner: FakeAudioContext) {}

  start = vi.fn((at: number) => {
    this.started = true
    this.owner.starts.push(at * 1000)
    this.owner.activeVoices++
    this.owner.maximumVoices = Math.max(this.owner.maximumVoices, this.owner.activeVoices)
  })

  stop = vi.fn((at?: number) => {
    if (this.endTimer !== undefined) window.clearTimeout(this.endTimer)
    const finish = () => {
      if (this.ended) return
      this.ended = true
      if (this.started) this.owner.activeVoices--
      this.onended?.()
    }
    const delay = at === undefined ? 0 : Math.max(0, (at - this.owner.currentTime) * 1000)
    if (delay) this.endTimer = window.setTimeout(finish, delay)
    else finish()
  })
}

class FakeAudioContext {
  static instances: FakeAudioContext[] = []
  static delayResume = false
  state: AudioContextState = 'suspended'
  destination = {}
  starts: number[] = []
  activeVoices = 0
  maximumVoices = 0
  private completeResume: (() => void) | undefined

  constructor() { FakeAudioContext.instances.push(this) }
  get currentTime() { return performance.now() / 1000 }

  resume = vi.fn(() => {
    const complete = () => { if (this.state !== 'closed') this.state = 'running' }
    if (!FakeAudioContext.delayResume) { complete(); return Promise.resolve() }
    return new Promise<void>(resolve => {
      this.completeResume = () => { complete(); resolve() }
    })
  })
  resolveResume() { this.completeResume?.() }
  suspend = vi.fn(() => {
    if (this.state !== 'closed') this.state = 'suspended'
    return Promise.resolve()
  })
  close = vi.fn(() => { this.state = 'closed'; return Promise.resolve() })
  createOscillator = () => new FakeOscillator(this)
  createGain = () => new FakeGain()
}

const visibilityDescriptor = Object.getOwnPropertyDescriptor(document, 'visibilityState')
function setVisibility(value: DocumentVisibilityState) {
  Object.defineProperty(document, 'visibilityState', { configurable: true, value })
  document.dispatchEvent(new Event('visibilitychange'))
}
async function enableSound() {
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Enable heartbeat audio' }))
    await Promise.resolve()
  })
}

describe('heartbeat audio lifecycle and long-running synchronization', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'performance'] })
    FakeAudioContext.instances = []
    FakeAudioContext.delayResume = false
    vi.stubGlobal('AudioContext', FakeAudioContext)
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' })
  })

  afterEach(() => {
    cleanup()
    vi.clearAllTimers()
    vi.useRealTimers()
    vi.unstubAllGlobals()
    if (visibilityDescriptor) Object.defineProperty(document, 'visibilityState', visibilityDescriptor)
    else Reflect.deleteProperty(document, 'visibilityState')
  })

  it('does not double-trigger or overlap beats through 60 seconds of actual crew-01 sample changes', async () => {
    const feed = createMonitoringFeed(getFixtureSnapshot('crew-01')!)
    feed.activate(true)
    const samples = window.setInterval(() => feed.advance(), 4000)
    render(<HeartbeatAudio feed={feed} active reducedMotion={false} />)
    expect(FakeAudioContext.instances).toHaveLength(0)
    await enableSound()
    const audio = FakeAudioContext.instances[0]!
    act(() => { vi.advanceTimersByTime(60000) })
    window.clearInterval(samples)

    expect(feed.getSnapshot().sequence).toBe(15)
    expect(audio.starts.length).toBeGreaterThanOrEqual(65)
    expect(audio.starts.length).toBeLessThanOrEqual(80)
    const intervals = audio.starts.slice(1).map((time, index) => time - audio.starts[index]!)
    // The authored rates are 71-74 bpm. A sub-600ms interval indicates a repeated beat,
    // not a legitimate response to these small supplied rate changes.
    expect(Math.min(...intervals)).toBeGreaterThanOrEqual(600)
    expect(audio.maximumVoices).toBe(1)
  })

  it('keeps a delayed resume muted and suspended when the tab hides before it resolves', async () => {
    FakeAudioContext.delayResume = true
    const feed = createMonitoringFeed(getFixtureSnapshot('crew-01')!)
    feed.activate(true)
    render(<HeartbeatAudio feed={feed} active reducedMotion={false} />)
    await enableSound()
    const audio = FakeAudioContext.instances[0]!
    act(() => { setVisibility('hidden') })
    await act(async () => { audio.resolveResume(); await Promise.resolve() })

    expect(audio.state).toBe('suspended')
    expect(screen.getByRole('button', { name: 'Enable heartbeat audio' })).toHaveAttribute('aria-pressed', 'false')
    expect(audio.starts).toEqual([])
    act(() => { setVisibility('visible'); vi.advanceTimersByTime(3000) })
    expect(audio.state).toBe('suspended')
    expect(audio.starts).toEqual([])
  })

  it('closes the context and stops its scheduler on station exit, leaving a later visit muted', async () => {
    const feed = createMonitoringFeed(getFixtureSnapshot('crew-01')!)
    feed.activate(true)
    const visit = render(<HeartbeatAudio feed={feed} active reducedMotion={false} />)
    await enableSound()
    const audio = FakeAudioContext.instances[0]!
    act(() => { vi.advanceTimersByTime(2000) })
    expect(audio.starts.length).toBeGreaterThan(1)
    visit.unmount()
    const count = audio.starts.length
    act(() => { vi.advanceTimersByTime(3000) })
    expect(audio.close).toHaveBeenCalledTimes(1)
    expect(audio.state).toBe('closed')
    expect(audio.activeVoices).toBe(0)
    expect(audio.starts).toHaveLength(count)

    render(<HeartbeatAudio feed={feed} active reducedMotion={false} />)
    expect(screen.getByRole('button', { name: 'Enable heartbeat audio' })).toHaveAttribute('aria-pressed', 'false')
    act(() => { vi.advanceTimersByTime(2000) })
    expect(FakeAudioContext.instances).toHaveLength(1)
    expect(audio.starts).toHaveLength(count)
  })
  it('unlocks automatic monitoring on a gesture and reuses its context across stations', async () => {
    const feed=createMonitoringFeed(getFixtureSnapshot('crew-01')!);feed.activate(true)
    const samples=window.setInterval(()=>feed.advance(),4000)
    const view=render(<AutomaticMonitoringAudio feed={feed} active={false} allowed />)
    expect(FakeAudioContext.instances).toHaveLength(0)
    await act(async()=>{fireEvent.pointerDown(document);await Promise.resolve()})
    expect(FakeAudioContext.instances).toHaveLength(1)
    expect(FakeAudioContext.instances[0]!.state).toBe('suspended')
    await act(async()=>{view.rerender(<AutomaticMonitoringAudio feed={feed} active allowed />);await Promise.resolve()})
    act(()=>{vi.advanceTimersByTime(60000)})
    window.clearInterval(samples)
    expect(feed.getSnapshot().sequence).toBe(15)
    const starts=FakeAudioContext.instances[0]!.starts
    expect(starts.length).toBeGreaterThan(65)
    expect(Math.min(...starts.slice(1).map((time,i)=>time-starts[i]!))).toBeGreaterThanOrEqual(600)
    expect(FakeAudioContext.instances[0]!.maximumVoices).toBe(1)
    await act(async()=>{view.rerender(<AutomaticMonitoringAudio feed={feed} active={false} allowed />);await Promise.resolve()})
    act(()=>vi.advanceTimersByTime(80))
    expect(FakeAudioContext.instances[0]!.state).toBe('suspended')
    await act(async()=>{view.rerender(<AutomaticMonitoringAudio feed={feed} active allowed />);await Promise.resolve()})
    expect(FakeAudioContext.instances).toHaveLength(1)
    view.unmount();expect(FakeAudioContext.instances[0]!.state).toBe('closed')
  })
  it('suspends automatic audio when an unlock resolves in a hidden tab',async()=>{
    FakeAudioContext.delayResume=true
    const feed=createMonitoringFeed(getFixtureSnapshot('crew-01')!);feed.activate(true)
    render(<AutomaticMonitoringAudio feed={feed} active allowed />)
    await act(async()=>{fireEvent.pointerDown(document);await Promise.resolve()})
    act(()=>setVisibility('hidden'))
    await act(async()=>{FakeAudioContext.instances[0]!.resolveResume();await Promise.resolve()})
    expect(FakeAudioContext.instances[0]!.state).toBe('suspended')
    expect(FakeAudioContext.instances[0]!.starts).toEqual([])
  })

})

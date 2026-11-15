import { chromium } from 'playwright'
import { PerspectiveCamera, Vector3 } from 'three'
import { mkdir, writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'

const base = process.env.BAY_URL ?? 'http://127.0.0.1:5175'
const out = 'docs/screenshots/phase3b'
const hardwareArgs = ['--use-angle=d3d11', '--ignore-gpu-blocklist', '--enable-gpu']
const pacingArgs = ['--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows']
const waitReady = page => page.getByTestId('environment-status').filter({ hasText: 'Environment ready' }).waitFor({ timeout: 90000 })
await mkdir(out, { recursive: true })
const browser = await chromium.launch({ args: hardwareArgs })
const report = { browser: browser.version(), captures: [], interactions: {}, measurements: [], notes: ['CPU render cost is submission time, not a GPU timestamp.', 'Memory counters are resource counts and optional JS heap, not measured VRAM bytes.'] }
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto(base)
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: `${out}/mission-entry.png` })
  report.captures.push('mission-entry.png')
  await page.goto(`${base}/bay/overview?crew=crew-01`)
  await page.bringToFront()
  await waitReady(page)
  await page.waitForTimeout(300)
  const layout = await page.evaluate(() => ({ viewport: [innerWidth, innerHeight], scrollHeight: document.documentElement.scrollHeight, scene: document.querySelector('.scene-viewport').getBoundingClientRect().toJSON() }))
  assert.equal(layout.scrollHeight, 900)
  assert.equal(layout.scene.height, 900)
  await page.screenshot({ path: `${out}/medical-bay-overview.png` })
  report.captures.push('medical-bay-overview.png')
  report.layout = layout

  // Project an actual 3D point onto the canvas, then perform a real pointer raycast.
  const bounds = await page.locator('canvas').boundingBox()
  const camera = new PerspectiveCamera(55, bounds.width / bounds.height, .08, 35)
  camera.position.set(3.3, 2.65, 4.1)
  camera.lookAt(-.5, 1.55, -1)
  camera.updateMatrixWorld()
  const target = new Vector3(-.4, 1.18, .15).project(camera)
  const point = { x: bounds.x + (target.x + 1) * bounds.width / 2, y: bounds.y + (1 - target.y) * bounds.height / 2 }
  await page.mouse.move(point.x, point.y)
  await page.waitForTimeout(100)
  assert.equal(await page.locator('canvas').evaluate(canvas => canvas.style.cursor), 'pointer')
  await page.mouse.click(point.x, point.y)
  await page.waitForURL(/view=examination/)
  await page.waitForTimeout(150)
  await page.screenshot({ path: `${out}/examination-station.png` })
  report.captures.push('examination-station.png')
  report.interactions.pointerSelection = true

  await page.getByRole('button', { name: 'Check standby indicator' }).click()
  assert.equal(await page.locator('canvas').getAttribute('data-scanner-animation'), 'static')
  report.interactions.reducedMotionIndicator = true
  await page.getByRole('button', { name: 'Equipment detail', exact: true }).click()
  await page.screenshot({ path: `${out}/equipment-detail.png` })
  report.captures.push('equipment-detail.png')
  await page.getByRole('link', { name: 'Vitals', exact: true }).click()
  await page.getByText('72 bpm').waitFor()
  await page.screenshot({ path: `${out}/bay-navigation.png` })
  report.captures.push('bay-navigation.png')
  await page.getByRole('button', { name: 'Module preview', exact: false }).click()
  await page.getByRole('button', { name: 'Bay overview', exact: true }).click()
  await page.getByRole('combobox', { name: 'Render quality' }).selectOption('low')
  await waitReady(page)
  await page.screenshot({ path: `${out}/medical-bay-low.png` })
  report.captures.push('medical-bay-low.png')
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto(`${base}/dashboard/overview?crew=crew-01`)
  await page.getByRole('heading', { name: 'Medical bay overview', exact: true }).waitFor()
  await page.screenshot({ path: `${out}/mobile-dashboard.png`, fullPage: true })
  report.captures.push('mobile-dashboard.png')
  report.pageErrors = errors
  assert.deepEqual(errors, [])
} finally { await browser.close() }

// Each path is isolated and foregrounded. Capture idle rAF pacing separately, then
// explicitly render/move the real camera continuously for a bounded measured interval.
for (const backend of ['hardware', 'software']) {
  const args = [...pacingArgs, ...(backend === 'hardware' ? hardwareArgs : ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'])]
  const browser = await chromium.launch({ args })
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' })
    await page.bringToFront()
    const rafBaseline = await page.evaluate(async () => new Promise(resolve => {
      const samples = []
      let previous = performance.now()
      function tick(now) {
        samples.push(now - previous)
        previous = now
        if (samples.length >= 60) {
          const values = samples.slice(3)
          resolve({ visibility: document.visibilityState, averageMs: values.reduce((a, b) => a + b, 0) / values.length })
        } else requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }))
    for (const quality of ['standard', 'low']) {
      const started = performance.now()
      await page.goto(`${base}/bay/overview?crew=crew-01&quality=${quality}&benchmark=1`)
      await page.bringToFront()
      await waitReady(page)
      const readyMs = performance.now() - started
      await page.waitForFunction(() => JSON.parse(document.querySelector('canvas')?.dataset.renderStats ?? '{}').benchmarkComplete, undefined, { timeout: 180000 })
      const result = await page.locator('canvas').evaluate(canvas => {
        const stats = JSON.parse(canvas.dataset.renderStats)
        const memory = performance.memory ? { usedJSHeapSize: performance.memory.usedJSHeapSize, totalJSHeapSize: performance.memory.totalJSHeapSize } : null
        const entries = performance.getEntriesByType('resource')
        const describe = entry => ({ url: entry.name, bytes: entry.encodedBodySize, transferBytes: entry.transferSize, durationMs: entry.duration })
        return { stats, memory, buffer: { width: canvas.width, height: canvas.height, cssWidth: canvas.clientWidth, cssHeight: canvas.clientHeight }, assets: entries.filter(entry => entry.name.includes('.glb')).map(describe), decoderAssets: entries.filter(entry => entry.name.includes('/assets/decoders/draco/')).map(describe) }
      })
      const measurement = { requestedBackend: backend, args, quality, viewport: [1440, 900], readyMs, rafBaseline, ...result }
      report.measurements.push(measurement)
      await writeFile(`${out}/render-measurements.json`, JSON.stringify(report, null, 2))
      console.log(JSON.stringify(measurement))
    }
  } finally { await browser.close() }
}
await writeFile(`${out}/render-measurements.json`, JSON.stringify(report, null, 2))
console.log('Phase 3B capture and measurement checks completed.')

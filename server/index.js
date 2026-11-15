import { resolve } from 'node:path'
import { existsSync } from 'node:fs'
import { createRuntime } from './runtime.js'
import { createApp } from './app.js'

const port = Number(process.env.API_PORT ?? 5001)
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('API_PORT must be a valid port')
const host = process.env.API_HOST ?? '127.0.0.1'
const origins = (process.env.CORS_ORIGINS ?? 'http://127.0.0.1:5186,http://localhost:5186,http://127.0.0.1:5187,http://localhost:5187,http://127.0.0.1:5001,http://localhost:5001').split(',').map(value => value.trim()).filter(Boolean)
const staticDir = process.argv.includes('--serve') ? resolve('dist') : null
if (staticDir && !existsSync(resolve(staticDir, 'index.html'))) throw new Error('Production build is missing. Run npm run build before npm start.')
const runtime = createRuntime({ file: resolve(process.env.DEMO_DATA_FILE ?? '.local-data/medbay.json') })
const server = createApp(runtime, { origins, staticDir }).listen(port, host, () => console.log(`Orbital Medical OS ${staticDir?'app and ':''}simulated API: http://${host}:${port}${staticDir?'/':'/api/health-check'}`))
let closing = false
function close() {
  if (closing) return
  closing = true
  server.close(() => { runtime.close(); process.exit(0) })
  setTimeout(() => process.exit(1), 5000).unref()
}
process.on('SIGINT', close)
process.on('SIGTERM', close)

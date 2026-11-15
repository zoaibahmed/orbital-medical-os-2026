import { Profiler, StrictMode } from 'react'
import { recordCommit } from './scene/quality/probeStore'
import { createRoot } from 'react-dom/client'
import App from './app/App'
import { ErrorBoundary } from './ui/ErrorBoundary'
import './styles/operations.css'
import './styles/integration.css'

const root = document.getElementById('root')
if (!root) throw new Error('Application root is missing')
createRoot(root).render(<StrictMode><Profiler id="OrbitalApp" onRender={recordCommit}><ErrorBoundary><App /></ErrorBoundary></Profiler></StrictMode>)

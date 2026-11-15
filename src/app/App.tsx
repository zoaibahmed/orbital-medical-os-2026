import { lazy, Suspense } from 'react'
import { BrowserRouter, useLocation } from 'react-router-dom'
import { SessionProvider } from '../state/SessionProvider'
import { EmergencyDialog } from '../features/emergency/EmergencyDialog'
import { UnifiedExperience } from '../features/experience/UnifiedExperience'
import { CrewApiProvider } from '../services/api/CrewApiProvider'

const VisualBenchmark = lazy(() => import('../scene/VisualBenchmark'))

/** The scene host is above route interpretation: URLs never replace the renderer. */
export function AppRoutes() {
  const location = useLocation()
  if (location.pathname === '/visual-benchmark') return <Suspense fallback={<p>Preparing environment study…</p>}><VisualBenchmark /></Suspense>
  return <SessionProvider><CrewApiProvider>
    <a className="skip-link" href="#main-content" onClick={event => { event.preventDefault(); document.getElementById('main-content')?.focus({preventScroll:true}) }}>Skip to main content</a>
    <UnifiedExperience />
    <EmergencyDialog />
  </CrewApiProvider></SessionProvider>
}
export default function App() { return <BrowserRouter><AppRoutes /></BrowserRouter> }

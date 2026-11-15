import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode; fallback?: ReactNode; onError?: () => void }
export class ErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch() { this.props.onError?.() }
  render() {
    if (this.state.failed) return this.props.fallback ?? <main className="recovery"><h1>Interface unavailable</h1><p>Reload to recover the local demo session.</p><button onClick={() => window.location.reload()}>Reload application</button></main>
    return this.props.children
  }
}

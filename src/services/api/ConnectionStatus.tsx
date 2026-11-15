import { useSyncExternalStore } from 'react'
import type { CrewConnection } from './connection'

export function ConnectionStatus({ connection }: { connection: CrewConnection }) {
  const state=useSyncExternalStore(connection.subscribe,connection.getSnapshot)
  return <div className="api-connection" role="status" data-testid="api-connection" data-status={state.status} data-crew={connection.crewId}>
    <span>{state.status==='connected'?'Backend connected / fictional simulation':state.status==='connecting'?'Connecting to demo backend / offline fixtures shown':'Backend unavailable / offline fixtures shown'}</span>
    {state.status==='offline'&&<><small>{state.error}</small><button onClick={connection.refresh}>Retry connection</button></>}
  </div>
}

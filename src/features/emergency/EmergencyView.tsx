import { ModulePlaceholder } from '../../ui/ModulePlaceholder'
import { useSession } from '../../state/session'

export default function EmergencyView() {
  const { setEmergencyOpen } = useSession()
  return <ModulePlaceholder title="Emergency protocols" description="The global rehearsal overlay is independent of the 3D renderer. Operational protocol content is pending domain review.">
    <button className="button button-critical" onClick={() => setEmergencyOpen(true)}>Open emergency rehearsal</button>
  </ModulePlaceholder>
}

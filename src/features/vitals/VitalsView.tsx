import { ModulePlaceholder, type ModuleProps } from '../../ui/ModulePlaceholder'
import { formatMeasurement } from '../../domain/format'

export default function VitalsView({ snapshot }: ModuleProps) {
  return <ModulePlaceholder title="Crew biometrics & vitals" description="A shared interface for cardiovascular, oxygen and sleep measurements. History and live chart interactions are deferred.">
    <dl><div><dt>Heart rate · simulated</dt><dd>{formatMeasurement(snapshot.biometrics.heartRate)}</dd></div><div><dt>HRV · missing sample</dt><dd>{formatMeasurement(snapshot.biometrics.heartRateVariability)}</dd></div><div><dt>Sleep duration · simulated</dt><dd>{formatMeasurement(snapshot.sleep.duration)}</dd></div></dl>
  </ModulePlaceholder>
}

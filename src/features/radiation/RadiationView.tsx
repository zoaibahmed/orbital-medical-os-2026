import { ModulePlaceholder, type ModuleProps } from '../../ui/ModulePlaceholder'
import { formatMeasurement } from '../../domain/format'

export default function RadiationView({ snapshot }: ModuleProps) {
  return <ModulePlaceholder title="Space radiation monitoring" description="Separate dose-rate and cumulative-dose contracts are ready. These fixtures are unrelated to a live instrument feed; risk calculations are outside this frontend.">
    <dl><div><dt>Dose rate · simulated</dt><dd>{formatMeasurement(snapshot.radiation.doseRate)}</dd></div><div><dt>Cumulative dose · simulated</dt><dd>{formatMeasurement(snapshot.radiation.cumulativeDose)}</dd></div></dl>
  </ModulePlaceholder>
}

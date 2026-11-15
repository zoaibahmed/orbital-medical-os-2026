import { ModulePlaceholder, type ModuleProps } from '../../ui/ModulePlaceholder'
import { formatMeasurement } from '../../domain/format'

export default function PhysicalView({ snapshot }: ModuleProps) {
  return <ModulePlaceholder title="Physiological & musculoskeletal assessment" description="The feature boundary is prepared for anatomy selection, exercise records and a reviewed SANS observation questionnaire.">
    <dl><div><dt>Bone density change</dt><dd>{formatMeasurement(snapshot.physical.boneDensityChange)}</dd></div><div><dt>Questionnaire</dt><dd>Not implemented</dd></div></dl>
  </ModulePlaceholder>
}

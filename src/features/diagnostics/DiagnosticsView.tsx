import { ModulePlaceholder, type ModuleProps } from '../../ui/ModulePlaceholder'

export default function DiagnosticsView({ snapshot }: ModuleProps) {
  return <ModulePlaceholder title="AI diagnostics" description="The diagnostic message contract is available for future supplied results. No AI service or diagnostic engine is connected.">
    <p><strong>Scripted interface fixture</strong></p><p>{snapshot.diagnostic.summary}</p>
  </ModulePlaceholder>
}

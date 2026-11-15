import { ModulePlaceholder, type ModuleProps } from '../../ui/ModulePlaceholder'

export default function WellbeingView({ snapshot }: ModuleProps) {
  return <ModulePlaceholder title="Psychological health & wellbeing" description="A dedicated boundary for voluntary check-ins and reviewed support resources. No responses are collected or saved in this foundation.">
    <dl><div><dt>Mood check-in</dt><dd>{snapshot.wellbeing.mood ?? 'Not recorded'}</dd></div><div><dt>Storage</dt><dd>None</dd></div></dl>
  </ModulePlaceholder>
}

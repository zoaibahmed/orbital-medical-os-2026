export function LoadingState({ label = 'Preparing interface…' }: { label?: string }) {
  return <p className="loading-state" role="status">{label}</p>
}

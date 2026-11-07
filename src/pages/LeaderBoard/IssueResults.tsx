import { experiment } from './data'
import type { SystemId } from './data'

export default function IssueResults() {
  return (
    <details className="mt-10 border-y border-border py-4">
      <summary className="cursor-pointer font-heading text-xl font-bold text-primary focus-visible:outline-2 focus-visible:outline-primary">Per-issue results</summary>
      <p className="mt-3 text-sm leading-6 text-muted">Hit (n) indicates the first test execution that triggered the reported failure. No hit means no confirmed trigger within the test budget.</p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">First confirmed failure trigger for each issue</caption>
          <thead className="border-b border-border">
            <tr>{['ID', 'Target Agent', 'Issue', ...experiment.systems.map((s) => s.name)].map((label) => <th key={label} scope="col" className="px-3 py-3">{label}</th>)}</tr>
          </thead>
          <tbody>
            {experiment.issues.map((issue) => (
              <tr key={issue.id} className="border-b border-border/50">
                <td className="px-3 py-3 text-muted">{issue.id}</td>
                <th scope="row" className="px-3 py-3 font-medium">{issue.agent}</th>
                <td className="px-3 py-3">#{issue.issue}</td>
                {experiment.systems.map((system) => {
                  const hit = issue.firstHit[system.id as SystemId]
                  return <td key={system.id} className={`px-3 py-3 ${hit === null ? 'text-muted' : 'font-semibold text-primary'}`}>{hit === null ? 'No hit' : `Hit (${hit})`}</td>
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  )
}

import { useState } from 'react'
import { experiment, detectedCount, detectionRate } from './data'

export default function LeaderboardTable() {
  const [sort, setSort] = useState({ budget: experiment.rankingBudget, descending: true })
  const systems = [...experiment.systems].sort((a, b) =>
    (detectedCount(a.id, sort.budget) - detectedCount(b.id, sort.budget)) * (sort.descending ? -1 : 1))

  function sortBy(budget: number) {
    setSort((current) => ({ budget, descending: current.budget === budget ? !current.descending : true }))
  }

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <caption className="caption-bottom pt-4 text-left text-xs leading-6 text-muted">
          Sorted by Detection@{sort.budget}, {sort.descending ? 'highest first' : 'lowest first'}. Click a metric heading to sort. Percentages use all {experiment.issues.length} issues.
        </caption>
        <thead className="border-y border-border bg-primary/3 font-heading text-base">
          <tr>
            <th scope="col" className="px-4 py-4">Rank</th>
            <th scope="col" className="px-4 py-4">Testing Agent</th>
            {experiment.budgets.map((budget) => (
              <th key={budget} scope="col" aria-sort={sort.budget === budget ? (sort.descending ? 'descending' : 'ascending') : undefined} className="text-right whitespace-nowrap">
                <button type="button" onClick={() => sortBy(budget)} className={`w-full cursor-pointer px-4 py-4 text-right font-bold hover:text-primary focus-visible:outline-2 focus-visible:outline-primary ${sort.budget === budget ? 'text-primary' : ''}`}>
                  Detection@{budget}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {systems.map((system, index) => (
            <tr key={system.id} className="border-b border-border hover:bg-primary/3">
              <td className="px-4 py-6 text-muted tabular-nums">{index + 1}</td>
              <th scope="row" className="px-4 py-6 font-normal whitespace-nowrap">
                <span className="block font-heading text-xl font-bold">{system.name}</span>
                {system.model && <span className="mt-1 block text-xs text-muted">{system.model}</span>}
              </th>
              {experiment.budgets.map((budget) => (
                <td key={budget} className={`px-4 py-6 text-right tabular-nums ${budget === sort.budget ? 'bg-primary/5 text-primary' : ''}`}>
                  <span className="font-semibold">{detectionRate(system.id, budget)}%</span>
                  <span className="mt-1 block text-xs text-muted">{detectedCount(system.id, budget)} / {experiment.issues.length}</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

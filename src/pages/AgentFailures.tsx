import { useState } from 'react'
import content from '../data/agent-failures.json'

type Issue = typeof content.issues[number]
type DimensionKey = keyof Issue['tags']
type SortKey = 'issue' | 'agent' | 'severity'
const dimensions = content.dimensions.map((dimension) => ({ ...dimension, key: dimension.key as DimensionKey }))
const agents = [...new Set(content.issues.map((issue) => issue.agent))].sort()
const severityStyles: Record<string, string> = {
  '1': 'border-border bg-background text-muted',
  '2': 'border-border bg-primary/3 text-foreground',
  '3': 'border-amber-800/20 bg-amber-800/5 text-amber-900',
  '4': 'border-primary/25 bg-primary/10 text-primary',
  '5': 'border-primary bg-primary text-primary-foreground',
}

export default function AgentFailures() {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [sort, setSort] = useState<{ key: SortKey; descending: boolean }>({ key: 'issue', descending: false })
  const search = query.trim().toLowerCase()
  const filtered = content.issues.filter((issue) => {
    if (filters.agent && issue.agent !== filters.agent) return false
    if (!dimensions.every((dimension) => !filters[dimension.key] || issue.tags[dimension.key].includes(filters[dimension.key]))) return false
    const labels = dimensions.flatMap((dimension) => dimension.labels
      .filter((label) => issue.tags[dimension.key].includes(label.id))
      .map((label) => `${label.id} ${label.label}`))
    return [issue.id, issue.agent, issue.title, ...labels].join(' ').toLowerCase().includes(search)
  }).sort((a, b) => {
    const difference = sort.key === 'severity'
      ? Number(a.tags.severity[0]) - Number(b.tags.severity[0])
      : sort.key === 'agent'
        ? a.agent.localeCompare(b.agent)
        : a.agentOrder - b.agentOrder || a.number - b.number
    return (sort.descending ? -difference : difference) || a.id.localeCompare(b.id)
  })

  function toggleSort(key: SortKey) {
    setSort((current) => ({ key, descending: current.key === key ? !current.descending : key === 'severity' }))
  }

  function setFilter(key: string, value: string) {
    setFilters((current) => ({ ...current, [key]: value }))
  }

  return (
    <article className="mx-auto w-full max-w-7xl pb-12 lg:px-6">
      <h1 className="text-3xl text-primary md:text-4xl">{content.title}</h1>
      <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">{content.description}</p>
      <p className="mt-3 text-sm text-muted">{content.issues.length} issues · {agents.length} agents · {dimensions.length} annotation dimensions</p>

      <div className="mt-7 flex flex-wrap items-end gap-4">
        <label className="min-w-60 flex-1 text-sm font-semibold">
          Search issues
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)}
            placeholder="Issue, agent, title, or tag…"
            className="mt-2 block w-full rounded border border-border bg-background px-3 py-2 font-normal outline-primary" />
        </label>
        <button type="button" onClick={() => { setQuery(''); setFilters({}) }} className="cursor-pointer px-2 py-2 text-sm text-primary underline underline-offset-4">Clear filters</button>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className="min-w-0 text-xs font-semibold">Agent
          <select value={filters.agent || ''} onChange={(event) => setFilter('agent', event.target.value)} className="mt-2 block w-full rounded border border-border bg-background px-2 py-2 text-sm font-normal outline-primary">
            <option value="">All agents</option>
            {agents.map((agent) => <option key={agent}>{agent}</option>)}
          </select>
        </label>
        {dimensions.map((dimension) => (
          <label key={dimension.key} className="min-w-0 text-xs font-semibold">{dimension.label}
            <select value={filters[dimension.key] || ''} onChange={(event) => setFilter(dimension.key, event.target.value)} className="mt-2 block w-full rounded border border-border bg-background px-2 py-2 text-sm font-normal outline-primary">
              <option value="">All tags</option>
              {dimension.labels.map((label) => <option key={label.id} value={label.id}>{label.label} ({label.count})</option>)}
            </select>
          </label>
        ))}
      </div>
      <p role="status" className="mt-5 text-xs text-muted">{filtered.length} of {content.issues.length} issues · Tag counts in filters refer to the full dataset. Click Issue, Agent, or Severity to sort.</p>
      <div className="mt-3 overflow-x-auto border border-border">
        <table className="w-full min-w-300 text-left text-xs">
          <caption className="sr-only">Agent failures with five open-coding dimensions</caption>
          <thead className="bg-primary/5">
            <tr>
              {(['issue', 'agent'] as const).map((key) => (
                <th key={key} scope="col" aria-sort={sort.key === key ? sort.descending ? 'descending' : 'ascending' : 'none'} className="px-3 py-3">
                  <button type="button" onClick={() => toggleSort(key)} className={`cursor-pointer ${sort.key === key ? 'text-primary' : ''}`}>{key === 'issue' ? 'Issue' : 'Agent'}</button>
                </th>
              ))}
              {dimensions.map((dimension) => (
                <th key={dimension.key} scope="col" aria-sort={dimension.key === 'severity' ? sort.key === 'severity' ? sort.descending ? 'descending' : 'ascending' : 'none' : undefined} className="px-3 py-3">
                  {dimension.key === 'severity'
                    ? <button type="button" onClick={() => toggleSort('severity')} className={`cursor-pointer ${sort.key === 'severity' ? 'text-primary' : ''}`}>{dimension.label}</button>
                    : dimension.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((issue) => (
              <tr key={issue.id} className="hover:bg-primary/3">
                <th scope="row" className="w-64 px-3 py-4 align-top text-left font-normal">
                  <a href={issue.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline underline-offset-4">#{issue.number}</a>
                  <p className="mt-2 leading-5 text-muted">{issue.title}</p>
                </th>
                <td className="px-3 py-4 align-top font-semibold leading-5">{issue.agent}</td>
                {dimensions.map((dimension) => (
                  <td key={dimension.key} className="px-3 py-4 align-top">
                    <div className="flex flex-wrap gap-1.5">
                      {issue.tags[dimension.key].map((id) => {
                        const label = dimension.labels.find((entry) => entry.id === id)!
                        return <span key={id} title={label.definition} className={`inline-block rounded border px-2 py-1 leading-4 ${dimension.key === 'severity' ? severityStyles[id] : 'border-primary/10 bg-primary/5 text-primary'}`}>{label.label}</span>
                      })}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-muted">No matching issues. Try another search or clear the filters.</td></tr>}
          </tbody>
        </table>
      </div>
      <p className="mt-5 text-xs leading-6 text-muted">{content.codingNote}</p>
      <details className="mt-6 border-t border-border pt-5">
        <summary className="cursor-pointer font-heading text-lg font-bold text-primary">Tag definitions and counts</summary>
        <p className="mt-3 text-xs leading-6 text-muted">Definitions retain the wording of the source workbooks. Counts are issues, counted once per tag; multiple-tag dimensions can total more than {content.issues.length}.</p>
        {dimensions.map((dimension) => (
          <section key={dimension.key} className="mt-6">
            <h2 className="text-lg">{dimension.label}</h2>
            <dl className="mt-2 divide-y divide-border">
              {dimension.labels.map((label) => (
                <div key={label.id} className="py-3 text-sm">
                  <dt className="font-semibold">{label.label} <span className="font-normal text-muted">· {label.count} issues</span></dt>
                  <dd className="mt-1 leading-6 text-muted">{label.definition}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </details>
      <p className="mt-6 text-xs leading-6 text-muted">Source: {content.sources.join(' · ')}</p>
    </article>
  )
}

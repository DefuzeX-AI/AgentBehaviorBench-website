import { useState } from 'react'
import registry from '../data/registry-agents.json'

export default function RegistryAgents() {
  const [query, setQuery] = useState('')
  const [domain, setDomain] = useState('')
  const domains = [...new Set(registry.agents.map((agent) => agent.domain))].sort()
  const search = query.trim().toLowerCase()
  const agents = registry.agents.filter((agent) =>
    (!domain || agent.domain === domain) &&
    [agent.agent, agent.repository, agent.domain, agent.domainReason].join(' ').toLowerCase().includes(search),
  )

  return (
    <section>
      <h1 className="text-3xl md:text-4xl">Registry Agents</h1>
      <p className="mt-4 text-muted">
        <strong className="text-primary">{registry.summary.agents}</strong> agents
        {' · '}<strong className="text-primary">{registry.summary.failures}</strong> agent failures
        {' · '}<strong className="text-primary">{registry.summary.agentsWithFailures}</strong> agents with failures
      </p>

      <div className="mt-6 flex flex-wrap items-end gap-4">
        <label className="min-w-60 flex-1 text-sm font-semibold">Search agents
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Agent, domain, or use case…" className="mt-2 block w-full rounded border border-border bg-background px-3 py-2 font-normal outline-primary" />
        </label>
        <label className="text-sm font-semibold">Domain
          <select value={domain} onChange={(event) => setDomain(event.target.value)} className="mt-2 block rounded border border-border bg-background px-3 py-2 font-normal outline-primary">
            <option value="">All domains</option>
            {domains.map((name) => <option key={name} value={name}>{name} ({registry.agents.filter((agent) => agent.domain === name).length})</option>)}
          </select>
        </label>
        <button type="button" onClick={() => { setQuery(''); setDomain('') }} className="cursor-pointer py-2 text-sm text-primary underline underline-offset-4">Clear filters</button>
      </div>
      <p role="status" className="mt-4 text-xs text-muted">{agents.length} of {registry.summary.agents} agents</p>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="caption-bottom pt-4 text-left text-xs leading-6 text-muted">
            Failures count issues with a runs directory, once per issue. IDs retain benchmark directory numbers.
            Commits are the recorded imported revisions. Unknown languages are left unverified.
          </caption>
          <thead className="border-y border-border font-heading text-base">
            <tr>
              {['ID', 'Agent', 'Domain', 'Commit', 'Agent Failures', 'Language', 'Integration'].map((label) => (
                <th key={label} scope="col" className="px-4 py-3 whitespace-nowrap first:pl-0">{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent.id} className="border-b border-border/60 hover:bg-primary/3">
                <td className="py-4 pr-4 text-muted tabular-nums">{String(agent.id).padStart(2, '0')}</td>
                <th scope="row" className="px-4 py-4 font-medium">
                  <a href={agent.repository} target="_blank" rel="noreferrer" className="text-primary underline-offset-4 hover:underline">{agent.agent}</a>
                </th>
                <td className="px-4 py-4">
                  <span className="text-xs font-medium text-primary">{agent.domain}</span>
                </td>
                <td className="px-4 py-4 font-mono text-xs">
                  <a href={`${agent.repository.replace(/\.git$/, '')}/commit/${agent.commit}`} title={agent.commit} target="_blank" rel="noreferrer" className="text-muted underline-offset-4 hover:text-primary hover:underline">
                    {agent.commit.slice(0, 12)}
                  </a>
                </td>
                <td title={agent.failureIssues.join(', ')} className="px-4 py-4 tabular-nums">{agent.failureCount}</td>
                <td title={agent.languageEvidence ?? 'No verified implementation-language evidence available.'} className="px-4 py-4">{agent.language ?? 'Unknown'}</td>
                <td className="px-4 py-4">{agent.integration === 'acp' ? 'ACP' : 'LangGraph'}</td>
              </tr>
            ))}
            {agents.length === 0 && <tr><td colSpan={7} className="py-8 text-center text-muted">No matching agents. Try another search or clear the filters.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  )
}

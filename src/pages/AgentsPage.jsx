import { emptyContent } from '../config/site.js';
import { getAgents, agentDirectorySource } from '../services/benchmark.js';
import { useResource } from '../hooks/useResource.js';
import DataTable from '../components/DataTable.jsx';
import ResourceState from '../components/ResourceState.jsx';

const columns = [
  { key: 'agent', label: 'Agent' },
  { key: 'framework', label: 'Framework' },
  { key: 'source', label: 'GitHub' },
  { key: 'revision', label: 'Commit / snapshot' },
];

export default function AgentsPage() {
  const resource = useResource(getAgents);
  return (
    <>
      <p className="page-description">Agents registered in AgentBehaviorBench.</p>
      <section className="panel agent-directory" aria-label="Agent directory">
        <div className="panel-heading">
          <h2>Registered agents</h2>
          {resource.status === 'ready' && <span>{resource.data.length} agents</span>}
        </div>
        <ResourceState resource={resource} empty={emptyContent.agents}>
          {(agents) => <DataTable columns={columns} label="Registered agents" caption="AgentBehaviorBench agent directory" rows={agents.map((agent) => ({
            id: agent.id,
            agent: <div className="agent-name"><strong>{agent.id}</strong><small>{agent.displayName}</small></div>,
            framework: <span className="tag">{agent.framework === 'acp' ? 'ACP' : agent.framework === 'langgraph' ? 'LangGraph' : agent.framework}</span>,
            source: agent.sourceUrl
              ? <a className="source-link" href={agent.sourceUrl} target="_blank" rel="noreferrer">{agent.sourceLabel}</a>
              : <span className="local-source">Local source</span>,
            revision: agent.sourceUrl && agent.sourceRevision && !agent.sourceRevision.startsWith('sha256:')
              ? <a className="source-link commit-link" href={`${agent.sourceUrl}/commit/${agent.sourceRevision}`} title={agent.sourceRevision} target="_blank" rel="noreferrer"><code>{agent.sourceRevision.slice(0, 8)}</code></a>
              : agent.sourceRevision
                ? <code className="snapshot-version" title={agent.sourceRevision}>{agent.sourceRevision.startsWith('sha256:') ? agent.sourceRevision.slice(0, 15) : agent.sourceRevision}</code>
                : <span className="local-source">Not recorded</span>,
          }))} />}
        </ResourceState>
      </section>
      <p className="directory-note">Source: <a href={`${agentDirectorySource.repository}/tree/${agentDirectorySource.revision}/resources/agents`} target="_blank" rel="noreferrer">AgentBehaviorBench · {agentDirectorySource.revision.slice(0, 8)}</a></p>
    </>
  );
}

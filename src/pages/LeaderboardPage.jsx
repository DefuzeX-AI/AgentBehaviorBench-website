import { leaderboardColumns, emptyContent } from '../config/site.js';
import { getLeaderboard } from '../services/benchmark.js';
import { useResource } from '../hooks/useResource.js';
import DataTable from '../components/DataTable.jsx';
import ResourceState from '../components/ResourceState.jsx';

export default function LeaderboardPage() {
  const resource = useResource(getLeaderboard);
  return (
    <section className="panel" aria-label="Model leaderboard">
      <div className="panel-heading"><h2>Model evaluation</h2><span>Leaderboard</span></div>
      {resource.status === 'ready' && !resource.data.length && <DataTable columns={leaderboardColumns} rows={[]} />}
      <ResourceState resource={resource} empty={emptyContent.leaderboard}>
        {(rows) => <DataTable columns={leaderboardColumns} rows={rows} />}
      </ResourceState>
    </section>
  );
}

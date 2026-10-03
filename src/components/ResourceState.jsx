import EmptyState from './EmptyState.jsx';

export default function ResourceState({ resource, empty, children }) {
  if (resource.status === 'loading') return <p className="resource-message" role="status">Loading…</p>;
  if (resource.status === 'error') return <div role="alert"><EmptyState title="Unable to load" description="Refresh the page to try again." /></div>;
  if (!resource.data.length) return <EmptyState {...empty} />;
  return children(resource.data);
}

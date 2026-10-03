import { emptyContent } from '../config/site.js';
import { getCases } from '../services/benchmark.js';
import { useResource } from '../hooks/useResource.js';
import ResourceState from '../components/ResourceState.jsx';

export default function CasesPage() {
  const resource = useResource(getCases);
  return (
    <section className="panel" aria-label="Case list">
      <ResourceState resource={resource} empty={emptyContent.cases}>
        {(cases) => <div className="case-grid">{cases.map((item) => (
          <article key={item.id} className="case-card">
            {item.category && <span className="tag">{item.category}</span>}
            <h2>{item.title}</h2><p>{item.summary}</p>
          </article>
        ))}</div>}
      </ResourceState>
    </section>
  );
}

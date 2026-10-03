import { emptyContent } from '../config/site.js';
import { useResource } from '../hooks/useResource.js';
import ResourceState from '../components/ResourceState.jsx';

export default function ContentPage({ contentKey, load }) {
  const resource = useResource(load);
  return (
    <section className="panel">
      <ResourceState resource={resource} empty={emptyContent[contentKey]}>
        {(sections) => <div className="content-sections">{sections.map((section) => (
          <article key={section.id}><h2>{section.title}</h2><p>{section.body}</p></article>
        ))}</div>}
      </ResourceState>
    </section>
  );
}

import content from '../data/output-structure.json'

export default function OutputStructure() {
  return (
    <article className="mx-auto max-w-4xl pb-12 lg:px-6">
      <h1 className="text-3xl text-primary md:text-4xl">{content.title}</h1>
      {content.sections.map((section) => (
        <section key={section.id} aria-labelledby={section.id} className="mt-10 border-t border-border pt-8">
          <h2 id={section.id} className="text-2xl">{section.title}</h2>
          <p className="mt-4 leading-7">{section.description}</p>
          <pre className="mt-4 overflow-x-auto rounded bg-primary/5 p-4 text-xs leading-6 text-primary"><code>{section.path}</code></pre>
          <dl className="mt-5 divide-y divide-border">
            {section.items.map((item) => (
              <div key={item.name} className="py-4">
                <dt className="text-sm font-semibold">{item.name}</dt>
                <dd className="mt-1 text-sm leading-6 text-muted">{item.description}</dd>
                {'example' in item && item.example && (
                  <dd className="mt-4">
                    <pre className="overflow-x-auto rounded bg-primary/5 p-4 text-xs leading-6 text-foreground"><code>{JSON.stringify(item.example, null, 2)}</code></pre>
                  </dd>
                )}
                {'note' in item && item.note && (
                  <dd className="mt-3 text-sm leading-6 text-muted">{item.note}</dd>
                )}
              </div>
            ))}
          </dl>
          {section.note && <p className="mt-4 text-sm leading-6 text-muted">{section.note}</p>}
        </section>
      ))}
    </article>
  )
}

import overview from '../data/benchmark-overview.json'

export default function AgentBehaviorBench() {
  return (
    <article className="mx-auto max-w-4xl pb-12 lg:px-6">
      <header className="py-8 text-center md:pt-12 md:pb-14">
        <h1 className="text-3xl text-primary md:text-5xl">{overview.title}</h1>
        <p className="mx-auto mt-4 max-w-2xl font-serif text-xl leading-relaxed md:text-2xl">{overview.subtitle}</p>
      </header>
      <section aria-labelledby="overview-heading" className="pt-8">
        <h2 id="overview-heading" className="text-2xl">Overview</h2>
        <p className="mt-4 text-base leading-8">{overview.overview}</p>
      </section>
    </article>
  )
}

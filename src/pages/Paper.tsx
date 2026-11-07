import { Link } from 'react-router-dom'
import paper from '../data/paper.json'

export default function Paper() {
  return (
    <article className="mx-auto max-w-4xl pb-12 lg:px-6">
      <h1 className="text-3xl text-primary md:text-4xl">Paper</h1>
      <header className="mt-8 border-b border-border pb-8">
        <h2 className="text-2xl leading-snug md:text-3xl">{paper.title}</h2>
        <p className="mt-4 text-sm text-muted">{paper.authors} · {paper.status}</p>
        <div className="mt-6 flex flex-wrap gap-5 text-sm text-primary">
          <span className="text-muted">Read paper (PDF)</span>
          <Link to="/citation" className="underline underline-offset-4">Cite this paper</Link>
        </div>
      </header>
      <section className="mt-8" aria-labelledby="paper-overview">
        <h2 id="paper-overview" className="text-2xl">Overview</h2>
        {paper.summary.map((paragraph) => <p key={paragraph} className="mt-4 leading-7">{paragraph}</p>)}
      </section>
      <section className="mt-8" aria-labelledby="paper-findings">
        <h2 id="paper-findings" className="text-2xl">Key Findings</h2>
        <p className="mt-4 leading-7">{paper.finding}</p>
        <Link to="/" className="mt-4 inline-block text-sm text-primary underline underline-offset-4">View detection results</Link>
      </section>
    </article>
  )
}

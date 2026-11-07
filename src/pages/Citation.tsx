import { useState } from 'react'
import paper from '../data/paper.json'

export default function Citation() {
  const [copyStatus, setCopyStatus] = useState('')
  const [copied, setCopied] = useState(false)

  async function copyBibtex() {
    setCopied(false)
    try {
      await navigator.clipboard.writeText(paper.bibtex)
      setCopied(true)
      setCopyStatus('Copied successfully.')
    } catch {
      setCopyStatus('Please select and copy the BibTeX below.')
    }
  }

  return (
    <article className="mx-auto max-w-4xl pb-12 lg:px-6">
      <h1 className="text-3xl text-primary md:text-4xl">Citation</h1>
      <section className="mt-8 border-t border-border pt-6" aria-labelledby="bibtex">
        <div className="flex items-center justify-between gap-4">
          <h2 id="bibtex" className="text-2xl">BibTeX</h2>
          <button type="button" onClick={copyBibtex} className="cursor-pointer rounded border border-border px-3 py-2 text-sm text-primary hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-primary">{copied ? 'Copied successfully' : 'Copy BibTeX'}</button>
        </div>
        <pre className="mt-4 overflow-x-auto rounded bg-primary/5 p-4 text-xs leading-6"><code>{paper.bibtex}</code></pre>
        <p role="status" className="mt-2 min-h-5 text-xs text-muted">{copyStatus}</p>
      </section>
    </article>
  )
}

import { experiment } from './data'
import LeaderboardTable from './LeaderboardTable'
import IssueResults from './IssueResults'

export default function LeaderBoard() {
  const agentCount = new Set(experiment.issues.map((issue) => issue.agent)).size

  return (
    <article className="mx-auto w-full max-w-6xl lg:px-6">
      <h1 className="text-3xl text-primary md:text-4xl">Leaderboards</h1>
      <nav aria-label="Leaderboard tasks" className="mt-8 border-b border-border">
        <a href="#failure-detection" aria-current="page" className="inline-block border-b-2 border-primary px-1 pb-3 text-sm font-semibold text-primary">{experiment.title}</a>
      </nav>
      <section id="failure-detection" aria-labelledby="task-heading" className="pt-6">
        <h2 id="task-heading" className="text-2xl">{experiment.title}</h2>
        <p className="mt-3 max-w-3xl leading-7 text-muted">{experiment.description}</p>
        <p className="mt-4 text-sm text-muted">{experiment.issues.length} issues · {agentCount} target agents · Up to {Math.max(...experiment.budgets)} test executions per issue</p>
        <LeaderboardTable />
        <p className="mt-6 max-w-3xl text-sm leading-7 text-muted">{experiment.metricDescription}</p>
        <IssueResults />
        <p className="mt-5 text-xs leading-6 text-muted">Source for Codex and Claude Code: {experiment.source.document}, {experiment.source.table}, p. {experiment.source.page}. Their scores are calculated from the paper’s per-issue results.</p>
      </section>
    </article>
  )
}

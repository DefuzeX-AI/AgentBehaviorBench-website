import { Fragment, useState } from 'react'
import content from '../data/cli-documentation.json'

export default function CliDocumentation() {
  const [query, setQuery] = useState('')
  const [group, setGroup] = useState('all')
  const [expanded, setExpanded] = useState<string | null>(null)
  const groups = content.groups
  const search = query.trim().toLowerCase()
  const commands = groups.flatMap((category) => content.commands.filter((command) =>
    command.group === category.id &&
    (group === 'all' || command.group === group) &&
    [command.command, command.description, ...command.parameters.map((p) => `${p.name} ${p.description}`)]
      .join(' ').toLowerCase().includes(search),
  ))

  return (
    <article className="mx-auto w-full max-w-6xl pb-12 lg:px-6">
      <h1 className="text-3xl text-primary md:text-4xl">{content.title}</h1>
      <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">{content.introduction}</p>
      <div className="mt-7 flex flex-wrap items-end gap-4">
        <label className="min-w-60 flex-1 text-sm font-semibold">
          Search commands
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)}
            placeholder="Command, option, or description…"
            className="mt-2 block w-full rounded border border-border bg-background px-3 py-2 font-normal outline-primary" />
        </label>
        <label className="text-sm font-semibold">
          Command group
          <select value={group} onChange={(event) => setGroup(event.target.value)}
            className="mt-2 block rounded border border-border bg-background px-3 py-2 font-normal outline-primary">
            <option value="all">All groups</option>
            {groups.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}
          </select>
        </label>
      </div>
      <p role="status" className="mt-4 text-xs text-muted">{commands.length} of {content.commands.length} commands</p>
      <div className="mt-3 overflow-x-auto border border-border">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">ABB command summary and parameter reference</caption>
          <thead className="bg-primary/5">
            <tr>
              <th scope="col" className="px-4 py-3">Command</th>
              <th scope="col" className="px-4 py-3">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {commands.map((command, index) => (
              <Fragment key={command.id}>
                {(index === 0 || commands[index - 1].group !== command.group) && (
                  <tr className="bg-primary/5">
                    <th colSpan={2} className="px-4 py-3 text-left">
                      <span className="font-mono text-primary">{groups.find((category) => category.id === command.group)?.label}</span>
                      <span className="mt-1 block text-xs font-normal leading-5 text-muted">{groups.find((category) => category.id === command.group)?.description}</span>
                    </th>
                  </tr>
                )}
                <tr className={expanded === command.id ? 'bg-primary/5' : 'hover:bg-primary/3'}>
                  <th scope="row" className="px-4 py-3 align-top font-normal">
                    <button type="button" aria-expanded={expanded === command.id}
                      aria-controls={`details-${command.id}`}
                      onClick={() => setExpanded(expanded === command.id ? null : command.id)}
                      className="cursor-pointer text-left font-mono text-xs leading-6 text-primary underline decoration-primary/30 underline-offset-4 focus-visible:outline-2 focus-visible:outline-primary">
                      {command.command}
                    </button>
                  </th>
                  <td className="px-4 py-3 align-top leading-6">{command.description}</td>
                </tr>
                <tr id={`details-${command.id}`} hidden={expanded !== command.id}>
                  <td colSpan={2} className="px-4 py-5 md:px-6">
                    <h2 className="text-xl text-primary">{command.command}</h2>
                    <pre className="mt-3 overflow-x-auto bg-primary/5 p-4 text-xs leading-6"><code>{command.usage}</code></pre>
                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <caption className="mb-2 text-left text-sm font-semibold">Parameters</caption>
                        <thead className="border-b border-border">
                          <tr>{['Parameter', 'Value', 'Required', 'Default', 'Description'].map((heading) => <th key={heading} scope="col" className="px-3 py-2">{heading}</th>)}</tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {command.parameters.map((parameter) => (
                            <tr key={`${parameter.scope}-${parameter.name}`}>
                              <th scope="row" className="px-3 py-3 align-top text-left font-normal">
                                <code className="text-primary">{parameter.name}</code>
                                <span className="mt-1 block text-muted">{parameter.kind}</span>
                                {parameter.scope !== command.command && <span className="mt-1 block text-muted">Before subcommand: {parameter.scope}</span>}
                              </th>
                              <td className="px-3 py-3 align-top font-mono">{parameter.value}</td>
                              <td className="px-3 py-3 align-top">{parameter.required ? 'Yes' : 'No'}</td>
                              <td className="px-3 py-3 align-top font-mono">{parameter.default}</td>
                              <td className="min-w-56 px-3 py-3 align-top leading-5">
                                {parameter.description || '—'}
                                {parameter.choices.length > 0 && <span className="mt-1 block">Choices: {parameter.choices.join(', ')}</span>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="mt-4 text-xs text-muted">Terminal help: <code>{command.command} --help</code></p>
                  </td>
                </tr>
              </Fragment>
            ))}
            {commands.length === 0 && <tr><td colSpan={2} className="px-4 py-8 text-center text-muted">No matching commands. Try another search or group.</td></tr>}
          </tbody>
        </table>
      </div>
      <p className="mt-5 text-xs leading-6 text-muted">{content.note}</p>
    </article>
  )
}

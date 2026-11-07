import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { render } from '../dist-ssr/entry-server.js'

const output = resolve('dist')
const base = process.env.SITE_BASE || '/'
if (!base.startsWith('/') || !base.endsWith('/')) throw new Error('SITE_BASE must start and end with /')
const origin = process.env.SITE_ORIGIN || 'https://defuzex-ai.github.io'
const navigation = JSON.parse(await readFile('src/data/navigation.json', 'utf8'))
const pages = navigation.flatMap(group => group.items)
const template = await readFile(join(output, 'index.html'), 'utf8')
const routeUrl = path => base + path.replace(/^\//, '')
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;')

async function save(path, html) {
  const filename = join(output, path)
  await mkdir(resolve(filename, '..'), { recursive: true })
  await writeFile(filename, html)
}

function documentFor(path, { hidden = false, canonical = true } = {}) {
  const markup = render(routeUrl(path))
  // React 19 hoists title in the rendered output; place it in the HTML head.
  const title = markup.match(/<title>[\s\S]*?<\/title>/)?.[0] || ''
  const head = title + (canonical ? `<link rel="canonical" href="${escape(origin + routeUrl(path))}" />` : '')
    + (hidden ? '<meta name="robots" content="noindex" />' : '')
  return template.replace('</head>', `${head}</head>`)
    .replace('<div id="root"></div>', () => `<div id="root">${markup.replace(title, '')}</div>`)
}

for (const page of pages) {
  await save(page.path === '/' ? 'index.html' : `${page.path.slice(1)}/index.html`, documentFor(page.path, page))
}
// Real files let GitHub Pages serve nested URLs without an SPA rewrite.
// Legacy URLs redirect to their canonical routes before React starts.
for (const [path, target] of [['leaderboards', '/'], ['output-structure', '/data-format']]) {
  const destination = escape(routeUrl(target))
  await save(`${path}/index.html`, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${destination}"><link rel="canonical" href="${escape(origin + routeUrl(target))}"><title>Redirecting</title></head><body><a href="${destination}">Continue</a></body></html>`)
}
// A static 404 avoids hydrating a different route's markup on unknown URLs.
await save('404.html', '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Page not found</title></head><body><h1>Page not found</h1><a href="' + escape(base) + '">Back to Leaderboards</a></body></html>')
await save('.nojekyll', '')
await save('sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + pages.filter(page => !page.hidden).map(page => `<url><loc>${escape(origin + routeUrl(page.path))}</loc></url>`).join('') + '</urlset>\n')
console.log(`Pre-rendered ${pages.length} pages with base ${base}`)

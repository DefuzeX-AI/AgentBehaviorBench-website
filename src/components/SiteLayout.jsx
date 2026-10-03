import { navigation, site } from '../config/site.js';

export default function SiteLayout({ path, page, children }) {
  return (
    <div className="site-layout">
      <a className="skip-link" href="#main-content" onClick={(event) => {
        event.preventDefault();
        document.getElementById('main-content')?.focus();
      }}>Skip to content</a>
      <aside className="sidebar">
        <a className="brand" href="#/" aria-label={site.name}>
          <span className="brand-mark" aria-hidden="true">A</span>
          <span>{site.shortName}<small>Behavior Benchmark</small></span>
        </a>
        <div className="nav-label">{site.section}</div>
        <nav aria-label="Main navigation">
          {navigation.map((item, index) => (
            <a key={item.path} href={`#${item.path}`} className={path === item.path ? 'nav-link active' : 'nav-link'} aria-current={path === item.path ? 'page' : undefined}>
              <span className="nav-number" aria-hidden="true">0{index + 1}</span>{item.label}
            </a>
          ))}
        </nav>
        <div className="sidebar-footer">{site.footer}</div>
      </aside>
      <div className="workspace">
        <header className="topbar"><span>{site.name}</span><span className="topbar-label">{site.header}</span></header>
        <main id="main-content" className="main-content" tabIndex={-1}>
          <div className="page-heading">
            <p className="eyebrow">{page?.eyebrow ?? 'NOT FOUND'}</p>
            <h1 id="page-title" tabIndex={-1}>{page?.title ?? 'Page not found'}</h1>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

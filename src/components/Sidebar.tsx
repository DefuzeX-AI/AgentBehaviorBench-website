import { NavLink } from 'react-router-dom'
import navigation from '../data/navigation.json'

export default function Sidebar() {
  return (
    <aside className="w-full shrink-0 border-b border-border bg-background md:sticky md:top-0 md:h-svh md:w-64 md:overflow-y-auto md:border-r md:border-b-0">
      <div className="px-6 pt-8 pb-7 font-heading text-2xl font-bold tracking-tight text-primary">
        AgentBehaviorBench
      </div>

      <nav aria-label="Main navigation" className="space-y-8 px-4 pb-8">
        {navigation.map((group) => (
          <div key={group.title ?? 'Main'}>
            {group.title && (
              <h2 className="mb-2 px-3 text-lg text-foreground">{group.title}</h2>
            )}
            <ul className="space-y-1">
              {group.items.filter((item) => !item.hidden).map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end
                    className={({ isActive }) => `block w-full cursor-pointer border-l-2 px-3 py-2.5 text-left text-sm leading-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                      isActive
                        ? 'border-primary bg-primary/7 font-semibold text-primary'
                        : 'border-transparent text-muted hover:bg-primary/5 hover:text-primary'
                    }`}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}

import { useEffect } from 'react'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import navigation from './data/navigation.json'
import Sidebar from './components/Sidebar.tsx'
import Leaderboards from './pages/LeaderBoard/index.tsx'
import AgentBehaviorBench from './pages/AgentBehaviorBench.tsx'
import OutputStructure from './pages/OutputStructure.tsx'
import CliDocumentation from './pages/CliDocumentation.tsx'
import RegistryAgents from './pages/RegistryAgents.tsx'
import AgentFailures from './pages/AgentFailures.tsx'
import Paper from './pages/Paper.tsx'
import Blog from './pages/Blog.tsx'
import Citation from './pages/Citation.tsx'

const pages = {
  'Leaderboards': Leaderboards,
  'Agent BehaviorBench': AgentBehaviorBench,
  'Data Format': OutputStructure,
  'CLI Documentation': CliDocumentation,
  'Registry Agents': RegistryAgents,
  'Agent Failures': AgentFailures,
  'Paper': Paper,
  'Blog': Blog,
  'Citation': Citation,
}

function App() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="min-h-svh md:flex">
      <Sidebar />
      <main className="min-w-0 flex-1 p-6 md:p-12">
        <Routes>
          {navigation.flatMap((group) => group.items).map(({ label, path }) => {
            const Page = pages[label]
            return (
              <Route key={path} path={path} element={<>
                <title>{`${label} | AgentBehaviorBench`}</title>
                <Page />
              </>} />
            )
          })}
          <Route path="/leaderboards" element={<Navigate to="/" replace />} />
          <Route path="/output-structure" element={<Navigate to="/data-format" replace />} />
          <Route path="*" element={<>
            <title>Page Not Found | AgentBehaviorBench</title>
            <h1 className="text-3xl text-primary">Page not found</h1>
            <Link to="/" className="mt-4 inline-block text-primary underline">Back to Leaderboards</Link>
          </>} />
        </Routes>
      </main>
    </div>
  )
}

export default App

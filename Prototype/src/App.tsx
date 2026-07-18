import { Route, Routes } from 'react-router'
import NavBar from './components/NavBar'
import CardLibraryPage from './pages/CardLibraryPage'
import CardDetailPage from './pages/CardDetailPage'
import AddWordPage from './pages/AddWordPage'
import QuickStudyPage from './pages/QuickStudyPage'
import DevSeedPanel from './components/DevSeedPanel'

function App() {
  return (
    <div className="flex h-svh flex-col overflow-hidden">
      {import.meta.env.DEV && <DevSeedPanel />}
      <main className="h-[var(--lexicard-main-height)] min-h-0 flex-none overflow-x-hidden overflow-y-auto">
        <Routes>
          <Route path="/" element={<CardLibraryPage />} />
          <Route path="/cards/:id" element={<CardDetailPage />} />
          <Route path="/add" element={<AddWordPage />} />
          <Route path="/study" element={<QuickStudyPage />} />
        </Routes>
      </main>
      <NavBar />
    </div>
  )
}

export default App

import { Route, Routes } from 'react-router'
import NavBar from './components/NavBar'
import CardLibraryPage from './pages/CardLibraryPage'
import CardDetailPage from './pages/CardDetailPage'
import AddWordPage from './pages/AddWordPage'
import QuickStudyPage from './pages/QuickStudyPage'
import DevSeedPanel from './components/DevSeedPanel'

function App() {
  return (
    <div className="flex min-h-svh flex-col">
      {import.meta.env.DEV && <DevSeedPanel />}
      <main className="flex-1 pb-[calc(72px+env(safe-area-inset-bottom))]">
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

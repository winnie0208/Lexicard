import { Route, Routes } from 'react-router'
import NavBar from './components/NavBar'
import CardLibraryPage from './pages/CardLibraryPage'
import AddWordPage from './pages/AddWordPage'
import QuickStudyPage from './pages/QuickStudyPage'

function App() {
  return (
    <div className="flex min-h-svh flex-col">
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<CardLibraryPage />} />
          <Route path="/add" element={<AddWordPage />} />
          <Route path="/study" element={<QuickStudyPage />} />
        </Routes>
      </main>
      <NavBar />
    </div>
  )
}

export default App

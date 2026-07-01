import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useLenis } from './hooks/useLenis'
import HomePage from './pages/HomePage'

function AppInner() {
  useLenis()

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  )
}

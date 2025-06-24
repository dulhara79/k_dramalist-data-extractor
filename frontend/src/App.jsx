import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import DramaDetail from './pages/DramaDetail'

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/drama/:title" element={<DramaDetail />} />
      </Routes>
    </div>
  )
}

export default App
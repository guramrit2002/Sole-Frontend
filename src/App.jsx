import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Grails from './pages/Grails'
import GrailDetail from './pages/GrailDetail'
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/grails" element={<Grails />} />
        <Route path="/grails/:id" element={<GrailDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

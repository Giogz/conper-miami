import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ModalAviso from './components/ModalAviso'
import Home from './pages/Home'
import Tramites from './pages/Tramites'
import TramiteDetalle from './pages/TramiteDetalle'
import Estado from './pages/Estado'

export default function App() {
  return (
    <HashRouter>
      <div className="flex min-h-dvh flex-col">
        <Header />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tramites" element={<Tramites />} />
            <Route path="/tramite/:id" element={<TramiteDetalle />} />
            <Route path="/estado" element={<Estado />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
        <ModalAviso />
      </div>
    </HashRouter>
  )
}

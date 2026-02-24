import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import AdminPage from './pages/AdminPage.jsx'
import { LenisProvider } from './lib/lenis.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LenisProvider>
      <BrowserRouter basename="/portfolio2026">
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </LenisProvider>
  </StrictMode>,
)

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Legal from './Legal.jsx'
import Access from './components/Access.jsx';
import ResellingEngine from './components/ResellingEngine.jsx';
import OwnerLogin from './components/OwnerLogin.jsx';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/access" element={<Access />} />
        <Route path="/ResellingEngine" element={<ResellingEngine />} />
        <Route path="/owner-login" element={<OwnerLogin />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)

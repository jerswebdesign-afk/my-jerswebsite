import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Legal from './Legal.jsx'
import Access from './Access.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/access" element={<Access />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)

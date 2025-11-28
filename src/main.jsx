import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // <--- Use BrowserRouter
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* IMPORTANT: Change "/your-repo-name" to match your GitHub repository name! */}
    {/* It must match the 'base' you set in vite.config.js */}
    <BrowserRouter basename="/DI_Management/">
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
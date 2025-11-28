import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom' // <--- CHANGE THIS IMPORT
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Use HashRouter for GitHub Pages */}
    <HashRouter> 
      <App />
    </HashRouter>
  </React.StrictMode>,
)
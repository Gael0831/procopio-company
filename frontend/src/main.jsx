import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import DarkModeProvider from './context/DarkModeContext.jsx'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DarkModeProvider>
      <BrowserRouter basename="/procopio_company">
        <App />
      </BrowserRouter>
    </DarkModeProvider>
  </React.StrictMode>
)
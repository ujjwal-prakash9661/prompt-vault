import React from 'react'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import AuthProvider from './context/AuthContext'

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
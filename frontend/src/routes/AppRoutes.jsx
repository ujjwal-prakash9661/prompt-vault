import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import Register from '../pages/Register'
import ProtectedRoutes from './ProtectedRoutes'
import Navbar from '../components/Navbar'
import CreatePrompt from '../pages/CreatePrompt'
import Categories from '../pages/Categories'
import Favourites from '../pages/Favourites'
import PromptBox from '../pages/PromptBox'
import AI from '../pages/AI'

const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/register" element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<ProtectedRoutes> <Dashboard /> </ProtectedRoutes>} />
        <Route path='/prompt' element={<ProtectedRoutes><CreatePrompt/></ProtectedRoutes>} />

        <Route path="/category" element={<ProtectedRoutes><Categories/></ProtectedRoutes>} />
        <Route path="/favourites" element={<ProtectedRoutes><Favourites /></ProtectedRoutes>} />

        <Route path="/prompt/allPrompt" element={<PromptBox />} />

        <Route path="/ai" element={<AI />} />

        <Route path='*' element={<Navigate to='/login' />} />
    </Routes>
  )
}

export default AppRoutes
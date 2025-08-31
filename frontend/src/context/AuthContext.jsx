import React, { createContext, useState, useEffect } from 'react'
import api from '../services/api'

export const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user')
      if (stored) {
        setUser(JSON.parse(stored))
      } else {
        setUser(null)
      }
    } finally {
      setAuthLoading(false)
    }
  }, [])

  const persist = (u) => {
    setUser(u)
    localStorage.setItem('user', JSON.stringify(u))
  }

  const register = async ({ name, email, password }) => {
    const [firstName, ...rest] = name.trim().split(' ')
    const lastName = rest.join(' ')
    const { data } = await api.post('/auth/register', {
      email,
      password,
      fullName: { firstName, lastName }
    })
    persist(data.user)
    return data.user
  }

  const login = async ({ email, password }) => {
    const { data } = await api.post('/auth/login', { email, password })
    persist(data.user)
    return data.user
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (err) {
      console.warn('Logout request failed', err)
    }
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, authLoading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

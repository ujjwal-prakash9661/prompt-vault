import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'

const Navbar = () => {
  const { user } = useContext(AuthContext)
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    // also set a data attribute for styling hooks
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <div className='flex items-center justify-between p-3 md:p-4 border-b frost-card relative z-40 bg-white/80 dark:bg-gray-900/70 border-gray-200 dark:border-gray-800'>
      <div className='flex items-center gap-2'>
        <button
          onClick={() => window.dispatchEvent(new Event('pv:toggleSidebar'))}
          className='px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100'
          aria-label='Toggle menu'
          title='Toggle menu'
        >
          ☰
        </button>
        <div className='text-xl font-bold'>Prompt Vault ✅</div>
      </div>

      <div className='flex items-center gap-2 md:gap-4'>
        <button
          onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
          className='px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100'
          aria-pressed={theme === 'dark'}
          title='Toggle dark / light theme'
        >
          <span className='sr-only'>Toggle theme</span>
          {theme === 'light' ? '🌞 Light' : '🌙 Dark'}
        </button>
      </div>
    </div>
  )
}

export default Navbar
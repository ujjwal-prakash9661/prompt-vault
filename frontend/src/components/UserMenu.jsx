import React, { useState, useContext, useRef, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import UserDemo from '../assets/user-demo.svg'

const UserMenu = ({ inset }) => {
  const { user, logout } = useContext(AuthContext)
  const [open, setOpen] = useState(false)
  const menuRef = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    const onDoc = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [])

  const handleLogout = () => {
    logout()
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className='relative' ref={menuRef}>
      <button
        onClick={() => setOpen(s => !s)}
        className='flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition'
        aria-haspopup='true'
        aria-expanded={open}
      >
  <img src={UserDemo} alt="avatar" className='w-8 h-8 rounded-full' />
        <span className='font-medium text-gray-900 dark:text-gray-100'>{user ? user.name : 'Guest'}</span>
      </button>

      {open && (
        <div className={
          `absolute z-50 p-3 rounded shadow-lg text-gray-900 dark:text-gray-100 ` +
          (inset === 'sidebar'
            ? 'bottom-full mb-2 left-0 w-56 frost-card'
            : 'right-0 mt-2 w-56 frost-card')
        }>
          <div className='px-2 py-1 text-sm text-gray-600 dark:text-gray-400'>Signed in as</div>
          <div className='px-2 py-1 font-semibold'>{user?.email || user?.name || 'Guest'}</div>
          <hr className='my-2 border-gray-200 dark:border-gray-700' />
          <button
            onClick={handleLogout}
            className='w-full text-left px-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-800 dark:text-gray-100'
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}

export default UserMenu
import React from 'react'
import { NavLink } from 'react-router-dom'
import UserMenu from './UserMenu'

const Item = ({to, onClick, children}) => {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={
          'flex items-center gap-3 px-4 py-2 rounded transition-colors duration-150 ' +
          'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 w-full text-left'
        }
      >
        {children}
      </button>
    )
  }

  return (
    <NavLink
      to={to}
      className={({isActive}) =>
        `flex items-center gap-3 px-4 py-2 rounded transition-colors duration-150 ` +
        (isActive
          ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200"
          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700")
      }
    >
      {children}
    </NavLink>
  )
}

const Sidebar = () => {
  return (
  <aside className='relative w-full md:w-64 p-3 md:p-4 border-r bg-white dark:bg-gray-800 min-h-screen text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700'>
      <div className='mb-4 md:mb-6 px-2'>
        <div className='text-lg font-bold'>PromptVault</div>
      </div>

      <nav className='space-y-1'>
        <Item to='/dashboard'>
          <span>🏠</span>
          <span>Dashboard</span>
        </Item>

        <Item to='/prompt'>
          <span>➕</span>
          <span>Create Prompt</span>
        </Item>

        <Item to = '/category'>
          <span>📁</span>
          <span>Categories</span>
        </Item>

        <Item to = '/favourites'>
          <span>⭐</span>
          <span>Favorites</span>
        </Item>

        <Item to ='/ai'>
          <span>🤖</span>
          <span>AI</span>
        </Item>
      </nav>

      <div className='absolute bottom-22 left-3 right-3'>
        <UserMenu inset='sidebar' />
      </div>
    </aside>
  )
}

export default Sidebar
import React, { useEffect, useState, useCallback } from 'react'
import Sidebar from './Sidebar'

// Mobile drawer that listens to a global event `pv:toggleSidebar`
const MobileSidebar = () => {
  const [open, setOpen] = useState(false)

  const close = useCallback(() => setOpen(false), [])
  const toggle = useCallback(() => setOpen(o => !o), [])

  useEffect(() => {
    const handler = () => toggle()
    window.addEventListener('pv:toggleSidebar', handler)
    const onKey = (e) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('pv:toggleSidebar', handler)
      window.removeEventListener('keydown', onKey)
    }
  }, [toggle, close])

  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={close}
      />
      {/* Drawer */}
      <div
        className={`absolute top-0 left-0 h-full w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform ${open ? 'translate-x-0' : '-translate-x-full'}`}
        role="dialog"
        aria-label="Mobile navigation"
      >
        <div className='p-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between'>
          <div className='font-bold'>Menu</div>
          <button className='px-2 py-1 rounded bg-gray-100 dark:bg-gray-800' onClick={close}>✕</button>
        </div>
        <Sidebar />
      </div>
    </div>
  )
}

export default MobileSidebar
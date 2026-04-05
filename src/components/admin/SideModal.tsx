import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'

interface SideModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function SideModal({ isOpen, onClose, title, children }: SideModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  if (!mounted) return null

  const content = (
    <div 
      className="fixed inset-0 flex justify-end"
      style={{ 
        pointerEvents: isOpen ? 'auto' : 'none', 
        zIndex: 9999,
        visibility: isOpen ? 'visible' : 'hidden',
        transition: 'visibility 300ms'
      }}
    >
      {/* Overlay */}
      <div 
        onClick={onClose}
        className={`absolute inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      />
      
      {/* Slide-over panel */}
      <div 
        className={`relative w-full max-w-[500px] h-full flex flex-col transition-transform duration-300 ease-in-out shadow-2xl bg-white ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="p-6 border-b border-admin-border-standard flex items-center justify-between bg-white">
          <h2 className="text-lg font-semibold text-admin-text-main m-0 tracking-tight">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-50 text-admin-text-subtle transition-colors flex items-center justify-center border-none bg-transparent cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto bg-white">
          {children}
        </div>
      </div>
    </div>
  )

  if (typeof document !== 'undefined') {
    return createPortal(content, document.body)
  }

  return null;
}

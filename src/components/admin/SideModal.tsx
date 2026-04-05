'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'

interface SideModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export default function SideModal({ isOpen, onClose, title, children }: SideModalProps) {
  useEffect(() => {
    if (!isOpen) return
    const wrap = document.querySelector<HTMLElement>('.admin-content-wrapper')
    const prev = wrap?.style.overflow ?? ''
    if (wrap) wrap.style.overflow = 'hidden'
    return () => {
      if (wrap) wrap.style.overflow = prev
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || typeof document === 'undefined') return null

  const content = (
    <div className="admin-side-modal-root">
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="admin-side-modal-backdrop"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-side-modal-title"
        className="admin-side-modal-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-side-modal-header">
          <h2 id="admin-side-modal-title">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="admin-side-modal-close"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="admin-side-modal-body">{children}</div>
      </div>
    </div>
  )

  return createPortal(content, document.body)
}

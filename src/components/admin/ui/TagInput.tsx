'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface TagInputProps {
  label?: string
  hint?: string
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
}

export default function TagInput({ label, hint, value, onChange, placeholder = 'Type and press Enter...' }: TagInputProps) {
  const [input, setInput] = useState('')

  const add = () => {
    const trimmed = input.trim()
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed])
    }
    setInput('')
  }

  const remove = (tag: string) => onChange(value.filter((t) => t !== tag))

  return (
    <div className="admin-field">
      {label && (
        <label className="admin-label">
          {label}
          {hint && <span className="admin-label-hint">{hint}</span>}
        </label>
      )}

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          className="admin-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add() } }}
          placeholder={placeholder}
        />
        <button type="button" className="admin-btn admin-btn-secondary" onClick={add} style={{ flexShrink: 0 }}>
          Add
        </button>
      </div>

      {value.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginTop: '0.5rem' }}>
          {value.map((tag) => (
            <span key={tag} className="admin-tag">
              {tag}
              <button type="button" className="admin-tag-remove" onClick={() => remove(tag)}>
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

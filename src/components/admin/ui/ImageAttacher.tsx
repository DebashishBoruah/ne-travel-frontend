'use client'

import { useRef, useState, useCallback } from 'react'
import { UploadCloud, X } from 'lucide-react'

interface ImageAttacherProps {
  label?: string
  required?: boolean
  hint?: string
  /** Existing image URL (edit mode) */
  existingUrl?: string | null
  /** Allow selecting multiple files */
  multiple?: boolean
  accept?: string
  onChange: (files: File[]) => void
  /** Currently selected files (controlled) */
  files?: File[]
}

export default function ImageAttacher({
  label,
  required,
  hint,
  existingUrl,
  multiple = false,
  accept = 'image/*',
  onChange,
  files = [],
}: ImageAttacherProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleFiles = useCallback(
    (incoming: FileList | null) => {
      if (!incoming) return
      const arr = Array.from(incoming)
      onChange(multiple ? [...files, ...arr] : arr.slice(0, 1))
    },
    [files, multiple, onChange],
  )

  const removeFile = (idx: number) => {
    onChange(files.filter((_, i) => i !== idx))
  }

  const previews = files.map((f) => URL.createObjectURL(f))
  const hasContent = files.length > 0 || existingUrl

  return (
    <div className="admin-field">
      {label && (
        <label className="admin-label">
          {label}
          {required && <span className="admin-label-required">*</span>}
          {hint && <span className="admin-label-hint">{hint}</span>}
        </label>
      )}

      {/* Previews */}
      {hasContent && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
          {files.map((f, i) => (
            <div key={f.name + i} className="admin-image-preview" style={{ width: 72, height: 72 }}>
              <img src={previews[i]} alt={f.name} />
              <button type="button" className="admin-image-preview-remove" onClick={() => removeFile(i)}>
                <X size={12} />
              </button>
            </div>
          ))}
          {existingUrl && files.length === 0 && (
            <div className="admin-image-preview" style={{ width: 72, height: 72 }}>
              <img src={existingUrl} alt="Current" />
            </div>
          )}
        </div>
      )}

      {/* Drop zone */}
      <div
        className={`admin-image-drop${dragging ? ' admin-image-drop-active' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files) }}
      >
        <UploadCloud size={20} className="admin-image-drop-icon" />
        <span className="admin-image-drop-label">
          {hasContent ? (multiple ? 'Add more images' : 'Replace image') : 'Click or drag to upload'}
        </span>
        <span className="admin-image-drop-hint">PNG, JPG, WebP up to 5 MB</span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        style={{ display: 'none' }}
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  )
}

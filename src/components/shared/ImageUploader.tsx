'use client'

import { useState } from 'react'
import { Upload, X } from 'lucide-react'
import { apiFetch } from '@/lib/api'

interface Props {
  onUploadComplete: (url: string) => void
  folder?: string
}

export function ImageUploader({ onUploadComplete, folder = 'ne-travel' }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)

    try {
      const response = await apiFetch('/api/upload', {
        method: 'POST',
        // Note: Do not manually set Content-Type header when sending FormData
        // The browser handles setting the correct multipart boundary
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      onUploadComplete(data.url)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="upload-container" style={{ position: 'relative', border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '2rem', textAlign: 'center', background: 'var(--color-slate-50)', cursor: 'pointer', transition: 'border-color 0.2s' }}>
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileChange} 
        disabled={uploading}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} 
      />
      
      {uploading ? (
        <div style={{ padding: '2rem' }}>
          <div className="spinner mx-auto" style={{ width: 24, height: 24, marginBottom: '1rem' }} />
          <p>Uploading to Cloudinary...</p>
        </div>
      ) : (
        <>
          <Upload size={32} style={{ margin: '0 auto 1rem', color: 'var(--color-text-light)' }} />
          <p style={{ fontWeight: 600 }}>Click or drag file to upload</p>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-light)', marginTop: '0.25rem' }}>PNG, JPG up to 5MB</p>
          {error && <p style={{ color: 'var(--color-danger)', marginTop: '1rem', fontSize: 'var(--font-size-sm)' }}>{error}</p>}
        </>
      )}
    </div>
  )
}

'use client'

import { useState, useRef } from 'react'
import { apiFetch } from '@/lib/api'
import { Info, UploadCloud, Image as ImageIcon, Loader2 } from 'lucide-react'

interface ArticleFormProps {
  initialData?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ArticleForm({ initialData, onSuccess, onCancel }: ArticleFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadSingleFile = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'articles')
    
    const res = await apiFetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
    
    const json = await res.json()
    if (!json.success) throw new Error(json.error || 'Upload failed')
    return json.url
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    
    try {
      let heroUrl = initialData?.hero_image || ''
      if (selectedFile) {
        heroUrl = await uploadSingleFile(selectedFile)
      } else if (!heroUrl) {
        throw new Error('Please select a cover image for the article.')
      }

      const payload = {
        title: formData.get('title'),
        category: formData.get('category'),
        slug: formData.get('title')?.toString().toLowerCase().replace(/\s+/g, '-'),
        hero_image: heroUrl,
        body: formData.get('body'),
        author: formData.get('author'),
        published_at: initialData?.published_at || new Date().toISOString()
      }

      const res = await apiFetch(initialData?.id ? `/api/content/articles/${initialData.id}` : '/api/content/articles', {
        method: initialData?.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      const json = await res.json()

      if (json.success) {
        if (onSuccess) onSuccess()
      } else {
        setError(json.error || 'Failed to create article')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.375rem', padding: '0.75rem 1rem', marginBottom: '1.5rem', color: '#dc2626', fontSize: '0.8125rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Info size={16} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        {/* Article Metadata Group */}
        <div className="admin-card-modern">
          <div className="admin-card-header">
            <h3 style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--admin-text-main)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Article Metadata</h3>
          </div>
          <div className="admin-card-body" style={{ padding: '1.5rem' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="admin-form-group col-span-full">
                <label className="admin-label">Title <span style={{ color: '#dc2626' }}>*</span></label>
                <input type="text" name="title" defaultValue={initialData?.title} required className="admin-input" placeholder="e.g. Living Root Bridges of Meghalaya" style={{ fontWeight: 600 }} />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Category <span style={{ color: '#dc2626' }}>*</span></label>
                <select name="category" defaultValue={initialData?.category} required className="admin-input admin-select">
                  <option value="">Select Category</option>
                  <option value="destination">Destination</option>
                  <option value="festival">Festival</option>
                  <option value="culture">Culture</option>
                  <option value="permit">Permit</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Author</label>
                <input type="text" name="author" defaultValue={initialData?.author} className="admin-input" placeholder="e.g. John Doe" />
              </div>

              <div className="admin-form-group col-span-full">
                <label className="admin-label">Hero Image (Cover) <span style={{ color: '#dc2626' }}>*</span></label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="admin-input flex flex-col items-center justify-center gap-3 cursor-pointer border-dashed border-2 py-8 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                  style={{ height: 'auto' }}
                >
                  {selectedFile ? (
                    <div className="flex items-center gap-3">
                       <div className="w-12 h-12 rounded-lg overflow-hidden border border-admin-border-standard">
                         <img src={URL.createObjectURL(selectedFile)} className="w-full h-full object-cover" />
                       </div>
                       <span className="text-sm font-medium text-admin-text-main truncate max-w-[200px]">{selectedFile.name}</span>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="text-admin-primary" size={24} />
                      <span className="text-sm font-medium text-admin-text-subtle">Upload Cover Image</span>
                    </>
                  )}
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                  onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content Group */}
        <div className="admin-card-modern">
          <div className="admin-card-header">
            <h3 style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--admin-text-main)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Article Content</h3>
          </div>
          <div className="admin-card-body" style={{ padding: '1.5rem' }}>
            <div className="admin-form-group">
              <label className="admin-label">Body Content <span style={{ color: '#dc2626' }}>*</span></label>
              <textarea name="body" defaultValue={initialData?.body} rows={12} required className="admin-input" style={{ height: 'auto', minHeight: '300px', lineHeight: '1.6' }} placeholder="Write your article content here..." />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--admin-border-standard)' }}>
          <button type="button" onClick={onCancel} className="admin-btn admin-btn-secondary" style={{ flex: 1 }}>Cancel</button>
          <button type="submit" disabled={loading} className="admin-btn admin-btn-primary" style={{ flex: 1 }}>
            {loading ? <Loader2 className="animate-spin" size={16} /> : (initialData?.id ? 'Update Article' : 'Publish Article')}
          </button>
        </div>
      </form>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import ArticleForm from '../ArticleForm'
import ArticlePreview from '@/components/admin/previews/ArticlePreview'
import { apiFetch } from '@/lib/api'
import { ArrowLeft, Edit3, Check, X, RefreshCw, Send, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function EditArticlePage() {
  const router = useRouter()
  const { id } = useParams()
  const [article, setArticle] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState<'preview' | 'edit'>('preview')

  const fetchArticle = async () => {
    try {
      const res = await apiFetch(`/api/content/articles/${id}`)
      const data = await res.json()
      setArticle(data.article || data)
    } catch (error) {
      console.error('Error fetching article:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchArticle()
    }
  }, [id])

  const handleSuccess = () => {
    setMode('preview')
    fetchArticle()
    router.refresh()
  }

  const handleCancel = () => {
    router.push('/admin/content/articles')
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
      <Loader2 className="animate-spin" size={24} style={{ color: 'var(--admin-primary)' }} />
    </div>
  )

  if (!article) return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--admin-text-subtle)' }}>
      <ArrowLeft size={40} style={{ color: '#d1d5db', margin: '0 auto 1rem' }} />
      <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--admin-text-main)', marginBottom: '0.5rem' }}>Article Not Found</h2>
      <p style={{ fontSize: '0.8125rem', marginBottom: '1.5rem' }}>The article you are looking for does not exist or has been removed.</p>
      <Link href="/admin/content/articles" className="admin-btn admin-btn-secondary">
        <ArrowLeft size={14} /> Back to Articles
      </Link>
    </div>
  )

  return (
    <div className="animate-fade-in">
      {/* Admin Control Bar */}
      <div 
        style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '0.75rem 0', marginBottom: '1.5rem',
          borderBottom: '1px solid var(--admin-border-standard)',
          position: 'sticky', top: 0, zIndex: 50,
          background: 'var(--admin-sidebar-bg)',
          marginTop: '-1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            onClick={handleCancel}
            className="admin-btn admin-btn-secondary"
            style={{ padding: '0 0.5rem' }}
            title="Back to List"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--admin-text-main)' }}>
              {mode === 'preview' ? 'Previewing' : 'Editing'}: {article.title}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--admin-text-subtle)', fontFamily: 'monospace' }}>
              Asset ID: {article.id?.slice(0, 8)}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {mode === 'preview' ? (
            <>
              <button 
                onClick={() => { setLoading(true); fetchArticle(); }}
                className="admin-btn admin-btn-secondary"
                style={{ padding: '0 0.5rem' }}
              >
                <RefreshCw size={14} />
              </button>
              <button 
                onClick={() => setMode('edit')}
                className="admin-btn admin-btn-primary"
              >
                <Edit3 size={14} /> Edit Story
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setMode('preview')}
                className="admin-btn admin-btn-secondary"
              >
                <X size={14} /> Cancel
              </button>
            </>
          )}
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {mode === 'preview' ? (
          <ArticlePreview data={article} />
        ) : (
          <div className="admin-card-modern">
            <div className="admin-card-header">
               <h3 style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--admin-text-main)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Story Editor</h3>
            </div>
            <div className="admin-card-body" style={{ padding: '1.5rem' }}>
              <ArticleForm 
                initialData={article}
                onSuccess={handleSuccess} 
                onCancel={() => setMode('preview')} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

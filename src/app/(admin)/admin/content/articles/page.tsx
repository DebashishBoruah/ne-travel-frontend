'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, BookOpen, Edit3, Search, Loader2 } from 'lucide-react'
import AdminCard from '@/components/admin/AdminCard'
import SideModal from '@/components/admin/SideModal'
import { apiFetch } from '@/lib/api'
import ArticleForm from './ArticleForm'

export default function ArticlesAdminPage() {
  const router = useRouter()
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [search, setSearch] = useState('')

  const fetchArticles = async () => {
    setLoading(true)
    try {
      const res = await apiFetch('/api/content/articles')
      const data = await res.json()
      if (data.articles) {
        setArticles(data.articles)
      } else if (Array.isArray(data)) {
        setArticles(data)
      } else if (data.data) {
        setArticles(data.data)
      }
    } catch (error) {
      console.error('Error fetching articles:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  const handleCreate = () => {
    setIsCreateModalOpen(true)
  }

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false)
    fetchArticles()
  }

  const handleEdit = (article: any) => {
    router.push(`/admin/content/articles/${article.id || article.slug}`)
  }

  const filtered = search
    ? articles.filter(a => a.title?.toLowerCase().includes(search.toLowerCase()))
    : articles

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--admin-text-main)', letterSpacing: '-0.025em' }}>Articles</h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--admin-text-subtle)', marginTop: 2 }}>Manage blog posts and long-form cultural content.</p>
        </div>
        <button onClick={handleCreate} className="admin-btn admin-btn-primary">
          <Plus size={14} /> Write Article
        </button>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-placeholder)' }} />
          <input type="text" className="admin-input" placeholder="Search articles..." style={{ paddingLeft: '2rem' }} value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '40vh' }}>
          <Loader2 className="animate-spin" size={24} style={{ color: 'var(--admin-primary)' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ background: '#fff', padding: '4rem 2rem', borderRadius: '0.5rem', textAlign: 'center', border: '1px dashed var(--admin-border-standard)' }}>
          <BookOpen size={40} style={{ color: '#d1d5db', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.375rem', color: 'var(--admin-text-main)' }}>No Articles Yet</h3>
          <p style={{ color: 'var(--admin-text-subtle)', marginBottom: '1.25rem', fontSize: '0.8125rem' }}>Share amazing stories and information about Northeast India.</p>
          <button onClick={handleCreate} className="admin-btn admin-btn-secondary">
            <Plus size={14} /> Compose First Article
          </button>
        </div>
      ) : (
        <div className="grid-cards">
          {filtered.map((article) => (
            <AdminCard
              key={article.id || article.slug || Math.random()}
              title={article.title}
              image={article.hero_image}
              badge={article.category}
              icon={BookOpen}
              onClick={() => handleEdit(article)}
              description={article.body || 'No content provided.'}
              meta={`By: ${article.author || 'Anonymous'}`}
              footer={
                <button onClick={() => handleEdit(article)} className="admin-btn admin-btn-primary">
                  <Edit3 size={12} /> Edit Article
                </button>
              }
            />
          ))}
        </div>
      )}

      <SideModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        title="Compose New Article"
      >
        <ArticleForm 
          onSuccess={handleCreateSuccess} 
          onCancel={() => setIsCreateModalOpen(false)} 
        />
      </SideModal>
    </div>
  )
}

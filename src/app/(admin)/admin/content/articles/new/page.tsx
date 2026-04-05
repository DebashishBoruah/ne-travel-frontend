'use client'

import { useRouter } from 'next/navigation'
import ArticleForm from '../ArticleForm'

export default function NewArticlePage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push('/admin/content/articles')
    router.refresh()
  }

  const handleCancel = () => {
    router.push('/admin/content/articles')
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="section-title" style={{ fontSize: '1.875rem' }}>Write New Article</h1>
        <p className="section-subtitle">Share amazing stories and information about Northeast India.</p>
      </div>

      <div className="max-w-4xl">
        <ArticleForm 
          onSuccess={handleSuccess} 
          onCancel={handleCancel} 
        />
      </div>
    </div>
  )
}

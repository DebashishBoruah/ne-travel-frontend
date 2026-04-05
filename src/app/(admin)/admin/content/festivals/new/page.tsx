'use client'

import { useRouter } from 'next/navigation'
import FestivalForm from '../FestivalForm'

export default function NewFestivalPage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push('/admin/content/festivals')
    router.refresh()
  }

  const handleCancel = () => {
    router.push('/admin/content/festivals')
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="section-title" style={{ fontSize: '1.875rem' }}>Add New Festival</h1>
        <p className="section-subtitle">Capture the rich culture of Northeast India.</p>
      </div>

      <div className="max-w-4xl">
        <FestivalForm 
          onSuccess={handleSuccess} 
          onCancel={handleCancel} 
        />
      </div>
    </div>
  )
}

'use client'

import { useRouter } from 'next/navigation'
import DestinationForm from '../DestinationForm'

export default function NewDestinationPage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push('/admin/content/destinations')
    router.refresh()
  }

  const handleCancel = () => {
    router.push('/admin/content/destinations')
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="section-title" style={{ fontSize: '1.875rem' }}>Create Destination</h1>
        <p className="section-subtitle">Add a new destination to the platform.</p>
      </div>

      <div className="max-w-4xl">
        <DestinationForm 
          onSuccess={handleSuccess} 
          onCancel={handleCancel} 
        />
      </div>
    </div>
  )
}

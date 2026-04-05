'use client'

import { useRouter } from 'next/navigation'
import PermitForm from '../PermitForm'

export default function NewPermitPage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push('/admin/content/permits')
    router.refresh()
  }

  const handleCancel = () => {
    router.push('/admin/content/permits')
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="section-title" style={{ fontSize: '1.875rem' }}>Add Permit Guide</h1>
        <p className="section-subtitle">Document regulations to help travelers visit restricted areas.</p>
      </div>

      <div className="max-w-4xl">
        <PermitForm 
          onSuccess={handleSuccess} 
          onCancel={handleCancel} 
        />
      </div>
    </div>
  )
}

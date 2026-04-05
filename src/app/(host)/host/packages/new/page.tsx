'use client'

import PackageForm from '../PackageForm'

export default function CreatePackagePage() {
  return (
    <div style={{ maxWidth: 800 }}>
      <PackageForm
        variant="page"
        onSuccess={() => {
          window.location.href = '/host/packages'
        }}
        onCancel={() => {
          window.location.href = '/host/packages'
        }}
      />
    </div>
  )
}

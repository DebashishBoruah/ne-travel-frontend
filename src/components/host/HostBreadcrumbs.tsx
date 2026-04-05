'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'

export function HostBreadcrumbs() {
  const pathname = usePathname()
  const paths = pathname.split('/').filter(p => p && p !== 'host')

  return (
    <nav className="admin-breadcrumb" aria-label="Breadcrumb">
      <Link href="/host/dashboard" className="admin-breadcrumb-item">
        Host Portal
      </Link>

      {paths.map((path, index) => {
        const href = `/host/${paths.slice(0, index + 1).join('/')}`
        const isLast = index === paths.length - 1
        const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ')

        return (
          <React.Fragment key={href}>
            <ChevronRight size={13} className="admin-breadcrumb-separator" />
            {isLast ? (
              <span className="admin-breadcrumb-current">{label}</span>
            ) : (
              <Link href={href} className="admin-breadcrumb-item">
                {label}
              </Link>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}

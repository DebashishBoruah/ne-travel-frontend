'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'

export function Breadcrumbs() {
  const pathname = usePathname()
  const paths = pathname.split('/').filter(p => p && p !== 'admin')

  return (
    <nav className="admin-breadcrumb" aria-label="Breadcrumb">
      <Link href="/admin" className="admin-breadcrumb-item hover:text-admin-text-main">
        NorthEastTravel
      </Link>
      
      {paths.length > 0 && <ChevronRight size={14} className="admin-breadcrumb-separator" />}
      
      {paths.map((path, index) => {
        const href = `/admin/${paths.slice(0, index + 1).join('/')}`
        const isLast = index === paths.length - 1
        const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ')

        return (
          <React.Fragment key={path}>
            {isLast ? (
              <span className="font-medium text-admin-text-main">{label}</span>
            ) : (
              <div className="flex items-center gap-2">
                <Link href={href} className="admin-breadcrumb-item">
                  {label}
                </Link>
                <ChevronRight size={14} className="admin-breadcrumb-separator" />
              </div>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}

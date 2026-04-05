'use client'

import React, { ReactNode } from 'react'
import { ImageIcon, LucideIcon, MoreVertical } from 'lucide-react'

interface AdminCardProps {
  title: string
  subtitle?: string | ReactNode
  description?: string
  image?: string
  badge?: string
  status?: string // 'draft' | 'pending' | 'published' | 'archived'
  onStatusChange?: (newStatus: string) => void
  tags?: string[]
  footer?: ReactNode
  icon?: LucideIcon
  onClick?: () => void
  meta?: string | ReactNode
}

export default function AdminCard({
  title,
  subtitle,
  description,
  image,
  badge,
  status,
  onStatusChange,
  tags = [],
  footer,
  icon: PlaceholderIcon = ImageIcon,
  onClick,
  meta
}: AdminCardProps) {
  const isClickable = !!onClick;

  const getStatusStyle = (s: string) => {
    switch (s?.toLowerCase()) {
      case 'published': return 'admin-badge-emerald'
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'draft': return 'bg-gray-100 text-gray-600 border-gray-200'
      case 'archived': return 'bg-rose-50 text-rose-700 border-rose-200'
      default: return 'bg-gray-50 text-gray-600 border-gray-200'
    }
  }

  return (
    <div 
      className={`admin-card-modern group ${isClickable ? 'cursor-pointer hover:border-admin-primary/50 transition-all duration-300' : ''}`}
      onClick={isClickable ? onClick : undefined}
      style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
    >
      <div className="relative aspect-video w-full overflow-hidden border-b border-admin-border-subtle bg-gray-50">
        {image ? (
          <img 
            src={image} 
            alt={title} 
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" 
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <PlaceholderIcon size={32} strokeWidth={1.5} style={{ color: 'var(--admin-text-placeholder)' }} />
          </div>
        )}
        
        {/* Status Badge Over Image */}
        {status && (
          <div className="absolute top-3 left-3">
            <span className={`admin-badge ${getStatusStyle(status)} shadow-sm`}>
              {status}
            </span>
          </div>
        )}

        {badge && (
          <div className="absolute top-3 right-3 text-[10px] font-bold text-white bg-black/40 backdrop-blur-md px-2 py-1 rounded-md uppercase tracking-wider">
            {badge}
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 bg-white">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-admin-text-main text-[0.875rem] tracking-tight group-hover:text-admin-primary transition-colors truncate" title={title}>
            {title}
          </h3>
        </div>
        
        {subtitle && (
          <div 
            className="text-[11px] font-medium text-admin-text-subtle mb-3 flex items-center gap-1.5 transition-all"
            style={{ opacity: 0.8 }}
          >
            {subtitle}
          </div>
        )}

        {description && (
          <p className="text-[12px] text-admin-text-subtle leading-relaxed line-clamp-2 mb-4 h-[36px]">
            {description}
          </p>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.slice(0, 2).map(t => (
              <span key={t} className="text-[10px] font-medium px-2 py-0.5 bg-gray-50 text-gray-500 rounded border border-gray-200">
                {t}
              </span>
            ))}
            {tags.length > 2 && <span className="text-[10px] text-gray-400 font-medium">+{tags.length - 2}</span>}
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto pt-3 border-t border-admin-border-subtle flex items-center justify-between">
          <div className="text-[10px] font-bold text-admin-text-subtle uppercase tracking-widest">
            {meta}
          </div>
          <div className="flex items-center gap-2">
            {footer}
          </div>
        </div>
      </div>
    </div>
  )
}

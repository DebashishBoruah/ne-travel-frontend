'use client'

import { forwardRef, type ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  icon?: React.ReactNode
}

const variantClass: Record<Variant, string> = {
  primary: 'admin-btn-primary',
  secondary: 'admin-btn-secondary',
  danger: 'admin-btn-danger',
  ghost: 'admin-btn-ghost',
}

const sizeClass: Record<Size, string> = {
  sm: 'admin-btn-sm',
  md: '',
  lg: 'admin-btn-lg',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'secondary', size = 'md', loading, icon, children, className = '', disabled, ...rest }, ref) => {
    const cls = `admin-btn ${variantClass[variant]} ${sizeClass[size]} ${className}`.trim()

    return (
      <button ref={ref} className={cls} disabled={disabled || loading} {...rest}>
        {loading ? (
          <span style={{ display: 'inline-flex', animation: 'spin 0.8s linear infinite', width: 14, height: 14 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" opacity=".35" />
              <path d="M12 2v4" />
            </svg>
          </span>
        ) : icon ? (
          <span style={{ display: 'inline-flex', flexShrink: 0 }}>{icon}</span>
        ) : null}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button

'use client'

import { forwardRef, type SelectHTMLAttributes } from 'react'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  required?: boolean
  hint?: string
  error?: string
  options: SelectOption[]
  placeholder?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, required, hint, error, options, placeholder, className = '', ...rest }, ref) => {
    const selectCls = `admin-input admin-select${error ? ' admin-input-error' : ''} ${className}`.trim()

    return (
      <div className="admin-field">
        {label && (
          <label className="admin-label">
            {label}
            {required && <span className="admin-label-required">*</span>}
            {hint && <span className="admin-label-hint">{hint}</span>}
          </label>
        )}
        <select ref={ref} className={selectCls} {...rest}>
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {error && <span className="admin-field-error">{error}</span>}
      </div>
    )
  }
)

Select.displayName = 'Select'
export default Select

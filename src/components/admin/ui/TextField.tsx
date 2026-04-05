'use client'

import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'

interface BaseProps {
  label?: string
  required?: boolean
  hint?: string
  error?: string
}

type InputProps = BaseProps & InputHTMLAttributes<HTMLInputElement> & { multiline?: false; rows?: never }
type TextAreaProps = BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement> & { multiline: true }

export type TextFieldProps = InputProps | TextAreaProps

const TextField = forwardRef<HTMLInputElement | HTMLTextAreaElement, TextFieldProps>(
  ({ label, required, hint, error, className = '', multiline, ...rest }, ref) => {
    const inputCls = `admin-input${error ? ' admin-input-error' : ''} ${className}`.trim()

    return (
      <div className="admin-field">
        {label && (
          <label className="admin-label">
            {label}
            {required && <span className="admin-label-required">*</span>}
            {hint && <span className="admin-label-hint">{hint}</span>}
          </label>
        )}
        {multiline ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            className={inputCls}
            {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            className={inputCls}
            {...(rest as InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
        {error && <span className="admin-field-error">{error}</span>}
      </div>
    )
  }
)

TextField.displayName = 'TextField'
export default TextField

import React from 'react'

const NeuButton = ({ children, variant = 'primary', loading = false, disabled = false, style, ...props }) => {
  const isPrimary = variant === 'primary'
  const isDisabled = disabled || loading
  
  return (
    <button
      disabled={isDisabled}
      style={{
        padding: '12px 24px',
        borderRadius: 'var(--radius-sm)',
        background: isDisabled ? 'var(--bg-color)' : (isPrimary ? 'var(--accent-primary)' : 'transparent'),
        color: isDisabled ? 'var(--text-secondary)' : (isPrimary ? '#000' : 'var(--text-primary)'),
        border: isDisabled ? '1px solid var(--border-color)' : (isPrimary ? 'none' : '1px solid var(--border-color)'),
        fontWeight: 500,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.7 : 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'all var(--transition-fast)',
        fontFamily: 'var(--font-sans)',
        ...style
      }}
      onMouseOver={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.background = isPrimary ? 'var(--accent-hover)' : 'var(--surface-hover)'
        }
      }}
      onMouseOut={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.background = isPrimary ? 'var(--accent-primary)' : 'transparent'
        }
      }}
      {...props}
    >
      {loading && (
        <svg style={{ animation: 'spin 1s linear infinite', width: '18px', height: '18px' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  )
}

export default NeuButton

import React from 'react'

const NeuButton = ({ children, variant = 'primary', style, ...props }) => {
  const isPrimary = variant === 'primary'
  
  return (
    <button
      style={{
        padding: '12px 24px',
        borderRadius: 'var(--radius-sm)',
        background: isPrimary ? 'var(--accent-primary)' : 'transparent',
        color: isPrimary ? '#000' : 'var(--text-primary)',
        border: isPrimary ? 'none' : '1px solid var(--border-color)',
        fontWeight: 500,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'all var(--transition-fast)',
        fontFamily: 'var(--font-sans)',
        ...style
      }}
      onMouseOver={(e) => {
        if (!props.disabled) {
          e.currentTarget.style.background = isPrimary ? 'var(--accent-hover)' : 'var(--surface-hover)'
        }
      }}
      onMouseOut={(e) => {
        if (!props.disabled) {
          e.currentTarget.style.background = isPrimary ? 'var(--accent-primary)' : 'transparent'
        }
      }}
      {...props}
    >
      {children}
    </button>
  )
}

export default NeuButton

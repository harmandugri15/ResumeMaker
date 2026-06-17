import React from 'react'

const NeuInput = ({ label, type = 'text', style, rightElement, ...props }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px', ...style }}>
      {label && (
        <label style={{ 
          fontSize: '0.9rem', 
          fontWeight: 500, 
          color: 'var(--text-secondary)' 
        }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          type={type}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '12px 16px',
            paddingRight: rightElement ? '48px' : '16px',
            background: 'var(--bg-color)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.95rem',
            outline: 'none',
            transition: 'border-color var(--transition-fast)'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--border-focus)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
          {...props}
        />
        {rightElement && (
          <div style={{ position: 'absolute', right: '12px', display: 'flex', alignItems: 'center' }}>
            {rightElement}
          </div>
        )}
      </div>
    </div>
  )
}

export default NeuInput

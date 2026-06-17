import React from 'react'

const NeuCard = ({ children, style, ...props }) => {
  return (
    <div
      style={{
        background: 'var(--surface-color)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: '24px',
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export default NeuCard

import React from 'react'
import { Link } from 'react-router-dom'
import NeuCard from '../components/ui/NeuCard'
import NeuButton from '../components/ui/NeuButton'

const TemplatePickerPage = () => {
  const templates = [
    { id: '1', name: 'Executive Pro', category: 'Professional', desc: 'Clean, traditional layout for corporate roles.', image: '/templates/executive_pro.png' },
    { id: '3', name: 'Modern Stack', category: 'Creative', desc: 'Bold headers with clear skill tags.', image: '/templates/modern_stack.png' },
    { id: '5', name: 'Pixel Perfect', category: 'Developer', desc: 'Monospace touches, designed for tech.', image: '/templates/pixel_perfect.png' },
    { id: '7', name: 'Simple Impact', category: 'Minimalist', desc: 'No lines, relies on strong typography.', image: '/templates/simple_impact.png' },
  ]

  return (
    <div className="container" style={{ paddingBottom: '40px' }}>
      <h2 style={{ marginBottom: '8px' }}>Choose a Template</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
        All our templates are 100% ATS-friendly. You can change your template at any time.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
        {templates.map(tpl => (
          <NeuCard key={tpl.id} style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ 
              height: '300px', 
              background: 'var(--bg-color)', 
              boxShadow: 'var(--neu-shadow-pressed)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              overflow: 'hidden'
            }}>
              <img 
                src={tpl.image} 
                alt={`${tpl.name} Template Preview`} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            
            <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{tpl.name}</h3>
            <span style={{ 
              fontSize: '0.8rem', 
              color: 'var(--accent-primary)', 
              background: 'rgba(74, 158, 255, 0.1)',
              padding: '2px 8px',
              borderRadius: '12px',
              display: 'inline-block',
              marginBottom: '8px',
              width: 'max-content'
            }}>
              {tpl.category}
            </span>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '24px', flex: 1 }}>
              {tpl.desc}
            </p>

            <Link to={`/build?template=${tpl.id}`}>
              <NeuButton variant="primary" style={{ width: '100%' }}>Use Template</NeuButton>
            </Link>
          </NeuCard>
        ))}
      </div>
    </div>
  )
}

export default TemplatePickerPage

import React from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import { FileText, Wand2, Target, CheckSquare, LogOut, ArrowRight } from 'lucide-react'
import NeuButton from '../ui/NeuButton'

const MainLayout = () => {
  const { isAuthenticated, logout, user } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const location = useLocation()
  const isDashboardRoute = location.pathname.includes('/dashboard') || location.pathname.includes('/build') || location.pathname.includes('/tailor')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-color)' }}>
      {/* Premium Glassmorphic Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        padding: '16px 0',
        background: 'rgba(12, 12, 12, 0.7)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-color)',
        transition: 'all 0.2s ease'
      }}>
        <div className="container" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          {/* Logo */}
          <Link to={isAuthenticated ? "/dashboard" : "/"} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '32px', height: '32px', 
              borderRadius: '8px', 
              background: 'var(--accent-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <FileText size={18} color="#000" strokeWidth={2.5} />
            </div>
            <span style={{ 
              fontFamily: 'var(--font-mono)', 
              fontSize: '1.25rem', 
              fontWeight: 700,
              letterSpacing: '-0.05em',
              color: '#fff'
            }}>
              Resume<span style={{ color: 'var(--accent-primary)' }}>Maker</span>
            </span>
          </Link>

          {/* Navigation */}
          {isAuthenticated ? (
            <nav style={{ display: 'flex', alignItems: 'center', gap: '32px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
              <Link to="/dashboard" style={{ color: 'var(--text-primary)', transition: 'color 0.2s' }}>Dashboard</Link>
              <Link to="/templates" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}>Templates</Link>
              <Link to="/build" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}>Build</Link>
              <Link to="/tailor" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}>Tailor</Link>
              
              <div style={{ width: '1px', height: '24px', background: 'var(--border-color)' }}></div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <NeuButton variant="ghost" onClick={handleLogout} style={{ padding: '8px', color: 'var(--text-secondary)' }}>
                  <LogOut size={18} />
                </NeuButton>
              </div>
            </nav>
          ) : (
            <nav style={{ display: 'flex', alignItems: 'center', gap: '24px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
              <a href="#" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}>Product</a>
              <a href="#" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}>Methodology</a>
              <a href="#" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}>Pricing</a>
              
              <div style={{ width: '1px', height: '24px', background: 'var(--border-color)', margin: '0 8px' }}></div>

              <Link to="/auth" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Sign In</Link>
              <Link to="/auth?tab=register">
                <NeuButton variant="primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  Deploy Now <ArrowRight size={14} style={{ marginLeft: '4px' }}/>
                </NeuButton>
              </Link>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* Premium Multi-Column Footer (Hidden on Editor Routes) */}
      {!isDashboardRoute && (
        <footer style={{ 
          background: '#09090b',
          borderTop: '1px solid var(--border-color)',
          padding: '80px 0 40px 0',
          marginTop: 'auto'
        }}>
          <div className="container">
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '2fr 1fr 1fr 1fr', 
              gap: '48px',
              marginBottom: '80px'
            }}>
              {/* Brand Column */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={16} color="#000" strokeWidth={2.5} />
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.05em', color: '#fff' }}>
                    Resume<span style={{ color: 'var(--accent-primary)' }}>Maker</span>
                  </span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '300px', marginBottom: '24px' }}>
                  A deterministic ATS optimization engine built for modern software engineers and professionals. Bypass the algorithm.
                </p>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <a href="#" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>Twitter</a>
                  <a href="#" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>GitHub</a>
                  <a href="#" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>LinkedIn</a>
                </div>
              </div>

              {/* Links Columns */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h4 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '8px' }}>PRODUCT</h4>
                <a href="#" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>ATS Engine</a>
                <a href="#" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>Semantic Tailoring</a>
                <a href="#" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>Templates</a>
                <a href="#" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>Pricing</a>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h4 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '8px' }}>RESOURCES</h4>
                <a href="#" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>Documentation</a>
                <a href="#" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>API Reference</a>
                <a href="#" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>Blog</a>
                <a href="#" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>Community</a>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h4 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '8px' }}>COMPANY</h4>
                <a href="#" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>About</a>
                <a href="#" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>Careers</a>
                <a href="#" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>Legal</a>
                <a href="#" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>Contact</a>
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              paddingTop: '32px',
              borderTop: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-mono)'
            }}>
              <div>© {new Date().getFullYear()} ResumeMaker Inc. All rights reserved.</div>
              <div style={{ display: 'flex', gap: '24px' }}>
                <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Privacy Policy</a>
                <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}

export default MainLayout

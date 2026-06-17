import React, { useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, User as UserIcon } from 'lucide-react'
import NeuCard from '../components/ui/NeuCard'
import NeuInput from '../components/ui/NeuInput'
import NeuButton from '../components/ui/NeuButton'
import useAuthStore from '../store/authStore'
import api from '../services/api'

const AuthPage = () => {
  const [searchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') === 'register' ? 'register' : 'login'
  const [tab, setTab] = useState(initialTab)
  const [showPassword, setShowPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const login = useAuthStore(state => state.login)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (tab === 'login') {
        const response = await api.post('auth/login/', {
          username: formData.email,
          password: formData.password
        })
        
        // Response should contain user object and tokens
        const { user, tokens } = response.data
        localStorage.setItem('access_token', tokens.access)
        localStorage.setItem('refresh_token', tokens.refresh)
        
        login(user, tokens)
        navigate('/dashboard')
        
      } else {
        // Handle Register
        const response = await api.post('auth/register/', {
          username: formData.email,
          first_name: formData.name.split(' ')[0] || formData.name,
          last_name: formData.name.split(' ').slice(1).join(' ') || '',
          email: formData.email,
          password: formData.password,
          password_confirm: formData.password
        })
        
        const { user, tokens } = response.data
        localStorage.setItem('access_token', tokens.access)
        localStorage.setItem('refresh_token', tokens.refresh)
        
        login(user, tokens)
        navigate('/dashboard')
      }
    } catch (err) {
      console.error('Auth error:', err)
      const data = err.response?.data
      if (data) {
        if (typeof data === 'string') {
          setError(data)
        } else if (data.error) {
          setError(data.error)
        } else if (data.detail) {
          setError(data.detail)
        } else {
          // Extract first validation error
          const firstKey = Object.keys(data)[0]
          const firstError = Array.isArray(data[firstKey]) ? data[firstKey][0] : data[firstKey]
          
          // Format the key to be more user friendly (e.g. 'password_confirm' -> 'Password')
          const niceKey = firstKey.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
          setError(`${niceKey}: ${firstError}`)
        }
      } else {
        setError('An error occurred connecting to the server.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <NeuCard style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ display: 'flex', marginBottom: '24px', gap: '8px' }}>
          <NeuButton 
            variant={tab === 'login' ? 'raised' : 'ghost'} 
            onClick={() => { setTab('login'); setError(''); }}
            style={{ flex: 1 }}
          >
            Login
          </NeuButton>
          <NeuButton 
            variant={tab === 'register' ? 'raised' : 'ghost'} 
            onClick={() => { setTab('register'); setError(''); }}
            style={{ flex: 1 }}
          >
            Register
          </NeuButton>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>
            {tab === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {tab === 'login' ? 'Sign in to access your resumes' : 'Start building your ATS-friendly resume'}
          </p>
        </div>

        {error && (
          <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--error)', color: 'var(--error)', borderRadius: 'var(--radius-sm)', marginBottom: '24px', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {tab === 'register' && (
            <NeuInput 
              label="Full Name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="John Doe" 
              required 
            />
          )}
          <NeuInput 
            label="Email" 
            name="email" 
            type="email" 
            value={formData.email} 
            onChange={handleChange} 
            placeholder="you@example.com" 
            required 
          />
          <NeuInput 
            label="Password" 
            name="password" 
            type={showPassword ? "text" : "password"} 
            value={formData.password} 
            onChange={handleChange} 
            placeholder="••••••••" 
            required 
            rightElement={
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--text-secondary)', 
                  cursor: 'pointer', 
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />

          {tab === 'login' && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-8px', marginBottom: '8px' }}>
              <a href="#" onClick={(e) => { e.preventDefault(); alert('Password reset flow would go here.'); }} style={{ color: 'var(--accent-primary)', fontSize: '0.85rem', textDecoration: 'none' }}>
                Forgot Password?
              </a>
            </div>
          )}
          
          <NeuButton variant="primary" type="submit" disabled={isLoading} style={{ marginTop: '16px', padding: '14px', fontSize: '1rem' }}>
            {isLoading ? 'Processing...' : (tab === 'login' ? 'Sign In' : 'Create Account')}
          </NeuButton>
        </form>
      </NeuCard>
    </div>
  )
}

export default AuthPage

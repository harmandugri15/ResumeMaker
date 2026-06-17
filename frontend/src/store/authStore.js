import { create } from 'zustand'

// Simple mock for now until we hook up the backend
const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem('access_token'), 
  tokens: {
    access: localStorage.getItem('access_token'),
    refresh: localStorage.getItem('refresh_token'),
  },
  
  login: (userData, tokens) => {
    localStorage.setItem('access_token', tokens.access)
    localStorage.setItem('refresh_token', tokens.refresh)
    set({ 
      user: userData, 
      isAuthenticated: true, 
      tokens 
    })
  },
  
  logout: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    set({ 
      user: null, 
      isAuthenticated: false, 
      tokens: null 
    })
  },
}))

export default useAuthStore

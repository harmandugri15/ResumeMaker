import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import React from 'react'

// Layouts
import MainLayout from './components/layout/MainLayout'

// Pages
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import TemplatePickerPage from './pages/TemplatePickerPage'
import ResumeBuilderPage from './pages/ResumeBuilderPage'
import JobTailorPage from './pages/JobTailorPage'
import ResumeReviewPage from './pages/ResumeReviewPage'

// Stores
import useAuthStore from './store/authStore'

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }
  return children
}

function App() {
  return (
    <Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#21213a',
            color: '#fff',
            border: '1px solid #4a9eff'
          }
        }}
      />
      
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="auth" element={<AuthPage />} />
          
          {/* Protected Routes */}
          <Route path="dashboard" element={
            <ProtectedRoute><DashboardPage /></ProtectedRoute>
          } />
          <Route path="templates" element={
            <ProtectedRoute><TemplatePickerPage /></ProtectedRoute>
          } />
          <Route path="build/:resumeId?" element={
            <ProtectedRoute><ResumeBuilderPage /></ProtectedRoute>
          } />
          <Route path="tailor/:resumeId?" element={
            <ProtectedRoute><JobTailorPage /></ProtectedRoute>
          } />
          <Route path="review" element={
            <ProtectedRoute><ResumeReviewPage /></ProtectedRoute>
          } />
        </Route>
      </Routes>
    </Router>
  )
}

export default App

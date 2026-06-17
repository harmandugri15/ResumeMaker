import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit3, Trash2, Download } from 'lucide-react'
import NeuCard from '../components/ui/NeuCard'
import NeuButton from '../components/ui/NeuButton'
import html2pdf from 'html2pdf.js'
import api from '../services/api'

const DashboardPage = () => {
  const [resumes, setResumes] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchResumes()
  }, [])

  const fetchResumes = async () => {
    try {
      // Assuming GET /api/resumes/ returns list of resumes
      const response = await api.get('resumes/')
      setResumes(response.data)
    } catch (err) {
      console.error("Error fetching resumes:", err)
      // Mock fallback if backend isn't responding
      setResumes([
         { id: 'mock-1', title: 'Software Engineer - Google', updated_at: new Date().toISOString(), template: 'Executive Pro' }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resume?")) return;
    
    try {
      if (typeof id === 'string' && id.startsWith('mock-')) {
         // Just delete local mock
      } else {
         await api.delete(`resumes/${id}/`)
      }
      setResumes(prev => prev.filter(r => r.id !== id))
    } catch (err) {
      console.error("Error deleting resume:", err)
      alert("Failed to delete resume.")
    }
  }

  const handleDownload = async (id) => {
    try {
      // 1. Fetch resume detail
      const resumeDetailRes = await api.get(`resumes/${id}/`)
      const resumeData = resumeDetailRes.data
      
      // 2. Fetch template CSS for styling
      const renderRes = await api.post(`templates/${resumeData.template_id}/render/`, resumeData)
      const htmlContent = renderRes.data.html
      const cssContent = renderRes.data.css

      // 3. Inject print-safe CSS
      const htmlForPrint = htmlContent.includes('</head>')
        ? htmlContent.replace('</head>', `<style>${cssContent} @page{margin:0} body{margin:0!important;background:white!important} .resume{padding:1.5cm!important;max-width:210mm!important;box-shadow:none!important}</style></head>`)
        : `<html><head><style>${cssContent} @page{margin:0} body{margin:0!important;background:white!important}</style></head><body>${htmlContent}</body></html>`
      
      // 4. Print via invisible iframe with onload event
      const iframe = document.createElement('iframe')
      iframe.style.position = 'fixed'
      iframe.style.right = '0'
      iframe.style.bottom = '0'
      iframe.style.width = '1px'
      iframe.style.height = '1px'
      iframe.style.opacity = '0'
      iframe.style.border = 'none'
      iframe.srcdoc = htmlForPrint
      iframe.onload = () => {
        iframe.contentWindow.focus()
        iframe.contentWindow.print()
        setTimeout(() => document.body.removeChild(iframe), 2000)
      }
      document.body.appendChild(iframe)
      
    } catch (err) {
      console.error("Error downloading PDF:", err)
      alert("PDF generation failed. Error: " + (err?.message || err))
    }
  }

  const handleRename = async (id, currentTitle) => {
    const newTitle = window.prompt("Enter new resume name:", currentTitle || "Untitled Resume")
    if (!newTitle || newTitle === currentTitle) return;
    try {
      // Find full resume to pass back to PUT (we need to send full data)
      const detailRes = await api.get(`resumes/${id}/`)
      const updatedData = { ...detailRes.data, title: newTitle }
      await api.put(`resumes/${id}/`, updatedData)
      setResumes(prev => prev.map(r => r.id === id ? { ...r, title: newTitle } : r))
    } catch (err) {
      console.error("Rename Error:", err)
      alert("Failed to rename resume")
    }
  }

  if (isLoading) return <div className="container" style={{ padding: '64px', textAlign: 'center' }}>Loading resumes...</div>

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h2>My Resumes</h2>
        <Link to="/templates">
          <NeuButton variant="primary">
            <Plus size={18} /> New Resume
          </NeuButton>
        </Link>
      </div>

      {resumes.length === 0 ? (
        <NeuCard style={{ textAlign: 'center', padding: '64px 24px' }}>
          <h3 style={{ color: 'var(--text-secondary)' }}>No resumes yet</h3>
          <p style={{ marginBottom: '24px', color: 'var(--text-secondary)' }}>Create your first ATS-friendly resume now.</p>
          <Link to="/templates">
            <NeuButton variant="primary">Create Resume</NeuButton>
          </Link>
        </NeuCard>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {resumes.map(resume => (
            <NeuCard key={resume.id} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1, marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{resume.title || 'Untitled Resume'}</h3>
                  <button onClick={() => handleRename(resume.id, resume.title)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }} title="Rename">
                    <Edit3 size={16} />
                  </button>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Template: {resume.template || 'Default'}
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Edited {new Date(resume.updated_at).toLocaleDateString()}
                </p>
              </div>
              
              <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
                <Link to={`/build/${resume.id}`} style={{ flex: 1 }}>
                  <NeuButton variant="flat" style={{ width: '100%' }}>Edit Resume</NeuButton>
                </Link>
                <NeuButton variant="ghost" onClick={() => handleDownload(resume.id)} style={{ padding: '10px' }} title="Download PDF"><Download size={16} /></NeuButton>
                <NeuButton variant="ghost" onClick={() => handleDelete(resume.id)} style={{ padding: '10px', color: 'var(--error)' }} title="Delete"><Trash2 size={16} /></NeuButton>
              </div>
            </NeuCard>
          ))}
        </div>
      )}
    </div>
  )
}

export default DashboardPage

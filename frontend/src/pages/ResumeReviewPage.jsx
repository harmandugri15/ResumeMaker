import React, { useState, useRef } from 'react'
import NeuCard from '../components/ui/NeuCard'
import NeuButton from '../components/ui/NeuButton'
import { Upload, FileText, CheckCircle, AlertTriangle } from 'lucide-react'
import api from '../services/api'

const ResumeReviewPage = () => {
  const [file, setFile] = useState(null)
  const [fileUrl, setFileUrl] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [review, setReview] = useState(null)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile)
      setFileUrl(URL.createObjectURL(selectedFile))
      setReview(null)
      setError(null)
    } else {
      alert("Please select a valid PDF file.")
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleReview = async () => {
    if (!file) return
    
    setIsUploading(true)
    setError(null)
    
    const formData = new FormData()
    formData.append('resume_pdf', file)

    try {
      const response = await api.post('review/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      // Backend returns {"score": 85, "feedback": [...]} based on reviewer.py structure
      setReview(response.data)
    } catch (err) {
      console.error("Review Error:", err)
      setError("Failed to analyze resume. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 64px)', borderTop: '1px solid var(--border-color)', background: 'var(--bg-color)' }}>
      {/* LEFT PANE: File Upload & PDF Preview */}
      <div style={{ flex: 1, borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)' }}>
          <h2 style={{ marginBottom: '8px' }}>AI Resume Review</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Upload your PDF to get actionable, RAG-powered feedback.</p>
          
          <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
             <NeuButton variant="flat" onClick={handleUploadClick} style={{ flex: 1 }}>
               <Upload size={18} style={{ marginRight: '8px' }} /> {file ? 'Change PDF' : 'Upload PDF'}
             </NeuButton>
             <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf" style={{ display: 'none' }} />
             
             <NeuButton 
               variant="primary" 
               onClick={handleReview}
               disabled={!file || isUploading}
               style={{ flex: 1 }}
             >
               {isUploading ? 'Analyzing...' : 'Analyze Now'}
             </NeuButton>
          </div>
        </div>

        <div style={{ flex: 1, background: '#e2e8f0', padding: '24px', overflowY: 'hidden' }}>
          {fileUrl ? (
            <iframe 
              src={fileUrl} 
              width="100%" 
              height="100%" 
              style={{ border: 'none', borderRadius: 'var(--radius-sm)', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
              title="Resume Preview"
            />
          ) : (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
              <FileText size={64} style={{ opacity: 0.5, marginBottom: '16px' }} />
              <p>Your PDF preview will appear here.</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANE: Analysis Results */}
      <div style={{ width: '450px', background: 'var(--surface-color)', padding: '32px', overflowY: 'auto' }}>
        {error && <div style={{ color: 'var(--error)', padding: '16px', border: '1px solid var(--error)', borderRadius: 'var(--radius-sm)', marginBottom: '24px' }}>{error}</div>}

        {review ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '1.5rem' }}>ATS Analysis</h3>
              <div style={{ 
                background: (review.score || review.overall_score || 0) > 80 ? 'var(--success)' : 'var(--warning)', 
                color: '#fff',
                padding: '8px 16px', 
                borderRadius: 'var(--radius-full)',
                fontWeight: 'bold',
                fontSize: '1.2rem'
              }}>
                {review.score || review.overall_score || 'N/A'} / 100
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {(review.suggestions || review.feedback || review.issues || []).map((item, i) => (
                <div key={i} style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: '8px',
                  padding: '16px',
                  background: 'var(--bg-color)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)'
                }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {item.severity === 'Critical' || item.severity === 'high' ? <AlertTriangle size={20} color="var(--error)" /> : 
                     item.severity === 'Important' || item.severity === 'medium' ? <AlertTriangle size={20} color="var(--warning)" /> :
                     <CheckCircle size={20} color="var(--success)" />}
                     <h4 style={{ fontSize: '0.95rem', margin: 0, textTransform: 'uppercase' }}>{item.category || item.type || 'Feedback'}</h4>
                  </div>
                  
                  {item.issue ? (
                    <>
                      <p style={{ fontSize: '0.9rem', margin: '4px 0 0 0', fontWeight: 500 }}>{item.issue}</p>
                      <p style={{ fontSize: '0.85rem', margin: 0, color: 'var(--text-secondary)' }}>{item.recommendation}</p>
                      {item.after && (
                        <div style={{ marginTop: '8px', padding: '8px', background: 'var(--surface-color)', borderRadius: '4px', fontSize: '0.8rem', borderLeft: '3px solid var(--success)' }}>
                          <strong>Suggestion:</strong> {item.after}
                        </div>
                      )}
                    </>
                  ) : (
                    <p style={{ fontSize: '0.85rem', margin: 0, color: 'var(--text-secondary)' }}>{item.message || item.description}</p>
                  )}
                </div>
              ))}
              
              {(!review.suggestions && !review.feedback && !review.issues) && (
                <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {JSON.stringify(review, null, 2)}
                </pre>
              )}
            </div>
          </div>
        ) : (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', textAlign: 'center' }}>
            <AlertTriangle size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
            <p>Upload a resume and click Analyze to receive specialized RAG-powered feedback.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ResumeReviewPage

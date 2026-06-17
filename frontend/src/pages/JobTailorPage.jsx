import React, { useState, useEffect } from 'react'
import NeuCard from '../components/ui/NeuCard'
import NeuButton from '../components/ui/NeuButton'
import { Sparkles, ArrowRight, Download, FileText, Briefcase, UploadCloud, CheckCircle, Upload, X, ChevronRight, Wand2 } from 'lucide-react'
import html2pdf from 'html2pdf.js'
import api from '../services/api'

const JobTailorPage = () => {
  const [resumes, setResumes] = useState([])
  const [selectedResumeId, setSelectedResumeId] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  
  // Upload state
  const [uploadMode, setUploadMode] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [parsedResumeData, setParsedResumeData] = useState(null)
  const [isParsing, setIsParsing] = useState(false)

  const [templates, setTemplates] = useState([])
  const [selectedTemplateId, setSelectedTemplateId] = useState(1)
  
  const [previewHtml, setPreviewHtml] = useState('')
  const [previewCss, setPreviewCss] = useState('')
  const [isRendering, setIsRendering] = useState(false)

  useEffect(() => {
    fetchResumes()
    fetchTemplates()
  }, [])

  const fetchResumes = async () => {
    try {
      const response = await api.get('resumes/')
      setResumes(response.data)
      if (response.data.length > 0) {
        setSelectedResumeId(response.data[0].id)
        if (response.data[0].template_id) setSelectedTemplateId(response.data[0].template_id)
      }
    } catch (err) {
      console.error("Error fetching resumes:", err)
    }
  }

  const fetchTemplates = async () => {
    try {
      const response = await api.get('templates/')
      setTemplates(response.data)
    } catch (err) {
      console.error("Error fetching templates:", err)
    }
  }

  // Update selected template if resume selection changes
  useEffect(() => {
    if (!uploadMode && selectedResumeId) {
      const res = resumes.find(r => r.id === selectedResumeId)
      if (res && res.template_id) setSelectedTemplateId(res.template_id)
    }
  }, [selectedResumeId, uploadMode, resumes])

  // Derive the preview data (base data overwritten by tailored fields)
  const baseResumeData = uploadMode ? parsedResumeData : resumes.find(r => r.id === selectedResumeId)?.data
  
  const previewData = React.useMemo(() => {
    if (!baseResumeData) return null
    if (!results || (!results.summary && !results.experience)) return baseResumeData
    
    // Deep merge experience to guarantee we don't lose dates/locations if AI accidentally drops them
    const tailoredExperience = (results.experience || []).map(optExp => {
      const originalExp = (baseResumeData.experience || []).find(e => e.company === optExp.company && e.title === optExp.title)
      if (originalExp) {
        return { ...originalExp, ...optExp } // AI fields overwrite, but original fields (dates, etc) act as fallback
      }
      return optExp
    })

    // If AI somehow returned no experience, fallback to base
    const finalExperience = tailoredExperience.length > 0 ? tailoredExperience : baseResumeData.experience

    return {
      ...baseResumeData,
      summary: results.summary || baseResumeData.summary,
      experience: finalExperience
    }
  }, [baseResumeData, results])

  // Fetch rendered HTML from backend whenever previewData or template changes
  useEffect(() => {
    if (!previewData || !selectedTemplateId) return
    
    const renderPreview = async () => {
      setIsRendering(true)
      try {
        const response = await api.post(`templates/${selectedTemplateId}/render/`, previewData)
        setPreviewHtml(response.data.html)
        setPreviewCss(response.data.css)
      } catch (err) {
        console.error("Error rendering template:", err)
      } finally {
        setIsRendering(false)
      }
    }
    
    // Add small debounce
    const timeout = setTimeout(renderPreview, 300)
    return () => clearTimeout(timeout)
  }, [previewData, selectedTemplateId])

  const handleTailor = async () => {
    if ((!uploadMode && !selectedResumeId) || (uploadMode && !parsedResumeData) || !jobDescription) return
    
    setIsAnalyzing(true)
    setError(null)
    setResults(null)
    
    try {
      const jdResponse = await api.post('tailor/analyze-job/', { job_description: jobDescription })
      const jobAnalysis = jdResponse.data

      let optResponse;
      if (uploadMode) {
        optResponse = await api.post('tailor/optimize/', { 
          resume_data: parsedResumeData,
          job_analysis: jobAnalysis
        })
      } else {
        optResponse = await api.post('tailor/optimize/', { 
          resume_id: selectedResumeId,
          job_analysis: jobAnalysis
        })
      }
      
      setResults(optResponse.data)
    } catch (err) {
      console.error("Tailor Error:", err)
      setError("Failed to generate tailored resume. Please ensure you are logged in and API is configured.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleDownload = async () => {
    if (!previewData) return;
    try {
      const payload = {
        title: uploadMode ? "Tailored Resume" : `${resumes.find(r => r.id === selectedResumeId)?.title || 'Resume'} (Tailored)`,
        template_id: selectedTemplateId,
        personal_info: previewData.personal_info,
        summary: previewData.summary,
        experience: previewData.experience,
        education: previewData.education,
        skills: previewData.skills,
        projects: previewData.projects || [],
        certifications: previewData.certifications || [],
        publications: previewData.publications || [],
        custom_sections: previewData.custom_sections || []
      };
      
      // Save the tailored resume
      await api.post('resumes/', payload);
      
      // Re-render fresh HTML for printing (with underlines stripped)
      const renderRes = await api.post(`templates/${selectedTemplateId}/render/`, previewData)
      const freshHtml = renderRes.data.html
      const freshCss = renderRes.data.css
      
      const htmlForPrint = freshHtml.includes('</head>')
        ? freshHtml.replace('</head>', `<style>${freshCss} @page{margin:0} body{margin:0!important;background:white!important} .resume{padding:1.5cm!important;max-width:210mm!important;box-shadow:none!important} u{text-decoration:none!important}</style></head>`)
        : `<html><head><style>${freshCss} @page{margin:0} body{margin:0!important} u{text-decoration:none!important}</style></head><body>${freshHtml}</body></html>`
      
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
      console.error("Download Error", err);
      alert("Failed to download PDF. Error: " + (err?.message || err));
    }
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 64px)', borderTop: '1px solid var(--border-color)', background: 'var(--bg-color)' }}>
      {/* LEFT PANE: Inputs */}
      <div style={{ width: '450px', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', background: 'var(--surface-color)', zIndex: 10 }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)' }}>
          <h2 style={{ marginBottom: '8px' }}>AI Resume Tailor</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Select a base resume and paste the target job description.</p>
        </div>
        
        <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
          {error && <div style={{ color: 'var(--error)', padding: '12px', border: '1px solid var(--error)', borderRadius: 'var(--radius-sm)', marginBottom: '16px' }}>{error}</div>}
          
          <div style={{ marginBottom: '24px', display: 'flex', gap: '16px' }}>
            <button 
              onClick={() => setUploadMode(false)}
              style={{ flex: 1, padding: '8px', border: 'none', background: !uploadMode ? 'var(--accent-primary)' : 'var(--bg-color)', color: !uploadMode ? '#fff' : 'var(--text-secondary)', borderRadius: '4px', cursor: 'pointer' }}
            >
              Select Existing
            </button>
            <button 
              onClick={() => setUploadMode(true)}
              style={{ flex: 1, padding: '8px', border: 'none', background: uploadMode ? 'var(--accent-primary)' : 'var(--bg-color)', color: uploadMode ? '#fff' : 'var(--text-secondary)', borderRadius: '4px', cursor: 'pointer' }}
            >
              Upload PDF
            </button>
          </div>

          {!uploadMode ? (
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Select Base Resume</label>
              <select 
                value={selectedResumeId} 
                onChange={e => setSelectedResumeId(e.target.value)}
                style={{
                  width: '100%', padding: '12px', background: 'var(--bg-color)',
                  border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)', outline: 'none'
                }}
              >
                {resumes.map(r => (
                  <option key={r.id} value={r.id}>{r.title || 'Untitled Resume'}</option>
                ))}
              </select>
            </div>
          ) : (
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Upload PDF Resume</label>
              <div style={{ 
                border: '2px dashed var(--border-color)', padding: '24px', textAlign: 'center', 
                borderRadius: 'var(--radius-md)', background: 'var(--bg-color)', position: 'relative'
              }}>
                {isParsing ? (
                  <div style={{ color: 'var(--accent-primary)' }}>Parsing Resume with AI...</div>
                ) : parsedResumeData ? (
                  <div style={{ color: 'var(--success)' }}>
                    <CheckCircle size={24} style={{ marginBottom: '8px' }} />
                    <div>{uploadedFile?.name} Parsed Successfully!</div>
                  </div>
                ) : (
                  <>
                    <UploadCloud size={32} color="var(--text-secondary)" style={{ marginBottom: '8px' }} />
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Click to upload or drag and drop</div>
                    <input 
                      type="file" 
                      accept=".pdf"
                      onChange={async (e) => {
                        const file = e.target.files[0]
                        if (file) {
                          setUploadedFile(file)
                          setIsParsing(true)
                          const formData = new FormData()
                          formData.append('file', file)
                          try {
                            const res = await api.post('tailor/parse-upload/', formData, {
                              headers: { 'Content-Type': 'multipart/form-data' }
                            })
                            setParsedResumeData(res.data.resume_data)
                          } catch (err) {
                            setError('Failed to parse PDF')
                          } finally {
                            setIsParsing(false)
                          }
                        }
                      }}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                    />
                  </>
                )}
              </div>
            </div>
          )}

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Target Job Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              style={{
                width: '100%', height: '300px', padding: '16px', background: 'var(--bg-color)',
                border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)', fontFamily: 'var(--font-sans)',
                resize: 'vertical', outline: 'none'
              }}
            />
          </div>

          <NeuButton 
            variant="primary" 
            style={{ width: '100%' }}
            onClick={handleTailor}
            loading={isAnalyzing}
            disabled={!jobDescription || (!uploadMode && !selectedResumeId) || (uploadMode && !parsedResumeData)}
          >
            {isAnalyzing ? 'Tailoring with RAG...' : <><Sparkles size={18} /> Generate Tailored Resume</>}
          </NeuButton>
        </div>
      </div>

      {/* RIGHT PANE: Results Preview */}
      <div style={{ flex: 1, background: '#e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px', overflowY: 'auto' }}>
        {previewHtml ? (
          <div style={{ width: '100%', maxWidth: '800px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <h3 style={{ color: '#000', margin: 0 }}>{results ? 'Tailored Preview' : 'Base Resume Preview'}</h3>
                {templates.length > 0 && (
                  <select 
                    value={selectedTemplateId} 
                    onChange={e => setSelectedTemplateId(e.target.value)}
                    style={{
                      padding: '8px', background: 'var(--surface-color)',
                      border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-primary)', outline: 'none'
                    }}
                  >
                    {templates.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                )}
              </div>
              <NeuButton variant="primary" onClick={handleDownload} style={{ padding: '8px 16px' }}>
                <Download size={18} style={{ marginRight: '8px' }} /> Download PDF
              </NeuButton>
            </div>
            
            <div style={{ 
              background: '#ffffff', width: '210mm', minHeight: '297mm', 
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25), 0 0 15px rgba(0,0,0,0.05)',
              overflow: 'hidden', position: 'relative', alignSelf: 'center', flexShrink: 0
            }}>
              {isRendering && (
                <div style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', zIndex: 100 }}>
                  Rendering...
                </div>
              )}
              <iframe
                title="Template Preview"
                style={{ width: '100%', height: '100%', minHeight: '297mm', border: 'none' }}
                srcDoc={previewHtml.replace(
                  '</head>',
                  `<style>
                    ${previewCss}
                    @page { margin: 0; }
                    body { margin: 0 !important; background: white !important; }
                    .resume { 
                      padding: 1.5cm !important; 
                      margin: 0 auto !important;
                      max-width: 210mm !important;
                      box-shadow: none !important;
                    }
                    /* AI Tailor visual underline for preview */
                    u { 
                      text-decoration: underline wavy #3b82f6; 
                      text-underline-offset: 3px; 
                      text-decoration-thickness: 2px;
                      background-color: rgba(59, 130, 246, 0.1);
                    }
                  </style></head>`
                )}
              />
            </div>
          </div>
        ) : (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
            <Briefcase size={64} style={{ opacity: 0.5, marginBottom: '16px' }} />
            <p>{isParsing ? 'Extracting text from PDF...' : 'Select a base resume or upload a PDF to see preview.'}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default JobTailorPage

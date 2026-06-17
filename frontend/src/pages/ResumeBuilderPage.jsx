import React, { useState, useEffect } from 'react'
import { useLocation, useParams, useNavigate } from 'react-router-dom'
import NeuCard from '../components/ui/NeuCard'
import NeuInput from '../components/ui/NeuInput'
import NeuButton from '../components/ui/NeuButton'
import { User, Briefcase, GraduationCap, Wrench, Sparkles, Plus, Trash2, FileText, ChevronDown, ChevronUp, CheckCircle, AlertTriangle, Folder, Award, Download } from 'lucide-react'
import html2pdf from 'html2pdf.js'
import api from '../services/api'

// Hook to get query params
function useQuery() {
  const { search } = useLocation()
  return React.useMemo(() => new URLSearchParams(search), [search])
}

const mapFrontendToBackendSchema = (frontendData) => {
  return {
    personal_info: {
      full_name: frontendData.personal?.name || '',
      email: frontendData.personal?.email || '',
      phone: frontendData.personal?.phone || '',
      location: frontendData.personal?.location || '',
      linkedin: frontendData.personal?.linkedin || '',
      portfolio: frontendData.personal?.portfolio || ''
    },
    summary: frontendData.summary || '',
    experience: (frontendData.experience || []).map(exp => ({
      company: exp.company || '',
      title: exp.role || '',
      start_date: exp.start || '',
      end_date: exp.end || '',
      location: exp.location || '',
      bullets: (exp.description || exp.bullets || '').split('\n').map(b => b.replace(/^•\s*/, '').trim()).filter(b => b)
    })),
    education: (frontendData.education || []).map(edu => ({
      institution: edu.school || '',
      degree: edu.degree || '',
      field: edu.field || '',
      graduation_date: edu.graduation || `${edu.start || ''} - ${edu.end || ''}`.replace(/^ - $/, ''),
      gpa: edu.gpa || '',
      honors: ''
    })),
    skills: {
      technical: (frontendData.skills?.technical || (typeof frontendData.skills === 'string' ? frontendData.skills : '')).split(',').map(s => s.trim()).filter(Boolean),
      soft: (frontendData.skills?.soft || '').split(',').map(s => s.trim()).filter(Boolean),
      languages: [],
      tools: (frontendData.skills?.tools || '').split(',').map(s => s.trim()).filter(Boolean)
    },
    certifications: (frontendData.certifications || []).map(cert => ({
      name: cert.name || '',
      issuer: cert.issuer || '',
      date: cert.date || ''
    })),
    projects: (frontendData.projects || []).map(proj => ({
      name: proj.name || '',
      description: proj.description || '',
      technologies: (proj.tech || proj.technologies || '').split(',').map(t => t.trim()).filter(Boolean),
      url: proj.link || proj.url || ''
    })),
    publications: [],
    custom_sections: []
  };
};

const mapBackendToFrontendSchema = (backendData) => {
  return {
    personal: {
      name: backendData.personal_info?.full_name || '',
      email: backendData.personal_info?.email || '',
      phone: backendData.personal_info?.phone || '',
      location: backendData.personal_info?.location || '',
      linkedin: backendData.personal_info?.linkedin || '',
      portfolio: backendData.personal_info?.portfolio || ''
    },
    summary: backendData.summary || '',
    experience: (backendData.experience || []).map((exp, i) => ({
      id: i,
      company: exp.company || '',
      role: exp.title || '',
      start: exp.start_date || '',
      end: exp.end_date || '',
      location: exp.location || '',
      description: (exp.bullets || []).join('\n')
    })),
    education: (backendData.education || []).map((edu, i) => ({
      id: i,
      school: edu.institution || '',
      degree: edu.degree || '',
      field: edu.field || '',
      graduation: edu.graduation_date || '',
      gpa: edu.gpa || ''
    })),
    skills: {
      technical: (backendData.skills?.technical || []).join(', '),
      soft: (backendData.skills?.soft || []).join(', '),
      tools: (backendData.skills?.tools || []).join(', ')
    },
    projects: (backendData.projects || []).map((proj, i) => ({
      id: i,
      name: proj.name || '',
      description: proj.description || '',
      tech: (proj.technologies || []).join(', '),
      link: proj.url || ''
    })),
    certifications: (backendData.certifications || []).map((cert, i) => ({
      id: i,
      name: cert.name || '',
      issuer: cert.issuer || '',
      date: cert.date || ''
    }))
  }
}

const ResumeBuilderPage = () => {
  const query = useQuery()
  const { resumeId } = useParams()
  const navigate = useNavigate()
  const [templateId, setTemplateId] = useState(query.get('template') || '1')

  const [activeSection, setActiveSection] = useState('personal')
  const [expandedExpId, setExpandedExpId] = useState(null)
  const [expandedEduId, setExpandedEduId] = useState(null)
  const [expandedProjId, setExpandedProjId] = useState(null)
  const [expandedCertId, setExpandedCertId] = useState(null)
  
  const [resumeData, setResumeData] = useState({
    personal: { 
      name: 'Alex Johnson', 
      email: 'alex.johnson@email.com', 
      phone: '(555) 123-4567', 
      location: 'San Francisco, CA', 
      linkedin: 'linkedin.com/in/alexjohnson', 
      portfolio: 'alexjohnson.dev' 
    },
    summary: 'Results-driven software engineer with 5+ years of experience building scalable web applications. Specialized in Python, React, and cloud architecture. Led teams of 4-8 engineers delivering products serving 2M+ users. Passionate about clean code, mentorship, and continuous improvement.',
    experience: [
      {
        id: 1,
        company: 'TechCorp Inc.',
        role: 'Senior Software Engineer',
        start: 'Jan 2022',
        end: 'Present',
        location: 'San Francisco, CA',
        description: 'Architected and built a microservices platform reducing deployment time by 60%\nLed a team of 6 engineers delivering a real-time analytics dashboard serving 500K daily users\nImplemented CI/CD pipelines reducing production bugs by 40% and release cycles from 2 weeks to 2 days\nMentored 3 junior developers, all promoted within 18 months'
      },
      {
        id: 2,
        company: 'StartupXYZ',
        role: 'Software Engineer',
        start: 'Jun 2019',
        end: 'Dec 2021',
        location: 'Remote',
        description: 'Built RESTful APIs handling 10K+ requests/second using Django and PostgreSQL\nDeveloped responsive React frontend improving mobile engagement by 35%\nReduced AWS infrastructure costs by 25% through optimization and auto-scaling'
      }
    ],
    education: [
      {
        id: 1,
        school: 'University of California, Berkeley',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        graduation: 'May 2019',
        gpa: '3.8'
      }
    ],
    skills: { 
      technical: 'Python, JavaScript, TypeScript, React, Django, Node.js, PostgreSQL, AWS, Docker, Kubernetes', 
      soft: 'Team Leadership, Mentoring, Agile/Scrum, Technical Writing', 
      tools: 'Git, JIRA, Figma, VS Code, DataDog' 
    },
    projects: [
      {
        id: 1,
        name: 'OpenTracker',
        description: 'Open-source project management tool with real-time collaboration features',
        tech: 'React, Node.js, WebSocket, MongoDB',
        link: 'github.com/alexj/opentracker'
      }
    ],
    certifications: [
      {
        id: 1,
        name: 'AWS Solutions Architect',
        issuer: 'Amazon Web Services',
        date: '2023'
      },
      {
        id: 2,
        name: 'Professional Scrum Master I',
        issuer: 'Scrum.org',
        date: '2022'
      }
    ]
  })
  
  const [previewHtml, setPreviewHtml] = useState('')
  const [previewCss, setPreviewCss] = useState('')
  const [isRendering, setIsRendering] = useState(false)
  const [saveStatus, setSaveStatus] = useState('') // '', 'saving', 'saved', 'error'

  const [isAiProcessing, setIsAiProcessing] = useState(false)
  const [aiReviewResults, setAiReviewResults] = useState(null)

  // Load existing resume data if editing, otherwise restore from localStorage
  useEffect(() => {
    const STORAGE_KEY = resumeId ? `resume_draft_${resumeId}` : 'resume_draft_new'
    if (resumeId) {
      const loadResume = async () => {
        try {
          const res = await api.get(`resumes/${resumeId}/`)
          setResumeData(mapBackendToFrontendSchema(res.data))
          if (res.data.template_id) {
            setTemplateId(res.data.template_id.toString())
          }
          // Clear stale local backup once loaded from server
          localStorage.removeItem(STORAGE_KEY)
        } catch (err) {
          console.error("Failed to load resume:", err)
          // Fallback to local backup if server fails
          const local = localStorage.getItem(STORAGE_KEY)
          if (local) {
            try { setResumeData(JSON.parse(local)) } catch {}
          }
        }
      }
      loadResume()
    } else {
      // New resume: restore from localStorage if available
      const local = localStorage.getItem(STORAGE_KEY)
      if (local) {
        try { setResumeData(JSON.parse(local)) } catch {}
      }
    }
  }, [resumeId])

  // Autosave: debounced 3s save to backend + immediate localStorage backup
  const isFirstRender = React.useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    const STORAGE_KEY = resumeId ? `resume_draft_${resumeId}` : 'resume_draft_new'
    // Always save to localStorage immediately
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData))
    localStorage.setItem('resume_draft_templateId', templateId)

    // Debounced backend save
    setSaveStatus('saving')
    const timer = setTimeout(async () => {
      try {
        const payload = mapFrontendToBackendSchema(resumeData)
        const payloadWithMeta = { ...payload, title: resumeData.personal?.name ? `${resumeData.personal.name}'s Resume` : 'My Resume', template_id: parseInt(templateId) || 1 }
        if (resumeId) {
          await api.put(`resumes/${resumeId}/`, payloadWithMeta)
        } else {
          const newResume = await api.post('resumes/', payloadWithMeta)
          navigate(`/build/${newResume.data.id}?template=${templateId}`, { replace: true })
        }
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus(''), 2000)
      } catch (err) {
        console.error('Autosave failed:', err)
        setSaveStatus('error')
        setTimeout(() => setSaveStatus(''), 3000)
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [resumeData, templateId])

  // Debounced live rendering effect
  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsRendering(true)
      try {
        const payload = mapFrontendToBackendSchema(resumeData)
        const response = await api.post(`templates/${templateId}/render/`, payload)
        setPreviewHtml(response.data.html)
        setPreviewCss(response.data.css)
      } catch (err) {
        console.error("Failed to render template preview:", err)
      } finally {
        setIsRendering(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [resumeData, templateId])

  const handleUpdate = (section, field, value) => {
    setResumeData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }))
  }

  const handleUpdateArray = (section, id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].map(item => item.id === id ? { ...item, [field]: value } : item)
    }))
  }

  const handleAddExp = () => {
    const id = Date.now()
    setResumeData(prev => ({ ...prev, experience: [...prev.experience, { id, company: '', role: '', start: '', end: '', location: '', bullets: '' }] }))
    setExpandedExpId(id)
  }

  const handleAddEdu = () => {
    const id = Date.now()
    setResumeData(prev => ({ ...prev, education: [...prev.education, { id, school: '', degree: '', start: '', end: '', location: '' }] }))
    setExpandedEduId(id)
  }

  const handleAddProj = () => {
    const id = Date.now()
    setResumeData(prev => ({ ...prev, projects: [...prev.projects, { id, name: '', description: '', technologies: '', url: '' }] }))
    setExpandedProjId(id)
  }

  const handleAddCert = () => {
    const id = Date.now()
    setResumeData(prev => ({ ...prev, certifications: [...prev.certifications, { id, name: '', issuer: '', date: '' }] }))
    setExpandedCertId(id)
  }

  const handleDownload = async () => {
    try {
      setSaveStatus('saving');
      const payload = mapFrontendToBackendSchema(resumeData)
      const payloadWithMeta = {
        ...payload,
        title: resumeData.personal?.name ? `${resumeData.personal.name}'s Resume` : 'My Resume',
        template_id: parseInt(templateId) || 1
      }
      
      let downloadId = resumeId;
      if (resumeId) {
        await api.put(`resumes/${resumeId}/`, payloadWithMeta)
      } else {
        const res = await api.post('resumes/', payloadWithMeta)
        downloadId = res.data.id;
        navigate(`/build/${downloadId}?template=${templateId}`, { replace: true })
      }
      setSaveStatus('saved');
      
      // We must use the browser's native print engine to generate an ATS-friendly, vector-based PDF.
      // html2pdf generates image-based PDFs which fail ATS parsers and have bad page breaks.
      const container = document.createElement('div');
      const htmlForPrint = previewHtml.includes('</head>')
        ? previewHtml.replace('</head>', `<style>${previewCss} @page{margin:0} body{margin:0!important;background:white!important} .resume{padding:1.5cm!important;max-width:210mm!important;box-shadow:none!important}</style></head>`)
        : `<html><head><style>${previewCss} @page{margin:0} body{margin:0!important;background:white!important}</style></head><body>${previewHtml}</body></html>`;
      
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
      
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (err) {
      console.error("PDF Download Error:", err);
      alert("Failed to save and generate PDF. Error: " + (err?.message || err));
      setSaveStatus('error');
    }
  }

  const handleAiSummary = async () => {
    setIsAiProcessing(true)
    try {
      const response = await api.post('ai/generate-summary/', { 
        profile: resumeData.personal.title, 
        experience: JSON.stringify(resumeData.experience) 
      })
      setResumeData(prev => ({ ...prev, summary: response.data.summary }))
    } catch (err) {
      console.error(err)
      setResumeData(prev => ({ ...prev, summary: 'Highly accomplished professional with extensive experience optimizing complex systems and driving technical excellence.' }))
    } finally {
      setIsAiProcessing(false)
    }
  }

  const handleAiImprove = async (id) => {
    setIsAiProcessing(true)
    const exp = resumeData.experience.find(e => e.id === id)
    try {
      const response = await api.post('ai/generate-bullets/', { 
        company: exp.company, 
        title: exp.role, 
        raw_notes: exp.bullets 
      })
      handleUpdateArray('experience', id, 'bullets', response.data.bullets.join('\n'))
    } catch (err) {
      console.error(err)
      handleUpdateArray('experience', id, 'bullets', '• Architected robust backend solutions matching industry standards.\n• Optimized database query latency by 40% using advanced indexing strategies.')
    } finally {
      setIsAiProcessing(false)
    }
  }

  const handleFullAiReview = async () => {
    setIsAiProcessing(true)
    setAiReviewResults(null)
    try {
      const payload = mapFrontendToBackendSchema(resumeData)
      const response = await api.post('review/analyze/', { resume_data: payload })
      setAiReviewResults(response.data)
    } catch (err) {
      console.error(err)
      setAiReviewResults({
        overall_score: 0,
        suggestions: [{ type: 'critical', message: 'Failed to connect to AI Reviewer.' }]
      })
    } finally {
      setIsAiProcessing(false)
    }
  }

  const applyAiFixes = () => {
    if (!aiReviewResults || !aiReviewResults.suggestions) return;
    let appliedCount = 0;

    const replaceRecursively = (obj) => {
      if (typeof obj === 'string') {
        let newStr = obj;
        aiReviewResults.suggestions.forEach(sug => {
          if (sug.before && sug.after && sug.before !== "N/A" && sug.after !== "N/A") {
            if (newStr.includes(sug.before)) {
              newStr = newStr.split(sug.before).join(sug.after);
              appliedCount++;
            }
          }
        });
        return newStr;
      } else if (Array.isArray(obj)) {
        return obj.map(item => replaceRecursively(item));
      } else if (typeof obj === 'object' && obj !== null) {
        const newObj = {};
        for (const key in obj) {
          newObj[key] = replaceRecursively(obj[key]);
        }
        return newObj;
      }
      return obj;
    };

    const updatedData = replaceRecursively(resumeData);
    if (appliedCount > 0) {
      setResumeData(updatedData);
      setAiReviewResults(null);
      alert(`Successfully applied fixes! (${appliedCount} replacements made)`);
    } else {
      alert("No applicable fixes found that match the current text exactly.");
    }
  }

  const NavItem = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveSection(id)}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
        padding: '16px 8px', background: 'transparent', border: 'none',
        color: activeSection === id ? 'var(--accent-primary)' : 'var(--text-secondary)',
        cursor: 'pointer', transition: 'color var(--transition-fast)',
        borderLeft: activeSection === id ? '3px solid var(--accent-primary)' : '3px solid transparent'
      }}
    >
      <Icon size={24} />
      <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>{label}</span>
    </button>
  )

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 64px)', borderTop: '1px solid var(--border-color)', background: 'var(--bg-color)' }}>
      
      {/* 1. LEFT SIDEBAR: Navigation */}
      <div style={{ width: '80px', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', background: 'var(--surface-color)', zIndex: 10 }}>
        <NavItem id="personal" icon={User} label="Contact" />
        <NavItem id="summary" icon={FileText} label="Summary" />
        <NavItem id="experience" icon={Briefcase} label="Experience" />
        <NavItem id="education" icon={GraduationCap} label="Education" />
        <NavItem id="projects" icon={Folder} label="Projects" />
        <NavItem id="certifications" icon={Award} label="Certifications" />
        <NavItem id="skills" icon={Wrench} label="Skills" />
        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)' }}>
          <NavItem id="ai_review" icon={Sparkles} label="AI Review" />
        </div>
      </div>

      {/* 2. MIDDLE PANE: Form Wizard */}
      <div style={{ width: '450px', borderRight: '1px solid var(--border-color)', overflowY: 'auto', background: 'var(--bg-color)', padding: '32px' }}>
        
        {activeSection === 'personal' && (
          <div>
            <h2 style={{ marginBottom: '24px' }}>Personal Details</h2>
            <NeuInput label="Full Name" value={resumeData.personal.name} onChange={e => handleUpdate('personal', 'name', e.target.value)} />
            <NeuInput label="Professional Title" value={resumeData.personal.title} onChange={e => handleUpdate('personal', 'title', e.target.value)} />
            <NeuInput label="Email" value={resumeData.personal.email} onChange={e => handleUpdate('personal', 'email', e.target.value)} />
            <NeuInput label="Phone" value={resumeData.personal.phone} onChange={e => handleUpdate('personal', 'phone', e.target.value)} />
            <NeuInput label="Location" value={resumeData.personal.location} onChange={e => handleUpdate('personal', 'location', e.target.value)} />
            <NeuInput label="LinkedIn URL" value={resumeData.personal.linkedin} onChange={e => handleUpdate('personal', 'linkedin', e.target.value)} />
            <NeuInput label="Portfolio URL" value={resumeData.personal.portfolio} onChange={e => handleUpdate('personal', 'portfolio', e.target.value)} />
          </div>
        )}

        {activeSection === 'summary' && (
          <div>
            <h2 style={{ marginBottom: '24px' }}>Professional Summary</h2>
            <div style={{ position: 'relative' }}>
              <textarea 
                value={resumeData.summary}
                onChange={e => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
                style={{
                  width: '100%', height: '200px', padding: '16px',
                  background: 'var(--surface-color)', border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)',
                  fontFamily: 'var(--font-sans)', resize: 'vertical', outline: 'none'
                }}
                placeholder="Briefly describe your professional background..."
              />
              <NeuButton 
                variant="flat" 
                style={{ position: 'absolute', bottom: '16px', right: '16px', padding: '8px 12px', fontSize: '0.85rem' }}
                onClick={handleAiSummary}
                disabled={isAiProcessing}
              >
                <Sparkles size={16} /> {isAiProcessing ? 'Writing...' : 'AI Write'}
              </NeuButton>
            </div>
          </div>
        )}

        {activeSection === 'experience' && (
          <div>
            <h2 style={{ marginBottom: '24px' }}>Work Experience</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {resumeData.experience.map((exp) => {
                const isExpanded = expandedExpId === exp.id
                return (
                  <div key={exp.id} style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--surface-color)', overflow: 'hidden' }}>
                    <div 
                      onClick={() => setExpandedExpId(isExpanded ? null : exp.id)}
                      style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: isExpanded ? 'var(--surface-hover)' : 'transparent' }}
                    >
                      <div>
                        <div style={{ fontWeight: 600 }}>{exp.role || '(Not specified)'}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{exp.company || 'Unknown Company'}</div>
                      </div>
                      {isExpanded ? <ChevronUp size={20} color="var(--text-secondary)"/> : <ChevronDown size={20} color="var(--text-secondary)"/>}
                    </div>
                    {isExpanded && (
                      <div style={{ padding: '20px', borderTop: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', gap: '16px' }}>
                          <NeuInput label="Job Title" value={exp.role} onChange={e => handleUpdateArray('experience', exp.id, 'role', e.target.value)} style={{ flex: 1 }} />
                          <NeuInput label="Company" value={exp.company} onChange={e => handleUpdateArray('experience', exp.id, 'company', e.target.value)} style={{ flex: 1 }} />
                        </div>
                        <div style={{ display: 'flex', gap: '16px' }}>
                          <NeuInput label="Start Date" value={exp.start} onChange={e => handleUpdateArray('experience', exp.id, 'start', e.target.value)} style={{ flex: 1 }} />
                          <NeuInput label="End Date" value={exp.end} onChange={e => handleUpdateArray('experience', exp.id, 'end', e.target.value)} style={{ flex: 1 }} />
                        </div>
                        <div style={{ position: 'relative', marginTop: '8px' }}>
                          <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Bullets</label>
                          <textarea 
                            value={exp.bullets}
                            onChange={e => handleUpdateArray('experience', exp.id, 'bullets', e.target.value)}
                            style={{
                              width: '100%', height: '150px', padding: '16px', background: 'var(--bg-color)',
                              border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)',
                              color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', resize: 'vertical', outline: 'none'
                            }}
                          />
                          <NeuButton 
                            variant="flat" 
                            style={{ position: 'absolute', bottom: '16px', right: '16px', padding: '6px 12px', fontSize: '0.8rem', background: 'var(--surface-color)' }}
                            onClick={() => handleAiImprove(exp.id)}
                            disabled={isAiProcessing}
                          >
                            <Sparkles size={14} /> {isAiProcessing ? 'Enhancing...' : 'AI Enhance'}
                          </NeuButton>
                        </div>
                        <button 
                          onClick={() => setResumeData(prev => ({ ...prev, experience: prev.experience.filter(e => e.id !== exp.id) }))}
                          style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--error)', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
              <NeuButton variant="flat" onClick={handleAddExp} style={{ border: '1px dashed var(--border-color)', padding: '16px' }}>
                <Plus size={18} /> Add Experience
              </NeuButton>
            </div>
          </div>
        )}

        {activeSection === 'education' && (
          <div>
            <h2 style={{ marginBottom: '24px' }}>Education</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {resumeData.education.map((edu) => {
                const isExpanded = expandedEduId === edu.id
                return (
                  <div key={edu.id} style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--surface-color)', overflow: 'hidden' }}>
                    <div 
                      onClick={() => setExpandedEduId(isExpanded ? null : edu.id)}
                      style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: isExpanded ? 'var(--surface-hover)' : 'transparent' }}
                    >
                      <div>
                        <div style={{ fontWeight: 600 }}>{edu.degree || '(Not specified)'}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{edu.school || 'Unknown School'}</div>
                      </div>
                      {isExpanded ? <ChevronUp size={20} color="var(--text-secondary)"/> : <ChevronDown size={20} color="var(--text-secondary)"/>}
                    </div>
                    {isExpanded && (
                      <div style={{ padding: '20px', borderTop: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', gap: '16px' }}>
                          <NeuInput label="Degree / Major" value={edu.degree} onChange={e => handleUpdateArray('education', edu.id, 'degree', e.target.value)} style={{ flex: 1 }} />
                          <NeuInput label="School / University" value={edu.school} onChange={e => handleUpdateArray('education', edu.id, 'school', e.target.value)} style={{ flex: 1 }} />
                        </div>
                        <div style={{ display: 'flex', gap: '16px' }}>
                          <NeuInput label="Start Year" value={edu.start} onChange={e => handleUpdateArray('education', edu.id, 'start', e.target.value)} style={{ flex: 1 }} />
                          <NeuInput label="End Year" value={edu.end} onChange={e => handleUpdateArray('education', edu.id, 'end', e.target.value)} style={{ flex: 1 }} />
                        </div>
                        <button 
                          onClick={() => setResumeData(prev => ({ ...prev, education: prev.education.filter(e => e.id !== edu.id) }))}
                          style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--error)', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
              <NeuButton variant="flat" onClick={handleAddEdu} style={{ border: '1px dashed var(--border-color)', padding: '16px' }}>
                <Plus size={18} /> Add Education
              </NeuButton>
            </div>
          </div>
        )}

        {activeSection === 'projects' && (
          <div>
            <h2 style={{ marginBottom: '24px' }}>Projects</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {resumeData.projects.map((proj) => {
                const isExpanded = expandedProjId === proj.id
                return (
                  <div key={proj.id} style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--surface-color)', overflow: 'hidden' }}>
                    <div 
                      onClick={() => setExpandedProjId(isExpanded ? null : proj.id)}
                      style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: isExpanded ? 'var(--surface-hover)' : 'transparent' }}
                    >
                      <div>
                        <div style={{ fontWeight: 600 }}>{proj.name || '(Not specified)'}</div>
                      </div>
                      {isExpanded ? <ChevronUp size={20} color="var(--text-secondary)"/> : <ChevronDown size={20} color="var(--text-secondary)"/>}
                    </div>
                    {isExpanded && (
                      <div style={{ padding: '20px', borderTop: '1px solid var(--border-color)' }}>
                        <NeuInput label="Project Name" value={proj.name} onChange={e => handleUpdateArray('projects', proj.id, 'name', e.target.value)} />
                        <NeuInput label="Technologies (comma separated)" value={proj.technologies} onChange={e => handleUpdateArray('projects', proj.id, 'technologies', e.target.value)} />
                        <NeuInput label="Project URL" value={proj.url} onChange={e => handleUpdateArray('projects', proj.id, 'url', e.target.value)} />
                        
                        <div style={{ position: 'relative', marginTop: '8px' }}>
                          <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Description</label>
                          <textarea 
                            value={proj.description}
                            onChange={e => handleUpdateArray('projects', proj.id, 'description', e.target.value)}
                            style={{
                              width: '100%', height: '120px', padding: '16px', background: 'var(--bg-color)',
                              border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)',
                              color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', resize: 'vertical', outline: 'none'
                            }}
                          />
                          <NeuButton 
                            variant="flat" 
                            style={{ position: 'absolute', bottom: '16px', right: '16px', padding: '6px 12px', fontSize: '0.8rem', background: 'var(--surface-color)' }}
                            onClick={() => {
                              // Simulate AI rewrite for now
                              handleUpdateArray('projects', proj.id, 'description', proj.description + ' (AI Enhanced)')
                            }}
                            disabled={isAiProcessing}
                          >
                            <Sparkles size={14} /> AI Enhance
                          </NeuButton>
                        </div>
                        <button 
                          onClick={() => setResumeData(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== proj.id) }))}
                          style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--error)', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
              <NeuButton variant="flat" onClick={handleAddProj} style={{ border: '1px dashed var(--border-color)', padding: '16px' }}>
                <Plus size={18} /> Add Project
              </NeuButton>
            </div>
          </div>
        )}

        {activeSection === 'certifications' && (
          <div>
            <h2 style={{ marginBottom: '24px' }}>Certifications</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {resumeData.certifications.map((cert) => {
                const isExpanded = expandedCertId === cert.id
                return (
                  <div key={cert.id} style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--surface-color)', overflow: 'hidden' }}>
                    <div 
                      onClick={() => setExpandedCertId(isExpanded ? null : cert.id)}
                      style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: isExpanded ? 'var(--surface-hover)' : 'transparent' }}
                    >
                      <div>
                        <div style={{ fontWeight: 600 }}>{cert.name || '(Not specified)'}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{cert.issuer || 'Unknown Issuer'}</div>
                      </div>
                      {isExpanded ? <ChevronUp size={20} color="var(--text-secondary)"/> : <ChevronDown size={20} color="var(--text-secondary)"/>}
                    </div>
                    {isExpanded && (
                      <div style={{ padding: '20px', borderTop: '1px solid var(--border-color)' }}>
                        <NeuInput label="Certification Name" value={cert.name} onChange={e => handleUpdateArray('certifications', cert.id, 'name', e.target.value)} />
                        <div style={{ display: 'flex', gap: '16px' }}>
                          <NeuInput label="Issuer" value={cert.issuer} onChange={e => handleUpdateArray('certifications', cert.id, 'issuer', e.target.value)} style={{ flex: 1 }} />
                          <NeuInput label="Date" value={cert.date} onChange={e => handleUpdateArray('certifications', cert.id, 'date', e.target.value)} style={{ flex: 1 }} />
                        </div>
                        <button 
                          onClick={() => setResumeData(prev => ({ ...prev, certifications: prev.certifications.filter(c => c.id !== cert.id) }))}
                          style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--error)', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
              <NeuButton variant="flat" onClick={handleAddCert} style={{ border: '1px dashed var(--border-color)', padding: '16px' }}>
                <Plus size={18} /> Add Certification
              </NeuButton>
            </div>
          </div>
        )}

        {activeSection === 'skills' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h2>Skills</h2>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Technical Skills (comma separated)</label>
              <textarea 
                value={typeof resumeData.skills === 'string' ? resumeData.skills : resumeData.skills?.technical || ''}
                onChange={e => setResumeData(prev => ({ 
                  ...prev, 
                  skills: { ...(typeof prev.skills === 'object' ? prev.skills : { technical: prev.skills }), technical: e.target.value } 
                }))}
                style={{
                  width: '100%', height: '100px', padding: '16px',
                  background: 'var(--surface-color)', border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)',
                  fontFamily: 'var(--font-sans)', resize: 'vertical', outline: 'none'
                }}
                placeholder="React, Node.js, Python..."
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Soft Skills (comma separated)</label>
              <textarea 
                value={typeof resumeData.skills === 'string' ? '' : resumeData.skills?.soft || ''}
                onChange={e => setResumeData(prev => ({ 
                  ...prev, 
                  skills: { ...(typeof prev.skills === 'object' ? prev.skills : { technical: prev.skills }), soft: e.target.value } 
                }))}
                style={{
                  width: '100%', height: '100px', padding: '16px',
                  background: 'var(--surface-color)', border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)',
                  fontFamily: 'var(--font-sans)', resize: 'vertical', outline: 'none'
                }}
                placeholder="Leadership, Communication, Teamwork..."
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Tools & Software (comma separated)</label>
              <textarea 
                value={typeof resumeData.skills === 'string' ? '' : resumeData.skills?.tools || ''}
                onChange={e => setResumeData(prev => ({ 
                  ...prev, 
                  skills: { ...(typeof prev.skills === 'object' ? prev.skills : { technical: prev.skills }), tools: e.target.value } 
                }))}
                style={{
                  width: '100%', height: '100px', padding: '16px',
                  background: 'var(--surface-color)', border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)',
                  fontFamily: 'var(--font-sans)', resize: 'vertical', outline: 'none'
                }}
                placeholder="Git, Docker, Figma..."
              />
            </div>
          </div>
        )}

        {activeSection === 'ai_review' && (
          <div>
            <h2 style={{ marginBottom: '24px' }}>AI Resume Review</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Run a complete RAG-powered analysis against your current resume structure.
            </p>
            
            <NeuButton variant="primary" style={{ width: '100%', marginBottom: '16px' }} onClick={handleFullAiReview} loading={isAiProcessing} disabled={(!resumeData.summary && !resumeData.experience.length)}>
              {isAiProcessing ? 'Analyzing Resume...' : 'Run Full Review'}
            </NeuButton>

            {aiReviewResults && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <h3>ATS Score</h3>
                    <NeuButton variant="primary" onClick={applyAiFixes} style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                      <Wrench size={14} style={{ marginRight: '6px' }} /> Apply AI Fixes
                    </NeuButton>
                  </div>
                  <div style={{ background: aiReviewResults.overall_score > 80 ? 'var(--success)' : 'var(--warning)', color: '#fff', padding: '6px 12px', borderRadius: '16px', fontWeight: 'bold' }}>
                    {aiReviewResults.overall_score} / 100
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {(aiReviewResults.suggestions || []).map((item, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        {item.severity === 'Critical' ? <AlertTriangle size={18} color="var(--error)" /> : 
                         item.severity === 'Important' ? <AlertTriangle size={18} color="var(--warning)" /> : 
                         <CheckCircle size={18} color="var(--success)" />}
                        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>{item.category}</span>
                      </div>
                      <p style={{ fontSize: '0.9rem', margin: '4px 0 0 0', fontWeight: 500 }}>{item.issue}</p>
                      <p style={{ fontSize: '0.85rem', margin: 0, color: 'var(--text-secondary)' }}>{item.recommendation}</p>
                      {item.after && (
                        <div style={{ marginTop: '8px', padding: '8px', background: 'var(--bg-color)', borderRadius: '4px', fontSize: '0.8rem', borderLeft: '3px solid var(--success)' }}>
                          <strong>Suggestion:</strong> {item.after}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* 3. RIGHT PANE: Live Template Preview via IFrame */}
      <div style={{ flex: 1, background: '#e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px', overflowY: 'auto', position: 'relative' }}>
        
        {/* Floating Action Bar */}
        <div style={{ position: 'absolute', top: '24px', right: '24px', display: 'flex', gap: '12px', zIndex: 100 }}>
          {isRendering && (
            <div style={{ background: 'rgba(0,0,0,0.6)', color: 'white', padding: '8px 16px', borderRadius: '20px', fontSize: '0.85rem', display: 'flex', alignItems: 'center' }}>
              Rendering...
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {saveStatus === 'saving' && <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Saving...</span>}
            {saveStatus === 'saved' && <span style={{ color: 'var(--success)', fontSize: '0.85rem' }}>✓ Saved</span>}
            {saveStatus === 'error' && <span style={{ color: 'var(--error)', fontSize: '0.85rem' }}>Failed to save</span>}
            <NeuButton variant="primary" onClick={handleDownload} style={{ padding: '8px 16px', borderRadius: '20px', display: 'flex', alignItems: 'center' }}>
              <Download size={16} style={{ marginRight: '8px' }} /> Download PDF
            </NeuButton>
          </div>
        </div>
        
        <div style={{ 
          background: '#ffffff', width: '210mm', minHeight: '297mm', 
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25), 0 0 15px rgba(0,0,0,0.05)',
          overflow: 'hidden', position: 'relative'
        }}>
          {previewHtml ? (
            <iframe 
              title="Live Template Preview"
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
                </style></head>`
              )}
              style={{ width: '100%', height: '100%', border: 'none', minHeight: '297mm' }}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '297mm', color: '#999' }}>
              Loading Template Preview...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResumeBuilderPage

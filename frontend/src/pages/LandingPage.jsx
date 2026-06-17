import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, ChevronRight, Terminal, Database, FileText, Cpu, ArrowRight } from 'lucide-react'
import NeuButton from '../components/ui/NeuButton'
import NeuCard from '../components/ui/NeuCard'
import useAuthStore from '../store/authStore'

// --- AI Demo Component ---
const AiDemo = ({ ctaLink }) => {
  const logs = [
    "[SYSTEM] ATS_EVAL_ENGINE_V2 Boot Sequence...",
    "[SYSTEM] Ready for schema compliance check.",
    "[SYSTEM] Awaiting user input to begin parse."
  ]

  const circleRadius = 40
  const circleCircumference = 2 * Math.PI * circleRadius
  const strokeDashoffset = circleCircumference

  return (
    <NeuCard style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Cpu size={20} color="var(--accent-primary)" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em' }}>ATS_EVAL_ENGINE_V2</span>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--warning)' }} />
        </div>
      </div>
      
      <div style={{ display: 'flex', flex: 1, minHeight: '300px', flexDirection: 'row' }}>
        {/* Tracker Side */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid var(--border-color)', padding: '24px', background: 'var(--bg-color)' }}>
          <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
              <circle
                cx="60" cy="60" r={circleRadius}
                fill="none"
                stroke="var(--surface-hover)"
                strokeWidth="4"
              />
              <circle
                cx="60" cy="60" r={circleRadius}
                fill="none"
                stroke="var(--accent-primary)"
                strokeWidth="4"
                strokeDasharray={circleCircumference}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: 'stroke-dashoffset 0.1s linear' }}
              />
            </svg>
            <div style={{ position: 'absolute', fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              0%
            </div>
          </div>
          <div style={{ marginTop: '24px' }}>
            <Link to={ctaLink} style={{ display: 'block' }}>
              <NeuButton variant="primary" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', width: '100%' }}>
                INITIALIZE
              </NeuButton>
            </Link>
          </div>
        </div>

        {/* Terminal Side */}
        <div style={{ flex: 1.5, background: '#09090b', padding: '16px', overflowY: 'auto', maxHeight: '300px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {logs.map((log, i) => (
            <div
              key={i}
              style={{ marginBottom: '8px', color: log.includes('PASSED') ? 'var(--accent-primary)' : log.includes('[') ? 'var(--text-secondary)' : 'var(--text-primary)' }}
            >
              {log}
            </div>
          ))}
        </div>
      </div>
    </NeuCard>
  )
}

// --- Main Landing Page ---
const LandingPage = () => {
  const [billingCycle, setBillingCycle] = useState('monthly')
  const { isAuthenticated } = useAuthStore()

  const ctaLink = isAuthenticated ? "/dashboard" : "/auth?tab=register"

  return (
    <div style={{ background: 'var(--bg-color)', minHeight: '100vh', color: 'var(--text-primary)', backgroundImage: 'url(/dark_abstract_grid.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      {/* Editorial Hero */}
      <section className="container" style={{ paddingTop: '120px', paddingBottom: '80px', display: 'flex', alignItems: 'center', gap: '48px' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{ flex: 1.2 }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--accent-primary)', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', marginBottom: '24px', color: 'var(--accent-primary)' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-primary)', boxShadow: '0 0 8px var(--accent-primary)' }} />
            v2.4 Engine Now Live
          </div>
          <h1 style={{ fontSize: '4.5rem', lineHeight: 1.05, marginBottom: '24px', letterSpacing: '-0.05em', color: '#fff' }}>
            Engineer your career. <br/>
            <span style={{ color: 'var(--text-secondary)' }}>Bypass the algorithm.</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '40px', lineHeight: 1.6 }}>
            Deterministic resume optimization. Our deterministic parser reverse-engineers Applicant Tracking Systems to guarantee your semantic relevance.
          </p>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Link to={ctaLink}>
              <NeuButton variant="primary" style={{ fontSize: '1rem', padding: '14px 32px' }}>
                Deploy Resume <ArrowRight size={18} />
              </NeuButton>
            </Link>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              No credit card required.
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          style={{ flex: 0.8, position: 'relative' }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'var(--accent-primary)', filter: 'blur(100px)', opacity: 0.1, borderRadius: '50%' }} />
          <img src="/ats_scanner_ui.png" alt="ATS Scanner Dashboard" style={{ width: '100%', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', position: 'relative', zIndex: 1 }} />
        </motion.div>
      </section>

      {/* AI Demo Section */}
      <section className="container" style={{ paddingBottom: '120px' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <AiDemo ctaLink={ctaLink} />
        </motion.div>
      </section>

      {/* Bento Grid Features */}
      <section className="container" style={{ paddingBottom: '120px' }}>
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '2.5rem', letterSpacing: '-0.03em', color: '#fff' }}>Architecture</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Built for strict compliance and maximum impact.</p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(12, 1fr)', 
          gap: '24px',
          gridAutoRows: 'minmax(240px, auto)'
        }}>
          {/* Large Item */}
          <NeuCard style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: 'var(--surface-color)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 24, right: 24 }}>
              <Database size={32} color="var(--border-focus)" />
            </div>
            <h3 style={{ fontSize: '1.75rem', marginBottom: '12px', color: '#fff' }}>Semantic Tailoring Engine</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '80%' }}>
              We don't just inject keywords. Our engine analyzes the dimensional relationship between your past experience and the job requirements, restructuring your achievements for a 78% higher parse success rate.
            </p>
          </NeuCard>

          {/* Medium Item */}
          <NeuCard style={{ gridColumn: 'span 4', background: 'var(--surface-color)', position: 'relative' }}>
             <div style={{ marginBottom: '24px' }}>
              <FileText size={32} color="var(--accent-primary)" />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: '#fff' }}>Strict ATS Schemas</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              12 deterministic templates that strictly adhere to iCIMS and Workday parsing rules.
            </p>
          </NeuCard>

          {/* Medium Item 2 */}
          <NeuCard style={{ gridColumn: 'span 5', background: 'var(--surface-color)' }}>
            <div style={{ marginBottom: '24px' }}>
              <Terminal size={32} color="var(--text-secondary)" />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: '#fff' }}>Interactive Extraction</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Answer targeted technical questions. We output quantified, impact-driven bullet points.
            </p>
          </NeuCard>

          {/* Wide Item */}
          <NeuCard style={{ gridColumn: 'span 7', background: 'var(--surface-color)', display: 'flex', alignItems: 'center', padding: '32px' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '2rem', marginBottom: '8px', color: '#fff' }}>100% Client-Side Export</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Your data never hits a rendering server. Instantaneous PDF generation using raw DOM node capture for perfect vector text preservation.
              </p>
            </div>
          </NeuCard>
        </div>
      </section>

      {/* Pricing & Social Proof */}
      <section style={{ borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', background: '#09090b', padding: '120px 0' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 style={{ fontSize: '3rem', letterSpacing: '-0.04em', color: '#fff', marginBottom: '24px', textAlign: 'center' }}>
            Access the Engine.
          </h2>
          
          <div style={{ display: 'flex', background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)', padding: '4px', marginBottom: '48px' }}>
            <button 
              onClick={() => setBillingCycle('monthly')}
              style={{ padding: '8px 24px', background: billingCycle === 'monthly' ? 'var(--border-focus)' : 'transparent', color: billingCycle === 'monthly' ? '#fff' : 'var(--text-secondary)', border: 'none', borderRadius: 'var(--radius-full)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', transition: 'all 0.15s ease' }}
            >
              MONTHLY
            </button>
            <button 
              onClick={() => setBillingCycle('yearly')}
              style={{ padding: '8px 24px', background: billingCycle === 'yearly' ? 'var(--border-focus)' : 'transparent', color: billingCycle === 'yearly' ? '#fff' : 'var(--text-secondary)', border: 'none', borderRadius: 'var(--radius-full)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', transition: 'all 0.15s ease' }}
            >
              YEARLY (SAVE 20%)
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', width: '100%', maxWidth: '900px' }}>
            {/* Free Tier */}
            <NeuCard style={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px' }}>DEVELOPER</div>
              <div style={{ fontSize: '3rem', fontWeight: 700, color: '#fff', marginBottom: '8px', letterSpacing: '-0.04em' }}>$0<span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 400 }}>/mo</span></div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '0.95rem' }}>Full access to schema templates and client-side PDF export.</p>
              
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['1 Active Resume', 'Standard Templates', 'Local Storage Sync', 'Community Support'].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                    <Check size={16} color="var(--border-focus)" /> {item}
                  </li>
                ))}
              </ul>
              <Link to={ctaLink} style={{ display: 'block' }}>
                <NeuButton variant="ghost" style={{ width: '100%', border: '1px solid var(--border-color)' }}>Initialize Free</NeuButton>
              </Link>
            </NeuCard>

            {/* Pro Tier */}
            <NeuCard style={{ background: 'var(--surface-color)', border: '1px solid var(--accent-primary)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-12px', right: '24px', background: 'var(--accent-primary)', color: '#000', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                RECOMMENDED
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', fontSize: '0.85rem', marginBottom: '16px' }}>ENTERPRISE</div>
              <div style={{ fontSize: '3rem', fontWeight: 700, color: '#fff', marginBottom: '8px', letterSpacing: '-0.04em' }}>
                ${billingCycle === 'monthly' ? '12' : '9'}
                <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 400 }}>/mo</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '0.95rem' }}>Full AI engine access for semantic tailoring and cloud sync.</p>
              
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['Unlimited Resumes', 'Semantic AI Tailoring', 'Automated Extraction', 'Cloud Synchronization'].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', color: '#fff' }}>
                    <Check size={16} color="var(--accent-primary)" /> {item}
                  </li>
                ))}
              </ul>
              <Link to={ctaLink} style={{ display: 'block' }}>
                <NeuButton variant="primary" style={{ width: '100%' }}>Deploy Pro</NeuButton>
              </Link>
            </NeuCard>
          </div>
        </div>
      </section>

      {/* Social Proof Masonry */}
      <section className="container" style={{ padding: '120px 0' }}>
        <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginBottom: '48px', textAlign: 'center' }}>TELEMETRY DATA</h3>
        
        <div style={{ display: 'columns', columnCount: 3, columnGap: '24px' }}>
          {/* Testimonial 1 */}
          <div style={{ background: 'var(--surface-color)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '24px', breakInside: 'avoid' }}>
            <p style={{ color: '#fff', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '16px' }}>
              "The semantic tailoring engine successfully aligned my past React experience with a Senior Frontend req. Received a callback within 48 hours. The deterministic parser output is flawless."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--border-focus)' }} />
              <div>
                <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>Sarah J.</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>SWE @ Stripe</div>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div style={{ background: 'var(--surface-color)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '24px', breakInside: 'avoid' }}>
            <p style={{ color: '#fff', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '16px' }}>
              "Stripped out all the generic AI slop I was getting from ChatGPT. The constraints actually force you to quantify your impact metrics."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--border-focus)' }} />
              <div>
                <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>Marcus T.</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>DevOps Engineer</div>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div style={{ background: 'var(--surface-color)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '24px', breakInside: 'avoid' }}>
            <p style={{ color: '#fff', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '16px' }}>
              "Finally, a tool that understands ATS isn't magic, it's just regex and database schemas. Using the specific Workday templates increased my parse rate from 40% to 100%."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--border-focus)' }} />
              <div>
                <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>Elena R.</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>Product Manager</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage

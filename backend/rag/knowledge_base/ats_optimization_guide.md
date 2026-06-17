# ATS Optimization Guide

## How Applicant Tracking Systems Work

An Applicant Tracking System (ATS) is software that employers use to collect, parse, filter, and rank resumes before a human recruiter ever sees them. Over 97% of Fortune 500 companies and 75%+ of mid-size employers use an ATS. Popular systems include Workday, Greenhouse, Lever, iCIMS, Taleo, and BambooHR.

### The ATS Pipeline

1. **Parsing** — The ATS extracts text from your resume and maps it into structured fields (name, email, work history, skills, education).
2. **Keyword Matching** — The system compares your resume content against the job description's required and preferred qualifications.
3. **Ranking/Scoring** — Candidates are scored and ranked. Recruiters typically review only the top-ranked applicants.
4. **Human Review** — A recruiter scans the parsed profile, not your original formatting.

If the parser fails to extract your data correctly, you are effectively invisible.

---

## Keyword Optimization Strategy

### Step 1: Extract Keywords from the Job Description

Read the job description and identify:
- **Hard skills**: Python, SQL, Salesforce, financial modeling, HIPAA compliance
- **Soft skills (if stated explicitly)**: cross-functional collaboration, stakeholder management
- **Tools & platforms**: AWS, Tableau, HubSpot, SAP
- **Certifications**: PMP, CPA, AWS Solutions Architect
- **Industry jargon**: agile methodology, pipeline management, regulatory compliance

### Step 2: Integrate Keywords Naturally

- Place critical keywords in your **Professional Summary**, **Skills section**, and **Experience bullets**.
- Use **exact phrasing** from the job description. If the posting says "project management," do not only write "managing projects."
- Include both the **acronym and full form** at least once: "Search Engine Optimization (SEO)."
- Do NOT keyword-stuff — the resume must still read well to a human reviewer.

### Step 3: Match Keyword Frequency

If a job description mentions "data analysis" five times, ensure your resume references it in multiple places (summary, skills, and at least one or two bullet points).

---

## Formatting Do's and Don'ts

### Do's ✅
- Use **standard section headings**: "Work Experience," "Education," "Skills," "Professional Summary," "Certifications."
- Use **simple bullet characters**: •, -, or standard list markers.
- Use **standard fonts**: Arial, Calibri, Times New Roman, Helvetica, Garamond.
- Keep font size between **10pt and 12pt** for body, up to 16pt for your name.
- Save as **.docx** (preferred by most ATS) or **.pdf** (if the posting allows it — some ATS cannot parse PDFs well).
- Use **reverse-chronological order** for experience.

### Don'ts ❌
- **No tables or columns** for critical content — many ATS parsers read left-to-right across columns, jumbling your data.
- **No text boxes** — content inside text boxes is often skipped entirely.
- **No headers/footers** for important information — some parsers ignore header/footer regions.
- **No images, logos, or icons** — ATS cannot read images, so icon-based skill ratings are invisible.
- **No custom fonts or special characters** — they may render as garbled text.
- **No "creative" section names** — "Where I've Made My Mark" will not be parsed as "Work Experience."

---

## Section Naming Conventions

Use these exact (or very close) headings for maximum ATS compatibility:

| Section Purpose       | Recommended Headings                          |
|-----------------------|-----------------------------------------------|
| Summary               | Professional Summary, Summary, Profile        |
| Work History           | Work Experience, Experience, Professional Experience |
| Education              | Education, Academic Background                 |
| Skills                 | Skills, Technical Skills, Core Competencies    |
| Certifications         | Certifications, Licenses & Certifications      |
| Projects               | Projects, Key Projects                         |
| Awards                 | Awards, Honors & Awards                        |
| Volunteer              | Volunteer Experience, Community Involvement     |

---

## File Format Considerations

| Format | ATS Compatibility | Notes |
|--------|-------------------|-------|
| .docx  | ✅ Best           | Universally parsed. Use this as default. |
| .pdf   | ⚠️ Good (usually) | Most modern ATS handle PDFs, but some older systems (Taleo) struggle. |
| .txt   | ✅ Safe fallback   | All formatting lost, but guaranteed parsing. |
| .pages | ❌ Avoid           | Apple format; most ATS cannot read it. |
| .jpg/.png | ❌ Never        | Image files are completely unreadable by ATS. |
| Google Docs link | ❌ Never | ATS expects an uploaded file, not a URL. |

**Best practice**: Submit .docx unless the application portal specifically requests PDF. Always test your resume through a free ATS simulator before submitting.

---

## ATS Testing Checklist

Before submitting, verify:
- [ ] All section headings are standard and recognized.
- [ ] No tables, text boxes, columns, or images contain critical content.
- [ ] Contact info is in the document body, not in headers/footers.
- [ ] Keywords from the job description appear naturally in your resume.
- [ ] The file is saved as .docx (or .pdf if specified).
- [ ] Dates are in a parseable format (e.g., "June 2022 – Present").
- [ ] Job titles, company names, and locations are on separate, clearly labeled lines.

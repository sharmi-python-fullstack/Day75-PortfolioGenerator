import { useRef, useState } from 'react'
import appStyles from './App.css?inline'
import './App.css'

const emptyProject = () => ({ title: '', description: '', url: '' })

const themes = [
  { id: 'modern', label: 'Modern', description: 'Bold & polished', mark: 'M' },
  { id: 'minimalist', label: 'Minimalist', description: 'Calm & considered', mark: 'm' },
  { id: 'creative', label: 'Creative', description: 'Colorful & expressive', mark: '✳' },
]

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character])
}

function getSafeProjectUrl(value) {
  if (!value.trim()) return null

  try {
    const url = new URL(
      /^https?:\/\//i.test(value) ? value : `https://${value}`,
    )
    return ['http:', 'https:'].includes(url.protocol) ? url.href : null
  } catch {
    return null
  }
}

function PortfolioPreview({ data, selectedTheme, portfolioRef }) {
  const { personalInfo, skills, projects } = data
  const theme = themes.find((item) => item.id === selectedTheme) ?? themes[0]

  return (
    <main className={`portfolio portfolio--${theme.id}`} ref={portfolioRef}>
      <div className="portfolio-topbar">
        <a className="portfolio-wordmark" href="#portfolio-top">
          <span className="wordmark-dot" />
          {personalInfo.name || 'Your Name'}
        </a>
        <span className="portfolio-theme-label">{theme.label} edition</span>
      </div>

      <section className="portfolio-hero" id="portfolio-top">
        <p className="eyebrow">PORTFOLIO / 2026</p>
        <h1>{personalInfo.name || 'Your name goes here'}<span>.</span></h1>
        <p className="portfolio-title">
          {personalInfo.title || 'Your next great title'}
        </p>
        <p className="portfolio-bio">
          {personalInfo.bio ||
            'A little about you will make this portfolio feel like yours.'}
        </p>
        {personalInfo.email && (
          <a className="hero-contact-link" href={`mailto:${personalInfo.email}`}>
            Let&apos;s talk <span aria-hidden="true">↗</span>
          </a>
        )}
      </section>

      <section className="portfolio-section">
        <div className="portfolio-section-heading">
          <div>
            <p className="eyebrow">THE TOOLKIT</p>
            <h2>Things I do well</h2>
          </div>
          <span className="section-count">{String(skills.length).padStart(2, '0')}</span>
        </div>
        {skills.length > 0 ? (
          <ul className="portfolio-skills grid grid-cols-1 sm:grid-cols-2">
            {skills.map((skill, index) => (
              <li className="portfolio-skill" key={`${skill}-${index}`}>
                <span className="skill-spark" aria-hidden="true">✳</span>
                {skill}
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-preview">Your skills will show up here.</p>
        )}
      </section>

      <section className="portfolio-section">
        <div className="portfolio-section-heading">
          <div>
            <p className="eyebrow">SELECTED WORK</p>
            <h2>Projects with purpose</h2>
          </div>
          <span className="section-count">{String(projects.length).padStart(2, '0')}</span>
        </div>
        {projects.length > 0 ? (
          <div className="portfolio-projects grid grid-cols-1 md:grid-cols-2">
            {projects.map((project, index) => {
              const projectUrl = getSafeProjectUrl(project.url)
              return (
                <article className="portfolio-project" key={index}>
                  <span className="project-index">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="project-copy">
                    <h3>{project.title || 'Untitled project'}</h3>
                    <p>{project.description || 'Add a short description of your work.'}</p>
                  </div>
                  {projectUrl && (
                    <a
                      className="project-link"
                      href={projectUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Visit ${project.title || 'project'}`}
                    >
                      ↗
                    </a>
                  )}
                </article>
              )
            })}
          </div>
        ) : (
          <p className="empty-preview">Your projects will take center stage here.</p>
        )}
      </section>

      <footer className="portfolio-footer">
        <div>
          <p className="eyebrow">HAVE A GOOD ONE IN MIND?</p>
          <h2>Let&apos;s make it happen.</h2>
        </div>
        <div className="footer-contact">
          {personalInfo.email && (
            <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
          )}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
        <span className="footer-note">Made with intention · 2026</span>
      </footer>
    </main>
  )
}

function App() {
  const [userData, setUserData] = useState({
    personalInfo: {
      name: '',
      title: '',
      bio: '',
      email: '',
      location: '',
    },
    skills: [],
    projects: [],
  })
  const [selectedTheme, setSelectedTheme] = useState('modern')
  const [isEditing, setIsEditing] = useState(true)
  const [skillInput, setSkillInput] = useState('')
  const portfolioRef = useRef(null)

  function updatePersonalInfo(event) {
    const { name, value } = event.target
    setUserData((current) => ({
      ...current,
      personalInfo: { ...current.personalInfo, [name]: value },
    }))
  }

  function addSkill(event) {
    event.preventDefault()
    const skill = skillInput.trim()
    if (!skill) return

    setUserData((current) => ({
      ...current,
      skills: [...current.skills, skill],
    }))
    setSkillInput('')
  }

  function removeSkill(indexToRemove) {
    setUserData((current) => ({
      ...current,
      skills: current.skills.filter((_, index) => index !== indexToRemove),
    }))
  }

  function updateProject(indexToUpdate, field, value) {
    setUserData((current) => ({
      ...current,
      projects: current.projects.map((project, index) =>
        index === indexToUpdate ? { ...project, [field]: value } : project,
      ),
    }))
  }

  function addProject() {
    setUserData((current) => ({
      ...current,
      projects: [...current.projects, emptyProject()],
    }))
  }

  function removeProject(indexToRemove) {
    setUserData((current) => ({
      ...current,
      projects: current.projects.filter((_, index) => index !== indexToRemove),
    }))
  }

  function downloadPortfolio() {
    const portfolioName = userData.personalInfo.name.trim()
    const filename =
      portfolioName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || 'portfolio'
    const title = `${portfolioName || 'My'} portfolio`
    const exportStyles = `
      * { box-sizing: border-box; }
      body {
        margin: 0;
        background: #f3f4ef;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      .portfolio-skills { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .portfolio-projects { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .portfolio--minimalist .portfolio-projects { grid-template-columns: minmax(0, 1fr); }
      @media (max-width: 680px) {
        .portfolio-skills, .portfolio-projects { grid-template-columns: minmax(0, 1fr); }
      }
      ${appStyles}
    `
    const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${escapeHtml(title)}">
    <title>${escapeHtml(title)}</title>
    <style>${exportStyles}</style>
  </head>
  <body>${portfolioRef.current.outerHTML}</body>
</html>`
    const file = new Blob([html], { type: 'text/html;charset=utf-8' })
    const downloadUrl = URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = `${filename}.html`
    document.body.append(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000)
  }

  if (!isEditing) {
    return (
      <div className="preview-shell">
        <div className="preview-toolbar">
          <a className="brand" href="#" onClick={(event) => {
            event.preventDefault()
            setIsEditing(true)
          }}>
            <span className="brand-mark">p.</span>
            <span>folio<span className="brand-plus">+</span></span>
          </a>
          <div className="preview-toolbar-actions">
            <div className="export-actions">
              <button
                className="button button--light"
                onClick={downloadPortfolio}
              >
                <span aria-hidden="true">↓</span> Download HTML
              </button>
              <button
                className="button button--light"
                onClick={() => window.print()}
                title="Opens the print dialog, where you can choose Save as PDF"
              >
                <span aria-hidden="true">↗</span> Save as PDF
              </button>
              <span className="export-help">PDF opens your print dialog</span>
            </div>
            <button className="button button--light" onClick={() => setIsEditing(true)}>
              <span aria-hidden="true">←</span> Back to editor
            </button>
          </div>
        </div>
        <PortfolioPreview
          data={userData}
          selectedTheme={selectedTheme}
          portfolioRef={portfolioRef}
        />
      </div>
    )
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" onClick={(event) => event.preventDefault()}>
          <span className="brand-mark">p.</span>
          <span>folio<span className="brand-plus">+</span></span>
        </a>
        <div className="topbar-note">
          <span className="status-dot" />
          <span>Your portfolio, your way</span>
        </div>
        <span className="step-label">01 <span>/</span> 02</span>
      </header>

      <main className="builder-layout">
        <aside className="intro-panel">
          <div className="intro-content">
            <span className="overline"><span /> THE PORTFOLIO STUDIO</span>
            <h1>Make your<br />work <em>stand out.</em></h1>
            <p className="intro-description">
              A good portfolio opens doors. Tell us a little about yourself and
              we&apos;ll make something worth opening.
            </p>
            <div className="intro-note">
              <span className="note-icon">✳</span>
              <p>No templates to wrestle with.<br />Just your story, beautifully told.</p>
            </div>
          </div>
          <div className="intro-bottom">
            <span>DESIGNED FOR WHAT&apos;S NEXT</span>
            <span className="intro-bottom-line" />
          </div>
        </aside>

        <section className="editor-panel">
          <div className="editor-heading">
            <div>
              <p className="editor-kicker">LET&apos;S GET STARTED</p>
              <h2>Build your portfolio</h2>
              <p className="editor-subtitle">The details that make you, you.</p>
            </div>
            <span className="edit-badge"><span /> EDITING</span>
          </div>

          <form onSubmit={(event) => event.preventDefault()}>
            <section className="form-section">
              <div className="form-section-title">
                <span className="section-number">01</span>
                <div>
                  <h3>The introduction</h3>
                  <p>Start with the essentials.</p>
                </div>
              </div>
              <div className="fields-grid grid grid-cols-1 sm:grid-cols-2">
                <label className="field">
                  <span>Your name</span>
                  <input
                    name="name"
                    value={userData.personalInfo.name}
                    onChange={updatePersonalInfo}
                    placeholder="e.g. Alex Morgan"
                    autoComplete="name"
                  />
                </label>
                <label className="field">
                  <span>Your title</span>
                  <input
                    name="title"
                    value={userData.personalInfo.title}
                    onChange={updatePersonalInfo}
                    placeholder="e.g. Product designer"
                  />
                </label>
                <label className="field field--full">
                  <span>Your story <span className="optional">(a few sentences)</span></span>
                  <textarea
                    name="bio"
                    value={userData.personalInfo.bio}
                    onChange={updatePersonalInfo}
                    placeholder="What do you love to do? What makes your approach different?"
                    rows="3"
                  />
                </label>
                <label className="field">
                  <span>Email address</span>
                  <input
                    name="email"
                    type="email"
                    value={userData.personalInfo.email}
                    onChange={updatePersonalInfo}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </label>
                <label className="field">
                  <span>Location <span className="optional">(optional)</span></span>
                  <input
                    name="location"
                    value={userData.personalInfo.location}
                    onChange={updatePersonalInfo}
                    placeholder="e.g. Brooklyn, NY"
                    autoComplete="address-level2"
                  />
                </label>
              </div>
            </section>

            <section className="form-section">
              <div className="form-section-title">
                <span className="section-number">02</span>
                <div>
                  <h3>Your toolkit</h3>
                  <p>What are you great at?</p>
                </div>
              </div>
              <div className="skill-entry">
                <label className="field">
                  <span className="visually-hidden">Add a skill</span>
                  <input
                    value={skillInput}
                    onChange={(event) => setSkillInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') addSkill(event)
                    }}
                    placeholder="Type a skill and press add"
                  />
                </label>
                <button className="button button--add" onClick={addSkill}>
                  <span aria-hidden="true">+</span> Add
                </button>
              </div>
              {userData.skills.length > 0 && (
                <ul className="editable-skills">
                  {userData.skills.map((skill, index) => (
                    <li className="editable-skill" key={`${skill}-${index}`}>
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        aria-label={`Remove ${skill}`}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="form-section">
              <div className="form-section-title form-section-title--projects">
                <span className="section-number">03</span>
                <div>
                  <h3>Selected work</h3>
                  <p>A few things you&apos;ve made.</p>
                </div>
                <button type="button" className="text-button" onClick={addProject}>
                  <span aria-hidden="true">+</span> Add project
                </button>
              </div>
              {userData.projects.length > 0 ? (
                <div className="project-editor-list">
                  {userData.projects.map((project, index) => (
                    <article className="project-editor" key={index}>
                      <div className="project-editor-heading">
                        <span>PROJECT {String(index + 1).padStart(2, '0')}</span>
                        <button
                          type="button"
                          className="remove-project"
                          onClick={() => removeProject(index)}
                        >
                          Remove
                        </button>
                      </div>
                      <label className="field">
                        <span>Project title</span>
                        <input
                          value={project.title}
                          onChange={(event) => updateProject(index, 'title', event.target.value)}
                          placeholder="e.g. A better way to shop"
                        />
                      </label>
                      <label className="field">
                        <span>Description</span>
                        <textarea
                          value={project.description}
                          onChange={(event) => updateProject(index, 'description', event.target.value)}
                          placeholder="What did you make, and why?"
                          rows="2"
                        />
                      </label>
                      <label className="field">
                        <span>Project link <span className="optional">(optional)</span></span>
                        <input
                          type="url"
                          value={project.url}
                          onChange={(event) => updateProject(index, 'url', event.target.value)}
                          placeholder="https://"
                        />
                      </label>
                    </article>
                  ))}
                </div>
              ) : (
                <button type="button" className="project-empty" onClick={addProject}>
                  <span className="project-empty-plus">+</span>
                  <span><strong>Add your first project</strong><small>Show the work you&apos;re proud of.</small></span>
                  <span className="project-empty-arrow">↗</span>
                </button>
              )}
            </section>

            <section className="form-section form-section--theme">
              <div className="form-section-title">
                <span className="section-number">04</span>
                <div>
                  <h3>Set the tone</h3>
                  <p>Pick a look that feels like you.</p>
                </div>
              </div>
              <div className="theme-options" role="radiogroup" aria-label="Portfolio theme">
                {themes.map((theme) => (
                  <button
                    className={`theme-option${selectedTheme === theme.id ? ' is-selected' : ''}`}
                    key={theme.id}
                    type="button"
                    role="radio"
                    aria-checked={selectedTheme === theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                  >
                    <span className={`theme-swatch theme-swatch--${theme.id}`}>
                      <span>{theme.mark}</span>
                      <span className="swatch-line" />
                      <span className="swatch-line swatch-line--short" />
                    </span>
                    <span className="theme-option-copy">
                      <strong>{theme.label}</strong>
                      <small>{theme.description}</small>
                    </span>
                    <span className="theme-check" aria-hidden="true">✓</span>
                  </button>
                ))}
              </div>
            </section>

            <div className="form-footer">
              <p><span className="footer-spark">✳</span> You can always come back and make changes.</p>
              <button
                className="button button--primary"
                type="button"
                onClick={() => {
                  setIsEditing(false)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              >
                Generate portfolio <span aria-hidden="true">↗</span>
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  )
}

export default App

import { useEffect, useMemo, useState } from 'react'
import { creatures as defaultCreatures, zones, quizQuestions, expeditionBadges } from './data'
import type { Creature, Zone, Tab, SavedState, PredictedCreature, CurrentUser } from './types'
import {
  fetchSpecies,
  fetchDiscoveries,
  saveDiscovery,
  deleteDiscovery,
  checkBackendHealth
} from './services/api'
import { getCurrentUser, logout, syncFavorite } from './services/auth'
import { toggleAmbientSound } from './services/sound'
import { TheUnknown } from './components/TheUnknown'
import { UnknownModal } from './components/UnknownModal'
import { AuthModal } from './components/AuthModal'
import { DepthSimulator } from './components/DepthSimulator'

const STORAGE_KEY = 'ocean-explorer-progress-v1'
const initialSaved: SavedState = { favorites: [], completed: [], bestScore: 0, savedPredictions: [] }

function readSaved(): SavedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialSaved
    const parsed = JSON.parse(raw) as Partial<SavedState>
    return {
      favorites: Array.isArray(parsed.favorites) ? parsed.favorites.filter((id): id is string => typeof id === 'string') : [],
      completed: Array.isArray(parsed.completed) ? parsed.completed.filter((id): id is string => typeof id === 'string') : [],
      bestScore: typeof parsed.bestScore === 'number' && Number.isFinite(parsed.bestScore) ? parsed.bestScore : 0,
      savedPredictions: Array.isArray(parsed.savedPredictions) ? parsed.savedPredictions : []
    }
  } catch {
    return initialSaved
  }
}

function App() {
  const [tab, setTab] = useState<Tab>('Discover')
  const [speciesList, setSpeciesList] = useState<Creature[]>(defaultCreatures)
  const [speciesLoading, setSpeciesLoading] = useState(false)
  const [dbConnected, setDbConnected] = useState(false)
  const [search, setSearch] = useState('')
  const [zoneFilter, setZoneFilter] = useState<Zone>('All zones')
  const [typeFilter, setTypeFilter] = useState('All creatures')
  const [selected, setSelected] = useState<Creature | null>(null)
  const [selectedUnknown, setSelectedUnknown] = useState<PredictedCreature | null>(null)
  const [saved, setSaved] = useState<SavedState>(readSaved)
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [quizCategory, setQuizCategory] = useState<string>('All Expeditions')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [quizFinished, setQuizFinished] = useState(false)
  const [toast, setToast] = useState('')
  const [audioActive, setAudioActive] = useState(false)

  // User authentication state
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin')

  // Check health and load species from MongoDB backend, and check user session
  useEffect(() => {
    checkBackendHealth().then((health) => {
      setDbConnected(Boolean(health.database?.connected))
    })

    // Check for existing session via HTTP-only cookie
    getCurrentUser().then((user) => {
      if (user) {
        setCurrentUser(user)
        if (user.favoriteSpeciesSlugs && user.favoriteSpeciesSlugs.length > 0) {
          setSaved((prev) => {
            const merged = Array.from(new Set([...prev.favorites, ...user.favoriteSpeciesSlugs]))
            return { ...prev, favorites: merged }
          })
        }
      }
    })

    setSpeciesLoading(true)
    fetchSpecies()
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setSpeciesList(res.data)
        }
      })
      .finally(() => {
        setSpeciesLoading(false)
      })

    // Sync saved discoveries with MongoDB backend
    fetchDiscoveries().then((discoveries) => {
      if (discoveries && discoveries.length > 0) {
        const backendSaved = discoveries.map((d) => d.predictionSnapshot)
        setSaved((prev) => {
          const existingIds = new Set(prev.savedPredictions.map((p) => p.id))
          const novel = backendSaved.filter((p) => !existingIds.has(p.id))
          if (novel.length === 0) return prev
          return { ...prev, savedPredictions: [...novel, ...prev.savedPredictions] }
        })
      }
    })
  }, [])

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(saved)) } catch {
      setToast('Progress could not be saved in this browser.')
    }
  }, [saved])

  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(''), 2600)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const types = useMemo(
    () => ['All creatures', ...Array.from(new Set(speciesList.map((c) => c.type))).sort()],
    [speciesList]
  )

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return speciesList.filter((creature) => {
      const matchesSearch =
        !query ||
        [creature.name, creature.scientific, creature.type, creature.zone, creature.description].some(
          (v) => (v || '').toLowerCase().includes(query)
        )
      const matchesZone = zoneFilter === 'All zones' || creature.zone === zoneFilter
      const matchesType = typeFilter === 'All creatures' || creature.type === typeFilter
      const matchesFavorites = !favoritesOnly || saved.favorites.includes(creature.id)
      return matchesSearch && matchesZone && matchesType && matchesFavorites
    })
  }, [speciesList, search, zoneFilter, typeFilter, favoritesOnly, saved.favorites])

  const activeQuizQuestions = useMemo(() => {
    return quizCategory === 'All Expeditions'
      ? quizQuestions
      : quizQuestions.filter((q) => q.category === quizCategory)
  }, [quizCategory])

  const score = answers.reduce((total, answer, index) => total + (answer === activeQuizQuestions[index]?.answer ? 1 : 0), 0)
  const completedCreatureCount = saved.completed.length
  const progressPercent = Math.round((completedCreatureCount / Math.max(1, speciesList.length)) * 100)

  // Compute unlocked expedition achievements
  const computedBadges = useMemo(() => {
    return expeditionBadges.map((badge) => {
      let unlocked = false
      let progressText = ''

      if (badge.id === 'first-contact') {
        unlocked = saved.completed.length >= 1
        progressText = `${saved.completed.length} / 1 discovered`
      } else if (badge.id === 'sunlight-diver') {
        const count = speciesList.filter((s) => s.zone === 'Sunlight zone' && saved.completed.includes(s.id)).length
        unlocked = count >= 3
        progressText = `${count} / 3 sunlight species`
      } else if (badge.id === 'twilight-scout') {
        const count = speciesList.filter((s) => s.zone === 'Twilight zone' && saved.completed.includes(s.id)).length
        unlocked = count >= 3
        progressText = `${count} / 3 twilight species`
      } else if (badge.id === 'abyssal-pioneer') {
        const count = speciesList.filter((s) => (s.zone === 'Midnight zone' || s.zone === 'Abyssal zone' || s.zone === 'Hadal zone') && saved.completed.includes(s.id)).length
        unlocked = count >= 3
        progressText = `${count} / 3 deep species`
      } else if (badge.id === 'creature-architect') {
        unlocked = saved.savedPredictions.length >= 1
        progressText = `${saved.savedPredictions.length} / 1 synthesized`
      } else if (badge.id === 'master-curator') {
        unlocked = saved.favorites.length >= 4
        progressText = `${saved.favorites.length} / 4 favorites`
      } else if (badge.id === 'ocean-scholar') {
        unlocked = saved.bestScore >= 4
        progressText = `Best: ${saved.bestScore} / 5+`
      }

      return { ...badge, unlocked, progressText }
    })
  }, [saved, speciesList])

  function toggleFavorite(id: string) {
    const isFavorite = saved.favorites.includes(id)
    setSaved((prev) => ({ ...prev, favorites: isFavorite ? prev.favorites.filter((item) => item !== id) : [...prev.favorites, id] }))
    if (currentUser) {
      syncFavorite(id, isFavorite ? 'remove' : 'add')
      setToast(isFavorite ? 'Removed from your account field journal' : 'Saved to your account field journal')
    } else {
      setToast(isFavorite ? 'Removed from your local field journal' : 'Saved to your local field journal (Guest)')
    }
  }

  async function handleSignOut() {
    await logout()
    setCurrentUser(null)
    setToast('Signed out of field journal')
  }

  function handleAuthSuccess(user: CurrentUser) {
    setCurrentUser(user)
    setShowAuthModal(false)
    setToast(`Welcome aboard, explorer ${user.name.split(' ')[0]}!`)
    if (user.favoriteSpeciesSlugs && user.favoriteSpeciesSlugs.length > 0) {
      setSaved((prev) => {
        const merged = Array.from(new Set([...prev.favorites, ...user.favoriteSpeciesSlugs]))
        return { ...prev, favorites: merged }
      })
    }
  }

  function markDiscovered(id: string) {
    if (saved.completed.includes(id)) {
      setToast('Already recorded in your field journal')
      return
    }
    setSaved((prev) => ({ ...prev, completed: [...prev.completed, id] }))
    setToast('Discovery recorded. Nice work, explorer!')
  }

  async function handleSavePrediction(creature: PredictedCreature) {
    setSaved((prev) => {
      const exists = prev.savedPredictions.some((p) => p.id === creature.id)
      if (exists) return prev
      return { ...prev, savedPredictions: [creature, ...prev.savedPredictions] }
    })
    // Persist to backend MongoDB
    await saveDiscovery(creature)
  }

  async function handleRemovePrediction(id: string) {
    setSaved((prev) => ({
      ...prev,
      savedPredictions: prev.savedPredictions.filter((p) => p.id !== id)
    }))
    // Remove from backend MongoDB
    await deleteDiscovery(id)
  }

  function startQuiz() {
    setAnswers([])
    setQuestionIndex(0)
    setQuizFinished(false)
    setTab('Ocean quiz')
  }

  function answerQuestion(index: number) {
    if (answers[questionIndex] !== undefined) return
    const next = [...answers, index]
    setAnswers(next)
    if (questionIndex === activeQuizQuestions.length - 1) {
      const finalScore = next.reduce((total, answer, i) => total + (answer === activeQuizQuestions[i]?.answer ? 1 : 0), 0)
      setSaved((prev) => ({ ...prev, bestScore: Math.max(prev.bestScore, finalScore) }))
      setQuizFinished(true)
    }
  }

  function nextQuestion() {
    if (questionIndex < activeQuizQuestions.length - 1) setQuestionIndex((i) => i + 1)
  }

  function resetFilters() {
    setSearch('')
    setZoneFilter('All zones')
    setTypeFilter('All creatures')
    setFavoritesOnly(false)
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => setTab('Discover')} aria-label="Ocean Explorer home">
          <span className="brand-mark">◉</span>
          <span>OCEAN<span className="brand-light">EXPLORER</span></span>
        </button>
        <nav className="main-nav" aria-label="Main navigation">
          {(['Discover', 'The Unknown', 'Ocean zones', 'Ocean quiz', 'My log'] as Tab[]).map((item) => (
            <button key={item} className={`nav-link ${tab === item ? 'active' : ''}`} onClick={() => setTab(item)}>
              {item === 'The Unknown' ? <span className="nav-unknown-badge">THE UNKNOWN <span>✦</span></span> : item}
            </button>
          ))}
        </nav>
        <div className="top-status">
          <span className={`live-dot ${dbConnected ? 'db-connected' : ''}`} /> FIELD JOURNAL{' '}
          <span className="status-count">{saved.completed.length + saved.savedPredictions.length}</span>
        </div>
        <button
          className={`top-audio-btn ${audioActive ? 'active' : ''}`}
          onClick={() => {
            const next = toggleAmbientSound(setAudioActive)
            setAudioActive(next)
          }}
          title="Toggle synthesized deep sea ambient hydrophone soundscape"
        >
          {audioActive && <span className="audio-pulse-dot" />}
          {audioActive ? 'Hydrophone: ON 🔊' : 'Hydrophone 🔇'}
        </button>
        <div className="top-account-area">
          {currentUser ? (
            <div className="top-user-pill">
              <span className="top-user-avatar">{currentUser.name.charAt(0)}</span>
              <span className="top-user-name">{currentUser.name}</span>
              <button className="top-signout-btn" onClick={handleSignOut} title="Sign Out">Sign out</button>
            </div>
          ) : (
            <button
              className="top-auth-btn"
              onClick={() => { setAuthModalMode('signin'); setShowAuthModal(true) }}
            >
              <span>✦</span> Sign In
            </button>
          )}
        </div>
      </header>

      <main>
        {tab === 'Discover' && (
          <>
            <section className="hero">
              <div className="hero-shade" />
              <div className="hero-content">
                <div className="eyebrow"><span className="eyebrow-line" /> YOUR WINDOW INTO THE DEEP</div>
                <h1>The ocean is<br /><em>another universe.</em></h1>
                <p className="hero-copy">Dive beneath the surface. Meet extraordinary life, explore hidden habitats, and discover how much of our blue planet is still a mystery.</p>
                <div className="hero-actions">
                  <button className="button button-primary" onClick={() => document.getElementById('discover-grid')?.scrollIntoView({ behavior: 'smooth' })}>Start exploring <span>↘</span></button>
                  <button className="button button-ghost" onClick={() => setTab('The Unknown')}>The Unknown Predictor <span>✦</span></button>
                  <button className="button button-ghost" onClick={() => setTab('Ocean zones')}>Explore the zones <span>→</span></button>
                </div>
                <div className="hero-metrics">
                  <div><strong>71%</strong><span>of Earth is ocean</span></div>
                  <div><strong>{speciesList.length.toString().padStart(2, '0')}</strong><span>documented species</span></div>
                  <div><strong>06</strong><span>deep-sea habitats</span></div>
                </div>
              </div>
              <div className="hero-caption"><span className="caption-dot" /> PACIFIC OCEAN · FIELD NOTES 001</div>
              <div className="scroll-hint"><span /> SCROLL TO DESCEND</div>
            </section>

            <section className="section intro-section">
              <div className="section-kicker">THE BLUE PLANET / 001</div>
              <div className="intro-grid">
                <h2>A world waiting<br />to be <em>discovered.</em></h2>
                <p>From sunlit coral gardens to the cold, dark depths, every layer of the ocean holds life adapted to its own extraordinary conditions. Your expedition starts here.</p>
              </div>
            </section>

            <section className="section discovery-section" id="discover-grid">
              <div className="section-heading">
                <div>
                  <div className="section-kicker">
                    MONGODB SPECIES REPOSITORY / {dbConnected ? 'ATLAS SYNC ACTIVE' : 'LOCAL CACHE'}
                  </div>
                  <h2>Meet the <em>inhabitants.</em></h2>
                </div>
                <button className={`text-action ${favoritesOnly ? 'selected-action' : ''}`} onClick={() => setFavoritesOnly((v) => !v)}>{favoritesOnly ? '★ Showing saved' : '☆ Saved discoveries'} <span>↗</span></button>
              </div>
              <div className="filter-panel">
                <label className="search-box"><span>⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search species, scientific name, habitat, or type…" aria-label="Search marine life" /><kbd>/</kbd></label>
                <label className="select-wrap"><span>HABITAT</span><select value={zoneFilter} onChange={(e) => setZoneFilter(e.target.value as Zone)}><option>All zones</option><option>Sunlight zone</option><option>Twilight zone</option><option>Midnight zone</option><option>Abyssal zone</option><option>Hadal zone</option></select></label>
                <label className="select-wrap"><span>SPECIES TYPE</span><select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>{types.map((type) => <option key={type}>{type}</option>)}</select></label>
                <button className="reset-button" onClick={resetFilters}>Reset ↺</button>
              </div>
              <div className="results-line">
                <span>{speciesLoading ? 'CONNECTING TO SPECIES REPOSITORY…' : `${filtered.length} SPECIES CATALOGUED`}</span>
                <span>SELECT A SPECIES TO OPEN FIELD NOTES & EVIDENCE</span>
              </div>
              {filtered.length > 0 ? <div className="creature-grid">
                {filtered.map((creature, index) => <article className="creature-card" key={creature.id}>
                  <button className="creature-image-button" onClick={() => setSelected(creature)} aria-label={`View ${creature.name} details`}>
                    <img src={creature.image} alt={creature.name} loading="lazy" onError={(e) => { const img = e.currentTarget; img.onerror = null; img.style.display='none'; const ph = img.parentElement?.querySelector('.img-placeholder') as HTMLElement | null; if (ph) ph.style.display='flex'; }} />
                    <span className="img-placeholder" aria-hidden="true" style={{display:'none',position:'absolute',inset:0,flexDirection:'column',alignItems:'center',justifyContent:'center',background:'linear-gradient(180deg,#041c2c,#08293b)',color:'#73e2e0',fontSize:'11px',fontFamily:'var(--mono)',letterSpacing:'1px',gap:'10px'}}><span style={{fontSize:'32px',opacity:.6}}>🦑</span>IMAGE UNAVAILABLE</span>
                    <span className="image-index">0{index + 1}</span><span className="card-open">↗</span>
                    {saved.completed.includes(creature.id) && <span className="discovered-tag">✓ DISCOVERED</span>}
                  </button>
                  <div className="creature-info">
                    <div className="creature-meta"><span>{creature.zone.toUpperCase()}</span><button className={`favorite-button ${saved.favorites.includes(creature.id) ? 'favorited' : ''}`} onClick={() => toggleFavorite(creature.id)} aria-label={saved.favorites.includes(creature.id) ? 'Remove favorite' : 'Save favorite'}>{saved.favorites.includes(creature.id) ? '★' : '☆'}</button></div>
                    <button className="creature-name" onClick={() => setSelected(creature)}>{creature.name}</button>
                    <div className="scientific">{creature.scientific}</div>
                    <div className="card-footer"><span>{creature.type}</span><button onClick={() => setSelected(creature)}>FIELD NOTES <span>↗</span></button></div>
                  </div>
                </article>)}
              </div> : <div className="empty-state"><span>⌕</span><h3>No creatures found</h3><p>Try another search term or clear your filters.</p><button className="button button-primary" onClick={resetFilters}>Clear filters</button></div>}
            </section>

            {/* Teaser Banner for The Unknown */}
            <section className="section unknown-teaser-strip">
              <div className="unknown-teaser-content">
                <div className="section-kicker">NEW RESEARCH MODULE · THE UNKNOWN</div>
                <h2>What lives in the deepest chasms?<br /><em>Predict the undiscovered.</em></h2>
                <p>Simulate extreme hydrostatic pressures, thermal vent boundaries, and chemosynthetic food webs to model hypothetical undiscovered deep-sea creatures backed by empirical marine science.</p>
                <button className="button button-primary" onClick={() => setTab('The Unknown')}>
                  Launch The Unknown Predictor <span>✦</span>
                </button>
              </div>
            </section>

            <section className="zone-banner">
              <div className="zone-banner-content"><div className="section-kicker">GO BEYOND THE SURFACE</div><h2>Three layers.<br /><em>Endless mysteries.</em></h2><p>Light fades. Pressure rises. Life finds a way.</p><button className="button button-primary" onClick={() => setTab('Ocean zones')}>Descend into the zones <span>→</span></button></div>
            </section>
            <section className="section conservation-strip"><div className="conservation-icon">✳</div><div><div className="section-kicker">A NOTE FROM THE FIELD</div><h3>Exploration comes with responsibility.</h3><p>Healthy oceans support life across our planet. Learn about marine habitats, reduce single-use plastics, and support evidence-based conservation.</p></div><button className="text-action" onClick={() => setTab('My log')}>View your impact <span>↗</span></button></section>
          </>
        )}

        {/* The Unknown Feature Tab */}
        {tab === 'The Unknown' && (
          <TheUnknown
            savedPredictions={saved.savedPredictions}
            onSavePrediction={handleSavePrediction}
            onRemovePrediction={handleRemovePrediction}
            onShowToast={setToast}
          />
        )}

        {tab === 'Ocean zones' && (
          <section className="page-section">
            <div className="section-kicker">DEPTH PROFILE / 003</div><h1 className="page-title">Descend into the <em>unknown.</em></h1>
            <p className="page-lead">As sunlight disappears, the ocean transforms across five distinct vertical realms. Explore the layers, test the submersible simulator, and discover which creatures call each depth home.</p>

            {/* Interactive Submersible Depth Simulator */}
            <DepthSimulator
              speciesList={speciesList}
              onSelectCreature={(c) => setSelected(c)}
            />

            <div className="section-heading" style={{ marginTop: '36px', marginBottom: '20px' }}>
              <div>
                <div className="section-kicker">PELAGIC STRATIFICATION</div>
                <h2>The Five <em>Oceanic Layers.</em></h2>
              </div>
            </div>
            <div className="zones-grid">{zones.map((zone, i) => {
              const count = speciesList.filter((c) => c.zone === zone.name).length
              return <article className="zone-card" key={zone.name}><div className="zone-image"><img src={zone.image} alt={zone.name} loading="lazy" /><span className="zone-number">0{i + 1}</span><span className="zone-symbol">{zone.icon}</span></div><div className="zone-details"><div className="zone-depth">{zone.depth} DEPTH</div><h2>{zone.name}</h2><p>{zone.note}</p><div className="zone-bottom"><span>{count} species profiles</span><button onClick={() => { setZoneFilter(zone.name); setTab('Discover'); document.getElementById('discover-grid')?.scrollIntoView({ behavior: 'smooth' }) }}>Explore species ↗</button></div></div></article>
            })}</div>
            <div className="fact-callout"><span>FIELD FACT / 04</span><p>Ocean depth zones are commonly described by how much sunlight reaches them. Exact boundaries vary by source and conditions; the deep sea is far from a uniform habitat.</p></div>
          </section>
        )}

        {tab === 'Ocean quiz' && (
          <section className="page-section quiz-page">
            <div className="section-kicker">KNOWLEDGE CHECK / 005</div><h1 className="page-title">Test your ocean <em>instinct.</em></h1>
            <p className="page-lead">15 comprehensive scientific questions across three exploration categories. Choose a specialty or complete the full expedition.</p>
            
            {/* Category selection bar */}
            <div className="quiz-category-bar">
              {['All Expeditions', 'Deep Sea Adaptations', 'Marine Ecology', 'Ocean Physics'].map((cat) => (
                <button
                  key={cat}
                  className={`quiz-category-chip ${quizCategory === cat ? 'active' : ''}`}
                  onClick={() => {
                    setQuizCategory(cat)
                    setAnswers([])
                    setQuestionIndex(0)
                    setQuizFinished(false)
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {!quizFinished ? <div className="quiz-card">
              <span className="question-category-tag">{activeQuizQuestions[questionIndex]?.category}</span>
              <div className="quiz-progress-line"><span>QUESTION {String(questionIndex + 1).padStart(2, '0')} / {activeQuizQuestions.length}</span><span>{Math.round((questionIndex / activeQuizQuestions.length) * 100)}% COMPLETE</span></div>
              <div className="progress-track"><span style={{ width: `${(questionIndex / activeQuizQuestions.length) * 100}%` }} /></div>
              <h2>{activeQuizQuestions[questionIndex]?.question}</h2>
              <div className="answer-list">{activeQuizQuestions[questionIndex]?.options.map((option, index) => {
                const chosen = answers[questionIndex]
                const correct = activeQuizQuestions[questionIndex]?.answer === index
                return <button key={option} className={`answer-option ${chosen !== undefined && correct ? 'correct' : ''} ${chosen === index && !correct ? 'incorrect' : ''}`} onClick={() => answerQuestion(index)} disabled={chosen !== undefined}><span>{String.fromCharCode(65 + index)}</span>{option}{chosen !== undefined && correct && <b>✓</b>}</button>
              })}</div>
              {answers[questionIndex] !== undefined && <div className="answer-feedback"><strong>{answers[questionIndex] === activeQuizQuestions[questionIndex]?.answer ? 'Correct — nice dive!' : 'Not quite — learn as you go.'}</strong><p>{activeQuizQuestions[questionIndex]?.explanation}</p>{questionIndex < activeQuizQuestions.length - 1 && <button className="button button-primary" onClick={nextQuestion}>Next question <span>→</span></button>}</div>}
            </div> : <div className="quiz-result"><div className="result-orb">✳</div><div className="section-kicker">EXPEDITION COMPLETE · {quizCategory.toUpperCase()}</div><h2>{score} <span>/ {activeQuizQuestions.length}</span></h2><p>{score === activeQuizQuestions.length ? 'Outstanding. You are a true marine biologist.' : score >= Math.ceil(activeQuizQuestions.length * 0.6) ? 'A strong dive. High proficiency across ocean science.' : 'Every explorer starts somewhere. Take another dive.'}</p><div className="best-score">PERSONAL BEST <strong>{Math.max(saved.bestScore, score)} / {quizQuestions.length}</strong></div><button className="button button-primary" onClick={startQuiz}>Dive again ↻</button></div>}
          </section>
        )}

        {tab === 'My log' && (
          <section className="page-section">
            <div className="section-kicker">PERSONAL FIELD JOURNAL / 004</div><h1 className="page-title">Your ocean <em>logbook.</em></h1>
            <p className="page-lead">Every saved species, completed discovery, and predicted hypothetical creature is safely synchronized with your MongoDB repository.</p>
            
            <div className="account-sync-banner" style={{
              background: currentUser ? 'rgba(0, 229, 255, 0.06)' : 'rgba(255, 255, 255, 0.04)',
              border: `1px solid ${currentUser ? 'rgba(0, 229, 255, 0.25)' : 'rgba(255, 255, 255, 0.1)'}`,
              borderRadius: '8px',
              padding: '12px 18px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <strong style={{ color: currentUser ? 'var(--cyan)' : '#8da4b4', fontSize: '13px', display: 'block', marginBottom: '2px' }}>
                  {currentUser ? `EXPLORER ACCOUNT: ${currentUser.name.toUpperCase()}` : 'GUEST EXPLORER MODE'}
                </strong>
                <span style={{ fontSize: '12.5px', color: '#91b0bd' }}>
                  {currentUser
                    ? `Authenticated as ${currentUser.email} — your field journal and predictions are linked to your account.`
                    : 'Your field journal is stored in this browser. Create an account or sign in to sync with MongoDB.'}
                </span>
              </div>
              {!currentUser && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="button button-ghost"
                    style={{ padding: '6px 14px', fontSize: '12px' }}
                    onClick={() => { setAuthModalMode('signin'); setShowAuthModal(true) }}
                  >
                    Sign in
                  </button>
                  <button
                    className="button button-primary"
                    style={{ padding: '6px 14px', fontSize: '12px' }}
                    onClick={() => { setAuthModalMode('signup'); setShowAuthModal(true) }}
                  >
                    Create account ↗
                  </button>
                </div>
              )}
            </div>
            <div className="log-stats">
              <div><span>DOCUMENTED DISCOVERIES</span><strong>{completedCreatureCount}<small> / {speciesList.length}</small></strong></div>
              <div><span>FAVORITE SPECIES</span><strong>{saved.favorites.length}</strong></div>
              <div><span>HYPOTHETICAL FINDS</span><strong>{saved.savedPredictions.length}</strong></div>
              <div><span>QUIZ PERSONAL BEST</span><strong>{saved.bestScore}<small> / {quizQuestions.length}</small></strong></div>
            </div>
            <div className="log-progress"><div className="log-progress-head"><span>SPECIES EXPLORATION</span><strong>{progressPercent}%</strong></div><div className="progress-track"><span style={{ width: `${progressPercent}%` }} /></div><p>Open any species field notes and mark it discovered to grow your collection.</p></div>

            {/* Expedition Badges Section */}
            <div className="badges-container">
              <div className="badges-head">
                <div>
                  <div className="section-kicker">FIELD JOURNAL ACHIEVEMENTS</div>
                  <h2 style={{ fontSize: '20px', color: '#f0f8ff', margin: '4px 0 0' }}>Explorer Honors & Milestones</h2>
                </div>
                <span className="badges-count-pill">
                  {computedBadges.filter((b) => b.unlocked).length} / {computedBadges.length} UNLOCKED
                </span>
              </div>
              <div className="badges-grid">
                {computedBadges.map((badge) => (
                  <div key={badge.id} className={`badge-card ${badge.unlocked ? 'unlocked' : ''}`}>
                    <div className="badge-card-top">
                      <span className="badge-icon">{badge.icon}</span>
                      <span className="badge-status-tag">{badge.unlocked ? 'UNLOCKED' : 'LOCKED'}</span>
                    </div>
                    <h3 className="badge-title">{badge.title}</h3>
                    <p className="badge-desc">{badge.description}</p>
                    <small style={{ color: badge.unlocked ? 'var(--cyan)' : '#6a8292', fontSize: '11px', fontFamily: 'var(--mono)' }}>
                      {badge.progressText}
                    </small>
                  </div>
                ))}
              </div>
            </div>

            {/* Three Columns: Saved Species, Recorded Finds, and Hypothetical Discoveries */}
            <div className="log-columns-three">
              <div>
                <div className="section-heading compact">
                  <div><div className="section-kicker">COLLECTION / {saved.favorites.length}</div><h2>Saved <em>species.</em></h2></div>
                </div>
                {saved.favorites.length ? (
                  <div className="log-list">
                    {speciesList.filter((c) => saved.favorites.includes(c.id)).map((c) => (
                      <button key={c.id} className="log-item" onClick={() => setSelected(c)}>
                        <img src={c.image} alt={c.name} loading="lazy" onError={(e) => { const img = e.currentTarget; img.onerror = null; img.style.background='#08293b'; img.src='data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-size="20">🦑</text></svg>'; }} />
                        <span><strong>{c.name}</strong><small>{c.zone}</small></span>
                        <b>↗</b>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="log-empty">Your collection is waiting. Use the ☆ on any creature to save it here.</div>
                )}
              </div>

              <div>
                <div className="section-heading compact">
                  <div><div className="section-kicker">FIELD RECORDS / {saved.completed.length}</div><h2>Recorded <em>finds.</em></h2></div>
                </div>
                {saved.completed.length ? (
                  <div className="log-list">
                    {speciesList.filter((c) => saved.completed.includes(c.id)).map((c) => (
                      <button key={c.id} className="log-item" onClick={() => setSelected(c)}>
                        <img src={c.image} alt={c.name} loading="lazy" onError={(e) => { const img = e.currentTarget; img.onerror = null; img.style.background='#08293b'; img.src='data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-size="20">🦑</text></svg>'; }} />
                        <span><strong>{c.name}</strong><small>✓ Discovery complete</small></span>
                        <b>↗</b>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="log-empty">Your first discovery is one click away. Open a species profile and record your find.</div>
                )}
              </div>

              <div>
                <div className="section-heading compact">
                  <div><div className="section-kicker">THE UNKNOWN / {saved.savedPredictions.length}</div><h2>Hypothetical <em>dossiers.</em></h2></div>
                </div>
                {saved.savedPredictions.length ? (
                  <div className="log-list">
                    {saved.savedPredictions.map((pred) => (
                      <div key={pred.id} className="log-item unknown-log-card">
                        <div className="unknown-log-icon">✦</div>
                        <span onClick={() => setSelectedUnknown(pred)} style={{ cursor: 'pointer' }}>
                          <strong>{pred.name}</strong>
                          <small><em>{pred.scientificName}</em> · {pred.depthRange}</small>
                        </span>
                        <div className="unknown-log-actions">
                          <button
                            type="button"
                            className="view-dossier-btn"
                            onClick={() => setSelectedUnknown(pred)}
                            title="Open Dossier"
                          >
                            ↗
                          </button>
                          <button
                            type="button"
                            className="remove-log-btn"
                            onClick={() => {
                              handleRemovePrediction(pred.id)
                              setToast('Hypothetical specimen removed')
                            }}
                            title="Remove"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="log-empty">
                    No hypothetical creatures saved yet. Visit <button className="inline-link-btn" onClick={() => setTab('The Unknown')}>The Unknown</button> to simulate and save speculative deep-sea creatures!
                  </div>
                )}
              </div>
            </div>

            <button className="text-action reset-progress" onClick={() => { if (window.confirm('Reset all saved favorites, discoveries, hypothetical dossiers, and quiz score? This cannot be undone.')) { setSaved(initialSaved); setToast('Field journal reset') } }}>Reset field journal ↻</button>
          </section>
        )}
      </main>

      <footer className="footer"><button className="brand footer-brand" onClick={() => setTab('Discover')}><span className="brand-mark">◉</span><span>OCEAN<span className="brand-light">EXPLORER</span></span></button><span>BUILT FOR THE CURIOUS · PROTECT THE BLUE</span><span>AN INTERACTIVE MARINE LIFE FIELD GUIDE & MONGODB SPECULATION ENGINE</span></footer>

      {/* Real creature modal */}
      {selected && <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setSelected(null) }}><section className="creature-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button className="modal-close" onClick={() => setSelected(null)} aria-label="Close details">×</button><div className="modal-image"><img src={selected.image} alt={selected.name} onError={(e) => { const img = e.currentTarget; img.onerror = null; img.src = ''; img.alt = 'Image unavailable'; img.style.cssText='width:100%;height:100%;min-height:540px;object-fit:contain;display:flex;background:linear-gradient(180deg,#041c2c,#08293b);'; const ph = document.getElementById('modal-img-placeholder'); if (ph) ph.style.display='flex'; }} /><div id="modal-img-placeholder" style={{display:'none',position:'absolute',inset:0,flexDirection:'column',alignItems:'center',justifyContent:'center',background:'linear-gradient(180deg,#041c2c,#08293b)',color:'#73e2e0',fontSize:'11px',fontFamily:'var(--mono)',letterSpacing:'1px',gap:'14px'}}><span style={{fontSize:'52px',opacity:.5}}>🔬</span><span>SPECIMEN IMAGE UNAVAILABLE</span><span style={{color:'#4a7080',fontSize:'9px'}}>{selected.scientific}</span></div>{selected.imageAttribution && <div style={{position:'absolute',bottom:0,left:0,right:0,padding:'6px 10px',background:'rgba(2,14,22,.8)',fontSize:'8px',fontFamily:'var(--mono)',letterSpacing:'.5px',color:'#5a8090',lineHeight:1.5}}>📷 {selected.imageAttribution}</div>}</div><div className="modal-content"><div className="section-kicker">DOCUMENTED SPECIES / SCIENTIFIC EVIDENCE</div><h2 id="modal-title">{selected.name}</h2><div className="scientific">{selected.scientific}</div><p className="modal-description">{selected.description}</p><div className="profile-data"><div><span>HABITAT</span><strong>{selected.zone}</strong></div><div><span>DEPTH RANGE</span><strong>{selected.depth}</strong></div><div><span>DIET</span><strong>{selected.diet}</strong></div><div><span>CONSERVATION</span><strong>{selected.status}</strong></div></div>{selected.biologicalAdaptations && selected.biologicalAdaptations.length > 0 && (<div className="specimen-section" style={{ marginTop: '16px' }}><div className="specimen-section-title">KEY BIOLOGICAL ADAPTATIONS</div><ul className="specimen-list">{selected.biologicalAdaptations.map((a, i) => (<li key={i}>{a}</li>))}</ul></div>)}<div className="fact-box"><span>✳ FIELD NOTE & FACT</span><p>{selected.fact}</p></div>{selected.sourceReferences && selected.sourceReferences.length > 0 && (<div className="specimen-section" style={{ marginTop: '16px' }}><div className="specimen-section-title">EVIDENCE & SOURCE CITATIONS</div><div className="inspirations-grid">{selected.sourceReferences.map((ref, idx) => (<div key={idx} className="inspiration-card"><div className="inspiration-names"><strong>{ref.title}</strong></div><cite className="inspiration-cite">{ref.citation}{ref.url && (<a href={ref.url} target="_blank" rel="noopener noreferrer" className="inspiration-link">View Reference ↗</a>)}</cite></div>))}</div></div>)}<div className="modal-actions"><button className="button button-primary" onClick={() => markDiscovered(selected.id)}>{saved.completed.includes(selected.id) ? '✓ Discovery recorded' : '✓ Mark discovered'}</button><button className="button button-ghost" onClick={() => toggleFavorite(selected.id)}>{saved.favorites.includes(selected.id) ? '★ Saved' : '☆ Save species'}</button></div><small className="data-note">Educational summary. Scientific conservation status and depth boundaries verified against IUCN and NOAA ocean databases.</small></div></section></div>}

      {/* Saved Unknown creature modal */}
      {selectedUnknown && (
        <UnknownModal
          creature={selectedUnknown}
          onClose={() => setSelectedUnknown(null)}
          isSaved={saved.savedPredictions.some((p) => p.id === selectedUnknown.id)}
          onToggleSave={(c) => {
            if (saved.savedPredictions.some((p) => p.id === c.id)) {
              handleRemovePrediction(c.id)
              setToast('Removed from your field journal')
            } else {
              handleSavePrediction(c)
              setToast('Hypothetical specimen saved!')
            }
          }}
        />
      )}

      {toast && <div className="toast" role="status"><span>✳</span>{toast}</div>}

      {/* Auth Modal for Sign In & Sign Up */}
      {showAuthModal && (
        <AuthModal
          initialMode={authModalMode}
          dbAvailable={dbConnected}
          onSuccess={handleAuthSuccess}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </div>
  )
}

export default App
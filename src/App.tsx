import { useEffect, useMemo, useState } from 'react'
import { creatures, zones, quizQuestions } from './data'
import type { Creature, Zone } from './types'

type Tab = 'Discover' | 'Ocean zones' | 'Ocean quiz' | 'My log'
type SavedState = { favorites: string[]; completed: string[]; bestScore: number }

const STORAGE_KEY = 'ocean-explorer-progress-v1'
const initialSaved: SavedState = { favorites: [], completed: [], bestScore: 0 }

function readSaved(): SavedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialSaved
    const parsed = JSON.parse(raw) as Partial<SavedState>
    return {
      favorites: Array.isArray(parsed.favorites) ? parsed.favorites.filter((id): id is string => typeof id === 'string') : [],
      completed: Array.isArray(parsed.completed) ? parsed.completed.filter((id): id is string => typeof id === 'string') : [],
      bestScore: typeof parsed.bestScore === 'number' && Number.isFinite(parsed.bestScore) ? parsed.bestScore : 0,
    }
  } catch {
    return initialSaved
  }
}

function App() {
  const [tab, setTab] = useState<Tab>('Discover')
  const [search, setSearch] = useState('')
  const [zoneFilter, setZoneFilter] = useState<Zone>('All zones')
  const [typeFilter, setTypeFilter] = useState('All creatures')
  const [selected, setSelected] = useState<Creature | null>(null)
  const [saved, setSaved] = useState<SavedState>(readSaved)
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [quizFinished, setQuizFinished] = useState(false)
  const [toast, setToast] = useState('')

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

  const types = useMemo(() => ['All creatures', ...Array.from(new Set(creatures.map((c) => c.type))).sort()], [])
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return creatures.filter((creature) => {
      const matchesSearch = !query || [creature.name, creature.scientific, creature.type, creature.zone].some((v) => v.toLowerCase().includes(query))
      const matchesZone = zoneFilter === 'All zones' || creature.zone === zoneFilter
      const matchesType = typeFilter === 'All creatures' || creature.type === typeFilter
      const matchesFavorites = !favoritesOnly || saved.favorites.includes(creature.id)
      return matchesSearch && matchesZone && matchesType && matchesFavorites
    })
  }, [search, zoneFilter, typeFilter, favoritesOnly, saved.favorites])

  const score = answers.reduce((total, answer, index) => total + (answer === quizQuestions[index]?.answer ? 1 : 0), 0)
  const completedCreatureCount = saved.completed.length
  const progressPercent = Math.round((completedCreatureCount / creatures.length) * 100)

  function toggleFavorite(id: string) {
    const isFavorite = saved.favorites.includes(id)
    setSaved((prev) => ({ ...prev, favorites: isFavorite ? prev.favorites.filter((item) => item !== id) : [...prev.favorites, id] }))
    setToast(isFavorite ? 'Removed from your field journal' : 'Saved to your field journal')
  }

  function markDiscovered(id: string) {
    if (saved.completed.includes(id)) {
      setToast('Already recorded in your field journal')
      return
    }
    setSaved((prev) => ({ ...prev, completed: [...prev.completed, id] }))
    setToast('Discovery recorded. Nice work, explorer!')
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
    if (questionIndex === quizQuestions.length - 1) {
      const finalScore = next.reduce((total, answer, i) => total + (answer === quizQuestions[i].answer ? 1 : 0), 0)
      setSaved((prev) => ({ ...prev, bestScore: Math.max(prev.bestScore, finalScore) }))
      setQuizFinished(true)
    }
  }

  function nextQuestion() {
    if (questionIndex < quizQuestions.length - 1) setQuestionIndex((i) => i + 1)
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
          {(['Discover', 'Ocean zones', 'Ocean quiz', 'My log'] as Tab[]).map((item) => (
            <button key={item} className={`nav-link ${tab === item ? 'active' : ''}`} onClick={() => setTab(item)}>{item}</button>
          ))}
        </nav>
        <div className="top-status"><span className="live-dot" /> FIELD JOURNAL <span className="status-count">{saved.completed.length}</span></div>
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
                  <button className="button button-ghost" onClick={() => setTab('Ocean zones')}>Explore the zones <span>→</span></button>
                </div>
                <div className="hero-metrics">
                  <div><strong>71%</strong><span>of Earth is ocean</span></div>
                  <div><strong>{creatures.length.toString().padStart(2, '0')}</strong><span>species profiles</span></div>
                  <div><strong>03</strong><span>ocean zones</span></div>
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
                <div><div className="section-kicker">SPECIES DATABASE / LIVE FILTERS</div><h2>Meet the <em>inhabitants.</em></h2></div>
                <button className={`text-action ${favoritesOnly ? 'selected-action' : ''}`} onClick={() => setFavoritesOnly((v) => !v)}>{favoritesOnly ? '★ Showing saved' : '☆ Saved discoveries'} <span>↗</span></button>
              </div>
              <div className="filter-panel">
                <label className="search-box"><span>⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search species, habitat, or type…" aria-label="Search marine life" /><kbd>/</kbd></label>
                <label className="select-wrap"><span>HABITAT</span><select value={zoneFilter} onChange={(e) => setZoneFilter(e.target.value as Zone)}><option>All zones</option><option>Sunlight zone</option><option>Twilight zone</option><option>Midnight zone</option></select></label>
                <label className="select-wrap"><span>SPECIES TYPE</span><select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>{types.map((type) => <option key={type}>{type}</option>)}</select></label>
                <button className="reset-button" onClick={resetFilters}>Reset ↺</button>
              </div>
              <div className="results-line"><span>{filtered.length} SPECIES FOUND</span><span>SELECT A SPECIES TO OPEN FIELD NOTES</span></div>
              {filtered.length > 0 ? <div className="creature-grid">
                {filtered.map((creature, index) => <article className="creature-card" key={creature.id}>
                  <button className="creature-image-button" onClick={() => setSelected(creature)} aria-label={`View ${creature.name} details`}>
                    <img src={creature.image} alt={creature.name} loading="lazy" onError={(e) => { e.currentTarget.style.opacity = '0.25' }} />
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

            <section className="zone-banner">
              <div className="zone-banner-content"><div className="section-kicker">GO BEYOND THE SURFACE</div><h2>Three layers.<br /><em>Endless mysteries.</em></h2><p>Light fades. Pressure rises. Life finds a way.</p><button className="button button-primary" onClick={() => setTab('Ocean zones')}>Descend into the zones <span>→</span></button></div>
            </section>
            <section className="section conservation-strip"><div className="conservation-icon">✳</div><div><div className="section-kicker">A NOTE FROM THE FIELD</div><h3>Exploration comes with responsibility.</h3><p>Healthy oceans support life across our planet. Learn about marine habitats, reduce single-use plastics, and support evidence-based conservation.</p></div><button className="text-action" onClick={() => setTab('My log')}>View your impact <span>↗</span></button></section>
          </>
        )}

        {tab === 'Ocean zones' && (
          <section className="page-section">
            <div className="section-kicker">DEPTH PROFILE / 003</div><h1 className="page-title">Descend into the <em>unknown.</em></h1>
            <p className="page-lead">As sunlight disappears, the ocean transforms. Explore the layers and discover which creatures call them home.</p>
            <div className="zones-grid">{zones.map((zone, i) => {
              const count = creatures.filter((c) => c.zone === zone.name).length
              return <article className="zone-card" key={zone.name}><div className="zone-image"><img src={zone.image} alt="" /><span className="zone-number">0{i + 1}</span><span className="zone-symbol">{zone.icon}</span></div><div className="zone-details"><div className="zone-depth">{zone.depth} DEPTH</div><h2>{zone.name}</h2><p>{zone.note}</p><div className="zone-bottom"><span>{count} species profiles</span><button onClick={() => { setZoneFilter(zone.name); setTab('Discover'); document.getElementById('discover-grid')?.scrollIntoView({ behavior: 'smooth' }) }}>Explore species ↗</button></div></div></article>
            })}</div>
            <div className="fact-callout"><span>FIELD FACT / 04</span><p>Ocean depth zones are commonly described by how much sunlight reaches them. Exact boundaries vary by source and conditions; the deep sea is far from a uniform habitat.</p></div>
          </section>
        )}

        {tab === 'Ocean quiz' && (
          <section className="page-section quiz-page">
            <div className="section-kicker">KNOWLEDGE CHECK / 005</div><h1 className="page-title">Test your ocean <em>instinct.</em></h1>
            <p className="page-lead">Five quick questions. Every answer adds a little more to your field knowledge.</p>
            {!quizFinished ? <div className="quiz-card">
              <div className="quiz-progress-line"><span>QUESTION {String(questionIndex + 1).padStart(2, '0')} / {quizQuestions.length}</span><span>{Math.round((questionIndex / quizQuestions.length) * 100)}% COMPLETE</span></div>
              <div className="progress-track"><span style={{ width: `${(questionIndex / quizQuestions.length) * 100}%` }} /></div>
              <h2>{quizQuestions[questionIndex].question}</h2>
              <div className="answer-list">{quizQuestions[questionIndex].options.map((option, index) => {
                const chosen = answers[questionIndex]
                const correct = quizQuestions[questionIndex].answer === index
                return <button key={option} className={`answer-option ${chosen !== undefined && correct ? 'correct' : ''} ${chosen === index && !correct ? 'incorrect' : ''}`} onClick={() => answerQuestion(index)} disabled={chosen !== undefined}><span>{String.fromCharCode(65 + index)}</span>{option}{chosen !== undefined && correct && <b>✓</b>}</button>
              })}</div>
              {answers[questionIndex] !== undefined && <div className="answer-feedback"><strong>{answers[questionIndex] === quizQuestions[questionIndex].answer ? 'Correct — nice dive!' : 'Not quite — learn as you go.'}</strong><p>{quizQuestions[questionIndex].explanation}</p>{questionIndex < quizQuestions.length - 1 && <button className="button button-primary" onClick={nextQuestion}>Next question <span>→</span></button>}</div>}
            </div> : <div className="quiz-result"><div className="result-orb">✳</div><div className="section-kicker">EXPEDITION COMPLETE</div><h2>{score} <span>/ {quizQuestions.length}</span></h2><p>{score === quizQuestions.length ? 'Outstanding. You know your ocean.' : score >= 3 ? 'A strong dive. There is always more to discover.' : 'Every explorer starts somewhere. Take another dive.'}</p><div className="best-score">PERSONAL BEST <strong>{Math.max(saved.bestScore, score)} / {quizQuestions.length}</strong></div><button className="button button-primary" onClick={startQuiz}>Dive again ↻</button></div>}
          </section>
        )}

        {tab === 'My log' && (
          <section className="page-section">
            <div className="section-kicker">PERSONAL FIELD JOURNAL / 004</div><h1 className="page-title">Your ocean <em>logbook.</em></h1>
            <p className="page-lead">Every saved species and completed discovery is stored in this browser, ready for your next visit.</p>
            <div className="log-stats"><div><span>DISCOVERIES</span><strong>{completedCreatureCount}<small> / {creatures.length}</small></strong></div><div><span>SAVED SPECIES</span><strong>{saved.favorites.length}</strong></div><div><span>QUIZ PERSONAL BEST</span><strong>{saved.bestScore}<small> / {quizQuestions.length}</small></strong></div></div>
            <div className="log-progress"><div className="log-progress-head"><span>SPECIES EXPLORATION</span><strong>{progressPercent}%</strong></div><div className="progress-track"><span style={{ width: `${progressPercent}%` }} /></div><p>Open any species field notes and mark it discovered to grow your collection.</p></div>
            <div className="log-columns"><div><div className="section-heading compact"><div><div className="section-kicker">COLLECTION / {saved.favorites.length}</div><h2>Saved <em>species.</em></h2></div></div>{saved.favorites.length ? <div className="log-list">{creatures.filter((c) => saved.favorites.includes(c.id)).map((c) => <button key={c.id} className="log-item" onClick={() => setSelected(c)}><img src={c.image} alt="" /><span><strong>{c.name}</strong><small>{c.zone}</small></span><b>↗</b></button>)}</div> : <div className="log-empty">Your collection is waiting. Use the ☆ on any creature to save it here.</div>}</div>
              <div><div className="section-heading compact"><div><div className="section-kicker">FIELD RECORDS / {saved.completed.length}</div><h2>Recorded <em>finds.</em></h2></div></div>{saved.completed.length ? <div className="log-list">{creatures.filter((c) => saved.completed.includes(c.id)).map((c) => <button key={c.id} className="log-item" onClick={() => setSelected(c)}><img src={c.image} alt="" /><span><strong>{c.name}</strong><small>✓ Discovery complete</small></span><b>↗</b></button>)}</div> : <div className="log-empty">Your first discovery is one click away. Open a species profile and record your find.</div>}</div></div>
            <button className="text-action reset-progress" onClick={() => { if (window.confirm('Reset all saved favorites, discoveries, and quiz best score? This cannot be undone.')) { setSaved(initialSaved); setToast('Field journal reset') } }}>Reset field journal ↻</button>
          </section>
        )}
      </main>

      <footer className="footer"><button className="brand footer-brand" onClick={() => setTab('Discover')}><span className="brand-mark">◉</span><span>OCEAN<span className="brand-light">EXPLORER</span></span></button><span>BUILT FOR THE CURIOUS · PROTECT THE BLUE</span><span>AN INTERACTIVE MARINE LIFE FIELD GUIDE</span></footer>

      {selected && <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setSelected(null) }}><section className="creature-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button className="modal-close" onClick={() => setSelected(null)} aria-label="Close details">×</button><div className="modal-image"><img src={selected.image} alt={selected.name} /></div><div className="modal-content"><div className="section-kicker">SPECIES PROFILE / FIELD NOTES</div><h2 id="modal-title">{selected.name}</h2><div className="scientific">{selected.scientific}</div><p className="modal-description">{selected.description}</p><div className="profile-data"><div><span>HABITAT</span><strong>{selected.zone}</strong></div><div><span>DEPTH RANGE</span><strong>{selected.depth}</strong></div><div><span>DIET</span><strong>{selected.diet}</strong></div><div><span>CONSERVATION</span><strong>{selected.status}</strong></div></div><div className="fact-box"><span>✳ DID YOU KNOW?</span><p>{selected.fact}</p></div><div className="modal-actions"><button className="button button-primary" onClick={() => markDiscovered(selected.id)}>{saved.completed.includes(selected.id) ? '✓ Discovery recorded' : '✓ Mark discovered'}</button><button className="button button-ghost" onClick={() => toggleFavorite(selected.id)}>{saved.favorites.includes(selected.id) ? '★ Saved' : '☆ Save species'}</button></div><small className="data-note">Educational overview. Conservation status and depth ranges can vary by species and source.</small></div></section></div>}
      {toast && <div className="toast" role="status"><span>✳</span>{toast}</div>}
    </div>
  )
}

export default App
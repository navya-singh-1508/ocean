import React, { useState, useEffect, useMemo, useCallback } from 'react'
import type {
  EnvironmentType,
  LightAvailability,
  OxygenAvailability,
  FoodSource,
  EnvironmentalInputs,
  PredictedCreature
} from '../types'
import {
  checkBackendHealth,
  requestPrediction,
  calculateLocalPressure,
  type HealthCheckResult
} from '../services/api'
import { CreatureIllustration } from './CreatureIllustration'
import { UnknownModal } from './UnknownModal'

interface TheUnknownProps {
  savedPredictions: PredictedCreature[]
  onSavePrediction: (creature: PredictedCreature) => void
  onRemovePrediction: (id: string) => void
  onShowToast: (message: string) => void
}

interface EnvironmentPreset {
  id: EnvironmentType
  label: string
  sub: string
  defaultDepth: number
  minDepth: number
  maxDepth: number
  defaultTemp: number
  minTemp: number
  maxTemp: number
  defaultLight: LightAvailability
  defaultOxygen: OxygenAvailability
  defaultFood: FoodSource
  description: string
}

const PRESETS: Record<EnvironmentType, EnvironmentPreset> = {
  twilight_zone: {
    id: 'twilight_zone',
    label: 'Twilight Zone',
    sub: 'Mesopelagic (200 – 1,000 m)',
    defaultDepth: 650,
    minDepth: 200,
    maxDepth: 1000,
    defaultTemp: 8.0,
    minTemp: 4.0,
    maxTemp: 18.0,
    defaultLight: 'weak_residual',
    defaultOxygen: 'oxygen_minimum_zone',
    defaultFood: 'marine_snow',
    description: 'The boundary where the last photons of sunlight fade away. Frequently overlaps with severe oxygen depletion layers.'
  },
  abyssal_plain: {
    id: 'abyssal_plain',
    label: 'Abyssal Plain',
    sub: 'Benthic Floor (3,000 – 6,000 m)',
    defaultDepth: 4500,
    minDepth: 3000,
    maxDepth: 6000,
    defaultTemp: 2.2,
    minTemp: -0.5,
    maxTemp: 4.0,
    defaultLight: 'none',
    defaultOxygen: 'standard_deep_water',
    defaultFood: 'marine_snow',
    description: 'Vast, flat, silt-covered seabed under 300–600 atm pressure with near-freezing temperatures fed by deep thermohaline currents.'
  },
  hadal_trench: {
    id: 'hadal_trench',
    label: 'Hadal Trench',
    sub: 'Subduction Chasm (6,000 – 11,000 m)',
    defaultDepth: 8400,
    minDepth: 6000,
    maxDepth: 11000,
    defaultTemp: 1.5,
    minTemp: 0.8,
    maxTemp: 3.5,
    defaultLight: 'none',
    defaultOxygen: 'well_oxygenated_cold_plume',
    defaultFood: 'benthic_sediment_detritus',
    description: 'Deepest chasms on Earth. Crushing pressure exceeding 600–1,100 bar requires high concentrations of TMAO piezolytes to maintain cellular enzymes.'
  },
  hydrothermal_vents: {
    id: 'hydrothermal_vents',
    label: 'Hydrothermal Vents',
    sub: 'Active Chimney Mixing Zone (1,500 – 4,000 m)',
    defaultDepth: 2500,
    minDepth: 1000,
    maxDepth: 5000,
    defaultTemp: 14.0,
    minTemp: 2.0,
    maxTemp: 38.0,
    defaultLight: 'geothermal_glow',
    defaultOxygen: 'standard_deep_water',
    defaultFood: 'chemosynthetic_microbes',
    description: 'Dynamic chemical mixing zones. While central mineral fluids vent at 350°C, living fauna thrive in the surrounding 2°C–38°C boundary gradients.'
  },
  underwater_canyon: {
    id: 'underwater_canyon',
    label: 'Underwater Canyon',
    sub: 'Bathypelagic Slope (500 – 3,500 m)',
    defaultDepth: 1600,
    minDepth: 500,
    maxDepth: 3500,
    defaultTemp: 4.5,
    minTemp: 1.5,
    maxTemp: 10.0,
    defaultLight: 'none',
    defaultOxygen: 'standard_deep_water',
    defaultFood: 'marine_snow',
    description: 'Steep topographic chutes funneling intense internal tidal currents and concentrating downwelling organic aggregates.'
  },
  open_deep_sea_habitat: {
    id: 'open_deep_sea_habitat',
    label: 'Open Deep Sea',
    sub: 'Pelagic Water Column (1,000 – 4,000 m)',
    defaultDepth: 2200,
    minDepth: 1000,
    maxDepth: 4000,
    defaultTemp: 3.0,
    minTemp: 1.0,
    maxTemp: 6.0,
    defaultLight: 'bioluminescence_only',
    defaultOxygen: 'standard_deep_water',
    defaultFood: 'predatory_ambush',
    description: 'A boundless sunless mid-water realm with no surfaces; populated by neutrally buoyant drifters, gelatinous medusae, and ambush predators.'
  }
}

export const TheUnknown: React.FC<TheUnknownProps> = ({
  savedPredictions,
  onSavePrediction,
  onRemovePrediction,
  onShowToast
}) => {
  // Environmental input states
  const [environment, setEnvironment] = useState<EnvironmentType>('hadal_trench')
  const [depthMeters, setDepthMeters] = useState<number>(8400)
  const [temperature, setTemperature] = useState<number>(1.5)
  const [lightAvailability, setLightAvailability] = useState<LightAvailability>('none')
  const [oxygenAvailability, setOxygenAvailability] = useState<OxygenAvailability>('well_oxygenated_cold_plume')
  const [foodSource, setFoodSource] = useState<FoodSource>('benthic_sediment_detritus')

  // Real-time calculated pressure metrics
  const currentPressure = useMemo(() => calculateLocalPressure(depthMeters), [depthMeters])
  const [pressureUnit, setPressureUnit] = useState<'bar' | 'atm' | 'mpa'>('bar')

  // Prediction state
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [prediction, setPrediction] = useState<PredictedCreature | null>(null)
  const [activeModalCreature, setActiveModalCreature] = useState<PredictedCreature | null>(null)

  // Server health state
  const [serverStatus, setServerStatus] = useState<HealthCheckResult>({
    connected: false
  })

  // Check backend connectivity on mount
  useEffect(() => {
    checkBackendHealth().then((res) => {
      setServerStatus(res)
    })
  }, [])

  // When changing environment, update defaults sensibly
  const handleSelectEnvironment = (newEnv: EnvironmentType) => {
    setEnvironment(newEnv)
    const preset = PRESETS[newEnv]
    setDepthMeters(preset.defaultDepth)
    setTemperature(preset.defaultTemp)
    setLightAvailability(preset.defaultLight)
    setOxygenAvailability(preset.defaultOxygen)
    setFoodSource(preset.defaultFood)
  }

  // Handle Predict Creature action
  const handlePredict = useCallback(async (customSeed?: number) => {
    setLoading(true)
    setError(null)

    const inputs: EnvironmentalInputs = {
      environment,
      depthMeters,
      temperatureCelsius: temperature,
      lightAvailability,
      oxygenAvailability,
      foodSource
    }

    const seed = customSeed !== undefined ? customSeed : Math.floor(Math.random() * 100000)

    try {
      const res = await requestPrediction(inputs, seed)
      setPrediction(res.creature)
      if (res.isOfflineFallback) {
        onShowToast('Biological profile synthesized (Local simulation engine)')
      } else {
        onShowToast('New deep-sea creature prediction synthesized!')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Prediction request failed.'
      setError(msg)
      onShowToast('Could not synthesize creature prediction.')
    } finally {
      setLoading(false)
    }
  }, [environment, depthMeters, temperature, lightAvailability, oxygenAvailability, foodSource, onShowToast])

  // Is current prediction saved?
  const isCurrentSaved = useMemo(() => {
    if (!prediction) return false
    return savedPredictions.some((p) => p.id === prediction.id)
  }, [prediction, savedPredictions])

  const handleToggleSaveCurrent = () => {
    if (!prediction) return
    if (isCurrentSaved) {
      onRemovePrediction(prediction.id)
      onShowToast('Removed from your field journal')
    } else {
      onSavePrediction(prediction)
      onShowToast('Hypothetical specimen saved to your field journal!')
    }
  }

  const currentPreset = PRESETS[environment]

  return (
    <div className="the-unknown-page">
      {/* Hero Header */}
      <section className="unknown-hero">
        <div className="section-kicker">
          <span className="eyebrow-line" /> THE UNKNOWN / SCIENTIFIC SPECULATION ENGINE
        </div>
        <h1 className="page-title">
          Predict the <em>Undiscovered.</em>
        </h1>
        <p className="page-lead">
          Over 80% of the deep ocean floor remains unmapped and unexplored. Using empirical principles of deep-sea biophysics—hydrostatic pressure, cellular piezolytes, thermal gradients, and trophic scarcity—simulate biologically plausible hypothetical creatures that could inhabit the abyss.
        </p>

        {/* Server & Database Engine Status Banner */}
        <div className="engine-status-strip">
          <div className="status-indicator">
            <span className={`status-beacon ${serverStatus.connected ? 'online' : 'offline'}`} />
            <span>
              BACKEND:{' '}
              <strong>
                {serverStatus.connected ? 'REST API ONLINE (PORT 3001)' : 'STANDALONE LOCAL SIMULATOR'}
              </strong>
            </span>
            <span className="status-divider">·</span>
            <span>
              DATABASE:{' '}
              <strong>
                {serverStatus.database?.connected
                  ? 'MONGODB ATLAS CONNECTED'
                  : 'IN-MEMORY / LOCAL PERSISTENCE'}
              </strong>
            </span>
          </div>
          <span className="speculation-disclaimer">
            🔬 EDUCATIONAL SPECULATIVE SCIENCE · HYPOTHETICAL ORGANISMS
          </span>
        </div>
      </section>

      {/* Main Interactive Controls & Prediction Workspace */}
      <div className="unknown-workspace-grid">
        {/* Left Column: Environmental Parameter Controls */}
        <div className="controls-panel">
          <div className="panel-header">
            <h3>1. Environmental Conditions</h3>
            <span className="panel-step">FIELD PARAMETERS</span>
          </div>

          {/* Environment selector buttons */}
          <div className="form-group">
            <label className="input-label">OCEAN HABITAT MATRIX</label>
            <div className="preset-selector-grid">
              {(Object.keys(PRESETS) as EnvironmentType[]).map((key) => {
                const p = PRESETS[key]
                const isSelected = environment === key
                return (
                  <button
                    key={key}
                    type="button"
                    className={`preset-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => handleSelectEnvironment(key)}
                  >
                    <strong>{p.label}</strong>
                    <small>{p.sub}</small>
                  </button>
                )
              })}
            </div>
            <p className="field-hint">{currentPreset.description}</p>
          </div>

          {/* Depth Slider and Gauge */}
          <div className="form-group">
            <div className="label-with-value">
              <label className="input-label" htmlFor="depth-input">
                DEPTH: <strong>{depthMeters.toLocaleString()} m</strong>
              </label>
              <span className="value-tag">
                {depthMeters < 1000 ? 'Dysphotic' : depthMeters < 6000 ? 'Aphotic Abyssal' : 'Ultra-Hadal Trench'}
              </span>
            </div>
            <input
              id="depth-input"
              type="range"
              min={currentPreset.minDepth}
              max={currentPreset.maxDepth}
              step={50}
              value={depthMeters}
              onChange={(e) => setDepthMeters(Number(e.target.value))}
              className="slider-input"
            />
            <div className="slider-bounds">
              <span>{currentPreset.minDepth.toLocaleString()} m</span>
              <span>{currentPreset.maxDepth.toLocaleString()} m</span>
            </div>
          </div>

          {/* Hydrostatic Pressure Display with Gauge vs Absolute Explanation */}
          <div className="pressure-calc-box">
            <div className="pressure-header">
              <span className="pressure-title">HYDROSTATIC PRESSURE AT {depthMeters} M</span>
              <div className="unit-toggle">
                {(['bar', 'atm', 'mpa'] as const).map((u) => (
                  <button
                    key={u}
                    type="button"
                    className={`unit-btn ${pressureUnit === u ? 'active' : ''}`}
                    onClick={() => setPressureUnit(u)}
                  >
                    {u.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="pressure-values-row">
              <div className="pressure-val-card">
                <span>GAUGE PRESSURE (WATER COLUMN ONLY)</span>
                <strong>
                  {pressureUnit === 'bar'
                    ? `${currentPressure.gaugeBar} bar`
                    : pressureUnit === 'atm'
                    ? `${currentPressure.gaugeAtm} atm`
                    : `${currentPressure.gaugeMpa} MPa`}
                </strong>
              </div>
              <div className="pressure-val-card highlighted">
                <span>ABSOLUTE PRESSURE (+ 1 ATM SURFACE LOAD)</span>
                <strong>
                  {pressureUnit === 'bar'
                    ? `${currentPressure.absoluteBar} bar`
                    : pressureUnit === 'atm'
                    ? `${currentPressure.absoluteAtm} atm`
                    : `${currentPressure.absoluteMpa} MPa`}
                </strong>
              </div>
            </div>
            <p className="pressure-note">
              ℹ <strong>Physics Note:</strong> Gauge pressure measures the mechanical force exerted solely by the water column above. Absolute pressure accounts for the atmospheric pressure at sea level resting upon the ocean. At this depth, protein folding requires cellular TMAO osmolytes.
            </p>
          </div>

          {/* Temperature Slider */}
          <div className="form-group">
            <div className="label-with-value">
              <label className="input-label" htmlFor="temp-input">
                WATER TEMPERATURE: <strong>{temperature.toFixed(1)} °C</strong>
              </label>
              <span className="value-tag">
                {temperature <= 2 ? 'Near-freezing Polar Water' : temperature > 15 ? 'Vent Mixing Boundary' : 'Isothermal Deep Sea'}
              </span>
            </div>
            <input
              id="temp-input"
              type="range"
              min={currentPreset.minTemp}
              max={currentPreset.maxTemp}
              step={0.5}
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="slider-input"
            />
            <div className="slider-bounds">
              <span>{currentPreset.minTemp.toFixed(1)} °C</span>
              <span>{currentPreset.maxTemp.toFixed(1)} °C</span>
            </div>
            {environment === 'hydrothermal_vents' && (
              <small className="thermal-callout">
                ♨ <strong>Vent Science:</strong> Fluid exits chimneys at ~350°C, but animals live in the turbulent perimeter mixing with 2°C seawater. Extreme species survive up to ~38°C–40°C.
              </small>
            )}
          </div>

          {/* Light, Oxygen, and Food Source Grid */}
          <div className="form-row-three">
            <div className="form-group">
              <label className="input-label">LIGHT AVAILABILITY</label>
              <select
                value={lightAvailability}
                onChange={(e) => setLightAvailability(e.target.value as LightAvailability)}
                className="select-field"
              >
                <option value="none">None (Total Aphotic Darkness)</option>
                <option value="bioluminescence_only">Bioluminescence Only</option>
                <option value="weak_residual">Weak Residual Sunlight</option>
                <option value="geothermal_glow">Geothermal Chimney Glow</option>
              </select>
            </div>

            <div className="form-group">
              <label className="input-label">OXYGEN AVAILABILITY</label>
              <select
                value={oxygenAvailability}
                onChange={(e) => setOxygenAvailability(e.target.value as OxygenAvailability)}
                className="select-field"
              >
                <option value="standard_deep_water">Standard Deep Water (3–5 ml/L)</option>
                <option value="oxygen_minimum_zone">Oxygen Minimum Zone (&lt; 1 ml/L)</option>
                <option value="well_oxygenated_cold_plume">Cold Plume (&gt; 5.5 ml/L)</option>
                <option value="anoxic">Anoxic (&lt; 0.1 ml/L)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="input-label">FOOD & TROPHIC SOURCE</label>
              <select
                value={foodSource}
                onChange={(e) => setFoodSource(e.target.value as FoodSource)}
                className="select-field"
              >
                <option value="marine_snow">Marine Snow (POC Flux)</option>
                <option value="chemosynthetic_microbes">Chemosynthetic Microbes</option>
                <option value="whale_falls_and_carrion">Whale Falls & Large Carrion</option>
                <option value="predatory_ambush">Predatory Ambush</option>
                <option value="benthic_sediment_detritus">Benthic Sediment Detritus</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="predict-actions">
            <button
              type="button"
              className="button button-primary predict-main-btn"
              onClick={() => handlePredict()}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="sonar-spinner" /> SYNTHESIZING BIOLOGICAL PROFILE…
                </>
              ) : (
                <>
                  PREDICT A CREATURE <span>↘</span>
                </>
              )}
            </button>

            {prediction && (
              <button
                type="button"
                className="button button-ghost"
                onClick={() => handlePredict(Math.floor(Math.random() * 1000000))}
                disabled={loading}
              >
                GENERATE ANOTHER CREATURE ↻
              </button>
            )}
          </div>

          {error && <div className="error-banner">⚠ {error}</div>}
        </div>

        {/* Right Column: Predicted Specimen Dossier */}
        <div className="results-panel">
          <div className="panel-header">
            <h3>2. Predicted Biological Profile</h3>
            <span className="panel-step">SPECIMEN HYPOTHESIS</span>
          </div>

          {loading ? (
            <div className="loading-state-card">
              <div className="radar-animation">
                <span className="radar-sweep" />
                <span className="radar-center" />
              </div>
              <h4>Simulating Evolutionary Pressures…</h4>
              <p>
                Calculating protein barotolerance, membrane desaturase ratios, sensory organ adaptations, and trophic energetics for {depthMeters} m depth.
              </p>
            </div>
          ) : prediction ? (
            <article className="creature-profile-card">
              {/* Uncertainty Flag */}
              <div className="profile-uncertainty-banner">
                <span className="banner-icon">⚠</span>
                <div>
                  <strong>HYPOTHETICAL EVOLUTIONARY PREDICTION</strong>
                  <span>Based on known marine biophysics. Not a documented real discovery.</span>
                </div>
              </div>

              {/* Specimen Illustration / Concept Art */}
              <div className="profile-illustration-wrap">
                <CreatureIllustration creature={prediction} />
              </div>

              {/* Specimen Identity */}
              <div className="profile-body">
                <div className="specimen-id-row">
                  <span className="specimen-id-tag">SPECIMEN DOSSIER #{prediction.id.slice(-6).toUpperCase()}</span>
                  <button
                    type="button"
                    className={`save-journal-btn ${isCurrentSaved ? 'saved' : ''}`}
                    onClick={handleToggleSaveCurrent}
                  >
                    {isCurrentSaved ? '★ Saved to Field Journal' : '☆ Save to Journal'}
                  </button>
                </div>

                <h2 className="specimen-name">{prediction.name}</h2>
                <div className="scientific specimen-scientific">{prediction.scientificName}</div>

                <p className="specimen-overview">{prediction.appearance}</p>

                {/* Key Specimen Attributes Grid */}
                <div className="specimen-traits-grid">
                  <div>
                    <span>BODY ARCHETYPE</span>
                    <strong>{prediction.bodyPlan}</strong>
                  </div>
                  <div>
                    <span>ESTIMATED SIZE</span>
                    <strong>{prediction.estimatedSize}</strong>
                  </div>
                  <div>
                    <span>ESTIMATED DEPTH</span>
                    <strong>{prediction.depthRange}</strong>
                  </div>
                  <div>
                    <span>WATER TEMPERATURE</span>
                    <strong>{prediction.temperatureRange}</strong>
                  </div>
                </div>

                {/* Sensory & Bioluminescence */}
                <div className="trait-detail-box">
                  <div className="trait-detail-title">SENSORY ADAPTATIONS</div>
                  <p>{prediction.sensoryAdaptations}</p>
                </div>

                <div className="trait-detail-box">
                  <div className="trait-detail-title">BIOLUMINESCENT SYSTEM</div>
                  <p>
                    {prediction.bioluminescence.present ? (
                      <>
                        <strong>Mechanism:</strong> {prediction.bioluminescence.mechanism} ({prediction.bioluminescence.wavelengthAndColor}).<br />
                        <strong>Ecological Role:</strong> {prediction.bioluminescence.function}
                      </>
                    ) : (
                      prediction.bioluminescence.function
                    )}
                  </p>
                </div>

                {/* Cellular & Biochemical Adaptations */}
                <div className="trait-detail-box">
                  <div className="trait-detail-title">CELLULAR & BIOCHEMICAL PIEZOLYTES</div>
                  <ul className="specimen-list">
                    {prediction.cellularAndBiochemicalAdaptations.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Biological Rationale Callout */}
                <div className="fact-box biological-rationale-box">
                  <span>✳ WHY THESE ENVIRONMENTAL CONDITIONS FAVOUR THESE TRAITS</span>
                  <p>{prediction.biologicalRationale}</p>
                </div>

                {/* Real Inspiration Species */}
                <div className="inspirations-section">
                  <div className="trait-detail-title">REAL BIOLOGICAL INSPIRATIONS & CITATIONS</div>
                  <div className="inspirations-list">
                    {prediction.inspirationSpecies.map((sp, idx) => (
                      <div key={idx} className="inspiration-item">
                        <div className="inspiration-head">
                          <strong>{sp.commonName}</strong> (<em>{sp.scientificName}</em>)
                        </div>
                        <p className="inspiration-body">{sp.keyAdaptation}</p>
                        <cite className="inspiration-source">
                          {sp.citation}{' '}
                          {sp.referenceUrl && (
                            <a
                              href={sp.referenceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="cite-link"
                            >
                              View Paper ↗
                            </a>
                          )}
                        </cite>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Uncertainties & Scientific Caveats */}
                <div className="uncertainties-section">
                  <div className="trait-detail-title">SCIENTIFIC UNCERTAINTIES</div>
                  <ul className="uncertainties-bullets">
                    {prediction.uncertainties.map((u, idx) => (
                      <li key={idx}>{u}</li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="profile-action-footer">
                  <button
                    type="button"
                    className="button button-primary"
                    onClick={() => setActiveModalCreature(prediction)}
                  >
                    Open Full Dossier ↗
                  </button>
                  <button
                    type="button"
                    className="button button-ghost"
                    onClick={handleToggleSaveCurrent}
                  >
                    {isCurrentSaved ? '★ Saved in Logbook' : '☆ Save in Field Journal'}
                  </button>
                  <button
                    type="button"
                    className="button button-ghost"
                    onClick={() => handlePredict(Math.floor(Math.random() * 1000000))}
                  >
                    Generate Another Plausible Profile ↻
                  </button>
                </div>
              </div>
            </article>
          ) : (
            <div className="empty-prediction-state">
              <span className="empty-symbol">☍</span>
              <h3>No Creature Predicted Yet</h3>
              <p>
                Configure the ocean depth, temperature, and habitat matrix on the left, then click <strong>"Predict a Creature"</strong> to generate a scientifically plausible hypothetical deep-sea organism.
              </p>
              <button
                type="button"
                className="button button-primary"
                onClick={() => handlePredict()}
              >
                Launch Prediction <span>↘</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Full Dossier Modal */}
      {activeModalCreature && (
        <UnknownModal
          creature={activeModalCreature}
          onClose={() => setActiveModalCreature(null)}
          isSaved={savedPredictions.some((p) => p.id === activeModalCreature.id)}
          onToggleSave={(c) => {
            if (savedPredictions.some((p) => p.id === c.id)) {
              onRemovePrediction(c.id)
              onShowToast('Removed from your field journal')
            } else {
              onSavePrediction(c)
              onShowToast('Hypothetical specimen saved to your field journal!')
            }
          }}
        />
      )}
    </div>
  )
}

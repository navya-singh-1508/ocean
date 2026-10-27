import React, { useState, useMemo } from 'react'
import type { Creature } from '../types'

interface DepthSimulatorProps {
  speciesList: Creature[]
  onSelectCreature: (creature: Creature) => void
}

interface LandmarkPreset {
  name: string
  depth: number
  description: string
}

const LANDMARKS: LandmarkPreset[] = [
  { name: 'Surface', depth: 0, description: 'Sunlit open waters, waves, and surface atmospheric breathing.' },
  { name: 'Coral Reef Floor', depth: 40, description: 'Vibrant photic zones with symbiotic coral calcification.' },
  { name: 'Photic Floor', depth: 200, description: 'The boundary where 99% of sunlight has been absorbed.' },
  { name: 'Scuba Record', depth: 332, description: 'Deepest scuba dive in human history (Ahmed Gabr, 2014).' },
  { name: 'Twilight Mesopelagic', depth: 800, description: 'Faint blue twilight photons; counterillumination realm.' },
  { name: 'Sperm Whale Hunt', depth: 1500, description: 'Extreme bathypelagic dives hunting giant squids in total darkness.' },
  { name: 'Titanic Wreck', depth: 3800, description: 'Sunken in 1912 on the North Atlantic abyssal plain.' },
  { name: 'Abyssal Plain', depth: 5000, description: 'Endless sediment plains covering 60% of Earth’s surface.' },
  { name: 'Challenger Deep', depth: 10928, description: 'Deepest point on Earth (Mariana Trench). 1,099 bar crushing pressure.' }
]

function getZoneByDepth(meters: number): { name: string; class: string; icon: string } {
  if (meters <= 200) return { name: 'Sunlight zone (Epipelagic)', class: 'zone-sun', icon: '☀' }
  if (meters <= 1000) return { name: 'Twilight zone (Mesopelagic)', class: 'zone-twilight', icon: '◐' }
  if (meters <= 4000) return { name: 'Midnight zone (Bathypelagic)', class: 'zone-midnight', icon: '☾' }
  if (meters <= 6000) return { name: 'Abyssal zone (Abyssopelagic)', class: 'zone-abyss', icon: '✦' }
  return { name: 'Hadal zone (Hadalpelagic Trenches)', class: 'zone-hadal', icon: '▼' }
}

function calculatePressureBar(meters: number): number {
  // P = 1 atm + (density * g * depth / 100,000)
  // rho = 1025 kg/m^3, g = 9.80665
  return Math.round((1 + (1025 * 9.80665 * meters) / 100000) * 10) / 10
}

function calculateTemperature(meters: number): number {
  if (meters <= 100) return 26
  if (meters <= 200) return 18
  if (meters <= 500) return 10
  if (meters <= 1000) return 5
  if (meters <= 3000) return 3
  if (meters <= 6000) return 2
  return 1.4
}

function calculateLightPercent(meters: number): number {
  if (meters === 0) return 100
  if (meters >= 1000) return 0
  if (meters >= 200) return Math.max(0.1, Number((1 - (meters - 200) / 800).toFixed(1)))
  return Math.max(1, Math.round(100 - (meters / 200) * 99))
}

export function DepthSimulator({ speciesList, onSelectCreature }: DepthSimulatorProps) {
  const [depth, setDepth] = useState<number>(800)

  const pressureBar = calculatePressureBar(depth)
  const pressureAtm = Math.round(pressureBar * 0.9869)
  const pressurePsi = Math.round(pressureBar * 14.5038)
  const temperatureC = calculateTemperature(depth)
  const temperatureF = Math.round((temperatureC * 9) / 5 + 32)
  const lightPercent = calculateLightPercent(depth)
  const zoneInfo = getZoneByDepth(depth)

  // Find species that overlap this depth
  const sightedSpecies = useMemo(() => {
    return speciesList.filter((sp) => {
      const min = sp.environmentalConditions?.pressureRange ? 0 : 0
      // Match using depth string parsing or simple zone heuristics
      if (depth <= 200 && (sp.zone === 'Sunlight zone' || sp.depth.includes('0–') || sp.depth.includes('Surface'))) return true
      if (depth > 200 && depth <= 1000 && (sp.zone === 'Twilight zone' || sp.depth.includes('1,000') || sp.depth.includes('800') || sp.depth.includes('600'))) return true
      if (depth > 1000 && depth <= 4000 && (sp.zone === 'Midnight zone' || sp.depth.includes('3,000') || sp.depth.includes('4,000') || sp.depth.includes('2,000'))) return true
      if (depth > 4000 && depth <= 6000 && (sp.zone === 'Abyssal zone' || sp.depth.includes('4,700') || sp.depth.includes('7,000'))) return true
      if (depth > 6000 && (sp.zone === 'Hadal zone' || sp.depth.includes('8,200') || sp.depth.includes('7,200'))) return true
      return false
    })
  }, [depth, speciesList])

  // Submersible visual water gradient
  const depthFraction = Math.min(1, depth / 11000)
  const waterColor = depth <= 200
    ? `rgba(0, 168, 204, ${0.15 + (depth / 200) * 0.2})`
    : depth <= 1000
    ? `rgba(6, 40, 80, ${0.4 + (depth / 1000) * 0.3})`
    : `rgba(2, 8, 16, ${0.7 + depthFraction * 0.28})`

  return (
    <div className="depth-simulator-card" style={{ background: `linear-gradient(180deg, #071926 0%, ${waterColor} 100%)` }}>
      <div className="depth-sim-header">
        <div>
          <span className="section-kicker">INTERACTIVE SUBMERSIBLE DESCENT MODULE</span>
          <h2 className="depth-sim-title">Virtual Depth Explorer</h2>
          <p className="depth-sim-sub">
            Scrub through the ocean column from sea level to the bottom of Challenger Deep. Experience real-time hydrostatic pressure, temperature drop, and organism sightings.
          </p>
        </div>
        <div className="submersible-badge">
          <span className="sub-icon">⚓</span>
          <div>
            <strong>SUBMERSIBLE HULL</strong>
            <span>{pressureBar > 600 ? 'TITANIUM CRUSH THRESHOLD' : pressureBar > 200 ? 'DEEP PRESSURE REINFORCED' : 'NORMAL STRESS LEVEL'}</span>
          </div>
        </div>
      </div>

      {/* Main Depth Scrubber */}
      <div className="depth-slider-container">
        <div className="depth-readout-row">
          <div className="depth-big-metric">
            <span className="depth-number">{depth.toLocaleString()}</span>
            <span className="depth-unit">METRES</span>
            <small className="depth-feet">({Math.round(depth * 3.28084).toLocaleString()} FEET)</small>
          </div>
          <div className={`depth-zone-pill ${zoneInfo.class}`}>
            <span>{zoneInfo.icon}</span> {zoneInfo.name}
          </div>
        </div>

        <input
          type="range"
          min="0"
          max="11000"
          step="25"
          value={depth}
          onChange={(e) => setDepth(Number(e.target.value))}
          className="depth-range-slider"
          aria-label="Ocean depth selector in metres"
        />

        {/* Depth Markers Line */}
        <div className="depth-ticks">
          <span>0m (Surface)</span>
          <span>200m</span>
          <span>1,000m</span>
          <span>4,000m</span>
          <span>6,000m</span>
          <span>11,000m (Mariana)</span>
        </div>
      </div>

      {/* Preset Landmark Buttons */}
      <div className="landmarks-tray">
        <span className="landmarks-label">DESCENT PRESETS:</span>
        <div className="landmarks-scroll">
          {LANDMARKS.map((item) => (
            <button
              key={item.name}
              className={`landmark-chip ${depth === item.depth ? 'active' : ''}`}
              onClick={() => setDepth(item.depth)}
            >
              <strong>{item.name}</strong>
              <small>{item.depth}m</small>
            </button>
          ))}
        </div>
      </div>

      {/* Real-time Physics Instruments Grid */}
      <div className="telemetry-grid">
        <div className="telemetry-cell">
          <span className="telemetry-title">HYDROSTATIC PRESSURE</span>
          <strong className="telemetry-val">{pressureBar.toLocaleString()} <small>BAR</small></strong>
          <span className="telemetry-detail">{pressureAtm.toLocaleString()} atm · {pressurePsi.toLocaleString()} PSI</span>
        </div>

        <div className="telemetry-cell">
          <span className="telemetry-title">WATER TEMPERATURE</span>
          <strong className="telemetry-val">{temperatureC.toFixed(1)} <small>°C</small></strong>
          <span className="telemetry-detail">{temperatureF}°F ambient thermal equilibrium</span>
        </div>

        <div className="telemetry-cell">
          <span className="telemetry-title">SOLAR ILLUMINATION</span>
          <strong className="telemetry-val">{lightPercent}%</strong>
          <span className="telemetry-detail">{depth >= 1000 ? 'Total aphotic darkness' : depth >= 200 ? 'Faint residual dysphotic light' : 'Full euphotic daylight'}</span>
        </div>

        <div className="telemetry-cell">
          <span className="telemetry-title">HULL COMPRESSION</span>
          <strong className="telemetry-val">{Math.min(100, Math.round((depth / 11000) * 100))}% <small>MAX</small></strong>
          <span className="telemetry-detail">
            {depth > 6000 ? 'Requires spherical syntactic titanium' : depth > 1000 ? 'Extreme acrylic bathysphere' : 'Standard atmospheric diving'}
          </span>
        </div>
      </div>

      {/* Species Sighted at this Depth */}
      <div className="sightings-section">
        <div className="sightings-head">
          <div className="section-kicker">FAUNA SIGHTINGS · DEPTH PROFILE {depth} METRES</div>
          <h3>Documented Marine Life at this Layer ({sightedSpecies.length})</h3>
        </div>

        {sightedSpecies.length > 0 ? (
          <div className="sightings-grid">
            {sightedSpecies.map((sp) => (
              <button
                key={sp.id}
                className="sighting-card"
                onClick={() => onSelectCreature(sp)}
                title={`Open ${sp.name} field notes`}
              >
                <img src={sp.image} alt={sp.name} loading="lazy" onError={(e) => { const img = e.currentTarget; img.onerror = null; img.style.background='linear-gradient(180deg,#041c2c,#08293b)'; img.style.objectFit='contain'; img.src='data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="60"><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-size="28">🦑</text></svg>'; }} />
                <div className="sighting-info">
                  <strong>{sp.name}</strong>
                  <em>{sp.scientific}</em>
                  <span className="sighting-depth">{sp.depth}</span>
                </div>
                <span className="sighting-open">↗</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="sightings-empty">
            <span>⚓</span> No specific baseline species profile anchored exactly at this single depth point. Many deep organisms vertically migrate thousands of metres each night during the Diel Vertical Migration.
          </div>
        )}
      </div>
    </div>
  )
}

import React from 'react'
import type { PredictedCreature } from '../types'

interface CreatureIllustrationProps {
  creature: PredictedCreature
  className?: string
}

export const CreatureIllustration: React.FC<CreatureIllustrationProps> = ({ creature, className = '' }) => {
  // If an AI image was generated, render the image with caption badge
  if (creature.imageUrl && creature.imageStatus === 'generated') {
    return (
      <div className={`creature-illustration-container ${className}`}>
        <div className="illustration-badge ai-badge">
          <span className="badge-dot ai-dot" /> AI-GENERATED VISUAL CONCEPT
        </div>
        <img
          src={creature.imageUrl}
          alt={creature.name}
          className="creature-ai-image"
          loading="lazy"
        />
        <div className="illustration-depth-tag">
          DEPTH: {creature.depthMeters.toLocaleString()} M · P_ABS: {creature.pressureMetrics.absoluteBar} BAR
        </div>
      </div>
    )
  }

  // Otherwise, render a rich, procedural SVG scientific specimen plate
  const isBioluminescent = creature.bioluminescence.present
  const glowColor = creature.bioluminescence.wavelengthAndColor.includes('Cobalt')
    ? '#4d94ff'
    : creature.bioluminescence.wavelengthAndColor.includes('Cyan')
    ? '#40e0d0'
    : '#73e2e0'

  const env = creature.environmentType
  const isVent = env === 'hydrothermal_vents'
  const isHadal = creature.depthMeters >= 6000
  const isTripod = creature.bodyPlan.toLowerCase().includes('stilt') || creature.bodyPlan.toLowerCase().includes('tripod')
  const isCephalopod = creature.bodyPlan.toLowerCase().includes('cephalopod') || creature.bodyPlan.toLowerCase().includes('vampyro')
  const isCrustacean = creature.bodyPlan.toLowerCase().includes('chitinous') || creature.bodyPlan.toLowerCase().includes('isopod') || creature.bodyPlan.toLowerCase().includes('decapod')

  // Background gradient depending on environment
  const bgGradient = isVent
    ? 'linear-gradient(180deg, #180905 0%, #291206 45%, #081a24 100%)'
    : isHadal
    ? 'linear-gradient(180deg, #020b12 0%, #031522 55%, #01070b 100%)'
    : 'linear-gradient(180deg, #041c2c 0%, #08293b 50%, #02111b 100%)'

  return (
    <div className={`creature-illustration-container ${className}`} style={{ background: bgGradient }}>
      <div className="illustration-badge concept-badge">
        <span className="badge-dot vector-dot" /> SPECULATIVE CONCEPT ART (PROCEDURAL VECTOR)
      </div>

      <svg
        viewBox="0 0 600 360"
        className="creature-svg-canvas"
        role="img"
        aria-label={`Scientific anatomical diagram of ${creature.scientificName}`}
      >
        <defs>
          {/* Bioluminescent glow filter */}
          <filter id="bioglow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Dermis gradient */}
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            {isVent ? (
              <>
                <stop offset="0%" stopColor="#d9534f" />
                <stop offset="50%" stopColor="#8c2f2d" />
                <stop offset="100%" stopColor="#301515" />
              </>
            ) : isHadal ? (
              <>
                <stop offset="0%" stopColor="#f3cdd7" stopOpacity="0.85" />
                <stop offset="60%" stopColor="#a3768b" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#432a39" stopOpacity="0.8" />
              </>
            ) : isCrustacean ? (
              <>
                <stop offset="0%" stopColor="#7a96a3" />
                <stop offset="50%" stopColor="#46626f" />
                <stop offset="100%" stopColor="#1e2e36" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#2c5b73" />
                <stop offset="50%" stopColor="#16374a" />
                <stop offset="100%" stopColor="#081b26" />
              </>
            )}
          </linearGradient>

          {/* Grid pattern for field specimen blueprint feel */}
          <pattern id="specimenGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(115,226,224,0.06)" strokeWidth="0.8" />
          </pattern>
        </defs>

        {/* Specimen grid background */}
        <rect width="600" height="360" fill="url(#specimenGrid)" />

        {/* Marine snow particles / water column turbulence */}
        <g opacity="0.3">
          <circle cx="80" cy="50" r="1.5" fill="#aee8f5" />
          <circle cx="140" cy="190" r="1.2" fill="#aee8f5" />
          <circle cx="210" cy="70" r="2" fill="#aee8f5" />
          <circle cx="340" cy="40" r="1.5" fill="#aee8f5" />
          <circle cx="480" cy="110" r="1.8" fill="#aee8f5" />
          <circle cx="530" cy="280" r="1.2" fill="#aee8f5" />
          <circle cx="70" cy="310" r="1.5" fill="#aee8f5" />
          <circle cx="290" cy="330" r="1.7" fill="#aee8f5" />
        </g>

        {/* Hydrothermal vent plume background if vent environment */}
        {isVent && (
          <g opacity="0.45">
            <path d="M 60 360 Q 90 240 130 140 Q 170 60 210 20" stroke="#ff8533" strokeWidth="24" fill="none" strokeLinecap="round" filter="url(#bioglow)" opacity="0.3" />
            <path d="M 70 360 Q 80 260 110 180" stroke="#ffd280" strokeWidth="8" fill="none" strokeLinecap="round" />
            <rect x="40" y="290" width="60" height="70" fill="#2d221c" rx="4" />
          </g>
        )}

        {/* Procedural Creature Morphologies */}
        {isVent ? (
          /* Chemosynthetic Tubeworm / Vent Shrimp form */
          <g transform="translate(180, 40)">
            {/* Clustered mineralized tubes */}
            <path d="M 40 280 Q 55 180 70 90" stroke="#f0ebe1" strokeWidth="22" strokeLinecap="round" fill="none" />
            <path d="M 90 280 Q 95 190 110 110" stroke="#ded5c5" strokeWidth="18" strokeLinecap="round" fill="none" />
            <path d="M 135 280 Q 130 200 140 130" stroke="#cdc3af" strokeWidth="16" strokeLinecap="round" fill="none" />

            {/* Radiant Scarlet Branchial Plume */}
            <path d="M 70 90 Q 75 40 60 15 Q 85 45 90 90" fill="#e62020" filter="url(#bioglow)" />
            <path d="M 68 85 Q 90 35 110 25 Q 100 65 95 95" fill="#ff4d4d" filter="url(#bioglow)" />
            <path d="M 110 110 Q 125 60 140 40 Q 130 80 120 115" fill="#e62020" filter="url(#bioglow)" />

            {/* Mineral encrustations */}
            <circle cx="52" cy="190" r="4" fill="#a77942" />
            <circle cx="102" cy="220" r="5" fill="#4d4239" />
          </g>
        ) : isHadal ? (
          /* Hadal Snailfish morphology: gelatinous, tapering, translucent */
          <g transform="translate(90, 80)">
            {/* Soft fins */}
            <path d="M 190 90 Q 280 40 370 70 Q 340 95 240 105 Z" fill="rgba(243,205,215,0.3)" />
            <path d="M 210 130 Q 300 170 380 120 Q 330 115 250 115 Z" fill="rgba(243,205,215,0.25)" />

            {/* Main Tadpole Teleost Body */}
            <path
              d="M 60 100 C 60 50, 140 45, 190 65 C 270 95, 340 95, 410 95 C 415 97, 415 103, 410 105 C 340 105, 270 105, 190 135 C 130 155, 60 145, 60 100 Z"
              fill="url(#bodyGrad)"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1.5"
            />

            {/* Visible liver / visceral organ through translucent hadal skin */}
            <ellipse cx="145" cy="105" rx="30" ry="18" fill="#4a1e2f" opacity="0.75" />

            {/* Cartilaginous skull lines (reduced calcification) */}
            <path d="M 85 85 Q 120 75 140 90" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" fill="none" strokeDasharray="3,3" />

            {/* Subcutaneous degenerate/microphthalmic eye */}
            <circle cx="95" cy="88" r="4" fill="#1b0811" stroke="#f3cdd7" strokeWidth="1" />
            <circle cx="96" cy="87" r="1.5" fill="#5c263d" />

            {/* Lateral line mechanosensory pores */}
            <path d="M 120 98 Q 230 92 360 97" stroke="#73e2e0" strokeWidth="1" strokeDasharray="2,4" fill="none" opacity="0.8" />
          </g>
        ) : isTripod ? (
          /* Abyssal Tripod Stilt Walker */
          <g transform="translate(100, 40)">
            {/* Long Stilt Rays descending to sediment */}
            <line x1="160" y1="140" x2="110" y2="290" stroke="#73e2e0" strokeWidth="2.5" opacity="0.9" filter="url(#bioglow)" />
            <line x1="200" y1="140" x2="220" y2="290" stroke="#73e2e0" strokeWidth="2.5" opacity="0.9" filter="url(#bioglow)" />
            <line x1="360" y1="125" x2="390" y2="290" stroke="#73e2e0" strokeWidth="2.5" opacity="0.9" filter="url(#bioglow)" />

            {/* Abyssal ooze sediment line */}
            <line x1="-30" y1="290" x2="430" y2="290" stroke="#254756" strokeWidth="2" strokeDasharray="4,6" />

            {/* Slender fish body elevated above benthic boundary layer */}
            <path
              d="M 90 120 C 120 100, 200 95, 320 115 L 370 125 L 320 135 C 200 145, 120 140, 90 120 Z"
              fill="url(#bodyGrad)"
              stroke="#73e2e0"
              strokeWidth="1.2"
            />
            {/* Pectoral tactile ray sensors held forward */}
            <path d="M 140 115 Q 100 80 70 50" stroke="#73e2e0" strokeWidth="1.5" fill="none" opacity="0.9" />
            <circle cx="70" cy="50" r="3" fill="#73e2e0" filter="url(#bioglow)" />

            {/* Eye */}
            <circle cx="115" cy="115" r="5" fill="#03111b" stroke="#73e2e0" strokeWidth="1" />
            <circle cx="116" cy="114" r="2" fill="#73e2e0" />
          </g>
        ) : isCephalopod ? (
          /* Vampyromorphic / Gelatinous Cephalopod */
          <g transform="translate(150, 60)">
            {/* Webbed arms */}
            <path d="M 150 160 Q 100 240 80 270 Q 130 230 150 180" fill="rgba(120,40,70,0.6)" />
            <path d="M 150 170 Q 140 250 150 280 Q 165 240 160 180" fill="rgba(140,50,85,0.7)" />
            <path d="M 160 170 Q 210 245 230 270 Q 190 220 165 180" fill="rgba(120,40,70,0.6)" />

            {/* Long retractile sensory filaments */}
            <path d="M 140 180 Q 70 230 40 290" stroke="#73e2e0" strokeWidth="1.2" strokeDasharray="3,3" fill="none" />
            <path d="M 170 180 Q 240 230 270 290" stroke="#73e2e0" strokeWidth="1.2" strokeDasharray="3,3" fill="none" />

            {/* Gelatinous Bell Mantle */}
            <path
              d="M 110 160 C 90 90, 120 40, 155 35 C 190 40, 220 90, 200 160 Z"
              fill="url(#bodyGrad)"
              stroke="rgba(243,205,215,0.5)"
              strokeWidth="1.5"
            />

            {/* Glowing arm-tip photophores */}
            <circle cx="80" cy="270" r="4" fill={glowColor} filter="url(#bioglow)" />
            <circle cx="150" cy="280" r="4" fill={glowColor} filter="url(#bioglow)" />
            <circle cx="230" cy="270" r="4" fill={glowColor} filter="url(#bioglow)" />

            {/* Deep red sensory eye */}
            <circle cx="135" cy="140" r="7" fill="#1f070d" stroke="#f3cdd7" strokeWidth="1" />
            <circle cx="136" cy="139" r="3" fill="#ff4d6d" />
            <circle cx="175" cy="140" r="7" fill="#1f070d" stroke="#f3cdd7" strokeWidth="1" />
            <circle cx="174" cy="139" r="3" fill="#ff4d6d" />
          </g>
        ) : isCrustacean ? (
          /* Giant Abyssal Isopod / Gigantostracan */
          <g transform="translate(130, 70)">
            {/* Segmented Carapace Tergites */}
            <path d="M 120 60 C 160 40, 200 40, 240 60 L 230 85 L 130 85 Z" fill="#607d8b" stroke="#37474f" strokeWidth="1.5" />
            <path d="M 115 90 L 245 90 L 240 115 L 120 115 Z" fill="#546e7a" stroke="#37474f" strokeWidth="1.5" />
            <path d="M 110 120 L 250 120 L 245 145 L 115 145 Z" fill="#455a64" stroke="#37474f" strokeWidth="1.5" />
            <path d="M 115 150 L 245 150 L 235 175 L 125 175 Z" fill="#37474f" stroke="#263238" strokeWidth="1.5" />
            <path d="M 125 180 L 235 180 L 220 205 L 140 205 Z" fill="#263238" stroke="#101518" strokeWidth="1.5" />

            {/* Articulated Pereopods (Walking Legs) */}
            <path d="M 115 95 L 80 110 L 65 130" stroke="#78909c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 110 125 L 75 140 L 60 165" stroke="#78909c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 115 155 L 80 170 L 70 195" stroke="#78909c" strokeWidth="2.5" fill="none" strokeLinecap="round" />

            <path d="M 245 95 L 280 110 L 295 130" stroke="#78909c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 250 125 L 285 140 L 300 165" stroke="#78909c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 245 155 L 280 170 L 290 195" stroke="#78909c" strokeWidth="2.5" fill="none" strokeLinecap="round" />

            {/* Large triangular sessile compound eyes */}
            <polygon points="140,55 160,50 150,70" fill="#0d1b22" stroke="#b0bec5" strokeWidth="1" />
            <polygon points="220,55 200,50 210,70" fill="#0d1b22" stroke="#b0bec5" strokeWidth="1" />
          </g>
        ) : (
          /* Bathypelagic Predator / Viper-Swallower Morphology */
          <g transform="translate(100, 70)">
            {/* Sinuous body */}
            <path
              d="M 80 100 Q 150 70 230 105 Q 310 135 390 110 Q 320 145 230 125 Q 150 105 80 120 Z"
              fill="url(#bodyGrad)"
              stroke="rgba(115,226,224,0.4)"
              strokeWidth="1.5"
            />

            {/* Enormous distensible lower jaw */}
            <path d="M 80 100 Q 55 125 50 145 Q 85 140 115 120 Z" fill="#0b1b24" stroke="#73e2e0" strokeWidth="1.2" />

            {/* Hinged fang teeth */}
            <line x1="60" y1="102" x2="62" y2="125" stroke="#fff" strokeWidth="1.5" />
            <line x1="72" y1="102" x2="74" y2="122" stroke="#fff" strokeWidth="1.5" />
            <line x1="56" y1="140" x2="58" y2="115" stroke="#fff" strokeWidth="1.5" />
            <line x1="68" y1="138" x2="70" y2="117" stroke="#fff" strokeWidth="1.5" />

            {/* Bioluminescent lure (esca) dangling from dorsal spine */}
            <path d="M 95 85 Q 70 30 50 55" stroke="#73e2e0" strokeWidth="1.5" fill="none" />
            <circle cx="50" cy="55" r="5" fill={glowColor} filter="url(#bioglow)" />

            {/* Tubular eye */}
            <circle cx="85" cy="90" r="5" fill="#03111b" stroke="#73e2e0" strokeWidth="1" />
            <circle cx="86" cy="89" r="2" fill="#73e2e0" />

            {/* Ventral photophore array (counter-illumination row) */}
            {isBioluminescent && (
              <g filter="url(#bioglow)">
                <circle cx="110" cy="118" r="2.2" fill={glowColor} />
                <circle cx="130" cy="116" r="2.2" fill={glowColor} />
                <circle cx="150" cy="115" r="2.2" fill={glowColor} />
                <circle cx="170" cy="116" r="2.2" fill={glowColor} />
                <circle cx="190" cy="119" r="2.2" fill={glowColor} />
                <circle cx="210" cy="122" r="2.2" fill={glowColor} />
                <circle cx="230" cy="124" r="2.2" fill={glowColor} />
                <circle cx="250" cy="126" r="2.2" fill={glowColor} />
                <circle cx="270" cy="127" r="2.2" fill={glowColor} />
                <circle cx="290" cy="126" r="2.2" fill={glowColor} />
              </g>
            )}
          </g>
        )}

        {/* Anatomical callout pointers */}
        <g className="anatomical-callouts" opacity="0.85">
          {/* Depth/Hydrostatic note */}
          <line x1="420" y1="300" x2="490" y2="300" stroke="#73e2e0" strokeWidth="0.8" />
          <circle cx="420" cy="300" r="2" fill="#73e2e0" />
          <text x="495" y="303" fill="#8caab5" fontSize="9" fontFamily="DM Mono, monospace">
            TMAO/Piezolyte Dermis
          </text>

          {/* Bioluminescence or sensory callout */}
          <line x1="80" y1="70" x2="30" y2="70" stroke="#73e2e0" strokeWidth="0.8" />
          <circle cx="80" cy="70" r="2" fill="#73e2e0" />
          <text x="15" y="65" fill="#8caab5" fontSize="9" fontFamily="DM Mono, monospace" textAnchor="start">
            {isBioluminescent ? 'Photophore Array (470nm)' : 'Mechanosensory Lateral Line'}
          </text>
        </g>
      </svg>

      <div className="illustration-depth-tag">
        <span>EST. DEPTH: <strong>{creature.depthMeters.toLocaleString()} M</strong></span>
        <span>HYDROSTATIC PRESSURE: <strong>{creature.pressureMetrics.gaugeBar} BAR (GAUGE) / {creature.pressureMetrics.absoluteBar} BAR (ABS)</strong></span>
      </div>
    </div>
  )
}

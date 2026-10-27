import React from 'react'
import type { PredictedCreature } from '../types'
import { CreatureIllustration } from './CreatureIllustration'

interface UnknownModalProps {
  creature: PredictedCreature
  onClose: () => void
  isSaved: boolean
  onToggleSave: (creature: PredictedCreature) => void
}

export const UnknownModal: React.FC<UnknownModalProps> = ({
  creature,
  onClose,
  isSaved,
  onToggleSave
}) => {
  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <section
        className="creature-modal unknown-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button className="modal-close" onClick={onClose} aria-label="Close dossier">
          ×
        </button>

        <div className="modal-illustration-panel">
          <CreatureIllustration creature={creature} className="modal-illustration" />
          <div className="specimen-label-card">
            <span className="specimen-number">SPECIMEN HYPOTHESIS · {creature.id.slice(-6).toUpperCase()}</span>
            <div className="specimen-pressure-grid">
              <div>
                <span>GAUGE PRESSURE</span>
                <strong>{creature.pressureMetrics.gaugeBar} bar</strong>
              </div>
              <div>
                <span>ABSOLUTE PRESSURE</span>
                <strong>{creature.pressureMetrics.absoluteBar} bar</strong>
              </div>
              <div>
                <span>TEMPERATURE</span>
                <strong>{creature.temperatureRange}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-content unknown-modal-content">
          <div className="section-kicker">
            <span>THE UNKNOWN / SCIENTIFIC PREDICTION DOSSIER</span>
          </div>

          <div className="uncertainty-pill">
            <span className="uncertainty-icon">⚠</span>
            <span>EDUCATIONAL HYPOTHESIS · NOT A DOCUMENTED LIVING SPECIES</span>
          </div>

          <h2 id="modal-title">{creature.name}</h2>
          <div className="scientific">{creature.scientificName}</div>

          <p className="modal-description">{creature.appearance}</p>

          <div className="profile-data">
            <div>
              <span>HABITAT MATRIX</span>
              <strong>{creature.environment}</strong>
            </div>
            <div>
              <span>ESTIMATED DEPTH</span>
              <strong>{creature.depthRange}</strong>
            </div>
            <div>
              <span>BODY PLAN</span>
              <strong>{creature.bodyPlan}</strong>
            </div>
            <div>
              <span>ESTIMATED SIZE</span>
              <strong>{creature.estimatedSize}</strong>
            </div>
          </div>

          <div className="specimen-section">
            <div className="specimen-section-title">BIOLUMINESCENCE & SENSORY SYSTEMS</div>
            <p className="specimen-text">
              <strong>Sensory:</strong> {creature.sensoryAdaptations}
            </p>
            <p className="specimen-text">
              <strong>Bioluminescence:</strong>{' '}
              {creature.bioluminescence.present
                ? `${creature.bioluminescence.mechanism} (${creature.bioluminescence.wavelengthAndColor}). Function: ${creature.bioluminescence.function}`
                : creature.bioluminescence.function}
            </p>
          </div>

          <div className="specimen-section">
            <div className="specimen-section-title">CELLULAR & BIOCHEMICAL ADAPTATIONS</div>
            <ul className="specimen-list">
              {creature.cellularAndBiochemicalAdaptations.map((adapt, i) => (
                <li key={i}>{adapt}</li>
              ))}
            </ul>
          </div>

          <div className="specimen-section">
            <div className="specimen-section-title">ECOLOGICAL NICHE & DIET</div>
            <p className="specimen-text">
              <strong>Diet:</strong> {creature.possibleDiet}
            </p>
            <p className="specimen-text">
              <strong>Trophic Role:</strong> {creature.ecologicalRole}
            </p>
          </div>

          <div className="fact-box biological-rationale-box">
            <span>✳ BIOLOGICAL SELECTION RATIONALE</span>
            <p>{creature.biologicalRationale}</p>
          </div>

          <div className="specimen-section">
            <div className="specimen-section-title">REAL BIOLOGICAL INSPIRATIONS & CITATIONS</div>
            <div className="inspirations-grid">
              {creature.inspirationSpecies.map((sp, idx) => (
                <div key={idx} className="inspiration-card">
                  <div className="inspiration-names">
                    <strong>{sp.commonName}</strong> (<em>{sp.scientificName}</em>)
                  </div>
                  <p className="inspiration-desc">{sp.keyAdaptation}</p>
                  <cite className="inspiration-cite">
                    {sp.citation}
                    {sp.referenceUrl && (
                      <a
                        href={sp.referenceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inspiration-link"
                      >
                        Scientific Source ↗
                      </a>
                    )}
                  </cite>
                </div>
              ))}
            </div>
          </div>

          <div className="specimen-section uncertainties-box">
            <div className="specimen-section-title">SCIENTIFIC LIMITATIONS & UNCERTAINTIES</div>
            <ul className="uncertainties-list">
              {creature.uncertainties.map((u, i) => (
                <li key={i}>{u}</li>
              ))}
            </ul>
          </div>

          <div className="modal-actions">
            <button
              className={`button ${isSaved ? 'button-ghost' : 'button-primary'}`}
              onClick={() => onToggleSave(creature)}
            >
              {isSaved ? '★ Remove from Field Journal' : '☆ Save to Field Journal'}
            </button>
            <button className="button button-ghost" onClick={onClose}>
              Close Dossier
            </button>
          </div>

          <small className="data-note">
            This hypothetical profile was generated from empirical deep-sea biophysical models. Deep-sea adaptations depend on multiple interacting evolutionary lineages.
          </small>
        </div>
      </section>
    </div>
  )
}

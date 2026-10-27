import test from 'node:test'
import assert from 'node:assert/strict'
import { calculatePressure } from '../engine/environments.js'
import { validateEnvironmentalInputs, predictCreature } from '../engine/predictor.js'

test('Hydrostatic pressure calculation differentiates absolute and gauge pressure', () => {
  const surface = calculatePressure(0)
  assert.equal(surface.gaugeAtm, 0)
  assert.equal(surface.absoluteAtm, 1.0)
  assert.equal(surface.gaugeBar, 0)
  assert.equal(surface.absoluteBar, 1.0)

  // 10,000 meters in trench
  const hadal = calculatePressure(10000)
  // rho * g * h / 100000 = 1026 * 9.80665 * 10000 / 100000 ~ 1006 bar
  assert.ok(hadal.gaugeBar > 950 && hadal.gaugeBar < 1050)
  assert.ok(hadal.absoluteBar > hadal.gaugeBar)
  assert.ok(hadal.absoluteAtm > hadal.gaugeAtm)
  assert.match(hadal.explanation, /Gauge pressure/i)
  assert.match(hadal.explanation, /Absolute pressure/i)
})

test('Environmental input validation flags out-of-bounds parameters', () => {
  const invalidDepth = validateEnvironmentalInputs({ depthMeters: 50 })
  assert.equal(invalidDepth.valid, false)
  assert.ok(invalidDepth.errors.some((e) => e.includes('Depth must be between')))
  assert.equal(invalidDepth.sanitized.depthMeters, 200)

  const invalidTemp = validateEnvironmentalInputs({
    environment: 'abyssal_plain',
    temperatureCelsius: 65
  })
  assert.equal(invalidTemp.valid, false)
  assert.ok(invalidTemp.errors.some((e) => e.includes('Deep-sea ambient water temperature')))
  assert.equal(invalidTemp.sanitized.temperatureCelsius, 30)
})

test('Hydrothermal vent environment allows higher mixing zone temperatures', () => {
  const ventInput = validateEnvironmentalInputs({
    environment: 'hydrothermal_vents',
    temperatureCelsius: 32
  })
  assert.equal(ventInput.valid, true)
  assert.equal(ventInput.sanitized.temperatureCelsius, 32)
})

test('Predictor produces hadal snailfish adaptations under extreme pressure', () => {
  const res = predictCreature({
    environment: 'hadal_trench',
    depthMeters: 8500,
    temperatureCelsius: 1.6,
    lightAvailability: 'none',
    oxygenAvailability: 'well_oxygenated_cold_plume',
    foodSource: 'benthic_sediment_detritus'
  }, 42)

  assert.equal(res.success, true)
  assert.ok(res.creature)
  assert.equal(res.creature?.hypothetical, true)
  assert.ok(res.creature?.pressureMetrics.absoluteAtm > 800)

  // Must include TMAO / piezolyte biochemical adaptations
  const adaptations = res.creature?.cellularAndBiochemicalAdaptations || []
  assert.ok(adaptations.some((a) => a.toLowerCase().includes('tmao') || a.toLowerCase().includes('piezolyte')))

  // Must include inspirational species like Mariana Snailfish or Hadal Amphipod
  const inspirations = res.creature?.inspirationSpecies || []
  assert.ok(inspirations.some((i) => i.scientificName.includes('Pseudoliparis') || i.scientificName.includes('Alicella')))
})

test('Predictor generates twilight zone counterillumination adaptation', () => {
  const res = predictCreature({
    environment: 'twilight_zone',
    depthMeters: 550,
    temperatureCelsius: 9.0,
    lightAvailability: 'weak_residual',
    oxygenAvailability: 'oxygen_minimum_zone',
    foodSource: 'marine_snow'
  }, 101)

  assert.equal(res.success, true)
  assert.ok(res.creature)
  assert.equal(res.creature?.bioluminescence.present, true)
  assert.match(res.creature?.bioluminescence.function, /counterillumination/i)
})

test('Seed parameter provides reproducible variations', () => {
  const resA = predictCreature({ environment: 'abyssal_plain', depthMeters: 4000 }, 12345)
  const resB = predictCreature({ environment: 'abyssal_plain', depthMeters: 4000 }, 12345)
  const resC = predictCreature({ environment: 'abyssal_plain', depthMeters: 4000 }, 99999)

  assert.equal(resA.creature?.scientificName, resB.creature?.scientificName)
  assert.equal(resA.creature?.bodyPlan, resB.creature?.bodyPlan)
})

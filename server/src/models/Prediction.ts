import mongoose, { Schema, type Document, type Model } from 'mongoose'
import type {
  EnvironmentType,
  LightAvailability,
  OxygenAvailability,
  FoodSource,
  PressureMetrics,
  BioluminescenceProfile,
  InspirationSpecies
} from '../types.js'

export interface IPrediction extends Document {
  predictionId: string
  name: string
  scientificName: string
  hypothetical: boolean
  environment: string
  environmentType: EnvironmentType
  depthMeters: number
  depthRange: string
  temperatureCelsius: number
  temperatureRange: string
  pressureMetrics: PressureMetrics
  appearance: string
  bodyPlan: string
  estimatedSize: string
  sensoryAdaptations: string
  bioluminescence: BioluminescenceProfile
  cellularAndBiochemicalAdaptations: string[]
  possibleDiet: string
  ecologicalRole: string
  biologicalRationale: string
  inspirationSpecies: InspirationSpecies[]
  uncertainties: string[]
  imagePrompt: string
  imageUrl: string | null
  imageStatus: string
  imageConceptBadge: string
  variationSeed?: number
  createdAt: Date
  updatedAt: Date
}

const PressureMetricsSchema = new Schema<PressureMetrics>(
  {
    gaugeAtm: { type: Number, required: true },
    absoluteAtm: { type: Number, required: true },
    gaugeBar: { type: Number, required: true },
    absoluteBar: { type: Number, required: true },
    gaugeMpa: { type: Number, required: true },
    absoluteMpa: { type: Number, required: true },
    explanation: { type: String, required: true }
  },
  { _id: false }
)

const BioluminescenceSchema = new Schema<BioluminescenceProfile>(
  {
    present: { type: Boolean, required: true },
    mechanism: { type: String, required: true },
    function: { type: String, required: true },
    wavelengthAndColor: { type: String, required: true }
  },
  { _id: false }
)

const InspirationSpeciesSchema = new Schema<InspirationSpecies>(
  {
    commonName: { type: String, required: true },
    scientificName: { type: String, required: true },
    keyAdaptation: { type: String, required: true },
    referenceUrl: { type: String, default: '' },
    citation: { type: String, required: true }
  },
  { _id: false }
)

const PredictionSchema = new Schema<IPrediction>(
  {
    predictionId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    scientificName: {
      type: String,
      required: true,
      trim: true
    },
    hypothetical: {
      type: Boolean,
      default: true
    },
    environment: {
      type: String,
      required: true
    },
    environmentType: {
      type: String,
      required: true,
      index: true
    },
    depthMeters: {
      type: Number,
      required: true,
      index: true
    },
    depthRange: {
      type: String,
      required: true
    },
    temperatureCelsius: {
      type: Number,
      required: true
    },
    temperatureRange: {
      type: String,
      required: true
    },
    pressureMetrics: {
      type: PressureMetricsSchema,
      required: true
    },
    appearance: {
      type: String,
      required: true
    },
    bodyPlan: {
      type: String,
      required: true
    },
    estimatedSize: {
      type: String,
      required: true
    },
    sensoryAdaptations: {
      type: String,
      required: true
    },
    bioluminescence: {
      type: BioluminescenceSchema,
      required: true
    },
    cellularAndBiochemicalAdaptations: {
      type: [String],
      default: []
    },
    possibleDiet: {
      type: String,
      required: true
    },
    ecologicalRole: {
      type: String,
      required: true
    },
    biologicalRationale: {
      type: String,
      required: true
    },
    inspirationSpecies: {
      type: [InspirationSpeciesSchema],
      default: []
    },
    uncertainties: {
      type: [String],
      default: []
    },
    imagePrompt: {
      type: String,
      default: ''
    },
    imageUrl: {
      type: String,
      default: null
    },
    imageStatus: {
      type: String,
      default: 'fallback'
    },
    imageConceptBadge: {
      type: String,
      default: 'Scientific Speculative Concept (Vector Illustration)'
    },
    variationSeed: {
      type: Number
    }
  },
  {
    timestamps: true
  }
)

export const Prediction: Model<IPrediction> =
  mongoose.models.Prediction || mongoose.model<IPrediction>('Prediction', PredictionSchema)

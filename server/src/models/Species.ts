import mongoose, { Schema, type Document, type Model } from 'mongoose'

export interface ISourceReference {
  title: string
  url?: string
  citation: string
}

export interface IEnvironmentalConditions {
  temperatureRange?: string
  pressureRange?: string
  lightLevel?: string
  oxygenLevel?: string
}

export interface ISpecies extends Document {
  slug: string
  name: string
  scientificName: string
  habitat: string // 'Sunlight zone' | 'Twilight zone' | 'Midnight zone' | 'Benthic' etc.
  type: string // 'Fish' | 'Mammal' | 'Cephalopod' | 'Cnidarian' | 'Reptile' | 'Ray'
  diet: string
  depthRange: string
  minDepthMeters?: number
  maxDepthMeters?: number
  environmentalConditions?: IEnvironmentalConditions
  biologicalAdaptations: string[]
  ecologicalRole?: string
  conservationStatus: string
  description: string
  fact: string
  imageUrl: string
  imageAttribution?: string
  sourceReferences: ISourceReference[]
  createdAt: Date
  updatedAt: Date
}

const SourceReferenceSchema = new Schema<ISourceReference>(
  {
    title: { type: String, required: true },
    url: { type: String, default: '' },
    citation: { type: String, required: true }
  },
  { _id: false }
)

const EnvironmentalConditionsSchema = new Schema<IEnvironmentalConditions>(
  {
    temperatureRange: { type: String },
    pressureRange: { type: String },
    lightLevel: { type: String },
    oxygenLevel: { type: String }
  },
  { _id: false }
)

const SpeciesSchema = new Schema<ISpecies>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
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
      trim: true,
      index: true
    },
    habitat: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    type: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    diet: {
      type: String,
      required: true
    },
    depthRange: {
      type: String,
      required: true
    },
    minDepthMeters: {
      type: Number
    },
    maxDepthMeters: {
      type: Number
    },
    environmentalConditions: {
      type: EnvironmentalConditionsSchema,
      default: {}
    },
    biologicalAdaptations: {
      type: [String],
      default: []
    },
    ecologicalRole: {
      type: String,
      default: ''
    },
    conservationStatus: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    fact: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    imageAttribution: {
      type: String,
      default: ''
    },
    sourceReferences: {
      type: [SourceReferenceSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
)

// Text index for search across common name, scientific name, and description
SpeciesSchema.index({
  name: 'text',
  scientificName: 'text',
  description: 'text',
  habitat: 'text',
  type: 'text'
})

export const Species: Model<ISpecies> =
  mongoose.models.Species || mongoose.model<ISpecies>('Species', SpeciesSchema)

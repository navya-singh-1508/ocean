import mongoose, { Schema, type Document, type Model } from 'mongoose'
import type { PredictedCreature } from '../types.js'

export interface IDiscovery extends Document {
  discoveryId: string
  predictionId: string
  predictionSnapshot: PredictedCreature
  notes: string
  userId: string
  isFavorite: boolean
  savedAt: Date
  createdAt: Date
  updatedAt: Date
}

const DiscoverySchema = new Schema<IDiscovery>(
  {
    discoveryId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    predictionId: {
      type: String,
      required: true,
      index: true
    },
    predictionSnapshot: {
      type: Schema.Types.Mixed,
      required: true
    },
    notes: {
      type: String,
      default: ''
    },
    userId: {
      type: String,
      default: 'demo-explorer',
      index: true
    },
    isFavorite: {
      type: Boolean,
      default: false
    },
    savedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
)

export const Discovery: Model<IDiscovery> =
  mongoose.models.Discovery || mongoose.model<IDiscovery>('Discovery', DiscoverySchema)

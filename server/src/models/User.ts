import mongoose, { Schema, type Document, type Model } from 'mongoose'

export interface IUser extends Document {
  name: string
  email: string
  passwordHash: string
  favoriteSpeciesSlugs: string[]
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, 'Name must be 100 characters or fewer']
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
    },
    passwordHash: {
      type: String,
      required: true,
      select: false // Never return password hash in default queries
    },
    favoriteSpeciesSlugs: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
)

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema)

import mongoose, { Schema, type Model, type Document } from 'mongoose'
import type { Language } from './Post'

export type UserRole = 'admin' | 'user'
export type UserProvider = 'credentials' | 'google'

export interface IUser extends Document {
  name?: string
  email: string
  password?: string
  image?: string
  role: UserRole
  provider: UserProvider
  language: Language
  savedPosts: mongoose.Types.ObjectId[]
  likedPosts: mongoose.Types.ObjectId[]
  savedRecipes: mongoose.Types.ObjectId[]
  likedRecipes: mongoose.Types.ObjectId[]
  savedVideos: mongoose.Types.ObjectId[]
  likedVideos: mongoose.Types.ObjectId[]
  purchasedPlans: mongoose.Types.ObjectId[]
  createdAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String },
    image: { type: String },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    provider: { type: String, enum: ['credentials', 'google'], required: true },
    language: { type: String, enum: ['te', 'en'], default: 'en' },
    savedPosts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    likedPosts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    savedRecipes: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }],
    likedRecipes: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }],
    savedVideos: [{ type: Schema.Types.ObjectId, ref: 'Video' }],
    likedVideos: [{ type: Schema.Types.ObjectId, ref: 'Video' }],
    purchasedPlans: [{ type: Schema.Types.ObjectId, ref: 'PremiumPlan' }],
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema)

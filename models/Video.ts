import mongoose, { Schema, type Model, type Document } from 'mongoose'
import type { Language } from './Post'

export type VideoCategory =
  | 'cooking'
  | 'health-education'
  | 'weight-loss'
  | 'diabetes'
  | 'shorts'

export interface IVideo extends Document {
  title: string
  slug: string
  description?: string
  youtubeUrl: string
  youtubeId: string
  thumbnailUrl?: string
  category?: VideoCategory
  tag?: string
  language: Language
  durationSeconds?: number
  views: number
  isPublished: boolean
  isFeatured: boolean
  createdAt: Date
}

const VideoSchema = new Schema<IVideo>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String },
    youtubeUrl: { type: String, required: true },
    youtubeId: { type: String, required: true },
    thumbnailUrl: { type: String },
    category: {
      type: String,
      enum: ['cooking','health-education','weight-loss','diabetes','shorts'],
    },
    tag: { type: String },
    language: { type: String, enum: ['te', 'en', 'hi'], default: 'te' },
    durationSeconds: { type: Number },
    views: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

export const Video: Model<IVideo> =
  mongoose.models.Video || mongoose.model<IVideo>('Video', VideoSchema)

import mongoose, { Schema, type Model, type Document } from 'mongoose'

export interface ISiteSettings extends Document {
  key: string
  value: string
  label: string
  description?: string
  category?: string
  updatedAt: Date
}

const SiteSettingsSchema = new Schema<ISiteSettings>({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  value: {
    type: String,
    required: false,
    default: '',
  },
  label: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    enum: ['statistics', 'site_info', 'contact', 'social', 'other'],
    default: 'other',
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: { createdAt: false, updatedAt: 'updatedAt' }
})

export const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings ||
  mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema)

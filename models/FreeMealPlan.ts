import mongoose, { Schema, models } from 'mongoose'

const FreeMealPlanSchema = new Schema({
  // Multilingual title
  titleEn: { type: String, required: true, trim: true },
  titleTe: { type: String, default: '', trim: true },
  titleHi: { type: String, default: '', trim: true },

  // Multilingual description
  descEn: { type: String, default: '' },
  descTe: { type: String, default: '' },
  descHi: { type: String, default: '' },

  // Category tag (multilingual)
  tagEn: { type: String, default: '' },
  tagTe: { type: String, default: '' },
  tagHi: { type: String, default: '' },

  // Bullet highlights (multilingual, comma-separated stored as array)
  highlightsEn: [{ type: String }],
  highlightsTe: [{ type: String }],
  highlightsHi: [{ type: String }],

  // PDF file (uploaded to Cloudinary)
  pdfUrl: { type: String, default: '' },
  pdfPublicId: { type: String, default: '' },

  // Icon name for frontend mapping (Flame, Activity, Wheat, Leaf, Heart, Baby)
  iconName: { type: String, default: 'Leaf' },

  // Visual style
  gradient: { type: String, default: 'from-emerald-500 to-teal-500' },
  iconColor: { type: String, default: 'text-emerald-600' },
  iconBg: { type: String, default: 'bg-emerald-100 dark:bg-emerald-900/30' },
  borderColor: { type: String, default: 'border-emerald-200 dark:border-emerald-800' },
  bgColor: { type: String, default: 'bg-emerald-50 dark:bg-emerald-900/10' },

  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true })

export const FreeMealPlan = models.FreeMealPlan || mongoose.model('FreeMealPlan', FreeMealPlanSchema)

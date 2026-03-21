import mongoose, { Schema, models } from 'mongoose'

const PremiumPlanSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  currency: { type: String, default: '₹' },
  durationWeeks: { type: Number, default: 4 },
  features: [{ type: String }],
  isActive: { type: Boolean, default: true },
  language: { type: String, enum: ['en', 'te'], default: 'en' },
  fileUrl: { type: String, default: '' },
}, { timestamps: true })

export const PremiumPlan = models.PremiumPlan || mongoose.model('PremiumPlan', PremiumPlanSchema)

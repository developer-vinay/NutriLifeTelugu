import mongoose, { Schema, models } from 'mongoose'

const PremiumPlanSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  originalPrice: { type: Number, default: null },
  discountLabel: { type: String, default: '' },
  currency: { type: String, default: '₹' },
  durationWeeks: { type: Number, default: 4 },
  features: [{ type: String }],
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  language: { type: String, enum: ['en', 'te', 'hi'], default: 'en' },
  fileUrl: { type: String, default: '' },
}, { timestamps: true })

export const PremiumPlan = models.PremiumPlan || mongoose.model('PremiumPlan', PremiumPlanSchema)

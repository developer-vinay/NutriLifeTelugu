import mongoose, { Schema, type Model, type Document } from 'mongoose'

export interface IProduct extends Document {
  name: string
  nameHi?: string
  nameTe?: string
  description: string
  descriptionHi?: string
  descriptionTe?: string
  price: number
  currency: string
  discountType?: 'percentage' | 'fixed' | 'none'
  discountValue?: number
  finalPrice?: number // Calculated field
  category: 'meal-plan' | 'ebook' | 'course' | 'consultation' | 'other'
  duration?: string // e.g., "30 days", "60 days"
  features: string[]
  featuresHi?: string[]
  featuresTe?: string[]
  imageUrl?: string
  fileUrl?: string // For downloadable PDFs/ebooks
  isActive: boolean
  isFeatured: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

const ProductSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  nameHi: {
    type: String,
    trim: true,
  },
  nameTe: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  descriptionHi: {
    type: String,
  },
  descriptionTe: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    enum: ['₹', '$', '€', '£', '¥'],
    default: '₹',
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed', 'none'],
    default: 'none',
  },
  discountValue: {
    type: Number,
    min: 0,
    default: 0,
  },
  finalPrice: {
    type: Number,
    min: 0,
  },
  category: {
    type: String,
    enum: ['meal-plan', 'ebook', 'course', 'consultation', 'other'],
    default: 'other',
  },
  duration: {
    type: String,
  },
  features: {
    type: [String],
    default: [],
  },
  featuresHi: {
    type: [String],
    default: [],
  },
  featuresTe: {
    type: [String],
    default: [],
  },
  imageUrl: {
    type: String,
  },
  fileUrl: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  sortOrder: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
})

// Index for sorting
ProductSchema.index({ sortOrder: 1, createdAt: -1 })

// Calculate final price before saving
ProductSchema.pre('save', function() {
  if (this.discountType === 'percentage' && this.discountValue) {
    this.finalPrice = this.price - (this.price * this.discountValue / 100)
  } else if (this.discountType === 'fixed' && this.discountValue) {
    this.finalPrice = Math.max(0, this.price - this.discountValue)
  } else {
    this.finalPrice = this.price
  }
})

export const Product: Model<IProduct> =
  mongoose.models.Product ||
  mongoose.model<IProduct>('Product', ProductSchema)

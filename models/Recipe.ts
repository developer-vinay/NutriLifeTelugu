import mongoose, { Schema, type Model, type Document } from 'mongoose'
import type { Language } from './Post'

export type RecipeCategory =
  | 'breakfast'
  | 'lunch'
  | 'dinner'
  | 'snacks'
  | 'millets'
  | 'diabetic-friendly'

export interface IRecipe extends Document {
  title: string
  slug: string
  description?: string
  content: string
  category?: RecipeCategory
  tag?: string
  language: Language
  heroImage?: string
  heroImagePublicId?: string
  prepTimeMinutes?: number
  cookTimeMinutes?: number
  servings?: number
  ingredients: string[]
  nutritionFacts?: {
    calories?: number
    protein?: number
    carbs?: number
    fat?: number
    fiber?: number
  }
  isPublished: boolean
  isFeatured: boolean
  views: number
  likes: number
  createdAt: Date
  updatedAt: Date
}

const RecipeSchema = new Schema<IRecipe>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String },
    content: { type: String, required: true },
    category: {
      type: String,
      enum: ['breakfast','lunch','dinner','snacks','millets','diabetic-friendly'],
    },
    tag: { type: String },
    language: { type: String, enum: ['te', 'en'], default: 'te' },
    heroImage: { type: String },
    heroImagePublicId: { type: String },
    prepTimeMinutes: { type: Number },
    cookTimeMinutes: { type: Number },
    servings: { type: Number },
    ingredients: { type: [String], default: [] },
    nutritionFacts: {
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
      fiber: Number,
    },
    isPublished: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true },
)

export const Recipe: Model<IRecipe> =
  mongoose.models.Recipe || mongoose.model<IRecipe>('Recipe', RecipeSchema)

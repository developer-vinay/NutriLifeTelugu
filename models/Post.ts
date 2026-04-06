import mongoose, { Schema, type Model, type Document } from 'mongoose'

export type PostCategory =
  | 'weight-loss'
  | 'diabetes'
  | 'gut-health'
  | 'immunity'
  | 'thyroid'
  | 'kids-nutrition'
  | 'recipes'
  | 'millets'
  | 'general'

export type Language = 'te' | 'en' | 'hi'

export interface IPost extends Document {
  title: string
  slug: string
  content: string
  excerpt?: string
  category?: PostCategory
  tag?: string
  language: Language
  heroImage?: string
  heroImagePublicId?: string
  youtubeUrl?: string
  contentImages?: string[]
  readTimeMinutes?: number
  views: number
  likes: number
  isPublished: boolean
  isFeatured: boolean
  author: string
  createdAt: Date
  updatedAt: Date
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    content: { type: String, required: true },
    excerpt: { type: String, maxlength: 200 },
    category: {
      type: String,
      enum: ['weight-loss','diabetes','gut-health','immunity','thyroid','kids-nutrition','recipes','millets','general'],
    },
    tag: { type: String },
    language: { type: String, enum: ['te', 'en', 'hi'], default: 'te' },
    heroImage: { type: String },
    heroImagePublicId: { type: String },
    youtubeUrl: { type: String },
    contentImages: [{ type: String }],
    readTimeMinutes: { type: Number },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    author: { type: String, default: 'NutriLifeMitra' },
  },
  { timestamps: true },
)

export const Post: Model<IPost> =
  mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema)

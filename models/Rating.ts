import mongoose, { Schema, type Model, type Document } from 'mongoose'

export interface IRating extends Document {
  contentType: 'recipe' | 'post'
  contentId: mongoose.Types.ObjectId
  userIdentifier: string // email or anonymous fingerprint
  stars: number // 1-5
  createdAt: Date
}

const RatingSchema = new Schema<IRating>(
  {
    contentType: { type: String, enum: ['recipe', 'post'], required: true },
    contentId: { type: Schema.Types.ObjectId, required: true },
    userIdentifier: { type: String, required: true },
    stars: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

// One rating per user per content item
RatingSchema.index({ contentType: 1, contentId: 1, userIdentifier: 1 }, { unique: true })

export const Rating: Model<IRating> =
  mongoose.models.Rating || mongoose.model<IRating>('Rating', RatingSchema)

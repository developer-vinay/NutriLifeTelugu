import mongoose, { Schema, type Model, type Document } from 'mongoose'

export interface IComment extends Document {
  contentType: 'post' | 'recipe'
  contentId: mongoose.Types.ObjectId
  name: string
  email: string
  body: string
  isApproved: boolean
  createdAt: Date
}

const CommentSchema = new Schema<IComment>(
  {
    contentType: { type: String, enum: ['post', 'recipe'], required: true },
    contentId: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, trim: true, lowercase: true },
    body: { type: String, required: true, trim: true, maxlength: 1000 },
    isApproved: { type: Boolean, default: true }, // auto-approve; set false for moderation
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

CommentSchema.index({ contentType: 1, contentId: 1, createdAt: -1 })

export const Comment: Model<IComment> =
  mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema)

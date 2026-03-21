import mongoose, { Schema, type Model, type Document } from 'mongoose'

export interface IComment extends Document {
  contentType: 'post' | 'recipe'
  contentId: mongoose.Types.ObjectId
  parentId?: mongoose.Types.ObjectId | null // null = top-level, set = reply
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
    parentId: { type: Schema.Types.ObjectId, ref: 'Comment', default: null },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, trim: true, lowercase: true },
    body: { type: String, required: true, trim: true, maxlength: 1000 },
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

CommentSchema.index({ contentType: 1, contentId: 1, parentId: 1, createdAt: 1 })

export const Comment: Model<IComment> =
  mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema)

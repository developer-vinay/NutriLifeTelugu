import mongoose, { Schema, type Model, type Document } from 'mongoose'

export interface IChatUsage extends Document {
  identifier: string   // userId or IP address
  date: string         // YYYY-MM-DD
  count: number
  updatedAt: Date
}

const ChatUsageSchema = new Schema<IChatUsage>({
  identifier: { type: String, required: true },
  date: { type: String, required: true },
  count: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
})

ChatUsageSchema.index({ identifier: 1, date: 1 }, { unique: true })

export const ChatUsage: Model<IChatUsage> =
  mongoose.models.ChatUsage || mongoose.model<IChatUsage>('ChatUsage', ChatUsageSchema)

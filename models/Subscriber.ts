import mongoose, { Schema, type Model, type Document } from 'mongoose'

export interface ISubscriber extends Document {
  email: string
  subscribedAt: Date
  isActive: boolean
  language: 'en' | 'te' | 'hi'
}

const SubscriberSchema = new Schema<ISubscriber>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  language: {
    type: String,
    enum: ['en', 'te', 'hi'],
    default: 'en',
  },
})

export const Subscriber: Model<ISubscriber> =
  mongoose.models.Subscriber ||
  mongoose.model<ISubscriber>('Subscriber', SubscriberSchema)


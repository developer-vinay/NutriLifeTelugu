import mongoose, { Schema, models } from 'mongoose'

const HeroSlideSchema = new Schema({
  imageUrl: { type: String, required: true },
  imagePublicId: { type: String, default: '' },
  alt: { type: String, default: '' },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  buttonText: { type: String, default: '' },
  buttonLink: { type: String, default: '' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

export const HeroSlide = (models.HeroSlide as mongoose.Model<any>) ?? mongoose.model('HeroSlide', HeroSlideSchema)

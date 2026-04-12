import mongoose, { Schema, models } from 'mongoose'

// A promotion can be a banner image, a YouTube video embed, or a link card
const PromotionSchema = new Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },

  // image type
  imageUrl: { type: String, default: '' },
  imagePublicId: { type: String, default: '' },

  // video type (YouTube)
  youtubeUrl: { type: String, default: '' },
  youtubeId: { type: String, default: '' },
  thumbnailUrl: { type: String, default: '' },

  // link type
  linkUrl: { type: String, default: '' },
  linkLabel: { type: String, default: 'Learn More' },
  description: { type: String, default: '' },

  // placement — where on the site this promo appears
  placement: { type: String, default: 'sidebar' },

  // targeting
  language: { type: String, default: 'all' },

  isActive: { type: Boolean, default: true },
  startsAt: { type: Date, default: null },
  endsAt: { type: Date, default: null },
  clickCount: { type: Number, default: 0 },
}, { timestamps: true })

export const Promotion = (models.Promotion as mongoose.Model<any>) ?? mongoose.model('Promotion', PromotionSchema)

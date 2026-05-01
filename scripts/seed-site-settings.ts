import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

import { connectDB } from '../lib/mongodb'
import { SiteSettings } from '../models/SiteSettings'

const defaultSettings = [
  // ===== SITE STATISTICS =====
  {
    key: 'families_served',
    value: '10,000+',
    label: 'Families Served',
    description: 'Total number of families who have used your diet plans',
    category: 'statistics',
  },
  {
    key: 'monthly_readers',
    value: '50,000+',
    label: 'Monthly Readers',
    description: 'Number of unique visitors per month',
    category: 'statistics',
  },
  {
    key: 'newsletter_subscribers',
    value: '10,000+',
    label: 'Newsletter Subscribers',
    description: 'Number of newsletter subscribers',
    category: 'statistics',
  },
  {
    key: 'total_recipes',
    value: '500+',
    label: 'Total Recipes',
    description: 'Total number of published recipes',
    category: 'statistics',
  },
  {
    key: 'total_articles',
    value: '200+',
    label: 'Total Articles',
    description: 'Total number of published articles',
    category: 'statistics',
  },
  {
    key: 'total_videos',
    value: '100+',
    label: 'Total Videos',
    description: 'Total number of published videos',
    category: 'statistics',
  },
  {
    key: 'cuisine_percentage',
    value: '100%',
    label: 'Cuisine Coverage',
    description: 'Percentage of Telugu/Indian cuisine coverage',
    category: 'statistics',
  },
  
  // ===== SITE INFORMATION =====
  {
    key: 'site_name',
    value: 'NutriLifeMitra',
    label: 'Site Name',
    description: 'Official name of the website',
    category: 'site_info',
  },
  {
    key: 'site_tagline',
    value: 'Smart Nutrition. Better Life.',
    label: 'Site Tagline',
    description: 'Short tagline or slogan',
    category: 'site_info',
  },
  {
    key: 'site_description',
    value: 'Health and nutrition platform for Telugu families',
    label: 'Site Description',
    description: 'Brief description of your website',
    category: 'site_info',
  },
  
  // ===== CONTACT INFORMATION =====
  {
    key: 'contact_email',
    value: 'contact@nutrilifemitra.com',
    label: 'Contact Email',
    description: 'Primary contact email address',
    category: 'contact',
  },
  {
    key: 'support_email',
    value: 'support@nutrilifemitra.com',
    label: 'Support Email',
    description: 'Customer support email address',
    category: 'contact',
  },
  {
    key: 'advertise_email',
    value: 'advertise@nutrilifemitra.com',
    label: 'Advertising Email',
    description: 'Email for advertising inquiries',
    category: 'contact',
  },
  
  // ===== SOCIAL MEDIA =====
  {
    key: 'facebook_url',
    value: '',
    label: 'Facebook URL',
    description: 'Facebook page URL (leave empty to hide)',
    category: 'social',
  },
  {
    key: 'instagram_url',
    value: '',
    label: 'Instagram URL',
    description: 'Instagram profile URL (leave empty to hide)',
    category: 'social',
  },
  {
    key: 'youtube_url',
    value: '',
    label: 'YouTube URL',
    description: 'YouTube channel URL (leave empty to hide)',
    category: 'social',
  },
  {
    key: 'twitter_url',
    value: '',
    label: 'Twitter/X URL',
    description: 'Twitter/X profile URL (leave empty to hide)',
    category: 'social',
  },
]

async function seedSiteSettings() {
  try {
    await connectDB()
    console.log('📊 Seeding site settings...')

    for (const setting of defaultSettings) {
      const existing = await SiteSettings.findOne({ key: setting.key })
      
      if (!existing) {
        await SiteSettings.create(setting)
        console.log(`✅ Created setting: ${setting.key} = ${setting.value}`)
      } else {
        console.log(`ℹ️  Setting already exists: ${setting.key}`)
      }
    }

    console.log('✅ Site settings seeded successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding site settings:', error)
    process.exit(1)
  }
}

seedSiteSettings()

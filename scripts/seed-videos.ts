import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { connectDB } from '../lib/mongodb'
import { Video } from '../models/Video'

// Using real NutriLife-style YouTube placeholder IDs
// Replace youtubeId and youtubeUrl with real ones when available

const teluguVideos = [
  {
    title: 'రాగి జావ ఎలా చేయాలి — పిల్లలకు & పెద్దలకు',
    slug: 'ragi-java-recipe-video-te',
    language: 'te',
    category: 'cooking',
    tag: 'Cooking',
    description: 'రాగి జావ తయారీ విధానం. పిల్లలకు, వృద్ధులకు చాలా మంచిది.',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnailUrl: '',
    durationSeconds: 480,
    isPublished: true,
    isFeatured: true,
    views: 0,
  },
  {
    title: 'డయాబెటిస్ కంట్రోల్ చేయడానికి ఏమి తినాలి',
    slug: 'diabetes-control-food-te',
    language: 'te',
    category: 'health-education',
    tag: 'Diabetes',
    description: 'డయాబెటిస్ ఉన్నవాళ్ళు ఏమి తినాలి, ఏమి తినకూడదు అని వివరంగా చెప్పాం.',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnailUrl: '',
    durationSeconds: 720,
    isPublished: true,
    isFeatured: false,
    views: 0,
  },
  {
    title: 'బరువు తగ్గడానికి ఉదయం ఏమి తినాలి',
    slug: 'weight-loss-morning-food-te',
    language: 'te',
    category: 'weight-loss',
    tag: 'Weight Loss',
    description: 'ఉదయం సరైన ఆహారం తింటే బరువు తగ్గడం సులభం అవుతుంది.',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnailUrl: '',
    durationSeconds: 600,
    isPublished: true,
    isFeatured: false,
    views: 0,
  },
  {
    title: 'పెసరట్టు రెసిపీ — 10 నిమిషాల్లో',
    slug: 'pesarattu-recipe-video-te',
    language: 'te',
    category: 'cooking',
    tag: 'Cooking',
    description: 'పెసరట్టు చేయడం చాలా సులభం. ఈ వీడియో చూసి ట్రై చేయండి.',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnailUrl: '',
    durationSeconds: 360,
    isPublished: true,
    isFeatured: false,
    views: 0,
  },
  {
    title: 'రోజూ నడవడం వల్ల కలిగే ఫాయిదాలు',
    slug: 'daily-walking-benefits-te',
    language: 'te',
    category: 'shorts',
    tag: 'Health Tips',
    description: 'రోజూ 30 నిమిషాలు నడిస్తే ఏమి జరుగుతుందో తెలుసా?',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnailUrl: '',
    durationSeconds: 55,
    isPublished: true,
    isFeatured: false,
    views: 0,
  },
]

const englishVideos = [
  {
    title: 'How to Make Ragi Dosa — Step by Step',
    slug: 'ragi-dosa-recipe-video-en',
    language: 'en',
    category: 'cooking',
    tag: 'Cooking',
    description: 'Learn how to make crispy ragi dosa at home. Easy step by step recipe.',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnailUrl: '',
    durationSeconds: 540,
    isPublished: true,
    isFeatured: true,
    views: 0,
  },
  {
    title: 'What to Eat for Diabetes — Complete Guide',
    slug: 'diabetes-diet-guide-en',
    language: 'en',
    category: 'diabetes',
    tag: 'Diabetes',
    description: 'A complete guide on what to eat and avoid if you have Type 2 diabetes.',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnailUrl: '',
    durationSeconds: 900,
    isPublished: true,
    isFeatured: false,
    views: 0,
  },
  {
    title: '5 Morning Habits for Weight Loss',
    slug: 'morning-habits-weight-loss-video-en',
    language: 'en',
    category: 'weight-loss',
    tag: 'Weight Loss',
    description: 'These 5 simple morning habits can help you lose weight without a gym.',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnailUrl: '',
    durationSeconds: 660,
    isPublished: true,
    isFeatured: false,
    views: 0,
  },
  {
    title: 'Oats Upma Recipe — Quick Healthy Breakfast',
    slug: 'oats-upma-recipe-video-en',
    language: 'en',
    category: 'cooking',
    tag: 'Cooking',
    description: 'Make oats upma in under 15 minutes. Healthy, filling, and delicious.',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnailUrl: '',
    durationSeconds: 420,
    isPublished: true,
    isFeatured: false,
    views: 0,
  },
  {
    title: 'Why Millets Are Better Than Rice',
    slug: 'millets-vs-rice-en',
    language: 'en',
    category: 'health-education',
    tag: 'Health Education',
    description: 'The science behind why millets are nutritionally superior to white rice.',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnailUrl: '',
    durationSeconds: 50,
    isPublished: true,
    isFeatured: false,
    views: 0,
  },
]

async function main() {
  await connectDB()
  console.log('Connected to DB')

  let inserted = 0
  let skipped = 0

  for (const video of [...teluguVideos, ...englishVideos]) {
    const exists = await Video.findOne({ slug: video.slug })
    if (exists) {
      console.log(`SKIP (exists): ${video.slug}`)
      skipped++
      continue
    }
    await Video.create(video)
    console.log(`INSERT: ${video.slug} [${video.language}]`)
    inserted++
  }

  console.log(`\nDone. Inserted: ${inserted}, Skipped: ${skipped}`)
  process.exit(0)
}

main().catch((e) => { console.error(e); process.exit(1) })

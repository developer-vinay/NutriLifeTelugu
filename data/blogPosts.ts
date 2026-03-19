export type ParagraphBlock = {
  type: 'paragraph'
  text: string
}

export type Heading2Block = {
  type: 'heading2'
  text: string
}

export type Heading3Block = {
  type: 'heading3'
  text: string
}

export type ImageBlock = {
  type: 'image'
  caption: string
  altText: string
}

export type VideoBlock = {
  type: 'video'
  youtubeUrl: string
  caption: string
}

export type ListBlock = {
  type: 'list'
  items: string[]
}

export type TakeawayBlock = {
  type: 'takeaway'
  title: string
  points: string[]
}

export type AdBlock = {
  type: 'ad'
  size: '728x90' | '300x250'
}

export type ContentUpgradeBlock = {
  type: 'contentUpgrade'
  headline: string
  subtext: string
  buttonText: string
}

export type ContentBlock =
  | ParagraphBlock
  | Heading2Block
  | Heading3Block
  | ImageBlock
  | VideoBlock
  | ListBlock
  | TakeawayBlock
  | AdBlock
  | ContentUpgradeBlock

export type BlogPost = {
  slug: string
  title: string
  category: string
  tag: string
  readTimeMinutes: number
  publishedDate: string
  views: number
  excerpt: string
  heroImage: string
  sections: ContentBlock[]
  relatedSlugs: string[]
}

export const blogPosts: BlogPost[] = [
  {
    slug: '7-day-ragi-diet-plan-weight-loss',
    title: '7-Day Ragi Diet Plan for Fast Weight Loss — Telugu Style',
    category: 'Health Tips',
    tag: 'Weight Loss',
    readTimeMinutes: 6,
    publishedDate: '2025-03-15',
    views: 12400,
    excerpt:
      'Ragi (finger millet) is one of the most powerful grains in Telugu cuisine. In this 7-day plan we break down exactly how to use ragi safely for sustainable fat loss.',
    heroImage: 'bg-emerald-900',
    sections: [
      {
        type: 'paragraph',
        text: 'Ragi (finger millet) is one of the most powerful grains in Telugu cuisine — and it is also one of the best foods for sustainable weight loss. In this article, we break down exactly how to use ragi across 7 days to see real results without starving yourself.',
      },
      {
        type: 'paragraph',
        text: 'Unlike crash diets, this ragi plan is designed for busy Telugu families. You can use it along with your regular curries, sambars, and chutneys so that the whole family can eat together while you still work towards your weight goals.',
      },
      {
        type: 'takeaway',
        title: 'Key takeaways from this article',
        points: [
          'Ragi has 3× more fiber than white rice — it keeps you full for longer.',
          'Best time to eat ragi is for breakfast and early dinner.',
          'Avoid deep-fried ragi snacks and sugar-heavy combinations.',
        ],
      },
      {
        type: 'heading2',
        text: 'Why ragi works for weight loss',
      },
      {
        type: 'paragraph',
        text: 'The high fiber content in ragi slows digestion and prevents blood sugar spikes. Unlike white rice, ragi keeps insulin levels stable — which is the key mechanism behind fat burning. Stable sugars mean fewer cravings, less random snacking, and better portion control.',
      },
      {
        type: 'paragraph',
        text: 'Ragi is also rich in calcium and iron, which makes it especially useful for women who are trying to lose weight without losing bone strength or energy levels. When combined with vegetables, dals, and healthy fats, ragi-based meals become a complete plate.',
      },
      {
        type: 'image',
        caption: 'Ragi vs white rice — fiber and glycemic index comparison',
        altText: 'Chart comparing ragi and white rice for fiber and blood sugar impact',
      },
      {
        type: 'ad',
        size: '728x90',
      },
      {
        type: 'heading2',
        text: 'Day-by-day 7-day ragi meal plan',
      },
      {
        type: 'list',
        items: [
          'Day 1: Breakfast — ragi dosa with coconut chutney (no oil tempering).',
          'Day 2: Breakfast — ragi mudda with sambar and a spoon of ghee.',
          'Day 3: Breakfast — ragi porridge with buttermilk and coriander.',
          'Day 4: Dinner — ragi sangati with pappu and a big salad.',
          'Day 5–7: Mix and match these meals, keeping one ragi meal per day.',
        ],
      },
      {
        type: 'video',
        youtubeUrl: 'https://www.youtube.com/watch?v=dummy',
        caption: 'Watch: 7-day ragi diet plan explained step-by-step in Telugu',
      },
      {
        type: 'contentUpgrade',
        headline: 'Download the printable 7-day ragi meal chart (PDF)',
        subtext:
          'Get a fridge-friendly PDF with day-by-day menus, portion sizes, and shopping list — in simple Telugu + English.',
        buttonText: 'Get the free PDF',
      },
      {
        type: 'ad',
        size: '300x250',
      },
      {
        type: 'paragraph',
        text: 'Remember that ragi is powerful, but it is still only one part of the puzzle. Sleep, stress, and daily movement all play an equal role in how quickly you see change on the weighing scale.',
      },
      {
        type: 'paragraph',
        text: 'If you are diabetic, pregnant, or have kidney issues, always check with your doctor or dietitian before starting any new grain-based plan. Start slow, watch how your body responds, and then build this 7-day plan into a long-term lifestyle.',
      },
    ],
    relatedSlugs: [
      'millet-breakfast-ideas',
      '10-diabetic-friendly-telugu-breakfasts',
      'ragi-vs-wheat-weight-loss',
    ],
  },
  {
    slug: 'millet-breakfast-ideas',
    title: '5 High-Fiber Millet Breakfast Ideas for Busy Mornings',
    category: 'Recipes',
    tag: 'Breakfast',
    readTimeMinutes: 5,
    publishedDate: '2025-02-10',
    views: 5400,
    excerpt:
      'Simple millet-based breakfast ideas that keep you full till lunch without raising your sugars.',
    heroImage: 'bg-emerald-800',
    sections: [],
    relatedSlugs: [],
  },
  {
    slug: '10-diabetic-friendly-telugu-breakfasts',
    title: '10 Diabetic-Friendly Telugu Breakfasts to Control Morning Sugars',
    category: 'Diabetes',
    tag: 'Diabetes',
    readTimeMinutes: 7,
    publishedDate: '2025-01-25',
    views: 8200,
    excerpt:
      'Swap sugar-heavy tiffins for these blood-sugar-friendly Telugu breakfast combinations.',
    heroImage: 'bg-emerald-800',
    sections: [],
    relatedSlugs: [],
  },
  {
    slug: 'ragi-vs-wheat-weight-loss',
    title: 'Ragi vs Wheat — Which is Better for Weight Loss?',
    category: 'Weight Loss',
    tag: 'Comparison',
    readTimeMinutes: 6,
    publishedDate: '2025-02-05',
    views: 6100,
    excerpt:
      'We compare ragi and wheat on fiber, glycemic index, and satiety to see which works better for fat loss.',
    heroImage: 'bg-emerald-800',
    sections: [],
    relatedSlugs: [],
  },
  {
    slug: 'gut-health-habits-telugu',
    title: '7 Morning Habits for Better Gut Health (Telugu Guide)',
    category: 'Gut Health',
    tag: 'Gut Health',
    readTimeMinutes: 5,
    publishedDate: '2025-03-01',
    views: 4300,
    excerpt:
      'Easy morning routine changes that improve digestion and reduce bloating over time.',
    heroImage: 'bg-emerald-800',
    sections: [],
    relatedSlugs: [],
  },
  {
    slug: 'kids-lunchbox-ideas',
    title: 'Healthy Kids Lunchbox Ideas — Telugu Style Tiffins',
    category: 'Kids Nutrition',
    tag: 'Kids',
    readTimeMinutes: 6,
    publishedDate: '2025-02-18',
    views: 3900,
    excerpt:
      'Balanced tiffin ideas that combine millets, veggies, and protein so your child comes home with an empty box.',
    heroImage: 'bg-emerald-800',
    sections: [],
    relatedSlugs: [],
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug)
}


export type Post = {
  id: number
  title: string
  category: string
  tag: string
  readTime: string
  daysAgo: string
  excerpt: string
  slug?: string
}

export const latestArticles: Post[] = [
  {
    id: 1,
    title: '7-day ragi diet plan for fast results',
    category: 'Weight Loss',
    tag: 'WEIGHT LOSS',
    readTime: '7 min read',
    daysAgo: '2 days ago',
    excerpt: 'How to use ragi mudda, dosa, and porridge for safe fat loss in Telugu households.',
    slug: '7-day-ragi-diet-plan-weight-loss',
  },
  {
    id: 2,
    title: 'Foxtail millet upma — step by step',
    category: 'Millets',
    tag: 'MILLET RECIPES',
    readTime: '5 min read',
    daysAgo: '4 days ago',
    excerpt: 'A fiber-rich breakfast that keeps your blood sugar stable till lunch.',
    slug: 'millet-breakfast-ideas',
  },
  {
    id: 3,
    title: '5 foods that spike blood sugar — avoid these',
    category: 'Diabetes',
    tag: 'DIABETES',
    readTime: '6 min read',
    daysAgo: '1 week ago',
    excerpt: 'Common South Indian foods that secretly raise your post-meal sugars.',
    slug: '10-diabetic-friendly-telugu-breakfasts',
  },
]

export const trendingRecipes: Post[] = [
  {
    id: 4,
    title: 'Jowar dosa with coconut chutney',
    category: 'Breakfast',
    tag: 'BREAKFAST',
    readTime: '3 min read',
    daysAgo: '1 day ago',
    excerpt: '',
  },
  {
    id: 5,
    title: 'Drumstick leaf smoothie for diabetics',
    category: 'Juices',
    tag: 'JUICES',
    readTime: '4 min read',
    daysAgo: '3 days ago',
    excerpt: '',
  },
  {
    id: 6,
    title: 'Instant ragi idli without fermentation',
    category: 'Snacks',
    tag: 'SNACKS',
    readTime: '5 min read',
    daysAgo: '5 days ago',
    excerpt: '',
  },
  {
    id: 7,
    title: '5-minute millet curd rice bowl',
    category: 'Dinner',
    tag: 'DINNER',
    readTime: '4 min read',
    daysAgo: '6 days ago',
    excerpt: '',
  },
]

export const healthTipArticles: Post[] = [
  {
    id: 8,
    title: 'Morning routine for better gut health',
    category: 'Gut Health',
    tag: 'GUT HEALTH',
    readTime: '4 min read',
    daysAgo: '3 days ago',
    excerpt: 'Simple Ayurvedic-inspired habits to keep your digestion strong.',
  },
  {
    id: 9,
    title: 'How to build immunity with millets',
    category: 'Immunity',
    tag: 'IMMUNITY',
    readTime: '5 min read',
    daysAgo: '5 days ago',
    excerpt: 'Use bajra, jowar, and ragi to support your immune system naturally.',
  },
  {
    id: 10,
    title: 'Kids tiffin box ideas for busy moms',
    category: 'Kids Nutrition',
    tag: 'KIDS',
    readTime: '6 min read',
    daysAgo: '1 week ago',
    excerpt: 'Balanced, fuss-free Telugu tiffin ideas your child will actually finish.',
  },
]


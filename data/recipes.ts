export type Recipe = {
  slug: string
  title: string
  tag: string
  emoji: string
  description: string
  readTimeMinutes: number
  servings: number
  isFeatured: boolean
  ingredients: string[]
  steps: string[]
  nutritionFacts: {
    calories: number
    protein: number
    carbs: number
    fat: number
    fiber: number
  }
}

export const recipes: Recipe[] = [
  {
    slug: 'jowar-dosa-with-coconut-chutney',
    title: 'జొన్న దోసె & కొబ్బరి చట్నీ',
    tag: 'Breakfast',
    emoji: '🥞',
    description: 'హై ఫైబర్ బ్రేక్‌ఫాస్ట్ — షుగర్ స్పైక్స్ తగ్గడానికి మంచిది.',
    readTimeMinutes: 5,
    servings: 2,
    isFeatured: true,
    ingredients: [
      'జొన్న పిండి – 1 కప్పు',
      'ఉప్పు – తగినంత',
      'నీరు – అవసరమైనంత',
      'కొబ్బరి – 1/2 కప్పు (చట్నీకి)',
      'పచ్చిమిర్చి – 1',
    ],
    steps: [
      'జొన్న పిండిలో ఉప్పు వేసి నీరు పోసి మిడియమ్ బ్యాటర్ చేయండి.',
      'పాన్ వేడి చేసి సన్నగా దోసె వేసి రెండు వైపులా కాల్చండి.',
      'చట్నీ కోసం కొబ్బరి, పచ్చిమిర్చి, ఉప్పు వేసి గ్రైండ్ చేయండి.',
    ],
    nutritionFacts: { calories: 280, protein: 8, carbs: 44, fat: 7, fiber: 6 },
  },
  {
    slug: 'ragi-mudda-sambar',
    title: 'రాగి ముద్ద & సాంబర్',
    tag: 'Millets & Superfoods',
    emoji: '🍲',
    description: 'పూర్తి భోజనం — ఫైబర్ + ప్రొటిన్ కాంబో.',
    readTimeMinutes: 6,
    servings: 2,
    isFeatured: false,
    ingredients: ['రాగి పిండి – 1 కప్పు', 'నీరు – 2 కప్పులు', 'ఉప్పు'],
    steps: ['నీరు మరిగించి రాగి పిండి వేసి కలపండి.', 'ముద్దగా చేసి సాంబర్‌తో తినండి.'],
    nutritionFacts: { calories: 320, protein: 9, carbs: 52, fat: 8, fiber: 7 },
  },
  {
    slug: 'diabetic-friendly-upma',
    title: 'డయాబెటిక్ ఫ్రెండ్లీ ఉప్మా',
    tag: 'Diabetic Friendly',
    emoji: '🥣',
    description: 'లో GI ఉప్మా — సింపుల్, త్వరగా తయారవుతుంది.',
    readTimeMinutes: 4,
    servings: 2,
    isFeatured: false,
    ingredients: ['సూజి/మిల్లెట్ రవ్వ – 1 కప్పు', 'కూరగాయలు', 'ఉప్పు'],
    steps: ['కూరగాయలు వేయించి రవ్వ జోడించి ఉడికించండి.'],
    nutritionFacts: { calories: 260, protein: 7, carbs: 40, fat: 7, fiber: 5 },
  },
  {
    slug: 'kids-veg-pulao',
    title: 'పిల్లల కోసం వెజ్ పులావ్',
    tag: 'Kids',
    emoji: '🍚',
    description: 'టిఫిన్ బాక్స్ కి పర్ఫెక్ట్ — కూరగాయలతో బ్యాలెన్స్.',
    readTimeMinutes: 6,
    servings: 3,
    isFeatured: false,
    ingredients: ['బాస్మతి బియ్యం', 'క్యారెట్', 'బీన్స్', 'పీస్', 'మసాలా'],
    steps: ['బియ్యం ఉడికించి కూరగాయలతో కలపండి.'],
    nutritionFacts: { calories: 340, protein: 8, carbs: 58, fat: 9, fiber: 6 },
  },
  {
    slug: 'weight-loss-salad-bowl',
    title: 'బరువు తగ్గడానికి సలాడ్ బౌల్',
    tag: 'Weight Loss',
    emoji: '🥗',
    description: 'ఫైబర్ ఎక్కువ — తక్కువ కేలరీలు.',
    readTimeMinutes: 3,
    servings: 1,
    isFeatured: false,
    ingredients: ['కీరా', 'టమాటా', 'క్యారెట్', 'లెమన్', 'ఉప్పు'],
    steps: ['అన్నీ కలిపి లెమన్ రసం జోడించండి.'],
    nutritionFacts: { calories: 140, protein: 3, carbs: 18, fat: 5, fiber: 6 },
  },
  {
    slug: 'snacks-smoothie',
    title: 'డ్రమ్‌స్టిక్ లీఫ్ స్మూతీ',
    tag: 'Snacks & Juices',
    emoji: '🥤',
    description: 'హెల్తీ జ్యూస్ — డయాబెటిస్ కి సహాయం.',
    readTimeMinutes: 3,
    servings: 1,
    isFeatured: false,
    ingredients: ['మునగ ఆకులు', 'పెరుగు', 'ఉప్పు', 'నీరు'],
    steps: ['అన్నీ గ్రైండ్ చేసి సర్వ్ చేయండి.'],
    nutritionFacts: { calories: 180, protein: 6, carbs: 20, fat: 7, fiber: 4 },
  },
]

export const recipeTabs = [
  'All',
  'Breakfast',
  'Lunch',
  'Dinner',
  'Snacks & Juices',
  'Millets & Superfoods',
  'Diabetic Friendly',
  'Weight Loss',
  'Kids',
] as const


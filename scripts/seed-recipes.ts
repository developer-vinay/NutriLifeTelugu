import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { connectDB } from '../lib/mongodb'
import { Recipe } from '../models/Recipe'

const teluguRecipes = [
  {
    title: 'రాగి జావ — పిల్లలకు & పెద్దలకు',
    slug: 'ragi-java-kids-adults',
    language: 'te',
    category: 'breakfast',
    tag: 'Breakfast',
    isFeatured: true,
    isPublished: true,
    author: 'NutriLife Telugu',
    description: 'రాగి జావ చాలా పోషకమైనది. పిల్లలకు, వృద్ధులకు, డయాబెటిక్స్‌కు చాలా మంచిది.',
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    servings: 2,
    ingredients: [
      'రాగి పిండి — 3 టేబుల్ స్పూన్లు',
      'నీళ్ళు — 2 కప్పులు',
      'పాలు — 1 కప్పు',
      'బెల్లం — రుచికి తగినట్టు',
      'ఏలకులు — 2',
      'నెయ్యి — 1 టీ స్పూన్',
    ],
    content: `<p>రాగి జావ తయారు చేయడం చాలా సులభం. ఇది పోషకాలతో నిండి ఉంటుంది.</p>
<h2>తయారీ విధానం</h2>
<ol>
<li>రాగి పిండిని కొంచెం నీళ్ళలో కలిపి గడ్డలు లేకుండా చేయండి.</li>
<li>మిగతా నీళ్ళు మరిగించి, రాగి మిశ్రమం వేయండి.</li>
<li>నిరంతరం కలుపుతూ 10 నిమిషాలు వండండి.</li>
<li>పాలు, బెల్లం, ఏలకులు వేసి మరో 5 నిమిషాలు వండండి.</li>
<li>నెయ్యి వేసి వడ్డించండి.</li>
</ol>
<p>రోజూ ఉదయం తింటే ఎముకలు బలంగా ఉంటాయి. రాగిలో కాల్షియం చాలా ఎక్కువగా ఉంటుంది.</p>`,
    nutritionFacts: { calories: 180, protein: 5, carbs: 32, fat: 4, fiber: 3 },
    views: 0, likes: 0,
  },
  {
    title: 'పెసరట్టు — ఆంధ్రా స్టైల్',
    slug: 'pesarattu-andhra-style',
    language: 'te',
    category: 'breakfast',
    tag: 'Breakfast',
    isFeatured: false,
    isPublished: true,
    author: 'NutriLife Telugu',
    description: 'పెసరట్టు ప్రోటీన్ తో నిండి ఉంటుంది. బరువు తగ్గాలనుకునే వాళ్ళకు చాలా మంచిది.',
    prepTimeMinutes: 20,
    cookTimeMinutes: 20,
    servings: 4,
    ingredients: [
      'పచ్చి పెసలు — 1 కప్పు',
      'అల్లం — చిన్న ముక్క',
      'పచ్చి మిర్చి — 2',
      'ఉప్పు — రుచికి తగినట్టు',
      'నూనె — వేయడానికి',
      'ఉల్లిపాయ — 1 (చిన్నది)',
    ],
    content: `<p>పెసరట్టు తెలుగు వాళ్ళ ఇష్టమైన అల్పాహారం. ఇది ప్రోటీన్ తో నిండి ఉంటుంది.</p>
<h2>తయారీ విధానం</h2>
<ol>
<li>పెసలు రాత్రంతా నానబెట్టండి.</li>
<li>అల్లం, పచ్చి మిర్చి, ఉప్పు వేసి మెత్తగా రుబ్బండి.</li>
<li>తవా వేడి చేసి, పిండి పోసి సన్నగా పరవండి.</li>
<li>ఉల్లిపాయ వేసి, నూనె చుట్టూ పోసి కాల్చండి.</li>
<li>రెండు వైపులా కాల్చి వడ్డించండి.</li>
</ol>
<p>అల్లం పచ్చడి లేదా కొబ్బరి చట్నీతో తింటే చాలా రుచిగా ఉంటుంది.</p>`,
    nutritionFacts: { calories: 150, protein: 9, carbs: 22, fat: 3, fiber: 4 },
    views: 0, likes: 0,
  },
  {
    title: 'సాంబార్ — తెలుగు ఇంటి స్టైల్',
    slug: 'sambar-telugu-home-style',
    language: 'te',
    category: 'lunch',
    tag: 'Lunch',
    isFeatured: false,
    isPublished: true,
    author: 'NutriLife Telugu',
    description: 'ఇంట్లో చేసే సాంబార్ రెస్టారెంట్ కంటే రుచిగా ఉంటుంది. కూరగాయలు ఎక్కువగా వేస్తే పోషకాలు ఎక్కువ.',
    prepTimeMinutes: 15,
    cookTimeMinutes: 25,
    servings: 4,
    ingredients: [
      'కందిపప్పు — 1 కప్పు',
      'టమాటాలు — 2',
      'ఉల్లిపాయలు — 2',
      'వంకాయ — 1',
      'డ్రమ్‌స్టిక్ — 1',
      'సాంబార్ పొడి — 2 టేబుల్ స్పూన్లు',
      'పులిహార పేస్ట్ — చిన్న ముద్ద',
      'కరివేపాకు, కొత్తిమీర',
    ],
    content: `<p>సాంబార్ అన్నంతో తింటే పూర్తి భోజనం అవుతుంది. ప్రోటీన్, ఫైబర్ రెండూ ఉంటాయి.</p>
<h2>తయారీ విధానం</h2>
<ol>
<li>కందిపప్పు ఉడికించి పక్కన పెట్టండి.</li>
<li>నూనెలో ఆవాలు, కరివేపాకు వేసి, ఉల్లిపాయలు వేయించండి.</li>
<li>టమాటాలు, కూరగాయలు వేసి వేయించండి.</li>
<li>సాంబార్ పొడి, పులిహార పేస్ట్ వేసి కలపండి.</li>
<li>పప్పు వేసి నీళ్ళు పోసి 15 నిమిషాలు మరగనివ్వండి.</li>
</ol>`,
    nutritionFacts: { calories: 160, protein: 8, carbs: 25, fat: 3, fiber: 6 },
    views: 0, likes: 0,
  },
  {
    title: 'జొన్న రొట్టె — డయాబెటిక్స్‌కు బెస్ట్',
    slug: 'jonna-rotte-diabetic-friendly',
    language: 'te',
    category: 'diabetic-friendly',
    tag: 'Diabetic Friendly',
    isFeatured: false,
    isPublished: true,
    author: 'NutriLife Telugu',
    description: 'జొన్న రొట్టె గ్లైసెమిక్ ఇండెక్స్ తక్కువగా ఉంటుంది. డయాబెటిక్స్‌కు చాలా మంచిది.',
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    servings: 3,
    ingredients: [
      'జొన్న పిండి — 2 కప్పులు',
      'వేడి నీళ్ళు — అవసరమైనంత',
      'ఉప్పు — రుచికి తగినట్టు',
    ],
    content: `<p>జొన్న రొట్టె తెలంగాణ, ఆంధ్రా లో చాలా కాలంగా తింటున్నారు. ఇది గ్లూటెన్ ఫ్రీ కూడా.</p>
<h2>తయారీ విధానం</h2>
<ol>
<li>జొన్న పిండిలో ఉప్పు వేసి, వేడి నీళ్ళు కొంచెం కొంచెం పోసి కలపండి.</li>
<li>మెత్తగా పిండి వేసుకోండి.</li>
<li>చిన్న ముద్దలు చేసి, అరచేతితో సన్నగా చేయండి.</li>
<li>తవా మీద రెండు వైపులా కాల్చండి.</li>
</ol>
<p>పచ్చడి లేదా కూర తో తింటే చాలా రుచిగా ఉంటుంది.</p>`,
    nutritionFacts: { calories: 120, protein: 3, carbs: 25, fat: 1, fiber: 3 },
    views: 0, likes: 0,
  },
  {
    title: 'రాగి లడ్డూ — హెల్దీ స్వీట్',
    slug: 'ragi-laddu-healthy-sweet',
    language: 'te',
    category: 'snacks',
    tag: 'Snacks',
    isFeatured: false,
    isPublished: true,
    author: 'NutriLife Telugu',
    description: 'రాగి లడ్డూ తినడానికి రుచిగా ఉంటుంది, పోషకాలు కూడా ఎక్కువగా ఉంటాయి.',
    prepTimeMinutes: 15,
    cookTimeMinutes: 10,
    servings: 10,
    ingredients: [
      'రాగి పిండి — 1 కప్పు',
      'బెల్లం పొడి — అర కప్పు',
      'నెయ్యి — 3 టేబుల్ స్పూన్లు',
      'ఏలకులు పొడి — అర టీ స్పూన్',
      'జీడిపప్పు — కొంచెం',
    ],
    content: `<p>రాగి లడ్డూ పిల్లలకు చాలా ఇష్టంగా ఉంటుంది. బిస్కెట్లు, చాక్లెట్ల కంటే ఇవి చాలా మంచివి.</p>
<h2>తయారీ విధానం</h2>
<ol>
<li>రాగి పిండిని నెయ్యిలో వేయించి బంగారు రంగు వచ్చేవరకు కాల్చండి.</li>
<li>చల్లారిన తర్వాత బెల్లం పొడి, ఏలకులు వేసి కలపండి.</li>
<li>నెయ్యి వేసి చేతితో ముద్దలు చేయండి.</li>
<li>జీడిపప్పు పెట్టి అలంకరించండి.</li>
</ol>`,
    nutritionFacts: { calories: 140, protein: 3, carbs: 20, fat: 6, fiber: 2 },
    views: 0, likes: 0,
  },
  {
    title: 'కొర్రల ఖిచ్డీ — మిల్లెట్ పవర్',
    slug: 'korrala-khichdi-millet',
    language: 'te',
    category: 'millets',
    tag: 'Millets',
    isFeatured: false,
    isPublished: true,
    author: 'NutriLife Telugu',
    description: 'కొర్రలు తినడం వల్ల బరువు తగ్గుతుంది, డయాబెటిస్ కంట్రోల్ అవుతుంది.',
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    servings: 3,
    ingredients: [
      'కొర్రలు — 1 కప్పు',
      'మూంగ్ దాల్ — అర కప్పు',
      'ఉల్లిపాయ — 1',
      'టమాటా — 1',
      'పచ్చి మిర్చి — 2',
      'అల్లం వెల్లుల్లి పేస్ట్ — 1 టీ స్పూన్',
      'జీలకర్ర, ఆవాలు, కరివేపాకు',
    ],
    content: `<p>కొర్రల ఖిచ్డీ తినడానికి రుచిగా ఉంటుంది, పోషకాలు కూడా ఎక్కువగా ఉంటాయి.</p>
<h2>తయారీ విధానం</h2>
<ol>
<li>కొర్రలు, మూంగ్ దాల్ కలిపి నానబెట్టండి.</li>
<li>నూనెలో ఆవాలు, జీలకర్ర, కరివేపాకు వేయించండి.</li>
<li>ఉల్లిపాయ, అల్లం వెల్లుల్లి పేస్ట్ వేసి వేయించండి.</li>
<li>టమాటా, మిర్చి వేసి కలపండి.</li>
<li>కొర్రలు, దాల్ వేసి నీళ్ళు పోసి ఉడికించండి.</li>
</ol>`,
    nutritionFacts: { calories: 200, protein: 8, carbs: 35, fat: 4, fiber: 5 },
    views: 0, likes: 0,
  },
  {
    title: 'పాలకూర పప్పు — ఐరన్ రిచ్',
    slug: 'palakura-pappu-iron-rich',
    language: 'te',
    category: 'lunch',
    tag: 'Lunch',
    isFeatured: false,
    isPublished: true,
    author: 'NutriLife Telugu',
    description: 'పాలకూర పప్పు ఐరన్, ప్రోటీన్ తో నిండి ఉంటుంది. రక్తహీనత ఉన్నవాళ్ళకు చాలా మంచిది.',
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    servings: 4,
    ingredients: [
      'కందిపప్పు — 1 కప్పు',
      'పాలకూర — 1 కట్ట',
      'టమాటాలు — 2',
      'ఉల్లిపాయ — 1',
      'పసుపు — అర టీ స్పూన్',
      'ఆవాలు, జీలకర్ర, ఎండు మిర్చి',
    ],
    content: `<p>పాలకూర పప్పు అన్నంతో తింటే చాలా రుచిగా ఉంటుంది. ఐరన్ ఎక్కువగా ఉంటుంది.</p>
<h2>తయారీ విధానం</h2>
<ol>
<li>కందిపప్పు ఉడికించి పక్కన పెట్టండి.</li>
<li>నూనెలో ఆవాలు, జీలకర్ర, ఎండు మిర్చి వేయించండి.</li>
<li>ఉల్లిపాయ, టమాటా వేసి వేయించండి.</li>
<li>పాలకూర వేసి వాడిపోయేవరకు వేయించండి.</li>
<li>పప్పు వేసి కలిపి 5 నిమిషాలు మరగనివ్వండి.</li>
</ol>`,
    nutritionFacts: { calories: 170, protein: 10, carbs: 24, fat: 3, fiber: 5 },
    views: 0, likes: 0,
  },
]

const englishRecipes = [
  {
    title: 'Oats Upma — Quick Healthy Breakfast',
    slug: 'oats-upma-healthy-breakfast',
    language: 'en',
    category: 'breakfast',
    tag: 'Breakfast',
    isFeatured: true,
    isPublished: true,
    author: 'NutriLife Telugu',
    description: 'Oats upma is a quick, filling breakfast that keeps you full for hours. High fiber, low glycemic.',
    prepTimeMinutes: 5,
    cookTimeMinutes: 10,
    servings: 2,
    ingredients: [
      'Rolled oats — 1 cup',
      'Onion — 1 medium',
      'Green chilli — 1',
      'Mustard seeds — 1 tsp',
      'Curry leaves — a few',
      'Ginger — small piece',
      'Salt to taste',
      'Oil — 1 tsp',
      'Lemon juice — 1 tsp',
    ],
    content: `<p>Oats upma is one of the easiest healthy breakfasts you can make. It takes under 15 minutes and keeps you full until lunch.</p>
<h2>How to make it</h2>
<ol>
<li>Dry roast oats for 2 minutes and keep aside.</li>
<li>Heat oil, add mustard seeds, curry leaves, green chilli, and ginger.</li>
<li>Add onion and saute until soft.</li>
<li>Add 1.5 cups water and bring to boil.</li>
<li>Add oats and stir continuously for 3-4 minutes until cooked.</li>
<li>Add lemon juice and serve hot.</li>
</ol>
<p>You can add vegetables like carrot, peas, or beans to make it more nutritious.</p>`,
    nutritionFacts: { calories: 200, protein: 7, carbs: 30, fat: 5, fiber: 5 },
    views: 0, likes: 0,
  },
  {
    title: 'Moong Dal Soup — Light and Protein Rich',
    slug: 'moong-dal-soup-protein',
    language: 'en',
    category: 'dinner',
    tag: 'Dinner',
    isFeatured: false,
    isPublished: true,
    author: 'NutriLife Telugu',
    description: 'A simple moong dal soup that is easy to digest, high in protein, and perfect for dinner.',
    prepTimeMinutes: 5,
    cookTimeMinutes: 20,
    servings: 3,
    ingredients: [
      'Yellow moong dal — 1 cup',
      'Turmeric — 1/4 tsp',
      'Cumin seeds — 1 tsp',
      'Garlic — 3 cloves',
      'Ginger — small piece',
      'Salt to taste',
      'Ghee — 1 tsp',
      'Lemon juice — 1 tsp',
    ],
    content: `<p>Moong dal soup is one of the best things you can eat for dinner. It is light, easy to digest, and very filling.</p>
<h2>How to make it</h2>
<ol>
<li>Wash moong dal and pressure cook with turmeric and 3 cups water for 3 whistles.</li>
<li>Heat ghee, add cumin seeds, garlic, and ginger.</li>
<li>Add the cooked dal and mix well.</li>
<li>Add salt and simmer for 5 minutes.</li>
<li>Add lemon juice before serving.</li>
</ol>
<p>This soup is great for people with diabetes, weight loss goals, or anyone who wants a light dinner.</p>`,
    nutritionFacts: { calories: 160, protein: 11, carbs: 24, fat: 3, fiber: 4 },
    views: 0, likes: 0,
  },
  {
    title: 'Egg Bhurji — High Protein Breakfast',
    slug: 'egg-bhurji-high-protein',
    language: 'en',
    category: 'breakfast',
    tag: 'Breakfast',
    isFeatured: false,
    isPublished: true,
    author: 'NutriLife Telugu',
    description: 'Egg bhurji is the fastest high-protein breakfast you can make. Ready in 10 minutes.',
    prepTimeMinutes: 5,
    cookTimeMinutes: 8,
    servings: 2,
    ingredients: [
      'Eggs — 3',
      'Onion — 1 small',
      'Tomato — 1 small',
      'Green chilli — 1',
      'Turmeric — a pinch',
      'Salt and pepper to taste',
      'Oil — 1 tsp',
      'Coriander leaves',
    ],
    content: `<p>Egg bhurji is a classic Indian scrambled egg dish. It is quick, tasty, and very high in protein.</p>
<h2>How to make it</h2>
<ol>
<li>Beat eggs with salt and pepper.</li>
<li>Heat oil, add onion and green chilli, saute for 2 minutes.</li>
<li>Add tomato and cook until soft.</li>
<li>Pour in the eggs and scramble on medium heat.</li>
<li>Add turmeric and coriander leaves, mix well.</li>
</ol>
<p>Eat with whole wheat roti or as is. Avoid white bread — it spikes blood sugar.</p>`,
    nutritionFacts: { calories: 180, protein: 14, carbs: 6, fat: 11, fiber: 1 },
    views: 0, likes: 0,
  },
  {
    title: 'Ragi Dosa — Crispy and Nutritious',
    slug: 'ragi-dosa-crispy-nutritious',
    language: 'en',
    category: 'breakfast',
    tag: 'Breakfast',
    isFeatured: false,
    isPublished: true,
    author: 'NutriLife Telugu',
    description: 'Ragi dosa is a crispy, nutritious alternative to regular dosa. High in calcium and fiber.',
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    servings: 4,
    ingredients: [
      'Ragi flour — 1 cup',
      'Rice flour — 1/4 cup',
      'Onion — 1 finely chopped',
      'Green chilli — 1',
      'Cumin seeds — 1 tsp',
      'Curry leaves',
      'Salt to taste',
      'Water — as needed',
      'Oil for cooking',
    ],
    content: `<p>Ragi dosa is one of the healthiest breakfast options. It is gluten-free, high in calcium, and very filling.</p>
<h2>How to make it</h2>
<ol>
<li>Mix ragi flour, rice flour, salt, and water to make a thin batter.</li>
<li>Add onion, green chilli, cumin seeds, and curry leaves.</li>
<li>Heat a tawa and pour the batter in a thin circle.</li>
<li>Drizzle oil around the edges and cook until crispy.</li>
<li>Serve with coconut chutney or sambar.</li>
</ol>`,
    nutritionFacts: { calories: 140, protein: 4, carbs: 26, fat: 3, fiber: 3 },
    views: 0, likes: 0,
  },
  {
    title: 'Sprouts Salad — Weight Loss Snack',
    slug: 'sprouts-salad-weight-loss',
    language: 'en',
    category: 'snacks',
    tag: 'Snacks',
    isFeatured: false,
    isPublished: true,
    author: 'NutriLife Telugu',
    description: 'Sprouts salad is the best evening snack for weight loss. High protein, zero cooking needed.',
    prepTimeMinutes: 10,
    cookTimeMinutes: 0,
    servings: 2,
    ingredients: [
      'Mixed sprouts — 1 cup',
      'Tomato — 1 chopped',
      'Onion — 1 small chopped',
      'Cucumber — half',
      'Green chilli — 1',
      'Lemon juice — 1 tsp',
      'Chaat masala — 1/2 tsp',
      'Salt to taste',
      'Coriander leaves',
    ],
    content: `<p>Sprouts salad is the easiest healthy snack. No cooking, just mix and eat. Very high in protein and fiber.</p>
<h2>How to make it</h2>
<ol>
<li>Soak moong and chana overnight, drain and keep covered for 8 hours to sprout.</li>
<li>Mix sprouts with all chopped vegetables.</li>
<li>Add lemon juice, chaat masala, and salt.</li>
<li>Garnish with coriander and serve immediately.</li>
</ol>
<p>Eat this instead of biscuits or chips in the evening. Your body will thank you.</p>`,
    nutritionFacts: { calories: 120, protein: 8, carbs: 18, fat: 1, fiber: 5 },
    views: 0, likes: 0,
  },
  {
    title: 'Foxtail Millet Pulao — Healthy One Pot Meal',
    slug: 'foxtail-millet-pulao',
    language: 'en',
    category: 'millets',
    tag: 'Millets',
    isFeatured: false,
    isPublished: true,
    author: 'NutriLife Telugu',
    description: 'Foxtail millet pulao is a healthy one-pot meal. Lower glycemic index than rice, high in fiber.',
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    servings: 3,
    ingredients: [
      'Foxtail millet (korralu) — 1 cup',
      'Mixed vegetables — 1 cup',
      'Onion — 1',
      'Ginger garlic paste — 1 tsp',
      'Whole spices — bay leaf, cloves, cardamom',
      'Mint leaves',
      'Salt to taste',
      'Oil — 1 tbsp',
    ],
    content: `<p>Foxtail millet pulao tastes just like rice pulao but is much healthier. It has a lower glycemic index which is great for diabetics.</p>
<h2>How to make it</h2>
<ol>
<li>Wash and soak millet for 20 minutes.</li>
<li>Heat oil, add whole spices and saute for 30 seconds.</li>
<li>Add onion and ginger garlic paste, cook until golden.</li>
<li>Add vegetables and saute for 3 minutes.</li>
<li>Add millet, 2 cups water, salt, and mint leaves.</li>
<li>Cover and cook on low heat for 15 minutes.</li>
</ol>`,
    nutritionFacts: { calories: 220, protein: 6, carbs: 38, fat: 5, fiber: 4 },
    views: 0, likes: 0,
  },
  {
    title: 'Diabetic Friendly Vegetable Soup',
    slug: 'diabetic-vegetable-soup',
    language: 'en',
    category: 'diabetic-friendly',
    tag: 'Diabetic Friendly',
    isFeatured: false,
    isPublished: true,
    author: 'NutriLife Telugu',
    description: 'A low-carb vegetable soup that is perfect for diabetics. Filling, nutritious, and easy to make.',
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    servings: 3,
    ingredients: [
      'Spinach — 1 cup',
      'Carrot — 1',
      'Beans — handful',
      'Tomato — 2',
      'Garlic — 4 cloves',
      'Pepper — 1 tsp',
      'Cumin — 1 tsp',
      'Salt to taste',
    ],
    content: `<p>This vegetable soup is low in carbs and calories but very filling. Perfect for diabetics who want to eat well without spiking blood sugar.</p>
<h2>How to make it</h2>
<ol>
<li>Chop all vegetables into small pieces.</li>
<li>Boil 3 cups water, add all vegetables and garlic.</li>
<li>Cook for 15 minutes until vegetables are soft.</li>
<li>Add cumin, pepper, and salt.</li>
<li>Blend half the soup for a thicker consistency if preferred.</li>
</ol>
<p>Drink this soup before your main meal to reduce how much you eat overall.</p>`,
    nutritionFacts: { calories: 80, protein: 3, carbs: 14, fat: 1, fiber: 4 },
    views: 0, likes: 0,
  },
]

async function main() {
  await connectDB()
  console.log('Connected to DB')

  let inserted = 0
  let skipped = 0

  for (const recipe of [...teluguRecipes, ...englishRecipes]) {
    const exists = await Recipe.findOne({ slug: recipe.slug })
    if (exists) {
      console.log(`SKIP (exists): ${recipe.slug}`)
      skipped++
      continue
    }
    await Recipe.create(recipe)
    console.log(`INSERT: ${recipe.slug} [${recipe.language}]`)
    inserted++
  }

  console.log(`\nDone. Inserted: ${inserted}, Skipped: ${skipped}`)
  process.exit(0)
}

main().catch((e) => { console.error(e); process.exit(1) })

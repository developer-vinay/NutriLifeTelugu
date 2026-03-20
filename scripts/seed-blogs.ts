import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { connectDB } from '../lib/mongodb'
import { Post } from '../models/Post'

const teluguPosts = [
  {
    title: 'రోజూ ఉదయం ఖాళీ కడుపుతో నీళ్ళు తాగడం వల్ల కలిగే ప్రయోజనాలు',
    slug: 'morning-water-benefits-te',
    language: 'te',
    category: 'general',
    tag: 'Health Tips',
    isFeatured: true,
    isPublished: true,
    author: 'NutriLifeMithra',
    excerpt: 'ఉదయం లేచిన వెంటనే నీళ్ళు తాగడం వల్ల జీర్ణశక్తి మెరుగవుతుంది, చర్మం మెరుస్తుంది.',
    content: `<p>ఉదయం లేచిన వెంటనే ఒక లేదా రెండు గ్లాసుల నీళ్ళు తాగడం చాలా మంచి అలవాటు. ఇది జపాన్ లో చాలా కాలంగా పాటిస్తున్న ఆరోగ్య రహస్యం.</p>
<h2>ప్రయోజనాలు</h2>
<ul>
<li>జీర్ణశక్తి మెరుగవుతుంది</li>
<li>మెటబాలిజం పెరుగుతుంది</li>
<li>చర్మం మెరుస్తుంది</li>
<li>మలబద్ధకం తగ్గుతుంది</li>
<li>రక్తం శుద్ధి అవుతుంది</li>
</ul>
<h2>ఎంత తాగాలి?</h2>
<p>ఉదయం లేచిన వెంటనే కనీసం 500ml నీళ్ళు తాగండి. బ్రష్ చేయడానికి ముందే తాగడం మరింత మంచిది.</p>
<p>నీళ్ళు తాగిన తర్వాత 30 నిమిషాలు ఏమీ తినకండి. ఈ అలవాటు 30 రోజులు పాటిస్తే తేడా కనిపిస్తుంది.</p>`,
    readTimeMinutes: 3,
    views: 0,
    likes: 0,
    contentImages: [],
  },
  {
    title: 'డయాబెటిస్ కంట్రోల్ చేయడానికి తినాల్సిన 10 ఆహారాలు',
    slug: 'diabetes-control-foods-te',
    language: 'te',
    category: 'diabetes',
    tag: 'Diabetes',
    isFeatured: true,
    isPublished: true,
    author: 'NutriLifeMithra',
    excerpt: 'డయాబెటిస్ ఉన్నవాళ్ళు ఈ 10 ఆహారాలు తింటే బ్లడ్ షుగర్ కంట్రోల్ లో ఉంటుంది.',
    content: `<p>డయాబెటిస్ ఉన్నవాళ్ళకు ఏం తినాలో, ఏం తినకూడదో తెలుసుకోవడం చాలా ముఖ్యం. సరైన ఆహారం తింటే మందులు తక్కువగా అవసరమవుతాయి.</p>
<h2>తినాల్సిన ఆహారాలు</h2>
<ol>
<li><strong>రాగి</strong> — గ్లైసెమిక్ ఇండెక్స్ తక్కువ, ఫైబర్ ఎక్కువ</li>
<li><strong>మెంతులు</strong> — ఇన్సులిన్ సెన్సిటివిటీ పెంచుతాయి</li>
<li><strong>కరేలా</strong> — బ్లడ్ షుగర్ తగ్గిస్తుంది</li>
<li><strong>పాలకూర</strong> — మెగ్నీషియం ఎక్కువగా ఉంటుంది</li>
<li><strong>అవకాడో</strong> — హెల్దీ ఫ్యాట్స్ ఉంటాయి</li>
<li><strong>వాల్‌నట్స్</strong> — ఒమేగా-3 ఫ్యాటీ యాసిడ్స్</li>
<li><strong>చేపలు</strong> — ప్రోటీన్ ఎక్కువ, కార్బ్స్ తక్కువ</li>
<li><strong>గుడ్లు</strong> — బ్లడ్ షుగర్ స్పైక్ చేయవు</li>
<li><strong>బ్రోకలీ</strong> — యాంటీఆక్సిడెంట్స్ ఎక్కువ</li>
<li><strong>చిక్కుళ్ళు</strong> — ప్రోటీన్, ఫైబర్ రెండూ ఉంటాయి</li>
</ol>
<p>ఈ ఆహారాలు రోజూ తింటే 3 నెలల్లో తేడా కనిపిస్తుంది. డాక్టర్ సలహా కూడా తీసుకోండి.</p>`,
    readTimeMinutes: 4,
    views: 0,
    likes: 0,
    contentImages: [],
  },
  {
    title: 'బరువు తగ్గడానికి రాత్రి భోజనం ఎలా ఉండాలి?',
    slug: 'weight-loss-dinner-tips-te',
    language: 'te',
    category: 'weight-loss',
    tag: 'Weight Loss',
    isFeatured: false,
    isPublished: true,
    author: 'NutriLifeMithra',
    excerpt: 'రాత్రి భోజనం తక్కువగా, తేలికగా తింటే బరువు తగ్గడం సులభమవుతుంది.',
    content: `<p>బరువు తగ్గాలంటే రాత్రి భోజనం చాలా ముఖ్యమైన పాత్ర పోషిస్తుంది. చాలా మంది రాత్రి ఎక్కువగా తింటారు — ఇది బరువు పెరగడానికి ప్రధాన కారణం.</p>
<h2>రాత్రి భోజనం నియమాలు</h2>
<ul>
<li>రాత్రి 7-8 గంటలలోపు తినండి</li>
<li>కార్బ్స్ తక్కువగా తినండి</li>
<li>ప్రోటీన్ ఎక్కువగా తినండి</li>
<li>నిద్రకు 2 గంటల ముందు తినడం ఆపండి</li>
</ul>
<h2>మంచి రాత్రి భోజనం ఉదాహరణలు</h2>
<ul>
<li>మూంగ్ దాల్ సూప్ + 1 రొట్టె</li>
<li>వేయించిన కూరగాయలు + గుడ్లు</li>
<li>చేప కూర + సలాడ్</li>
</ul>
<p>రాత్రి అన్నం తినడం తగ్గించండి. అన్నం బదులు రొట్టె లేదా మిల్లెట్ తినండి.</p>`,
    readTimeMinutes: 3,
    views: 0,
    likes: 0,
    contentImages: [],
  },
  {
    title: 'పిల్లల పోషణ — తల్లిదండ్రులు తెలుసుకోవాల్సిన విషయాలు',
    slug: 'child-nutrition-guide-te',
    language: 'te',
    category: 'kids-nutrition',
    tag: 'Nutrition',
    isFeatured: false,
    isPublished: true,
    author: 'NutriLifeMithra',
    excerpt: 'పిల్లలకు సరైన పోషణ ఇవ్వడం ఎలా? ఏ వయసులో ఏం తినాలి?',
    content: `<p>పిల్లల శారీరక, మానసిక వికాసానికి సరైన పోషణ చాలా అవసరం. చిన్నప్పటి నుండి మంచి అలవాట్లు నేర్పించడం తల్లిదండ్రుల బాధ్యత.</p>
<h2>వయసు వారీగా పోషణ</h2>
<h3>1-3 సంవత్సరాలు</h3>
<p>పాలు, పండ్లు, కూరగాయలు, పప్పు అన్నం ఇవ్వండి. జంక్ ఫుడ్ పూర్తిగా నివారించండి.</p>
<h3>4-10 సంవత్సరాలు</h3>
<p>ప్రోటీన్ ఎక్కువగా ఇవ్వండి. గుడ్లు, పాలు, పప్పులు రోజూ ఇవ్వండి.</p>
<h3>11-18 సంవత్సరాలు</h3>
<p>కాల్షియం, ఐరన్ ఎక్కువగా అవసరం. రాగి, పాలు, ఆకుకూరలు ఇవ్వండి.</p>
<p>పిల్లలకు రోజూ కనీసం 30 నిమిషాలు ఆటలు ఆడించండి. శారీరక వ్యాయామం కూడా పోషణలో భాగమే.</p>`,
    readTimeMinutes: 4,
    views: 0,
    likes: 0,
    contentImages: [],
  },
  {
    title: 'మిల్లెట్స్ తినడం వల్ల కలిగే 7 ఆరోగ్య ప్రయోజనాలు',
    slug: 'millets-health-benefits-te',
    language: 'te',
    category: 'millets',
    tag: 'Millets',
    isFeatured: false,
    isPublished: true,
    author: 'NutriLifeMithra',
    excerpt: 'మిల్లెట్స్ తినడం వల్ల డయాబెటిస్, బరువు, హృదయ సమస్యలు తగ్గుతాయి.',
    content: `<p>మన పూర్వీకులు తినే ధాన్యాలు మళ్ళీ ప్రాచుర్యం పొందుతున్నాయి. మిల్లెట్స్ అంటే జొన్న, రాగి, కొర్రలు, సజ్జలు వంటివి.</p>
<h2>7 ప్రయోజనాలు</h2>
<ol>
<li>బ్లడ్ షుగర్ కంట్రోల్ చేస్తాయి</li>
<li>బరువు తగ్గడానికి సహాయపడతాయి</li>
<li>హృదయ ఆరోగ్యం మెరుగవుతుంది</li>
<li>జీర్ణశక్తి పెరుగుతుంది</li>
<li>గ్లూటెన్ ఫ్రీ — సెలియాక్ వ్యాధి ఉన్నవాళ్ళకు మంచిది</li>
<li>ఎముకలు బలంగా ఉంటాయి</li>
<li>రోగనిరోధక శక్తి పెరుగుతుంది</li>
</ol>
<p>వారంలో కనీసం 3 రోజులు మిల్లెట్స్ తినండి. అన్నం బదులు మిల్లెట్ వాడండి.</p>`,
    readTimeMinutes: 3,
    views: 0,
    likes: 0,
    contentImages: [],
  },
]

const englishPosts = [
  {
    title: '10 Foods That Naturally Lower Blood Sugar',
    slug: 'foods-lower-blood-sugar-en',
    language: 'en',
    category: 'diabetes',
    tag: 'Diabetes',
    isFeatured: true,
    isPublished: true,
    author: 'NutriLifeMithra',
    excerpt: 'These 10 foods can help keep your blood sugar in check without medication.',
    content: `<p>Managing blood sugar through diet is one of the most powerful things you can do for your health. Here are 10 foods that science backs for lowering blood sugar naturally.</p>
<h2>The Top 10</h2>
<ol>
<li><strong>Fenugreek seeds</strong> — Soak overnight and eat on empty stomach</li>
<li><strong>Bitter gourd (karela)</strong> — Juice or stir-fry, powerful blood sugar reducer</li>
<li><strong>Cinnamon</strong> — Add to tea or oats daily</li>
<li><strong>Leafy greens</strong> — Spinach, methi, palak are all excellent</li>
<li><strong>Eggs</strong> — High protein, zero carbs, no blood sugar spike</li>
<li><strong>Nuts</strong> — Almonds and walnuts slow glucose absorption</li>
<li><strong>Ragi (finger millet)</strong> — Low glycemic index grain</li>
<li><strong>Garlic</strong> — Improves insulin sensitivity</li>
<li><strong>Turmeric</strong> — Anti-inflammatory, helps insulin function</li>
<li><strong>Legumes</strong> — Slow-digesting carbs with high fiber</li>
</ol>
<p>Combine these foods with regular walking and you will see results within weeks. Always consult your doctor before changing your diet significantly.</p>`,
    readTimeMinutes: 4,
    views: 0,
    likes: 0,
    contentImages: [],
  },
  {
    title: 'Why You Should Eat Breakfast Every Day',
    slug: 'why-eat-breakfast-daily-en',
    language: 'en',
    category: 'general',
    tag: 'Health Tips',
    isFeatured: true,
    isPublished: true,
    author: 'NutriLifeMithra',
    excerpt: 'Skipping breakfast slows your metabolism and leads to overeating later. Here is why breakfast matters.',
    content: `<p>Many people skip breakfast thinking it will help them lose weight. The opposite is usually true. Skipping breakfast slows your metabolism and makes you overeat at lunch and dinner.</p>
<h2>What Happens When You Skip Breakfast</h2>
<ul>
<li>Blood sugar drops, causing fatigue and brain fog</li>
<li>Cortisol (stress hormone) spikes</li>
<li>You crave high-calorie foods by mid-morning</li>
<li>Metabolism slows down to conserve energy</li>
</ul>
<h2>What to Eat for Breakfast</h2>
<p>The best breakfasts combine protein, fiber, and healthy fats:</p>
<ul>
<li>Eggs + whole grain toast</li>
<li>Oats with nuts and fruit</li>
<li>Ragi dosa with chutney</li>
<li>Pesarattu with ginger chutney</li>
</ul>
<p>Aim to eat within 1 hour of waking up. Keep it simple — it does not need to be elaborate.</p>`,
    readTimeMinutes: 3,
    views: 0,
    likes: 0,
    contentImages: [],
  },
  {
    title: 'The Truth About Protein — How Much Do You Really Need?',
    slug: 'protein-how-much-need-en',
    language: 'en',
    category: 'general',
    tag: 'Nutrition',
    isFeatured: false,
    isPublished: true,
    author: 'NutriLifeMithra',
    excerpt: 'Most Indians are protein deficient. Find out how much protein you actually need and the best sources.',
    content: `<p>Protein is the most important macronutrient for building muscle, losing fat, and staying healthy. Yet most Indians eat far less protein than they need.</p>
<h2>How Much Protein Do You Need?</h2>
<p>The general recommendation is 0.8g per kg of body weight. But for active people, 1.2–1.6g per kg is better.</p>
<p>For a 60kg person: 48–96g of protein per day.</p>
<h2>Best Protein Sources</h2>
<ul>
<li>Eggs — 6g per egg, complete protein</li>
<li>Chicken breast — 31g per 100g</li>
<li>Fish — 20-25g per 100g</li>
<li>Paneer — 18g per 100g</li>
<li>Lentils (dal) — 9g per 100g cooked</li>
<li>Greek yogurt — 10g per 100g</li>
<li>Peanuts — 26g per 100g</li>
</ul>
<p>Spread your protein intake across all meals. Your body can only absorb about 30-40g per meal effectively.</p>`,
    readTimeMinutes: 4,
    views: 0,
    likes: 0,
    contentImages: [],
  },
  {
    title: '5 Simple Habits for Better Gut Health',
    slug: 'gut-health-habits-en',
    language: 'en',
    category: 'gut-health',
    tag: 'Health Tips',
    isFeatured: false,
    isPublished: true,
    author: 'NutriLifeMithra',
    excerpt: 'Your gut health affects everything — mood, immunity, weight. These 5 habits will transform your gut.',
    content: `<p>Your gut is often called the second brain. It affects your mood, immune system, weight, and even skin. Here are 5 simple habits to improve your gut health starting today.</p>
<h2>5 Gut Health Habits</h2>
<ol>
<li><strong>Eat fermented foods daily</strong> — Curd, idli, dosa batter, pickles all contain probiotics</li>
<li><strong>Eat more fiber</strong> — Vegetables, fruits, legumes feed good gut bacteria</li>
<li><strong>Drink enough water</strong> — Keeps things moving, prevents constipation</li>
<li><strong>Reduce sugar and processed food</strong> — These feed bad bacteria</li>
<li><strong>Manage stress</strong> — Stress directly harms gut bacteria balance</li>
</ol>
<h2>Signs of Poor Gut Health</h2>
<ul>
<li>Bloating after meals</li>
<li>Frequent constipation or diarrhea</li>
<li>Skin problems like acne</li>
<li>Constant fatigue</li>
<li>Food intolerances</li>
</ul>
<p>Start with just one habit this week. Small consistent changes beat big dramatic ones every time.</p>`,
    readTimeMinutes: 4,
    views: 0,
    likes: 0,
    contentImages: [],
  },
  {
    title: 'How to Lose Weight Without Starving Yourself',
    slug: 'lose-weight-without-starving-en',
    language: 'en',
    category: 'weight-loss',
    tag: 'Weight Loss',
    isFeatured: false,
    isPublished: true,
    author: 'NutriLifeMithra',
    excerpt: 'Crash diets do not work long-term. Here is a sustainable approach to weight loss that actually works.',
    content: `<p>Most people try to lose weight by eating as little as possible. This almost always fails. Your body adapts, metabolism slows, and you end up gaining the weight back plus more.</p>
<h2>The Right Approach</h2>
<p>Sustainable weight loss is about eating the right foods, not eating less food.</p>
<h2>What Actually Works</h2>
<ul>
<li><strong>Eat more protein</strong> — Keeps you full, preserves muscle</li>
<li><strong>Fill half your plate with vegetables</strong> — Low calorie, high volume</li>
<li><strong>Cut liquid calories</strong> — No sugary drinks, juices, or alcohol</li>
<li><strong>Walk 30 minutes daily</strong> — Simple, sustainable, effective</li>
<li><strong>Sleep 7-8 hours</strong> — Poor sleep increases hunger hormones</li>
<li><strong>Eat slowly</strong> — Takes 20 minutes for your brain to register fullness</li>
</ul>
<h2>What to Avoid</h2>
<ul>
<li>Skipping meals</li>
<li>Crash diets under 1200 calories</li>
<li>Cutting out entire food groups</li>
</ul>
<p>Aim for 0.5–1kg loss per week. Anything faster is usually water weight or muscle loss.</p>`,
    readTimeMinutes: 5,
    views: 0,
    likes: 0,
    contentImages: [],
  },
]

async function main() {
  await connectDB()
  console.log('Connected to DB')

  let inserted = 0
  let skipped = 0

  for (const post of [...teluguPosts, ...englishPosts]) {
    const exists = await Post.findOne({ slug: post.slug })
    if (exists) {
      console.log(`SKIP (exists): ${post.slug}`)
      skipped++
      continue
    }
    await Post.create(post)
    console.log(`INSERT: ${post.slug} [${post.language}]`)
    inserted++
  }

  console.log(`\nDone. Inserted: ${inserted}, Skipped: ${skipped}`)
  process.exit(0)
}

main().catch((e) => { console.error(e); process.exit(1) })

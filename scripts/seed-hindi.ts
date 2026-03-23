import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { connectDB } from '../lib/mongodb'
import { Post } from '../models/Post'
import { Recipe } from '../models/Recipe'
import { Video } from '../models/Video'

const hindiPosts = [
  {
    title: 'वजन घटाने के 10 आसान तरीके',
    slug: 'vajan-ghatane-ke-10-tarike',
    language: 'hi',
    tag: 'Weight Loss',
    category: 'weight-loss',
    isPublished: true,
    readTimeMinutes: 5,
    excerpt: 'घर पर आसानी से वजन घटाने के 10 प्रभावी तरीके जो आपकी दिनचर्या में फिट हों।',
    content: `<p>वजन घटाना मुश्किल नहीं है अगर आप सही तरीके अपनाएं।</p>
<h2>1. सुबह गर्म पानी पिएं</h2>
<p>रोज सुबह खाली पेट गर्म पानी पीने से मेटाबॉलिज्म बढ़ता है।</p>
<h2>2. छोटे-छोटे भोजन करें</h2>
<p>दिन में 5-6 बार छोटे भोजन करें बजाय 3 बड़े भोजन के।</p>
<h2>3. चीनी कम करें</h2>
<p>चाय, कॉफी और मीठे पेय में चीनी कम करें।</p>
<h2>4. रोज 30 मिनट व्यायाम करें</h2>
<p>चलना, योग या कोई भी शारीरिक गतिविधि करें।</p>
<h2>5. पर्याप्त पानी पिएं</h2>
<p>दिन में कम से कम 8-10 गिलास पानी पिएं।</p>`,
    views: 0,
    likes: 0,
  },
  {
    title: 'मधुमेह में क्या खाएं और क्या न खाएं',
    slug: 'madhumeh-mein-kya-khayen',
    language: 'hi',
    tag: 'Diabetes',
    category: 'diabetes',
    isPublished: true,
    readTimeMinutes: 6,
    excerpt: 'मधुमेह रोगियों के लिए सही आहार गाइड — क्या खाएं, क्या परहेज करें।',
    content: `<p>मधुमेह में सही आहार बहुत जरूरी है।</p>
<h2>क्या खाएं</h2>
<ul>
<li>हरी सब्जियां — पालक, मेथी, करेला</li>
<li>साबुत अनाज — जौ, बाजरा, रागी</li>
<li>दालें और फलियां</li>
<li>कम वसा वाले डेयरी उत्पाद</li>
</ul>
<h2>क्या न खाएं</h2>
<ul>
<li>सफेद चावल और मैदा</li>
<li>मीठे पेय और जूस</li>
<li>तले हुए खाद्य पदार्थ</li>
<li>प्रोसेस्ड फूड</li>
</ul>`,
    views: 0,
    likes: 0,
  },
  {
    title: 'रागी — सुपरफूड जो हर भारतीय को खाना चाहिए',
    slug: 'ragi-superfood-hindi',
    language: 'hi',
    tag: 'Nutrition',
    category: 'general',
    isPublished: true,
    readTimeMinutes: 4,
    excerpt: 'रागी में कैल्शियम, आयरन और फाइबर भरपूर होता है। जानें इसके फायदे।',
    content: `<p>रागी (फिंगर मिलेट) एक पोषण से भरपूर अनाज है।</p>
<h2>रागी के फायदे</h2>
<ul>
<li>हड्डियों को मजबूत बनाता है — कैल्शियम से भरपूर</li>
<li>ब्लड शुगर नियंत्रित करता है</li>
<li>वजन घटाने में मदद करता है</li>
<li>एनीमिया से बचाता है</li>
</ul>
<h2>रागी कैसे खाएं</h2>
<p>रागी की रोटी, डोसा, खिचड़ी या लड्डू बनाकर खाएं।</p>`,
    views: 0,
    likes: 0,
  },
  {
    title: 'पाचन सुधारने के घरेलू उपाय',
    slug: 'pachan-sudharne-ke-upay',
    language: 'hi',
    tag: 'Gut Health',
    category: 'gut-health',
    isPublished: true,
    readTimeMinutes: 5,
    excerpt: 'पाचन तंत्र को मजबूत बनाने के आसान घरेलू नुस्खे।',
    content: `<p>अच्छा पाचन स्वस्थ जीवन की नींव है।</p>
<h2>पाचन सुधारने के उपाय</h2>
<ol>
<li>खाने के बाद 10 मिनट टहलें</li>
<li>दही और छाछ का सेवन करें</li>
<li>अदरक और जीरे का पानी पिएं</li>
<li>खाना धीरे-धीरे चबाकर खाएं</li>
<li>रात का खाना हल्का रखें</li>
</ol>`,
    views: 0,
    likes: 0,
  },
  {
    title: 'बच्चों के लिए पोषण से भरपूर टिफिन आइडिया',
    slug: 'bacchon-ke-liye-tiffin-ideas',
    language: 'hi',
    tag: 'Kids Nutrition',
    category: 'kids-nutrition',
    isPublished: true,
    readTimeMinutes: 4,
    excerpt: 'स्कूल जाने वाले बच्चों के लिए स्वस्थ और स्वादिष्ट टिफिन के 10 आइडिया।',
    content: `<p>बच्चों के टिफिन में पोषण और स्वाद दोनों होने चाहिए।</p>
<h2>10 हेल्दी टिफिन आइडिया</h2>
<ol>
<li>रागी डोसा + नारियल चटनी</li>
<li>मूंग दाल चीला</li>
<li>वेजिटेबल उपमा</li>
<li>पनीर पराठा</li>
<li>फ्रूट सलाद</li>
<li>ओट्स इडली</li>
<li>मिक्स वेज पुलाव</li>
<li>दही चावल</li>
<li>मूंगफली लड्डू</li>
<li>बाजरा खिचड़ी</li>
</ol>`,
    views: 0,
    likes: 0,
  },
]

const hindiRecipes = [
  {
    title: 'रागी डोसा — स्वस्थ नाश्ता',
    slug: 'ragi-dosa-hindi',
    language: 'hi',
    category: 'breakfast',
    tag: 'Breakfast',
    isFeatured: true,
    isPublished: true,
    author: 'NutriLife Hindi',
    description: 'रागी से बना पौष्टिक डोसा जो डायबिटीज और वजन घटाने में मददगार है।',
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    servings: 4,
    ingredients: [
      'रागी आटा — 1 कप',
      'चावल का आटा — ¼ कप',
      'दही — ½ कप',
      'प्याज — 1 (बारीक कटा)',
      'हरी मिर्च — 2',
      'अदरक — 1 इंच',
      'नमक — स्वादानुसार',
      'तेल — तलने के लिए',
    ],
    content: `<p>रागी डोसा एक पौष्टिक और स्वादिष्ट नाश्ता है।</p>
<h2>बनाने की विधि</h2>
<ol>
<li>रागी आटा, चावल का आटा और दही मिलाकर बैटर बनाएं।</li>
<li>प्याज, हरी मिर्च और अदरक डालें।</li>
<li>नमक मिलाएं और 30 मिनट रखें।</li>
<li>तवे पर तेल लगाकर डोसा फैलाएं।</li>
<li>दोनों तरफ से सुनहरा होने तक पकाएं।</li>
</ol>`,
    nutritionFacts: { calories: 150, protein: 5, carbs: 28, fat: 3, fiber: 4 },
    views: 0,
    likes: 0,
  },
  {
    title: 'मूंग दाल खिचड़ी — पाचन के लिए',
    slug: 'moong-dal-khichdi-hindi',
    language: 'hi',
    category: 'lunch',
    tag: 'Lunch',
    isFeatured: false,
    isPublished: true,
    author: 'NutriLife Hindi',
    description: 'हल्की और पौष्टिक मूंग दाल खिचड़ी जो पाचन के लिए बेहतरीन है।',
    prepTimeMinutes: 10,
    cookTimeMinutes: 25,
    servings: 3,
    ingredients: [
      'चावल — ½ कप',
      'मूंग दाल — ½ कप',
      'घी — 1 टेबलस्पून',
      'जीरा — 1 टीस्पून',
      'हल्दी — ½ टीस्पून',
      'अदरक — 1 इंच',
      'नमक — स्वादानुसार',
      'पानी — 3 कप',
    ],
    content: `<p>मूंग दाल खिचड़ी बीमारी में और रोज के खाने में दोनों के लिए अच्छी है।</p>
<h2>बनाने की विधि</h2>
<ol>
<li>चावल और दाल धोकर 20 मिनट भिगोएं।</li>
<li>प्रेशर कुकर में घी गर्म करें, जीरा डालें।</li>
<li>अदरक, हल्दी डालें।</li>
<li>चावल-दाल और पानी डालकर 3 सीटी लें।</li>
<li>नमक मिलाएं और परोसें।</li>
</ol>`,
    nutritionFacts: { calories: 220, protein: 10, carbs: 38, fat: 5, fiber: 5 },
    views: 0,
    likes: 0,
  },
  {
    title: 'करेले की सब्जी — डायबिटीज के लिए',
    slug: 'karele-ki-sabzi-hindi',
    language: 'hi',
    category: 'lunch',
    tag: 'Diabetic Friendly',
    isFeatured: false,
    isPublished: true,
    author: 'NutriLife Hindi',
    description: 'करेला ब्लड शुगर कम करने में मदद करता है। यह रेसिपी कम कड़वी और स्वादिष्ट है।',
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    servings: 3,
    ingredients: [
      'करेला — 4 (छोटे)',
      'प्याज — 2',
      'टमाटर — 2',
      'हल्दी — ½ टीस्पून',
      'धनिया पाउडर — 1 टीस्पून',
      'नमक — स्वादानुसार',
      'तेल — 2 टेबलस्पून',
    ],
    content: `<p>करेला मधुमेह रोगियों के लिए एक प्राकृतिक दवा है।</p>
<h2>बनाने की विधि</h2>
<ol>
<li>करेले को काटकर नमक लगाकर 30 मिनट रखें।</li>
<li>पानी से धोकर निचोड़ें।</li>
<li>तेल में प्याज भूनें, टमाटर डालें।</li>
<li>मसाले डालकर करेला मिलाएं।</li>
<li>ढककर 15 मिनट पकाएं।</li>
</ol>`,
    nutritionFacts: { calories: 80, protein: 3, carbs: 10, fat: 4, fiber: 3 },
    views: 0,
    likes: 0,
  },
  {
    title: 'बाजरा रोटी — सर्दियों का सुपरफूड',
    slug: 'bajra-roti-hindi',
    language: 'hi',
    category: 'dinner',
    tag: 'Dinner',
    isFeatured: false,
    isPublished: true,
    author: 'NutriLife Hindi',
    description: 'बाजरे की रोटी आयरन और फाइबर से भरपूर है। सर्दियों में जरूर खाएं।',
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    servings: 4,
    ingredients: [
      'बाजरा आटा — 2 कप',
      'गर्म पानी — आवश्यकतानुसार',
      'नमक — स्वादानुसार',
      'घी — परोसने के लिए',
    ],
    content: `<p>बाजरा रोटी उत्तर भारत में बहुत लोकप्रिय है।</p>
<h2>बनाने की विधि</h2>
<ol>
<li>बाजरा आटे में गर्म पानी और नमक मिलाकर गूंधें।</li>
<li>छोटी-छोटी लोइयां बनाएं।</li>
<li>हाथ से थपथपाकर रोटी बनाएं।</li>
<li>तवे पर दोनों तरफ से पकाएं।</li>
<li>घी लगाकर गर्म परोसें।</li>
</ol>`,
    nutritionFacts: { calories: 170, protein: 5, carbs: 30, fat: 4, fiber: 5 },
    views: 0,
    likes: 0,
  },
]

const hindiVideos = [
  {
    title: 'वजन घटाने के 5 आसान तरीके | NutriLife Hindi',
    slug: 'vajan-ghatane-ke-tarike-video',
    language: 'hi',
    youtubeUrl: 'https://youtube.com/@nutrilifemithra',
    youtubeId: 'hindi-weight-loss-1',
    category: 'weight-loss',
    tag: 'Weight Loss',
    isFeatured: true,
    isPublished: true,
    description: 'घर पर आसानी से वजन घटाने के 5 प्रभावी तरीके।',
    durationSeconds: 480,
    views: 0,
    likes: 0,
  },
  {
    title: 'रागी डोसा बनाने की विधि | Healthy Breakfast',
    slug: 'ragi-dosa-video-hindi',
    language: 'hi',
    youtubeUrl: 'https://youtube.com/@nutrilifemithra',
    youtubeId: 'hindi-ragi-dosa-1',
    category: 'cooking',
    tag: 'Cooking',
    isFeatured: false,
    isPublished: true,
    description: 'रागी डोसा बनाने की आसान विधि — स्वस्थ और स्वादिष्ट।',
    durationSeconds: 360,
    views: 0,
    likes: 0,
  },
  {
    title: 'मधुमेह में क्या खाएं | Diabetes Diet Guide',
    slug: 'diabetes-diet-video-hindi',
    language: 'hi',
    youtubeUrl: 'https://youtube.com/@nutrilifemithra',
    youtubeId: 'hindi-diabetes-1',
    category: 'health-education',
    tag: 'Diabetes',
    isFeatured: false,
    isPublished: true,
    description: 'मधुमेह रोगियों के लिए सही आहार की जानकारी।',
    durationSeconds: 600,
    views: 0,
    likes: 0,
  },
]

async function seed() {
  await connectDB()
  console.log('Connected to DB')

  // Posts
  for (const post of hindiPosts) {
    const exists = await Post.findOne({ slug: post.slug })
    if (!exists) {
      await Post.create(post)
      console.log('Created post:', post.slug)
    } else {
      console.log('Skipped (exists):', post.slug)
    }
  }

  // Recipes
  for (const recipe of hindiRecipes) {
    const exists = await Recipe.findOne({ slug: recipe.slug })
    if (!exists) {
      await Recipe.create(recipe)
      console.log('Created recipe:', recipe.slug)
    } else {
      console.log('Skipped (exists):', recipe.slug)
    }
  }

  // Videos
  for (const video of hindiVideos) {
    const exists = await Video.findOne({ slug: video.slug })
    if (!exists) {
      await Video.create(video)
      console.log('Created video:', video.slug)
    } else {
      console.log('Skipped (exists):', video.slug)
    }
  }

  console.log('Hindi seed complete!')
  process.exit(0)
}

seed().catch((err) => { console.error(err); process.exit(1) })

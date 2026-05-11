'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/components/LanguageProvider'
import { Leaf, Home, Heart, Users, Salad, BookOpen, Stethoscope, Send, CheckCircle } from 'lucide-react'
import PromotionBlock from '@/components/promotions/PromotionBlock'

const content = {
  en: {
    hero_title: 'About NutriLife',
    hero_sub: 'Smart Nutrition. Better Life.',
    mission_title: 'Our Mission',
    mission_body: 'NutriLife is a health and nutrition platform built to make healthy eating simple, affordable, and culturally relevant. We believe good nutrition starts in your own kitchen — with the ingredients you already know and love.',
    story_title: 'Our Story',
    story_body: 'NutriLife was born from a simple observation: most nutrition content online is either too generic or too expensive to be useful for everyday families. We set out to change that by creating content rooted in local food culture.',
    what_title: 'What We Offer',
    what_items: (totalRecipes: string, totalArticles: string, totalVideos: string) => [
      `${totalRecipes} healthy recipes with step-by-step instructions`,
      'Free diet plans for weight loss, diabetes, thyroid, and more',
      `${totalArticles} evidence-based health articles written in plain language`,
      `${totalVideos} YouTube videos with cooking guides and health education`,
      'Weekly newsletter with nutrition tips and seasonal recipes',
    ],
    values_title: 'Our Values',
    values: [
      { icon: 'leaf', title: 'Evidence-Based', desc: 'Every tip and recipe is grounded in nutritional science, not trends.' },
      { icon: 'home', title: 'Culturally Rooted', desc: 'We celebrate local ingredients and traditional cooking methods.' },
      { icon: 'heart', title: 'Accessible to All', desc: 'Free content for everyone — no paywalls on the basics.' },
      { icon: 'users', title: 'Community First', desc: 'Built with and for our readers, not just for them.' },
    ],
    team_title: 'Behind NutriLife',
    team_body: 'NutriLife is run by a small team of nutritionists, food writers, and developers passionate about making healthy living accessible. We work with certified dietitians to ensure accuracy.',
    cta_recipes: 'Browse Recipes',
    cta_plans: 'Free Diet Plans',
    cta_contact: 'Contact Us',
    mission_badge: 'Mission',
    story_badge: 'Story',
    contact_title: 'Contact Us',
    contact_sub: 'Send us your feedback, suggestions, or questions.',
    name_label: 'Name',
    name_placeholder: 'Your name',
    msg_label: 'Message',
    msg_placeholder: 'Write your message here...',
    send_btn: 'Send Message',
    sending: 'Sending…',
    sent_msg: "Message sent! We'll get back to you soon.",
    error_msg: 'Failed to send. Please try again.',
  },
  hi: {
    hero_title: 'न्यूट्रीलाइफ के बारे में',
    hero_sub: 'स्मार्ट पोषण। बेहतर जीवन।',
    mission_title: 'हमारा मिशन',
    mission_body: 'न्यूट्रीलाइफ एक स्वास्थ्य और पोषण मंच है जो स्वस्थ खाने को सरल, किफायती और सांस्कृतिक रूप से प्रासंगिक बनाने के लिए बनाया गया है। हम मानते हैं कि अच्छा पोषण आपकी अपनी रसोई से शुरू होता है।',
    story_title: 'हमारी कहानी',
    story_body: 'न्यूट्रीलाइफ एक सरल अवलोकन से जन्मा: ऑनलाइन अधिकांश पोषण सामग्री या तो बहुत सामान्य है या रोजमर्रा के परिवारों के लिए बहुत महंगी। हमने स्थानीय खाद्य संस्कृति में निहित सामग्री बनाकर इसे बदलने का निर्णय लिया।',
    what_title: 'हम क्या प्रदान करते हैं',
    what_items: (totalRecipes: string, totalArticles: string, totalVideos: string) => [
      `चरण-दर-चरण निर्देशों के साथ ${totalRecipes} स्वस्थ रेसिपी`,
      'वजन घटाने, मधुमेह, थायरॉइड और अधिक के लिए मुफ्त डाइट प्लान',
      `सरल भाषा में लिखे गए ${totalArticles} साक्ष्य-आधारित स्वास्थ्य लेख`,
      `खाना पकाने की गाइड और स्वास्थ्य शिक्षा के साथ ${totalVideos} YouTube वीडियो`,
      'पोषण टिप्स और मौसमी रेसिपी के साथ साप्ताहिक न्यूज़लेटर',
    ],
    values_title: 'हमारे मूल्य',
    values: [
      { icon: 'leaf', title: 'साक्ष्य-आधारित', desc: 'हर टिप और रेसिपी पोषण विज्ञान पर आधारित है।' },
      { icon: 'home', title: 'सांस्कृतिक जड़ें', desc: 'हम स्थानीय सामग्री और पारंपरिक खाना पकाने के तरीकों का जश्न मनाते हैं।' },
      { icon: 'heart', title: 'सभी के लिए सुलभ', desc: 'सभी के लिए मुफ्त सामग्री — बुनियादी बातों पर कोई पेवॉल नहीं।' },
      { icon: 'users', title: 'समुदाय पहले', desc: 'हमारे पाठकों के साथ और उनके लिए बनाया गया।' },
    ],
    team_title: 'न्यूट्रीलाइफ के पीछे',
    team_body: 'न्यूट्रीलाइफ पोषण विशेषज्ञों, खाद्य लेखकों और डेवलपर्स की एक छोटी टीम द्वारा चलाया जाता है जो स्वस्थ जीवन को सुलभ बनाने के बारे में भावुक हैं।',
    cta_recipes: 'रेसिपी देखें',
    cta_plans: 'मुफ्त डाइट प्लान',
    cta_contact: 'संपर्क करें',
    mission_badge: 'मिशन',
    story_badge: 'कहानी',
    contact_title: 'संपर्क करें',
    contact_sub: 'अपनी प्रतिक्रिया, सुझाव या प्रश्न भेजें।',
    name_label: 'नाम',
    name_placeholder: 'आपका नाम',
    msg_label: 'संदेश',
    msg_placeholder: 'यहाँ अपना संदेश लिखें...',
    send_btn: 'संदेश भेजें',
    sending: 'भेज रहे हैं…',
    sent_msg: 'संदेश भेजा गया! हम जल्द ही आपसे संपर्क करेंगे।',
    error_msg: 'भेजने में विफल। कृपया पुनः प्रयास करें।',
  },
  te: {
    hero_title: 'న్యూట్రిలైఫ్ గురించి',
    hero_sub: 'స్మార్ట్ న్యూట్రిషన్. బెటర్ లైఫ్.',
    mission_title: 'మా లక్ష్యం',
    mission_body: 'న్యూట్రిలైఫ్ అనేది ఆరోగ్యకరమైన తినడాన్ని సులభంగా, అందుబాటులో మరియు సాంస్కృతికంగా సంబంధితంగా చేయడానికి నిర్మించిన ఒక ఆరోగ్య మరియు పోషకాహార వేదిక.',
    story_title: 'మా కథ',
    story_body: 'న్యూట్రిలైఫ్ ఒక సాధారణ పరిశీలన నుండి పుట్టింది: ఆన్‌లైన్‌లో చాలా పోషకాహార కంటెంట్ రోజువారీ కుటుంబాలకు ఉపయోగపడేంత సాధారణంగా లేదా చాలా ఖరీదుగా ఉంటుంది.',
    what_title: 'మేము అందించేది',
    what_items: (totalRecipes: string, totalArticles: string, totalVideos: string) => [
      `దశల వారీ సూచనలతో ${totalRecipes} ఆరోగ్యకరమైన వంటకాలు`,
      'బరువు తగ్గడం, మధుమేహం, థైరాయిడ్ మరియు మరిన్నింటికి ఉచిత డైట్ ప్లాన్‌లు',
      `సాధారణ భాషలో రాసిన ${totalArticles} సాక్ష్యం-ఆధారిత ఆరోగ్య వ్యాసాలు`,
      `వంట గైడ్‌లు మరియు ఆరోగ్య విద్యతో ${totalVideos} YouTube వీడియోలు`,
      'పోషకాహార చిట్కాలు మరియు సీజనల్ వంటకాలతో వారపు న్యూస్‌లెటర్',
    ],
    values_title: 'మా విలువలు',
    values: [
      { icon: 'leaf', title: 'సాక్ష్యం-ఆధారిత', desc: 'ప్రతి చిట్కా మరియు వంటకం పోషకాహార శాస్త్రంలో ఆధారపడి ఉంటుంది.' },
      { icon: 'home', title: 'సాంస్కృతికంగా పాతుకుపోయిన', desc: 'మేము స్థానిక పదార్థాలు మరియు సాంప్రదాయ వంట పద్ధతులను జరుపుకుంటాం.' },
      { icon: 'heart', title: 'అందరికీ అందుబాటులో', desc: 'అందరికీ ఉచిత కంటెంట్ — ప్రాథమిక విషయాలపై పేవాల్‌లు లేవు.' },
      { icon: 'users', title: 'కమ్యూనిటీ ఫస్ట్', desc: 'మా పాఠకులతో మరియు వారి కోసం నిర్మించబడింది.' },
    ],
    team_title: 'న్యూట్రిలైఫ్ వెనుక',
    team_body: 'న్యూట్రిలైఫ్ ఆరోగ్యకరమైన జీవనాన్ని అందుబాటులో ఉంచడంపై మక్కువ ఉన్న పోషకాహార నిపుణులు, ఆహార రచయితలు మరియు డెవలపర్‌ల చిన్న బృందం నడుపుతోంది.',
    cta_recipes: 'వంటకాలు చూడండి',
    cta_plans: 'ఉచిత డైట్ ప్లాన్‌లు',
    cta_contact: 'సంప్రదించండి',
    mission_badge: 'మా లక్ష్యం',
    story_badge: 'మా కథ',
    contact_title: 'సంప్రదించండి',
    contact_sub: 'మీ అభిప్రాయాలు, సూచనలు లేదా ప్రశ్నలు పంపండి.',
    name_label: 'పేరు',
    name_placeholder: 'మీ పేరు',
    msg_label: 'సందేశం',
    msg_placeholder: 'మీ సందేశం ఇక్కడ రాయండి...',
    send_btn: 'పంపండి',
    sending: 'పంపుతున్నాం...',
    sent_msg: 'మీ సందేశం పంపబడింది! త్వరలో మీకు సమాధానం ఇస్తాం.',
    error_msg: 'పంపడం విఫలమైంది. మళ్ళీ ప్రయత్నించండి.',
  },
}

export default function AboutClient() {
  const { language } = useLanguage()
  
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactMsg, setContactMsg] = useState('')
  const [contactLoading, setContactLoading] = useState(false)
  const [contactDone, setContactDone] = useState(false)
  const [contactError, setContactError] = useState('')
  
  // Dynamic settings
  const [totalRecipes, setTotalRecipes] = useState('500+')
  const [totalArticles, setTotalArticles] = useState('200+')
  const [totalVideos, setTotalVideos] = useState('100+')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/site-settings')
        if (res.ok) {
          const data = await res.json()
          setTotalRecipes(data.total_recipes || '500+')
          setTotalArticles(data.total_articles || '200+')
          setTotalVideos(data.total_videos || '100+')
        }
      } catch (err) {
        console.error('Failed to fetch site settings:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const t = content[language] ?? content.en

  async function handleContact(e: React.FormEvent) {
    e.preventDefault()
    setContactLoading(true)
    setContactError('')
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: contactName, email: contactEmail, message: contactMsg }),
    })
    setContactLoading(false)
    if (res.ok) {
      setContactDone(true)
    } else {
      setContactError(t.error_msg)
    }
  }

  return (
    <div className="bg-white dark:bg-slate-950">

      {/* Hero banner */}
      <section className="bg-gradient-to-br from-[#1A5C38] to-emerald-700">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center text-white">
          <h1 className="font-nunito text-4xl font-bold md:text-5xl">{t.hero_title}</h1>
          <p className="mt-3 text-lg text-emerald-100">{t.hero_sub}</p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-14 px-6 py-14">

        {/* Mission */}
        <section className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <span className="mb-3 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-[#1A5C38] dark:bg-emerald-900/40 dark:text-emerald-400">
              {t.mission_badge}
            </span>
            <h2 className="mb-4 font-nunito text-2xl font-bold text-gray-900 dark:text-slate-50">{t.mission_title}</h2>
            <p className="leading-relaxed text-gray-600 dark:text-slate-400">{t.mission_body}</p>
          </div>
          <div className="flex items-center justify-center rounded-2xl bg-emerald-50 p-10 dark:bg-emerald-900/20">
            <Salad size={72} className="text-emerald-400" />
          </div>
        </section>

        {/* Story */}
        <section className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="order-2 flex items-center justify-center rounded-2xl bg-amber-50 p-10 dark:bg-amber-900/10 md:order-1">
            <BookOpen size={72} className="text-amber-400" />
          </div>
          <div className="order-1 md:order-2">
            <span className="mb-3 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
              {t.story_badge}
            </span>
            <h2 className="mb-4 font-nunito text-2xl font-bold text-gray-900 dark:text-slate-50">{t.story_title}</h2>
            <p className="leading-relaxed text-gray-600 dark:text-slate-400">{t.story_body}</p>
          </div>
        </section>

        {/* What we offer */}
        <section>
          <h2 className="mb-6 font-nunito text-2xl font-bold text-gray-900 dark:text-slate-50">{t.what_title}</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {t.what_items(totalRecipes, totalArticles, totalVideos).map((item, i) => (
              <li key={i} className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1A5C38] text-[10px] font-bold text-white">✓</span>
                <span className="text-sm text-gray-700 dark:text-slate-300">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* SEO-Rich Content Section - "People Also Search For" Keywords */}
        <section className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-8 dark:border-emerald-900/30 dark:from-emerald-950/20 dark:to-slate-950">
          <h2 className="mb-6 font-nunito text-2xl font-bold text-gray-900 dark:text-slate-50">
            {language === 'te' ? 'మేము ఏమి అందిస్తాము' : language === 'hi' ? 'हम क्या प्रदान करते हैं' : 'What We Provide'}
          </h2>
          
          <div className="space-y-6">
            {/* English, Telugu, Hindi Content */}
            <div className="space-y-4 text-sm leading-relaxed text-gray-700 dark:text-slate-300">
              {language === 'en' && (
                <>
                  <p>
                    <strong>NutriLifeMitra</strong> is your trusted source for <strong>healthy Indian recipes</strong>, <strong>nutrition posts in Telugu</strong>, <strong>nutrition posts in Hindi</strong>, and <strong>nutrition posts in English</strong>. We provide <strong>recipes in Telugu</strong>, <strong>recipes in Hindi</strong>, and <strong>recipes in English</strong> for every meal of the day.
                  </p>
                  <p>
                    Looking for <strong>weight loss tips</strong>? We offer <strong>weight loss diet plans</strong>, <strong>weight loss recipes</strong>, and <strong>weight loss tips in Telugu</strong> and <strong>Hindi</strong>. Our <strong>diabetes diet plan</strong>, <strong>diabetes recipes</strong>, and <strong>diabetic-friendly recipes</strong> help manage blood sugar naturally.
                  </p>
                  <p>
                    Explore our <strong>millet recipes</strong> including <strong>ragi recipes</strong>, <strong>jowar recipes</strong>, <strong>foxtail millet recipes</strong>, and <strong>bajra recipes</strong>. We also provide <strong>thyroid diet plans</strong>, <strong>PCOS diet plans</strong>, <strong>gut health tips</strong>, and <strong>kids nutrition advice</strong>.
                  </p>
                  <p>
                    Find <strong>healthy breakfast recipes</strong>, <strong>healthy lunch recipes</strong>, <strong>healthy dinner recipes</strong>, and <strong>healthy snacks for kids</strong>. Our <strong>Indian diet plans</strong> include <strong>free diet plans</strong> and <strong>premium meal plans</strong> for various health goals.
                  </p>
                  <p>
                    Use our free <strong>BMI calculator</strong>, <strong>calorie calculator</strong>, <strong>water intake calculator</strong>, and <strong>sugar intake checker</strong>. Watch our <strong>cooking videos in Telugu</strong>, <strong>cooking videos in Hindi</strong>, and <strong>health education videos</strong>.
                  </p>
                </>
              )}
              
              {language === 'te' && (
                <>
                  <p>
                    <strong>న్యూట్రిలైఫ్‌మిత్ర</strong> మీ విశ్వసనీయ మూలం <strong>ఆరోగ్యకరమైన భారతీయ వంటకాలు</strong>, <strong>తెలుగులో పోషకాహార పోస్ట్‌లు</strong>, <strong>హిందీలో పోషకాహార పోస్ట్‌లు</strong>, మరియు <strong>ఇంగ్లీష్‌లో పోషకాహార పోస్ట్‌లు</strong>. మేము <strong>తెలుగు రెసిపీలు</strong>, <strong>హిందీ రెసిపీలు</strong>, మరియు <strong>ఇంగ్లీష్ రెసిపీలు</strong> అందిస్తాము.
                  </p>
                  <p>
                    <strong>బరువు తగ్గడం టిప్స్</strong> కోసం చూస్తున్నారా? మేము <strong>బరువు తగ్గడం డైట్ ప్లాన్</strong>, <strong>బరువు తగ్గడం రెసిపీలు</strong>, మరియు <strong>తెలుగులో బరువు తగ్గడం టిప్స్</strong> అందిస్తాము. మా <strong>షుగర్ డైట్ ప్లాన్</strong>, <strong>డయాబెటిస్ రెసిపీలు</strong>, మరియు <strong>డయాబెటిక్-ఫ్రెండ్లీ రెసిపీలు</strong> రక్తంలో చక్కెరను సహజంగా నిర్వహించడంలో సహాయపడతాయి.
                  </p>
                  <p>
                    మా <strong>మిల్లెట్ రెసిపీలు</strong> అన్వేషించండి - <strong>రాగి రెసిపీలు</strong>, <strong>జొన్న రెసిపీలు</strong>, <strong>కొర్రలు రెసిపీలు</strong>, మరియు <strong>సజ్జ రెసిపీలు</strong>. మేము <strong>థైరాయిడ్ డైట్ ప్లాన్</strong>, <strong>PCOS డైట్ ప్లాన్</strong>, <strong>గట్ హెల్త్ టిప్స్</strong>, మరియు <strong>పిల్లల పోషకాహార సలహా</strong> కూడా అందిస్తాము.
                  </p>
                  <p>
                    <strong>ఆరోగ్యకరమైన బ్రేక్‌ఫాస్ట్ రెసిపీలు</strong>, <strong>ఆరోగ్యకరమైన లంచ్ రెసిపీలు</strong>, <strong>ఆరోగ్యకరమైన డిన్నర్ రెసిపీలు</strong>, మరియు <strong>పిల్లలకు ఆరోగ్యకరమైన స్నాక్స్</strong> కనుగొనండి. మా <strong>భారతీయ డైట్ ప్లాన్‌లు</strong> <strong>ఉచిత డైట్ ప్లాన్‌లు</strong> మరియు <strong>ప్రీమియం మీల్ ప్లాన్‌లు</strong> కలిగి ఉన్నాయి.
                  </p>
                  <p>
                    మా ఉచిత <strong>BMI కాలిక్యులేటర్</strong>, <strong>కేలరీ కాలిక్యులేటర్</strong>, <strong>నీటి తీసుకోవడం కాలిక్యులేటర్</strong>, మరియు <strong>చక్కెర తీసుకోవడం చెకర్</strong> ఉపయోగించండి. మా <strong>తెలుగులో వంట వీడియోలు</strong>, <strong>హిందీలో వంట వీడియోలు</strong>, మరియు <strong>ఆరోగ్య విద్య వీడియోలు</strong> చూడండి.
                  </p>
                </>
              )}
              
              {language === 'hi' && (
                <>
                  <p>
                    <strong>न्यूट्रिलाइफमित्र</strong> आपका विश्वसनीय स्रोत है <strong>स्वस्थ भारतीय व्यंजन</strong>, <strong>तेलुगु में पोषण पोस्ट</strong>, <strong>हिंदी में पोषण पोस्ट</strong>, और <strong>अंग्रेजी में पोषण पोस्ट</strong>। हम <strong>तेलुगु रेसिपी</strong>, <strong>हिंदी रेसिपी</strong>, और <strong>अंग्रेजी रेसिपी</strong> प्रदान करते हैं।
                  </p>
                  <p>
                    <strong>वजन घटाने के टिप्स</strong> खोज रहे हैं? हम <strong>वजन घटाने की डाइट प्लान</strong>, <strong>वजन घटाने की रेसिपी</strong>, और <strong>हिंदी में वजन घटाने के टिप्स</strong> प्रदान करते हैं। हमारी <strong>डायबिटीज डाइट प्लान</strong>, <strong>डायबिटीज रेसिपी</strong>, और <strong>डायबिटिक-फ्रेंडली रेसिपी</strong> रक्त शर्करा को स्वाभाविक रूप से प्रबंधित करने में मदद करती हैं।
                  </p>
                  <p>
                    हमारी <strong>मिलेट रेसिपी</strong> देखें - <strong>रागी रेसिपी</strong>, <strong>ज्वार रेसिपी</strong>, <strong>कंगनी रेसिपी</strong>, और <strong>बाजरा रेसिपी</strong>। हम <strong>थायराइड डाइट प्लान</strong>, <strong>PCOS डाइट प्लान</strong>, <strong>गट हेल्थ टिप्स</strong>, और <strong>बच्चों के पोषण सलाह</strong> भी प्रदान करते हैं।
                  </p>
                  <p>
                    <strong>स्वस्थ नाश्ता रेसिपी</strong>, <strong>स्वस्थ लंच रेसिपी</strong>, <strong>स्वस्थ डिनर रेसिपी</strong>, और <strong>बच्चों के लिए स्वस्थ स्नैक्स</strong> खोजें। हमारी <strong>भारतीय डाइट प्लान</strong> में <strong>मुफ्त डाइट प्लान</strong> और <strong>प्रीमियम मील प्लान</strong> शामिल हैं।
                  </p>
                  <p>
                    हमारे मुफ्त <strong>BMI कैलकुलेटर</strong>, <strong>कैलोरी कैलकुलेटर</strong>, <strong>पानी का सेवन कैलकुलेटर</strong>, और <strong>चीनी का सेवन चेकर</strong> का उपयोग करें। हमारे <strong>हिंदी में खाना पकाने के वीडियो</strong>, <strong>तेलुगु में खाना पकाने के वीडियो</strong>, और <strong>स्वास्थ्य शिक्षा वीडियो</strong> देखें।
                  </p>
                </>
              )}
            </div>

            {/* Popular Search Terms */}
            <div className="mt-6 border-t border-emerald-200 pt-6 dark:border-emerald-900/30">
              <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-slate-50">
                {language === 'te' ? 'ప్రజలు కూడా వెతుకుతున్నారు:' : language === 'hi' ? 'लोग यह भी खोजते हैं:' : 'People Also Search For:'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {language === 'en' && [
                  'recipes in Telugu', 'recipes in Hindi', 'nutrition posts', 'weight loss tips',
                  'diabetes diet', 'thyroid diet', 'PCOS diet', 'millet recipes', 'ragi recipes',
                  'healthy Indian recipes', 'diet plans in Telugu', 'diet plans in Hindi',
                  'BMI calculator', 'calorie calculator', 'gut health tips', 'kids nutrition',
                ].map((term, i) => (
                  <span key={i} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm dark:bg-slate-800 dark:text-slate-300">
                    {term}
                  </span>
                ))}
                
                {language === 'te' && [
                  'తెలుగు రెసిపీలు', 'పోషకాహార పోస్ట్‌లు', 'బరువు తగ్గడం టిప్స్', 'షుగర్ డైట్',
                  'థైరాయిడ్ డైట్', 'PCOS డైట్', 'మిల్లెట్ రెసిపీలు', 'రాగి రెసిపీలు',
                  'ఆరోగ్యకరమైన వంటకాలు', 'తెలుగు డైట్ ప్లాన్', 'BMI కాలిక్యులేటర్',
                  'కేలరీ కాలిక్యులేటర్', 'గట్ హెల్త్ టిప్స్', 'పిల్లల పోషకాహారం',
                ].map((term, i) => (
                  <span key={i} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm dark:bg-slate-800 dark:text-slate-300">
                    {term}
                  </span>
                ))}
                
                {language === 'hi' && [
                  'हिंदी रेसिपी', 'पोषण पोस्ट', 'वजन घटाने के टिप्स', 'डायबिटीज डाइट',
                  'थायराइड डाइट', 'PCOS डाइट', 'मिलेट रेसिपी', 'रागी रेसिपी',
                  'स्वस्थ भारतीय व्यंजन', 'हिंदी डाइट प्लान', 'BMI कैलकुलेटर',
                  'कैलोरी कैलकुलेटर', 'गट हेल्थ टिप्स', 'बच्चों का पोषण',
                ].map((term, i) => (
                  <span key={i} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm dark:bg-slate-800 dark:text-slate-300">
                    {term}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section>
          <h2 className="mb-6 font-nunito text-2xl font-bold text-gray-900 dark:text-slate-50">{t.values_title}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.values.map((v, i) => {
              const iconMap: Record<string, React.ReactNode> = {
                leaf: <Leaf size={24} className="text-[#1A5C38] dark:text-emerald-400" />,
                home: <Home size={24} className="text-[#1A5C38] dark:text-emerald-400" />,
                heart: <Heart size={24} className="text-[#1A5C38] dark:text-emerald-400" />,
                users: <Users size={24} className="text-[#1A5C38] dark:text-emerald-400" />,
              }
              return (
                <div key={i} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-900/20">{iconMap[v.icon]}</div>
                  <h3 className="mb-1 font-nunito text-sm font-bold text-gray-900 dark:text-slate-50">{v.title}</h3>
                  <p className="text-xs leading-relaxed text-gray-500 dark:text-slate-400">{v.desc}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Team */}
        <section className="rounded-2xl bg-gradient-to-r from-emerald-50 to-white p-8 dark:from-emerald-900/20 dark:to-slate-950">
          <div className="flex items-start gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#1A5C38]">
              <Stethoscope size={24} className="text-white" />
            </div>
            <div>
              <h2 className="mb-2 font-nunito text-xl font-bold text-gray-900 dark:text-slate-50">{t.team_title}</h2>
              <p className="leading-relaxed text-gray-600 dark:text-slate-400">{t.team_body}</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="flex flex-wrap gap-3">
          <Link href="/recipes" className="rounded-full bg-[#1A5C38] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800">
            {t.cta_recipes}
          </Link>
          <Link href="/diet-plans" className="rounded-full border border-[#1A5C38] px-6 py-2.5 text-sm font-semibold text-[#1A5C38] transition hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
            {t.cta_plans}
          </Link>
          <Link href="/advertise" className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800">
            {t.cta_contact}
          </Link>
        </section>

        {/* About page promotion */}
        <PromotionBlock placement="about" language={language} />

        {/* Contact / Feedback Form */}
        <section id="contact" className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="mb-1 font-nunito text-2xl font-bold text-gray-900 dark:text-slate-50">{t.contact_title}</h2>
          <p className="mb-6 text-sm text-gray-500 dark:text-slate-400">{t.contact_sub}</p>
          {contactDone ? (
            <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-4 dark:bg-emerald-900/20">
              <CheckCircle size={20} className="text-[#1A5C38]" />
              <p className="text-sm font-medium text-[#1A5C38]">{t.sent_msg}</p>
            </div>
          ) : (
            <form onSubmit={handleContact} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-slate-300">{t.name_label}</label>
                  <input type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} required
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                    placeholder={t.name_placeholder} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-slate-300">Email</label>
                  <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} required
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                    placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-slate-300">{t.msg_label}</label>
                <textarea value={contactMsg} onChange={(e) => setContactMsg(e.target.value)} required rows={4}
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                  placeholder={t.msg_placeholder} />
              </div>
              {contactError && <p className="text-xs text-red-600">{contactError}</p>}
              <button type="submit" disabled={contactLoading}
                className="flex items-center gap-2 rounded-full bg-[#1A5C38] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60">
                <Send size={14} />
                {contactLoading ? t.sending : t.send_btn}
              </button>
            </form>
          )}
        </section>

      </div>
    </div>
  )
}

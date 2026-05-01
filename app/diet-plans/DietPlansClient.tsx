'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/components/LanguageProvider'
import BuyPlanButton from '@/components/payment/BuyPlanButton'
import {
  Download, CheckCircle2, Leaf, Heart, Baby, Wheat, Activity, Flame,
  Star, Users, Shield, ChevronDown, ChevronUp, ArrowRight, Zap,
  Clock, FileText, Sparkles, BadgeCheck, Gift
} from 'lucide-react'
import PromotionBlock from '@/components/promotions/PromotionBlock'

// Icon mapping for dynamic free plans
const iconMap: Record<string, any> = {
  Flame, Activity, Wheat, Leaf, Heart, Baby
}

const freePlansStatic = [
  {
    icon: Flame,
    tag: { te: 'వెయిట్ లాస్', en: 'Weight Loss', hi: 'वजन घटाना' },
    title: { te: '7-రోజుల వెయిట్ లాస్ ప్లాన్', en: '7-Day Weight Loss Plan', hi: '7-दिन वजन घटाने का प्लान' },
    desc: { te: 'సైన్స్-బేస్డ్ మీల్ ప్లాన్ — ఇంట్లో దొరికే పదార్థాలతో.', en: 'Science-backed meal plan using everyday ingredients.', hi: 'रोज़मर्रा की सामग्री से बना विज्ञान-आधारित मील प्लान।' },
    highlights: {
      te: ['7 రోజుల పూర్తి మెనూ', 'షాపింగ్ లిస్ట్ సహా', 'ప్రింటబుల్ PDF'],
      en: ['Full 7-day menu', 'Includes shopping list', 'Printable PDF'],
      hi: ['पूरा 7-दिन का मेनू', 'शॉपिंग लिस्ट सहित', 'प्रिंटेबल PDF'],
    },
    gradient: 'from-orange-500 to-red-500',
    bg: 'bg-orange-50 dark:bg-orange-900/10',
    border: 'border-orange-200 dark:border-orange-800',
    iconBg: 'bg-orange-100 dark:bg-orange-900/30',
    iconColor: 'text-orange-600',
  },
  {
    icon: Activity,
    tag: { te: 'డయాబెటిస్', en: 'Diabetes', hi: 'मधुमेह' },
    title: { te: 'డయాబెటిస్ ఫ్రెండ్లీ ప్లాన్', en: 'Diabetes Friendly Plan', hi: 'डायबिटीज फ्रेंडली प्लान' },
    desc: { te: 'లో-గ్లైసెమిక్ తెలుగు వంటకాలు — షుగర్ కంట్రోల్ కోసం.', en: 'Low-glycemic Telugu recipes for blood sugar control.', hi: 'ब्लड शुगर नियंत्रण के लिए लो-ग्लाइसेमिक रेसिपी।' },
    highlights: {
      te: ['లో-GI ఫుడ్ లిస్ట్', 'స్నాక్ ఐడియాస్', 'డాక్టర్ రివ్యూడ్'],
      en: ['Low-GI food list', 'Snack ideas included', 'Doctor reviewed'],
      hi: ['लो-GI फूड लिस्ट', 'स्नैक आइडिया शामिल', 'डॉक्टर समीक्षित'],
    },
    gradient: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50 dark:bg-blue-900/10',
    border: 'border-blue-200 dark:border-blue-800',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600',
  },
  {
    icon: Wheat,
    tag: { te: 'మిల్లెట్స్', en: 'Millets', hi: 'मिलेट्स' },
    title: { te: 'మిల్లెట్స్ మీల్ చార్ట్', en: 'Millets Meal Chart', hi: 'मिलेट्स मील चार्ट' },
    desc: { te: 'రాగి, జొన్న, సజ్జ — తెలుగు రెసిపీలతో పూర్తి గైడ్.', en: 'Complete guide with ragi, jowar & bajra Telugu recipes.', hi: 'रागी, ज्वार और बाजरा के साथ पूरी गाइड।' },
    highlights: {
      te: ['6 మిల్లెట్ రెసిపీలు', 'న్యూట్రిషన్ చార్ట్', 'వీక్లీ మెనూ'],
      en: ['6 millet recipes', 'Nutrition chart', 'Weekly menu'],
      hi: ['6 मिलेट रेसिपी', 'पोषण चार्ट', 'साप्ताहिक मेनू'],
    },
    gradient: 'from-yellow-500 to-amber-500',
    bg: 'bg-yellow-50 dark:bg-yellow-900/10',
    border: 'border-yellow-200 dark:border-yellow-800',
    iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
    iconColor: 'text-yellow-600',
  },
  {
    icon: Leaf,
    tag: { te: 'గట్ హెల్త్', en: 'Gut Health', hi: 'पाचन' },
    title: { te: 'గట్ హెల్త్ ప్లాన్', en: 'Gut Health Plan', hi: 'पाचन स्वास्थ्य प्लान' },
    desc: { te: 'జీర్ణశక్తి మెరుగుపడేందుకు ప్రోబయోటిక్-రిచ్ మెనూ.', en: 'Probiotic-rich menu to improve your digestion naturally.', hi: 'पाचन सुधारने के लिए प्रोबायोटिक-युक्त मेनू।' },
    highlights: {
      te: ['ప్రోబయోటిక్ ఫుడ్స్', 'ఫైబర్-రిచ్ రెసిపీలు', '14-రోజుల ప్లాన్'],
      en: ['Probiotic foods list', 'Fiber-rich recipes', '14-day plan'],
      hi: ['प्रोबायोटिक फूड्स', 'फाइबर-युक्त रेसिपी', '14-दिन का प्लान'],
    },
    gradient: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50 dark:bg-emerald-900/10',
    border: 'border-emerald-200 dark:border-emerald-800',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
    iconColor: 'text-emerald-600',
  },
  {
    icon: Heart,
    tag: { te: 'థైరాయిడ్', en: 'Thyroid', hi: 'थायरॉइड' },
    title: { te: 'థైరాయిడ్ సపోర్ట్ ప్లాన్', en: 'Thyroid Support Plan', hi: 'थायरॉइड सपोर्ट प्लान' },
    desc: { te: 'హార్మోన్ బ్యాలెన్స్ కోసం ఆయోడిన్-రిచ్ ఫుడ్ గైడ్.', en: 'Iodine-rich food guide for hormone balance support.', hi: 'हार्मोन संतुलन के लिए आयोडीन-युक्त आहार गाइड।' },
    highlights: {
      te: ['ఆయోడిన్ ఫుడ్ లిస్ట్', 'అవాయిడ్ ఫుడ్స్', 'డైలీ మెనూ'],
      en: ['Iodine food list', 'Foods to avoid', 'Daily menu'],
      hi: ['आयोडीन फूड लिस्ट', 'परहेज़ की सूची', 'दैनिक मेनू'],
    },
    gradient: 'from-pink-500 to-rose-500',
    bg: 'bg-pink-50 dark:bg-pink-900/10',
    border: 'border-pink-200 dark:border-pink-800',
    iconBg: 'bg-pink-100 dark:bg-pink-900/30',
    iconColor: 'text-pink-600',
  },
  {
    icon: Baby,
    tag: { te: 'పిల్లలు', en: 'Kids', hi: 'बच्चे' },
    title: { te: 'పిల్లల పోషణ ప్లాన్', en: "Kids Nutrition Plan", hi: 'बच्चों का पोषण प्लान' },
    desc: { te: 'పిల్లల ఎదుగుదలకు బ్యాలెన్స్డ్ టిఫిన్ & డిన్నర్ ఐడియాస్.', en: 'Balanced tiffin & dinner ideas for healthy child growth.', hi: 'स्वस्थ बच्चों के विकास के लिए संतुलित टिफिन और डिनर।' },
    highlights: {
      te: ['ఏజ్-వైజ్ మెనూ', 'టిఫిన్ ఐడియాస్', 'ఇమ్యూనిటీ బూస్టర్స్'],
      en: ['Age-wise menu', 'Tiffin box ideas', 'Immunity boosters'],
      hi: ['उम्र के अनुसार मेनू', 'टिफिन बॉक्स आइडिया', 'इम्युनिटी बूस्टर'],
    },
    gradient: 'from-purple-500 to-violet-500',
    bg: 'bg-purple-50 dark:bg-purple-900/10',
    border: 'border-purple-200 dark:border-purple-800',
    iconBg: 'bg-purple-100 dark:bg-purple-900/30',
    iconColor: 'text-purple-600',
  },
]

const faqs = {
  en: [
    { q: 'Are the free plans really free?', a: 'Yes, 100% free. No credit card needed. Just enter your email and we send the PDF instantly.' },
    { q: 'Are these plans suitable for Telugu families?', a: 'Absolutely. All plans use traditional Telugu ingredients like ragi, jowar, pesarattu, and local vegetables.' },
    { q: 'What is included in the premium plans?', a: 'Premium plans include a detailed week-by-week meal schedule, shopping lists, recipe cards, and WhatsApp support from our nutritionist.' },
    { q: 'Can I follow these plans if I have diabetes?', a: 'Yes. We have a dedicated diabetes-friendly plan. All our plans are reviewed by certified nutritionists.' },
    { q: 'How do I get the PDF after purchase?', a: 'The PDF is sent to your email immediately after payment. You can also download it from your profile page.' },
  ],
  te: [
    { q: 'ఉచిత ప్లాన్స్ నిజంగా ఉచితమేనా?', a: 'అవును, 100% ఉచితం. క్రెడిట్ కార్డ్ అవసరం లేదు. మీ ఇమెయిల్ ఇవ్వండి, PDF వెంటనే పంపబడుతుంది.' },
    { q: 'ఈ ప్లాన్స్ తెలుగు కుటుంబాలకు సరిపోతాయా?', a: 'తప్పకుండా. అన్ని ప్లాన్స్ రాగి, జొన్న, పెసరట్టు వంటి సాంప్రదాయ తెలుగు పదార్థాలు ఉపయోగిస్తాయి.' },
    { q: 'ప్రీమియం ప్లాన్స్‌లో ఏమి ఉంటుంది?', a: 'వారం వారం మీల్ షెడ్యూల్, షాపింగ్ లిస్ట్, రెసిపీ కార్డ్స్, మరియు మా న్యూట్రిషనిస్ట్ WhatsApp సపోర్ట్ ఉంటాయి.' },
    { q: 'డయాబెటిస్ ఉంటే ఈ ప్లాన్స్ ఫాలో చేయవచ్చా?', a: 'అవును. మాకు ప్రత్యేక డయాబెటిస్-ఫ్రెండ్లీ ప్లాన్ ఉంది. అన్ని ప్లాన్స్ సర్టిఫైడ్ న్యూట్రిషనిస్ట్‌లు రివ్యూ చేశారు.' },
    { q: 'కొనుగోలు తర్వాత PDF ఎలా పొందాలి?', a: 'పేమెంట్ తర్వాత PDF వెంటనే మీ ఇమెయిల్‌కు పంపబడుతుంది. మీ ప్రొఫైల్ పేజీ నుండి కూడా డౌన్‌లోడ్ చేయవచ్చు.' },
  ],
  hi: [
    { q: 'क्या मुफ्त प्लान्स सच में मुफ्त हैं?', a: 'हाँ, 100% मुफ्त। कोई क्रेडिट कार्ड नहीं चाहिए। बस अपना ईमेल दें, PDF तुरंत भेजा जाएगा।' },
    { q: 'क्या ये प्लान्स भारतीय परिवारों के लिए उपयुक्त हैं?', a: 'बिल्कुल। सभी प्लान्स रागी, ज्वार, पेसरट्टू जैसी पारंपरिक सामग्री का उपयोग करते हैं।' },
    { q: 'प्रीमियम प्लान्स में क्या शामिल है?', a: 'साप्ताहिक मील शेड्यूल, शॉपिंग लिस्ट, रेसिपी कार्ड्स और हमारे पोषण विशेषज्ञ का WhatsApp सपोर्ट।' },
    { q: 'क्या मधुमेह होने पर ये प्लान्स फॉलो कर सकते हैं?', a: 'हाँ। हमारे पास एक समर्पित डायबिटीज-फ्रेंडली प्लान है। सभी प्लान्स प्रमाणित पोषण विशेषज्ञों द्वारा समीक्षित हैं।' },
    { q: 'खरीद के बाद PDF कैसे मिलेगा?', a: 'भुगतान के तुरंत बाद PDF आपके ईमेल पर भेजा जाएगा। आप अपने प्रोफाइल पेज से भी डाउनलोड कर सकते हैं।' },
  ],
}

// Function to generate translations with dynamic stats
function getTranslations(familiesServed: string, freePlansCount: number, cuisinePercentage: string) {
  return {
    te: {
      hero_eyebrow: 'తెలుగు న్యూట్రిషన్',
      hero_title: 'మీ ఆరోగ్యానికి సరైన డైట్ ప్లాన్',
      hero_sub: 'ఉచిత & ప్రీమియం మీల్ ప్లాన్స్ — తెలుగు కుటుంబాల కోసం నిపుణులు రూపొందించారు.',
      hero_cta: 'ఉచిత ప్లాన్ పొందండి',
      hero_cta2: 'ప్రీమియం చూడండి',
      stats: [
        { value: familiesServed, label: 'కుటుంబాలు ఉపయోగించాయి' },
        { value: String(freePlansCount), label: 'ఉచిత ప్లాన్స్' },
        { value: cuisinePercentage, label: 'తెలుగు వంటకాలు' },
      ],
      free_title: 'ఉచిత మీల్ ప్లాన్స్',
      free_sub: 'డౌన్‌లోడ్ చేయండి, ప్రింట్ చేయండి, ఈ రోజే ప్రారంభించండి — పూర్తిగా ఉచితం.',
      premium_title: 'ప్రీమియం ప్లాన్స్',
      premium_sub: 'వ్యక్తిగతీకరించిన మీల్ ప్లాన్స్ — నిపుణుల మార్గదర్శకత్వంతో.',
      premium_badge: 'నిపుణులు రూపొందించారు',
      no_plans: 'ప్రీమియం ప్లాన్స్ త్వరలో వస్తాయి',
      no_plans_sub: 'వ్యక్తిగతీకరించిన మీల్ ప్లాన్స్ నిపుణుల మార్గదర్శకత్వంతో — త్వరలో లాంచ్ అవుతాయి.',
      email_placeholder: 'మీ ఇమెయిల్ ఇవ్వండి',
      download: 'ఉచిత PDF పొందండి',
      week_plan: '-వారాల ప్లాన్',
      one_time: 'ఒకసారి చెల్లింపు',
      faq_title: 'తరచుగా అడిగే ప్రశ్నలు',
      tools_title: 'మీకు ఏ ప్లాన్ సరిపోతుందో తెలుసుకోండి',
      tools_sub: 'మా ఉచిత హెల్త్ టూల్స్ ఉపయోగించి మీ BMI, కేలరీలు తనిఖీ చేయండి.',
      tools_btn: 'హెల్త్ టూల్స్ ట్రై చేయండి',
      trust: [
        { title: 'నిపుణులు ఆమోదించారు', desc: 'సర్టిఫైడ్ పోషకాహార నిపుణులు సమీక్షించారు' },
        { title: 'తెలుగు వంటకాలు', desc: 'సాంప్రదాయ పదార్థాలు, ఆధునిక శాస్త్రం' },
        { title: 'తక్షణ డౌన్‌లోడ్', desc: 'PDF వెంటనే మీ ఇన్‌బాక్స్‌కు వస్తుంది' },
      ],
      includes: 'ఇందులో ఉంటుంది:',
      get_free: 'ఉచితంగా పొందండి',
      nav_free: 'ఉచిత ప్లాన్స్',
      nav_premium: 'ప్రీమియం',
      nav_faq: 'FAQ',
    },
    hi: {
      hero_eyebrow: 'भारतीय पोषण',
      hero_title: 'आपकी सेहत के लिए सही डाइट प्लान',
      hero_sub: 'मुफ्त और प्रीमियम मील प्लान्स — भारतीय परिवारों के लिए विशेषज्ञों द्वारा तैयार।',
      hero_cta: 'मुफ्त प्लान पाएं',
      hero_cta2: 'प्रीमियम देखें',
      stats: [
        { value: familiesServed, label: 'परिवारों ने उपयोग किया' },
        { value: String(freePlansCount), label: 'मुफ्त प्लान्स' },
        { value: cuisinePercentage, label: 'भारतीय व्यंजन' },
      ],
      free_title: 'मुफ्त मील प्लान्स',
      free_sub: 'डाउनलोड करें, प्रिंट करें, आज से शुरू करें — पूरी तरह मुफ्त।',
      premium_title: 'प्रीमियम प्लान्स',
      premium_sub: 'विशेषज्ञ मार्गदर्शन के साथ व्यक्तिगत मील प्लान्स।',
      premium_badge: 'विशेषज्ञ डिज़ाइन',
      no_plans: 'प्रीमियम प्लान्स जल्द आ रहे हैं',
      no_plans_sub: 'विशेषज्ञ मार्गदर्शन के साथ व्यक्तिगत मील प्लान्स — जल्द लॉन्च होंगे।',
      email_placeholder: 'अपना ईमेल दर्ज करें',
      download: 'मुफ्त PDF पाएं',
      week_plan: '-सप्ताह का प्लान',
      one_time: 'एकमुश्त भुगतान',
      faq_title: 'अक्सर पूछे जाने वाले सवाल',
      tools_title: 'जानें कौन सा प्लान आपके लिए सही है',
      tools_sub: 'हमारे मुफ्त हेल्थ टूल्स से अपना BMI और कैलोरी जरूरत जांचें।',
      tools_btn: 'हेल्थ टूल्स आज़माएं',
      trust: [
        { title: 'विशेषज्ञ अनुमोदित', desc: 'प्रमाणित पोषण विशेषज्ञों द्वारा समीक्षित' },
        { title: 'भारतीय व्यंजन', desc: 'पारंपरिक सामग्री, आधुनिक पोषण विज्ञान' },
        { title: 'तुरंत डाउनलोड', desc: 'PDF आपके इनबॉक्स में तुरंत भेजा जाएगा' },
      ],
      includes: 'इसमें शामिल है:',
      get_free: 'मुफ्त पाएं',
      nav_free: 'मुफ्त प्लान्स',
      nav_premium: 'प्रीमियम',
      nav_faq: 'FAQ',
    },
    en: {
      hero_eyebrow: 'Telugu Nutrition',
      hero_title: 'The Right Diet Plan for Your Health',
      hero_sub: 'Free & premium meal plans — specially designed for Telugu families by certified nutritionists.',
      hero_cta: 'Get Free Plan',
      hero_cta2: 'View Premium',
      stats: [
        { value: familiesServed, label: 'Families served' },
        { value: String(freePlansCount), label: 'Free plans' },
        { value: cuisinePercentage, label: 'Telugu cuisine' },
      ],
      free_title: 'Free Meal Plans',
      free_sub: 'Download, print, and start today — completely free, no strings attached.',
      premium_title: 'Premium Plans',
      premium_sub: 'Personalized meal plans with expert nutritionist guidance.',
      premium_badge: 'Expert Designed',
      no_plans: 'Premium plans coming soon',
      no_plans_sub: 'Personalized meal plans with expert guidance — launching soon.',
      email_placeholder: 'Enter your email',
      download: 'Get Free PDF',
      week_plan: '-week plan',
      one_time: 'one-time payment',
      faq_title: 'Frequently Asked Questions',
      tools_title: 'Find out which plan suits you',
      tools_sub: 'Use our free health tools to check your BMI and calorie needs.',
      tools_btn: 'Try Health Tools',
      trust: [
        { title: 'Expert Approved', desc: 'All plans reviewed by certified nutritionists' },
        { title: 'Telugu Cuisine', desc: 'Traditional ingredients, modern nutrition science' },
        { title: 'Instant Download', desc: 'PDF delivered to your inbox immediately' },
      ],
      includes: 'Includes:',
      get_free: 'Get for Free',
      nav_free: 'Free Plans',
      nav_premium: 'Premium',
      nav_faq: 'FAQ',
    },
  }
}

export default function DietPlansClient({ 
  plans, 
  freePlansCount,
  familiesServed,
  cuisinePercentage 
}: { 
  plans: any[]; 
  freePlansCount: number;
  familiesServed: string;
  cuisinePercentage: string;
}) {
  const { language } = useLanguage()
  const translations = getTranslations(familiesServed, freePlansCount, cuisinePercentage)
  const tx = translations[language]
  const faqList = faqs[language]
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [emails, setEmails] = useState<Record<string, string>>({})
  const [freePlans, setFreePlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState<Record<string, boolean>>({})
  const [success, setSuccess] = useState<Record<string, boolean>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Fetch free plans from API
  useEffect(() => {
    async function fetchFreePlans() {
      try {
        const res = await fetch('/api/free-plans')
        if (res.ok) {
          const data = await res.json()
          // Map database plans to component format - only show active plans
          const mapped = data
            .filter((p: any) => p.isActive)
            .map((p: any) => ({
              _id: p._id,
              icon: iconMap[p.iconName] || Leaf,
              tag: { te: p.tagTe || p.tagEn, en: p.tagEn, hi: p.tagHi || p.tagEn },
              title: { te: p.titleTe || p.titleEn, en: p.titleEn, hi: p.titleHi || p.titleEn },
              desc: { te: p.descTe || p.descEn, en: p.descEn, hi: p.descHi || p.descEn },
              highlights: {
                te: p.highlightsTe?.length ? p.highlightsTe : (p.highlightsEn || []),
                en: p.highlightsEn || [],
                hi: p.highlightsHi?.length ? p.highlightsHi : (p.highlightsEn || []),
              },
              gradient: p.gradient || 'from-emerald-500 to-teal-500',
              bg: p.bgColor || 'bg-emerald-50 dark:bg-emerald-900/10',
              border: p.borderColor || 'border-emerald-200 dark:border-emerald-800',
              iconBg: p.iconBg || 'bg-emerald-100 dark:bg-emerald-900/30',
              iconColor: p.iconColor || 'text-emerald-600',
              pdfUrl: p.pdfUrl,
            }))
          setFreePlans(mapped)
        } else {
          setFreePlans([])
        }
      } catch (err) {
        console.error('Failed to fetch free plans:', err)
        setFreePlans([])
      } finally {
        setLoading(false)
      }
    }
    fetchFreePlans()
  }, [])

  // Handle email submission for a specific plan
  async function handleSendEmail(planId: string, planTitle: string) {
    const email = emails[planId]
    if (!email || !email.trim()) {
      setErrors(prev => ({ ...prev, [planId]: 'Please enter your email' }))
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setErrors(prev => ({ ...prev, [planId]: 'Please enter a valid email address' }))
      return
    }

    setSending(prev => ({ ...prev, [planId]: true }))
    setErrors(prev => ({ ...prev, [planId]: '' }))

    try {
      const res = await fetch('/api/free-plans/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, planId, language }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to send email')
      }

      setSuccess(prev => ({ ...prev, [planId]: true }))
      setEmails(prev => ({ ...prev, [planId]: '' }))
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSuccess(prev => ({ ...prev, [planId]: false }))
      }, 5000)
    } catch (err: any) {
      setErrors(prev => ({ ...prev, [planId]: err.message || 'Failed to send email. Please try again.' }))
    } finally {
      setSending(prev => ({ ...prev, [planId]: false }))
    }
  }

  return (
    <div className="bg-white dark:bg-slate-950">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f3d25] via-[#1A5C38] to-emerald-600 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-white/5" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-emerald-100">
                <Leaf size={12} /> {tx.hero_eyebrow}
              </span>
              <h1 className="font-nunito text-4xl font-bold leading-tight text-white md:text-5xl">{tx.hero_title}</h1>
              <p className="mt-4 text-base text-emerald-100/90">{tx.hero_sub}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#free" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#1A5C38] shadow-lg transition hover:bg-emerald-50 active:scale-95">
                  <Download size={15} /> {tx.hero_cta}
                </a>
                <a href="#premium" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
                  {tx.hero_cta2} <ArrowRight size={14} />
                </a>
              </div>
            </div>
            <div className="flex flex-row gap-4 md:flex-col">
              {tx.stats.map((s) => (
                <div key={s.label} className="rounded-2xl bg-white/10 px-5 py-4 text-center">
                  <p className="font-nunito text-2xl font-bold text-white">{s.value}</p>
                  <p className="mt-0.5 text-xs text-emerald-200">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Sticky nav ── */}
      <div className="sticky top-16 z-20 border-b bg-white/95 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/95">
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2">
          {[{ href: '#free', label: tx.nav_free }, { href: '#premium', label: tx.nav_premium }, { href: '#faq', label: tx.nav_faq }].map((item) => (
            <a key={item.href} href={item.href}
              className="shrink-0 rounded-full px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-emerald-50 hover:text-[#1A5C38] dark:text-slate-400 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400">
              {item.label}
            </a>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-20 px-4 py-14">

        {/* ── Trust bar ── */}
        <div className="grid gap-4 sm:grid-cols-3">
          {tx.trust.map(({ title, desc }, i) => {
            const icons = [BadgeCheck, Leaf, Zap]
            const Icon = icons[i]
            return (
              <div key={title} className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1A5C38]/10 dark:bg-emerald-900/30">
                  <Icon size={18} className="text-[#1A5C38] dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-slate-50">{title}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">{desc}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Free Plans ── */}
        <section id="free" className="scroll-mt-28">
          <div className="mb-2 flex items-center gap-3">
            <span className="h-1 w-8 rounded-full bg-[#1A5C38]" />
            <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">100% FREE</span>
          </div>
          <h2 className="font-nunito text-3xl font-bold text-gray-900 dark:text-slate-50">{tx.free_title}</h2>
          <p className="mt-2 text-gray-500 dark:text-slate-400">{tx.free_sub}</p>
          
          {loading ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 animate-pulse rounded-2xl bg-gray-100 dark:bg-slate-800" />
              ))}
            </div>
          ) : freePlans.length === 0 ? (
            <div className="mt-8 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50 p-12 text-center dark:border-emerald-700 dark:bg-emerald-900/10">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                <Gift size={28} className="text-emerald-500" />
              </div>
              <p className="font-nunito text-xl font-bold text-emerald-800 dark:text-emerald-300">
                {language === 'te' ? 'ఉచిత ప్లాన్స్ త్వరలో వస్తాయి' : language === 'hi' ? 'मुफ्त प्लान्स जल्द आ रहे हैं' : 'Free plans coming soon'}
              </p>
              <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-400">
                {language === 'te' ? 'మేము మీ కోసం అద్భుతమైన ఉచిత మీల్ ప్లాన్స్ తయారు చేస్తున్నాము' : language === 'hi' ? 'हम आपके लिए शानदार मुफ्त मील प्लान्स तैयार कर रहे हैं' : 'We are preparing amazing free meal plans for you'}
              </p>
              <a href="#premium" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1A5C38] px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-800">
                {language === 'te' ? 'ప్రీమియం చూడండి' : language === 'hi' ? 'प्रीमियम देखें' : 'View Premium Plans'} <ArrowRight size={14} />
              </a>
            </div>
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {freePlans.map((p) => {
                const Icon = p.icon
                const planId = p._id || p.title.en
                const emailVal = emails[planId] ?? ''
                const isSending = sending[planId] || false
                const isSuccess = success[planId] || false
                const error = errors[planId] || ''
                
                return (
                  <div key={planId}
                    className={`group flex flex-col overflow-hidden rounded-2xl border ${p.border} ${p.bg} transition hover:-translate-y-1 hover:shadow-lg`}>
                    <div className={`h-1.5 w-full bg-gradient-to-r ${p.gradient}`} />
                    <div className="flex flex-1 flex-col p-5">
                      <div className="mb-4 flex items-start gap-3">
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${p.iconBg}`}>
                          <Icon size={22} className={p.iconColor} />
                        </div>
                        <div>
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${p.iconColor}`}>{p.tag[language]}</span>
                          <p className="font-nunito text-base font-bold leading-snug text-gray-900 dark:text-slate-50">{p.title[language]}</p>
                        </div>
                      </div>
                      <p className="mb-4 text-sm text-gray-600 dark:text-slate-400">{p.desc[language]}</p>
                      {p.highlights[language]?.length > 0 && (
                        <ul className="mb-5 space-y-1.5">
                          {p.highlights[language].map((h: string, idx: number) => (
                            <li key={idx} className="flex items-center gap-2 text-xs text-gray-700 dark:text-slate-300">
                              <CheckCircle2 size={13} className="shrink-0 text-emerald-500" /> {h}
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="mt-auto space-y-2">
                        {isSuccess ? (
                          <div className="rounded-xl bg-emerald-100 px-4 py-3 text-center dark:bg-emerald-900/30">
                            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                              ✓ {language === 'te' ? 'ఇమెయిల్ పంపబడింది!' : language === 'hi' ? 'ईमेल भेजा गया!' : 'Email sent!'}
                            </p>
                            <p className="mt-0.5 text-xs text-emerald-600 dark:text-emerald-500">
                              {language === 'te' ? 'మీ ఇన్‌బాక్స్ చెక్ చేయండి' : language === 'hi' ? 'अपना इनबॉक्स चेक करें' : 'Check your inbox'}
                            </p>
                          </div>
                        ) : (
                          <>
                            <input 
                              type="email" 
                              value={emailVal}
                              onChange={(e) => {
                                setEmails((prev) => ({ ...prev, [planId]: e.target.value }))
                                setErrors((prev) => ({ ...prev, [planId]: '' }))
                              }}
                              placeholder={tx.email_placeholder}
                              disabled={isSending}
                              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-2 focus:ring-[#1A5C38]/20 disabled:opacity-60 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500" 
                            />
                            {error && (
                              <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
                            )}
                            <button 
                              type="button"
                              onClick={() => handleSendEmail(planId, p.title[language])}
                              disabled={isSending}
                              className={`flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${p.gradient} px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:opacity-90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed`}>
                              {isSending ? (
                                <>
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                  {language === 'te' ? 'పంపుతోంది...' : language === 'hi' ? 'भेजा जा रहा है...' : 'Sending...'}
                                </>
                              ) : (
                                <>
                                  <Download size={14} /> {tx.download}
                                </>
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* ── Premium Plans ── */}
        <section id="premium" className="scroll-mt-28">
          <div className="mb-2 flex items-center gap-3">
            <span className="h-1 w-8 rounded-full bg-amber-500" />
            <span className="rounded-full bg-amber-100 px-3 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">{tx.premium_badge}</span>
          </div>
          <h2 className="font-nunito text-3xl font-bold text-gray-900 dark:text-slate-50">{tx.premium_title}</h2>
          <p className="mt-2 text-gray-500 dark:text-slate-400">{tx.premium_sub}</p>
          <div className="mb-8 mt-6"><PromotionBlock placement="diet-plans" language={language} /></div>
          {plans.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50 p-12 text-center dark:border-amber-700 dark:bg-amber-900/10">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                <Star size={28} className="text-amber-500" />
              </div>
              <p className="font-nunito text-xl font-bold text-amber-800 dark:text-amber-300">{tx.no_plans}</p>
              <p className="mt-2 text-sm text-amber-700 dark:text-amber-400">{tx.no_plans_sub}</p>
              <a href="#free" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1A5C38] px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-800">
                <Download size={14} /> {tx.hero_cta}
              </a>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {plans.map((p, idx) => {
                const isFeatured = idx === 0
                return (
                  <div key={p._id}
                    className={`relative flex flex-col overflow-hidden rounded-2xl shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${isFeatured ? 'border-2 border-amber-400 bg-gradient-to-b from-amber-50 to-white dark:border-amber-500 dark:from-amber-900/20 dark:to-slate-800' : 'border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800'}`}>
                    {isFeatured && (
                      <div className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-400 to-orange-400 py-2 text-xs font-bold text-white">
                        <Star size={12} fill="white" /> Most Popular
                      </div>
                    )}
                    {!isFeatured && <div className="h-1.5 w-full bg-gradient-to-r from-gray-300 to-gray-400 dark:from-slate-600 dark:to-slate-500" />}
                    <div className="flex flex-1 flex-col p-6">
                      <p className="font-nunito text-xl font-bold text-gray-900 dark:text-slate-50">{p.title}</p>
                      {p.description && <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">{p.description}</p>}
                      <span className="mt-3 inline-flex w-fit items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                        <Clock size={11} /> {p.durationWeeks}{tx.week_plan}
                      </span>
                      <div className="my-5 flex items-end gap-2">
                        <span className="font-nunito text-4xl font-bold text-[#D97706] dark:text-amber-400">{p.currency}{p.price}</span>
                        <span className="mb-1 text-xs text-gray-400 dark:text-slate-500">{tx.one_time}</span>
                      </div>
                      {p.features?.length > 0 && (
                        <ul className="mb-6 space-y-2.5">
                          {p.features.map((f: string, i: number) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-slate-300">
                              <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-500" /> {f}
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="mt-auto"><BuyPlanButton planId={p._id} planTitle={p.title} price={p.price} currency={p.currency} /></div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* ── Health Tools CTA ── */}
        <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-[#1A5C38] to-emerald-600 shadow-xl dark:from-slate-800 dark:to-slate-700">
          <div className="flex flex-col items-start justify-between gap-6 p-8 md:flex-row md:items-center">
            <div>
              <p className="font-nunito text-2xl font-bold text-white">{tx.tools_title}</p>
              <p className="mt-1 text-sm text-emerald-100">{tx.tools_sub}</p>
            </div>
            <Link href="/health-tools"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#1A5C38] shadow-lg transition hover:bg-emerald-50 active:scale-95">
              <Activity size={16} /> {tx.tools_btn} <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="scroll-mt-28">
          <div className="mb-2 flex items-center gap-3">
            <span className="h-1 w-8 rounded-full bg-[#1A5C38]" />
          </div>
          <h2 className="font-nunito text-3xl font-bold text-gray-900 dark:text-slate-50">{tx.faq_title}</h2>
          <div className="mt-8 space-y-3">
            {faqList.map((item, i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                <button type="button" onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
                  <span className="font-semibold text-gray-900 dark:text-slate-50">{item.q}</span>
                  {openFaq === i
                    ? <ChevronUp size={18} className="shrink-0 text-[#1A5C38] dark:text-emerald-400" />
                    : <ChevronDown size={18} className="shrink-0 text-gray-400" />}
                </button>
                {openFaq === i && (
                  <div className="border-t border-gray-100 px-5 py-4 dark:border-slate-700">
                    <p className="text-sm text-gray-600 dark:text-slate-400">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section className="rounded-3xl bg-[#F0FAF4] py-12 text-center dark:bg-emerald-900/10">
          <div className="mx-auto max-w-lg">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#1A5C38]/10">
              <Sparkles size={28} className="text-[#1A5C38] dark:text-emerald-400" />
            </div>
            <h3 className="font-nunito text-2xl font-bold text-gray-900 dark:text-slate-50">
              {language === 'te' ? 'ఈ రోజే మీ ఆరోగ్య ప్రయాణం ప్రారంభించండి' : language === 'hi' ? 'आज ही अपनी स्वास्थ्य यात्रा शुरू करें' : 'Start your health journey today'}
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
              {language === 'te' ? '6 ఉచిత ప్లాన్స్ అందుబాటులో ఉన్నాయి — ఇప్పుడే డౌన్‌లోడ్ చేయండి.' : language === 'hi' ? '6 मुफ्त प्लान्स उपलब्ध हैं — अभी डाउनलोड करें।' : '6 free plans available — download now.'}
            </p>
            <a href="#free"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1A5C38] px-8 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-800 active:scale-95">
              <Download size={15} /> {tx.hero_cta}
            </a>
          </div>
        </section>

      </div>
    </div>
  )
}

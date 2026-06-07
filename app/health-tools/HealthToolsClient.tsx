'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/components/LanguageProvider'
import { Scale, Flame, Ruler, Candy, Droplets, Activity, Star, Sun, Snowflake, Lightbulb } from 'lucide-react'
import PromotionBlock from '@/components/promotions/PromotionBlock'

type Tool = 'bmi' | 'calorie' | 'ideal-weight' | 'sugar' | 'water' | 'waist-hip'

const toolsMeta = {
  te: [
    { id: 'bmi' as Tool,          icon: <Scale size={18} />,    label: 'BMI కాలిక్యులేటర్',       desc: 'మీ బాడీ మాస్ ఇండెక్స్ తనిఖీ చేయండి' },
    { id: 'calorie' as Tool,      icon: <Flame size={18} />,    label: 'కేలరీ కాలిక్యులేటర్',     desc: 'రోజువారీ కేలరీ అవసరాలు (TDEE)' },
    { id: 'ideal-weight' as Tool, icon: <Ruler size={18} />,    label: 'ఆదర్శ బరువు',              desc: 'మీ ఆరోగ్యకరమైన బరువు పరిధి' },
    { id: 'sugar' as Tool,        icon: <Candy size={18} />,    label: 'షుగర్ ఇన్‌టేక్ చెకర్',    desc: 'రోజువారీ చక్కెర పరిమితి తనిఖీ' },
    { id: 'water' as Tool,        icon: <Droplets size={18} />, label: 'నీటి అవసరం',               desc: 'రోజుకు ఎంత నీరు తాగాలి' },
    { id: 'waist-hip' as Tool,    icon: <Activity size={18} />, label: 'వెయిస్ట్-హిప్ రేషియో',    desc: 'పొట్ట ఊబకాయం రిస్క్ తనిఖీ' },
  ],
  hi: [
    { id: 'bmi' as Tool,          icon: <Scale size={18} />,    label: 'BMI कैलकुलेटर',        desc: 'अपना बॉडी मास इंडेक्स जांचें' },
    { id: 'calorie' as Tool,      icon: <Flame size={18} />,    label: 'कैलोरी कैलकुलेटर',     desc: 'दैनिक कैलोरी जरूरत (TDEE)' },
    { id: 'ideal-weight' as Tool, icon: <Ruler size={18} />,    label: 'आदर्श वजन',             desc: 'अपना स्वस्थ वजन सीमा जानें' },
    { id: 'sugar' as Tool,        icon: <Candy size={18} />,    label: 'शुगर इनटेक चेकर',      desc: 'दैनिक चीनी सीमा जांचें' },
    { id: 'water' as Tool,        icon: <Droplets size={18} />, label: 'पानी की जरूरत',         desc: 'रोज कितना पानी पीना चाहिए' },
    { id: 'waist-hip' as Tool,    icon: <Activity size={18} />, label: 'कमर-कूल्हा अनुपात',    desc: 'पेट की मोटापा जोखिम जांचें' },
  ],
  en: [
    { id: 'bmi' as Tool,          icon: <Scale size={18} />,    label: 'BMI Calculator',       desc: 'Check your Body Mass Index' },
    { id: 'calorie' as Tool,      icon: <Flame size={18} />,    label: 'Calorie Calculator',    desc: 'Daily calorie needs (TDEE)' },
    { id: 'ideal-weight' as Tool, icon: <Ruler size={18} />,    label: 'Ideal Weight',          desc: 'Find your healthy weight range' },
    { id: 'sugar' as Tool,        icon: <Candy size={18} />,    label: 'Sugar Intake Checker',  desc: 'Daily sugar limit & food check' },
    { id: 'water' as Tool,        icon: <Droplets size={18} />, label: 'Water Intake',          desc: 'How much water you need daily' },
    { id: 'waist-hip' as Tool,    icon: <Activity size={18} />, label: 'Waist-Hip Ratio',       desc: 'Abdominal obesity risk check' },
  ],
}

function UpgradeCTA({ result, price, language }: { result: string; price: string; language: 'en' | 'te' | 'hi' }) {
  const labels = {
    en: {
      title: 'Want a personalized diet plan?',
      desc: 'Based on your result ({result}), our nutritionists have curated a meal plan tailored for you. Get structured 4-week plans, grocery lists, and blood-sugar friendly recipes.',
      premium: 'Upgrade to Premium Plan {price} →',
      free: 'Try Free Plan First',
    },
    te: {
      title: 'వ్యక్తిగత డైట్ ప్లాన్ కావాలా?',
      desc: 'మీ ఫలితం ({result}) ఆధారంగా, మా పోషకాహార నిపుణులు మీకు అనుకూలమైన ఆహార ప్లాన్ రూపొందించారు. 4-వారాల ప్లాన్లు, కిరాణా జాబితాలు మరియు బ్లడ్-షుగర్ స్నేహపూర్వక వంటకాలు పొందండి.',
      premium: 'ప్రీమియం ప్లాన్‌కు అప్‌గ్రేడ్ చేయండి {price} →',
      free: 'ముందుగా ఉచిత ప్లాన్ ప్రయత్నించండి',
    },
    hi: {
      title: 'व्यक्तिगत डाइट प्लान चाहिए?',
      desc: 'आपके परिणाम ({result}) के आधार पर, हमारे पोषण विशेषज्ञों ने आपके लिए एक भोजन योजना तैयार की है। 4-सप्ताह की योजनाएं, किराने की सूची और ब्लड-शुगर अनुकूल रेसिपी प्राप्त करें।',
      premium: 'प्रीमियम प्लान में अपग्रेड करें {price} →',
      free: 'पहले मुफ्त प्लान आजमाएं',
    },
  }

  const t = labels[language]

  return (
    <div className="mt-6 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-5 dark:border-amber-700 dark:from-amber-900/20 dark:to-orange-900/20">
      <div className="flex items-start gap-3">
        <Star size={22} className="shrink-0 text-amber-500 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-bold text-amber-900 dark:text-amber-200">{t.title}</p>
          <p className="mt-1 text-xs text-amber-800 dark:text-amber-300">
            {t.desc.replace('{result}', result)}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href="/diet-plans#premium"
              className="inline-flex items-center rounded-full bg-[#D97706] px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:opacity-90"
            >
              {t.premium.replace('{price}', price)}
            </Link>
            <Link
              href="/diet-plans#free"
              className="inline-flex items-center rounded-full border border-amber-400 px-4 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100 dark:text-amber-300 dark:hover:bg-amber-900/30"
            >
              {t.free}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function BMICalculator({ price, language }: { price: string; language: 'en' | 'te' | 'hi' }) {
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [result, setResult] = useState<{ bmi: number; category: string; color: string } | null>(null)

  const labels = {
    en: {
      height: 'Height (cm)',
      weight: 'Weight (kg)',
      calculate: 'Calculate BMI',
      underweight: 'Underweight',
      normal: 'Normal weight',
      overweight: 'Overweight',
      obese: 'Obese',
    },
    te: {
      height: 'ఎత్తు (సెం.మీ)',
      weight: 'బరువు (కిలోలు)',
      calculate: 'BMI లెక్కించండి',
      underweight: 'తక్కువ బరువు',
      normal: 'సాధారణ బరువు',
      overweight: 'అధిక బరువు',
      obese: 'ఊబకాయం',
    },
    hi: {
      height: 'ऊंचाई (सें.मी)',
      weight: 'वजन (किलो)',
      calculate: 'BMI गणना करें',
      underweight: 'कम वजन',
      normal: 'सामान्य वजन',
      overweight: 'अधिक वजन',
      obese: 'मोटापा',
    },
  }

  const t = labels[language]

  function calculate() {
    const h = parseFloat(height) / 100
    const w = parseFloat(weight)
    if (!h || !w || h <= 0 || w <= 0) return
    const bmi = w / (h * h)
    let category = '', color = ''
    if (bmi < 18.5) { category = t.underweight; color = 'text-blue-600' }
    else if (bmi < 25) { category = t.normal; color = 'text-emerald-600' }
    else if (bmi < 30) { category = t.overweight; color = 'text-amber-600' }
    else { category = t.obese; color = 'text-red-600' }
    setResult({ bmi: Math.round(bmi * 10) / 10, category, color })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-slate-300">{t.height}</label>
          <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="e.g. 165"
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-slate-300">{t.weight}</label>
          <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 65"
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500" />
        </div>
      </div>
      <button onClick={calculate} className="w-full rounded-xl bg-[#1A5C38] py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
        {t.calculate}
      </button>
      {result && (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800/60">
          <p className="text-4xl font-bold text-gray-900 dark:text-slate-50">{result.bmi}</p>
          <p className={`mt-1 text-sm font-semibold ${result.color}`}>{result.category}</p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-slate-700">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-400 via-emerald-400 via-amber-400 to-red-500" style={{ width: `${Math.min((result.bmi / 40) * 100, 100)}%` }} />
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-gray-400">
            <span>{t.underweight}</span><span>{t.normal}</span><span>{t.overweight}</span><span>{t.obese}</span>
          </div>
          <UpgradeCTA result={`BMI ${result.bmi} — ${result.category}`} price={price} language={language} />
        </div>
      )}
    </div>
  )
}

function CalorieCalculator({ price, language }: { price: string; language: 'en' | 'te' | 'hi' }) {
  const [age, setAge] = useState('')
  const [gender, setGender] = useState<'male' | 'female'>('female')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [activity, setActivity] = useState('1.375')
  const [result, setResult] = useState<{ bmr: number; tdee: number; goal: string } | null>(null)

  const labels = {
    en: {
      age: 'Age (years)',
      gender: 'Gender',
      female: 'Female',
      male: 'Male',
      height: 'Height (cm)',
      weight: 'Weight (kg)',
      activityLevel: 'Activity Level',
      calculate: 'Calculate Calories',
      bmr: 'BMR (base calories)',
      tdee: 'Daily calories (TDEE)',
      lowGoal: 'Low calorie needs — focus on nutrient-dense foods',
      modGoal: 'Moderate calorie needs — balanced diet recommended',
      highGoal: 'High calorie needs — ensure adequate protein & complex carbs',
      activities: [
        'Sedentary (desk job, no exercise)',
        'Lightly active (1–3 days/week)',
        'Moderately active (3–5 days/week)',
        'Very active (6–7 days/week)',
        'Extra active (physical job + gym)',
      ],
    },
    te: {
      age: 'వయస్సు (సంవత్సరాలు)',
      gender: 'లింగం',
      female: 'స్త్రీ',
      male: 'పురుషుడు',
      height: 'ఎత్తు (సెం.మీ)',
      weight: 'బరువు (కిలోలు)',
      activityLevel: 'చురుకుదనం స్థాయి',
      calculate: 'కేలరీలు లెక్కించండి',
      bmr: 'BMR (బేస్ కేలరీలు)',
      tdee: 'రోజువారీ కేలరీలు (TDEE)',
      lowGoal: 'తక్కువ కేలరీ అవసరాలు — పోషక-సాంద్రమైన ఆహారంపై దృష్టి పెట్టండి',
      modGoal: 'మోస్తరు కేలరీ అవసరాలు — సమతుల్య ఆహారం సిఫార్సు చేయబడింది',
      highGoal: 'అధిక కేలరీ అవసరాలు — తగినంత ప్రోటీన్ & సంక్లిష్ట కార్బోహైడ్రేట్లు నిర్ధారించండి',
      activities: [
        'నిశ్చల (డెస్క్ పని, వ్యాయామం లేదు)',
        'కొంచెం చురుకుగా (వారానికి 1–3 రోజులు)',
        'మోస్తరుగా చురుకుగా (వారానికి 3–5 రోజులు)',
        'చాలా చురుకుగా (వారానికి 6–7 రోజులు)',
        'అదనపు చురుకుగా (శారీరక పని + జిమ్)',
      ],
    },
    hi: {
      age: 'उम्र (वर्ष)',
      gender: 'लिंग',
      female: 'महिला',
      male: 'पुरुष',
      height: 'ऊंचाई (सें.मी)',
      weight: 'वजन (किलो)',
      activityLevel: 'गतिविधि स्तर',
      calculate: 'कैलोरी गणना करें',
      bmr: 'BMR (आधार कैलोरी)',
      tdee: 'दैनिक कैलोरी (TDEE)',
      lowGoal: 'कम कैलोरी जरूरत — पोषक तत्वों से भरपूर खाद्य पदार्थों पर ध्यान दें',
      modGoal: 'मध्यम कैलोरी जरूरत — संतुलित आहार की सिफारिश',
      highGoal: 'उच्च कैलोरी जरूरत — पर्याप्त प्रोटीन और जटिल कार्ब्स सुनिश्चित करें',
      activities: [
        'निष्क्रिय (डेस्क जॉब, कोई व्यायाम नहीं)',
        'हल्का सक्रिय (सप्ताह में 1–3 दिन)',
        'मध्यम सक्रिय (सप्ताह में 3–5 दिन)',
        'बहुत सक्रिय (सप्ताह में 6–7 दिन)',
        'अतिरिक्त सक्रिय (शारीरिक काम + जिम)',
      ],
    },
  }

  const t = labels[language]

  const activityLevels = [
    { value: '1.2', label: t.activities[0] },
    { value: '1.375', label: t.activities[1] },
    { value: '1.55', label: t.activities[2] },
    { value: '1.725', label: t.activities[3] },
    { value: '1.9', label: t.activities[4] },
  ]

  function calculate() {
    const a = parseFloat(age), h = parseFloat(height), w = parseFloat(weight), act = parseFloat(activity)
    if (!a || !h || !w) return
    const bmr = gender === 'male'
      ? 10 * w + 6.25 * h - 5 * a + 5
      : 10 * w + 6.25 * h - 5 * a - 161
    const tdee = Math.round(bmr * act)
    const goal = tdee < 1600 ? t.lowGoal
      : tdee < 2200 ? t.modGoal
      : t.highGoal
    setResult({ bmr: Math.round(bmr), tdee, goal })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-slate-300">{t.age}</label>
          <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="e.g. 30"
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-slate-300">{t.gender}</label>
          <select value={gender} onChange={e => setGender(e.target.value as 'male' | 'female')}
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
            <option value="female">{t.female}</option>
            <option value="male">{t.male}</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-slate-300">{t.height}</label>
          <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="e.g. 160"
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-slate-300">{t.weight}</label>
          <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 60"
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500" />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-slate-300">{t.activityLevel}</label>
        <select value={activity} onChange={e => setActivity(e.target.value)}
          className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
          {activityLevels.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
        </select>
      </div>
      <button onClick={calculate} className="w-full rounded-xl bg-[#1A5C38] py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
        {t.calculate}
      </button>
      {result && (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="rounded-xl bg-white p-3 shadow-sm dark:bg-slate-900">
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-50">{result.bmr}</p>
              <p className="text-[11px] text-gray-500 dark:text-slate-400">{t.bmr}</p>
            </div>
            <div className="rounded-xl bg-[#1A5C38] p-3 shadow-sm">
              <p className="text-2xl font-bold text-white">{result.tdee}</p>
              <p className="text-[11px] text-emerald-100">{t.tdee}</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-600 dark:text-slate-400">{result.goal}</p>
          <UpgradeCTA result={`${result.tdee} kcal/day TDEE`} price={price} language={language} />
        </div>
      )}
    </div>
  )
}

function IdealWeightCalculator({ price, language }: { price: string; language: 'en' | 'te' | 'hi' }) {
  const [height, setHeight] = useState('')
  const [gender, setGender] = useState<'male' | 'female'>('female')
  const [result, setResult] = useState<{ min: number; max: number; robinson: number } | null>(null)

  const labels = {
    en: {
      height: 'Height (cm)',
      gender: 'Gender',
      female: 'Female',
      male: 'Male',
      calculate: 'Calculate Ideal Weight',
      bmiRange: 'Healthy BMI range',
      robinson: 'Robinson formula',
    },
    te: {
      height: 'ఎత్తు (సెం.మీ)',
      gender: 'లింగం',
      female: 'స్త్రీ',
      male: 'పురుషుడు',
      calculate: 'ఆదర్శ బరువు లెక్కించండి',
      bmiRange: 'ఆరోగ్యకరమైన BMI పరిధి',
      robinson: 'రాబిన్సన్ ఫార్ములా',
    },
    hi: {
      height: 'ऊंचाई (सें.मी)',
      gender: 'लिंग',
      female: 'महिला',
      male: 'पुरुष',
      calculate: 'आदर्श वजन गणना करें',
      bmiRange: 'स्वस्थ BMI सीमा',
      robinson: 'रॉबिन्सन फॉर्मूला',
    },
  }

  const t = labels[language]

  function calculate() {
    const h = parseFloat(height)
    if (!h || h < 100) return
    const inchesOver5ft = (h / 2.54) - 60
    const robinson = gender === 'male'
      ? 52 + 1.9 * inchesOver5ft
      : 49 + 1.7 * inchesOver5ft
    const bmiMin = (18.5 * (h / 100) * (h / 100))
    const bmiMax = (24.9 * (h / 100) * (h / 100))
    setResult({ min: Math.round(bmiMin * 10) / 10, max: Math.round(bmiMax * 10) / 10, robinson: Math.round(robinson * 10) / 10 })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-slate-300">{t.height}</label>
          <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="e.g. 162"
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-slate-300">{t.gender}</label>
          <select value={gender} onChange={e => setGender(e.target.value as 'male' | 'female')}
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
            <option value="female">{t.female}</option>
            <option value="male">{t.male}</option>
          </select>
        </div>
      </div>
      <button onClick={calculate} className="w-full rounded-xl bg-[#1A5C38] py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
        {t.calculate}
      </button>
      {result && (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="rounded-xl bg-white p-3 shadow-sm dark:bg-slate-900">
              <p className="text-xl font-bold text-gray-900 dark:text-slate-50">{result.min}–{result.max} kg</p>
              <p className="text-[11px] text-gray-500 dark:text-slate-400">{t.bmiRange}</p>
            </div>
            <div className="rounded-xl bg-[#1A5C38] p-3 shadow-sm">
              <p className="text-xl font-bold text-white">{result.robinson} kg</p>
              <p className="text-[11px] text-emerald-100">{t.robinson}</p>
            </div>
          </div>
          <UpgradeCTA result={`Ideal weight ${result.min}–${result.max} kg`} price={price} language={language} />
        </div>
      )}
    </div>
  )
}

function SugarIntakeChecker({ price, language }: { price: string; language: 'en' | 'te' | 'hi' }) {
  const [isDiabetic, setIsDiabetic] = useState(false)
  const [breakfast, setBreakfast] = useState('')
  const [lunch, setLunch] = useState('')
  const [dinner, setDinner] = useState('')
  const [snacks, setSnacks] = useState('')
  const [beverages, setBeverages] = useState('')
  const [showFoodRef, setShowFoodRef] = useState(false)
  
  // Multilingual food reference items (common Indian foods)
  const foodReference = {
    en: [
      { name: 'Tea with 1 tsp sugar', sugar: 4 },
      { name: 'Tea with 2 tsp sugar', sugar: 8 },
      { name: 'Coffee with 1 tsp sugar', sugar: 4 },
      { name: 'Biscuits (2 pcs Marie)', sugar: 3 },
      { name: 'Biscuits (2 pcs Cream)', sugar: 6 },
      { name: 'Packaged juice (200ml)', sugar: 20 },
      { name: 'Fresh juice (no sugar)', sugar: 15 },
      { name: 'Soft drink (300ml)', sugar: 32 },
      { name: 'Soft drink (600ml)', sugar: 65 },
      { name: 'Chocolate bar (40g)', sugar: 24 },
      { name: 'Ice cream (1 scoop)', sugar: 14 },
      { name: 'Gulab jamun (2 pcs)', sugar: 25 },
      { name: 'Jalebi (2 pcs)', sugar: 28 },
      { name: 'Rasgulla (2 pcs)', sugar: 18 },
      { name: 'Sweet lassi (1 glass)', sugar: 25 },
      { name: 'Banana (medium)', sugar: 14 },
      { name: 'Apple (medium)', sugar: 19 },
      { name: 'Mango (medium)', sugar: 46 },
      { name: 'Grapes (1 cup)', sugar: 23 },
      { name: 'Sweetened yogurt (1 cup)', sugar: 17 },
      { name: 'Breakfast cereal (1 cup)', sugar: 12 },
      { name: 'Energy drink (250ml)', sugar: 27 },
      { name: 'Sports drink (500ml)', sugar: 35 },
      { name: 'Flavored milk (200ml)', sugar: 18 },
    ],
    te: [
      { name: 'టీ (1 చెంచా చక్కెర)', sugar: 4 },
      { name: 'టీ (2 చెంచాల చక్కెర)', sugar: 8 },
      { name: 'కాఫీ (1 చెంచా చక్కెర)', sugar: 4 },
      { name: 'బిస్కెట్లు (2 మేరీ)', sugar: 3 },
      { name: 'బిస్కెట్లు (2 క్రీం)', sugar: 6 },
      { name: 'ప్యాకేజీ జ్యూస్ (200ml)', sugar: 20 },
      { name: 'తాజా జ్యూస్ (చక్కెర లేకుండా)', sugar: 15 },
      { name: 'సాఫ్ట్ డ్రింక్ (300ml)', sugar: 32 },
      { name: 'సాఫ్ట్ డ్రింక్ (600ml)', sugar: 65 },
      { name: 'చాక్లెట్ బార్ (40g)', sugar: 24 },
      { name: 'ఐస్‌క్రీం (1 స్కూప్)', sugar: 14 },
      { name: 'గులాబ్ జామున్ (2 ముక్కలు)', sugar: 25 },
      { name: 'జలేబీ (2 ముక్కలు)', sugar: 28 },
      { name: 'రసగుల్లా (2 ముక్కలు)', sugar: 18 },
      { name: 'తీపి లస్సీ (1 గ్లాసు)', sugar: 25 },
      { name: 'అరటి పండు (మధ్యం)', sugar: 14 },
      { name: 'ఆపిల్ (మధ్యం)', sugar: 19 },
      { name: 'మామిడి (మధ్యం)', sugar: 46 },
      { name: 'ద్రాక్ష (1 కప్పు)', sugar: 23 },
      { name: 'తీపి యోగర్ట్ (1 కప్పు)', sugar: 17 },
      { name: 'బ్రేక్‌ఫాస్ట్ సీరియల్ (1 కప్పు)', sugar: 12 },
      { name: 'ఎనర్జీ డ్రింక్ (250ml)', sugar: 27 },
      { name: 'స్పోర్ట్స్ డ్రింక్ (500ml)', sugar: 35 },
      { name: 'ఫ్లేవర్డ్ మిల్క్ (200ml)', sugar: 18 },
    ],
    hi: [
      { name: 'चाय (1 चम्मच चीनी)', sugar: 4 },
      { name: 'चाय (2 चम्मच चीनी)', sugar: 8 },
      { name: 'कॉफी (1 चम्मच चीनी)', sugar: 4 },
      { name: 'बिस्किट (2 मैरी)', sugar: 3 },
      { name: 'बिस्किट (2 क्रीम)', sugar: 6 },
      { name: 'पैकेज्ड जूस (200ml)', sugar: 20 },
      { name: 'ताजा जूस (बिना चीनी)', sugar: 15 },
      { name: 'सॉफ्ट ड्रिंक (300ml)', sugar: 32 },
      { name: 'सॉफ्ट ड्रिंक (600ml)', sugar: 65 },
      { name: 'चॉकलेट बार (40g)', sugar: 24 },
      { name: 'आइसक्रीम (1 स्कूप)', sugar: 14 },
      { name: 'गुलाब जामुन (2 टुकड़े)', sugar: 25 },
      { name: 'जलेबी (2 टुकड़े)', sugar: 28 },
      { name: 'रसगुल्ला (2 टुकड़े)', sugar: 18 },
      { name: 'मीठी लस्सी (1 गिलास)', sugar: 25 },
      { name: 'केला (मध्यम)', sugar: 14 },
      { name: 'सेब (मध्यम)', sugar: 19 },
      { name: 'आम (मध्यम)', sugar: 46 },
      { name: 'अंगूर (1 कप)', sugar: 23 },
      { name: 'मीठा दही (1 कप)', sugar: 17 },
      { name: 'ब्रेकफास्ट सीरियल (1 कप)', sugar: 12 },
      { name: 'एनर्जी ड्रिंक (250ml)', sugar: 27 },
      { name: 'स्पोर्ट्स ड्रिंक (500ml)', sugar: 35 },
      { name: 'फ्लेवर्ड मिल्क (200ml)', sugar: 18 },
    ],
  }

  const labels = {
    en: {
      diabetic: 'Diabetic / pre-diabetic',
      breakfast: 'Breakfast (grams)',
      lunch: 'Lunch (grams)',
      dinner: 'Dinner (grams)',
      snacks: 'Snacks (grams)',
      beverages: 'Beverages (grams)',
      calculate: 'Check Sugar Intake',
      consumed: 'Sugar consumed',
      limit: 'Daily limit (WHO)',
      good: 'Good — well within limit',
      moderate: 'Moderate — approaching limit',
      over: 'Over limit — reduce sugar intake',
      foodRefToggle: '📋 Food Reference Guide',
      foodRefTitle: 'Common Food Sugar Content',
      helpText: 'Enter sugar in grams for each meal. Use the reference guide below for common foods.',
    },
    te: {
      diabetic: 'డయాబెటిస్ / ప్రీ-డయాబెటిక్',
      breakfast: 'బ్రేక్‌ఫాస్ట్ (గ్రాములు)',
      lunch: 'మధ్యాహ్నం (గ్రాములు)',
      dinner: 'రాత్రి భోజనం (గ్రాములు)',
      snacks: 'స్నాక్స్ (గ్రాములు)',
      beverages: 'పానీయాలు (గ్రాములు)',
      calculate: 'షుగర్ ఇన్‌టేక్ చెక్ చేయండి',
      consumed: 'తినిన చక్కెర',
      limit: 'రోజువారీ పరిమితి (WHO)',
      good: 'మంచిది — పరిమితిలోనే ఉంది',
      moderate: 'మోస్తరు — పరిమితికి చేరుకుంటోంది',
      over: 'పరిమితి దాటింది — చక్కెర తగ్గించండి',
      foodRefToggle: '📋 ఆహార సూచన గైడ్',
      foodRefTitle: 'సాధారణ ఆహారాల్లో చక్కెర కంటెంట్',
      helpText: 'ప్రతి భోజనానికి చక్కెర గ్రాములలో నమోదు చేయండి. సాధారణ ఆహారాల కోసం క్రింది సూచన గైడ్ ఉపయోగించండి.',
    },
    hi: {
      diabetic: 'डायबिटीज / प्री-डायबिटिक',
      breakfast: 'नाश्ता (ग्राम)',
      lunch: 'दोपहर का भोजन (ग्राम)',
      dinner: 'रात का खाना (ग्राम)',
      snacks: 'स्नैक्स (ग्राम)',
      beverages: 'पेय पदार्थ (ग्राम)',
      calculate: 'शुगर इनटेक जांचें',
      consumed: 'चीनी खाई',
      limit: 'दैनिक सीमा (WHO)',
      good: 'अच्छा — सीमा के भीतर',
      moderate: 'मध्यम — सीमा के पास',
      over: 'सीमा से अधिक — चीनी कम करें',
      foodRefToggle: '📋 खाद्य संदर्भ गाइड',
      foodRefTitle: 'सामान्य खाद्य पदार्थों में चीनी',
      helpText: 'प्रत्येक भोजन के लिए चीनी ग्राम में दर्ज करें। सामान्य खाद्य पदार्थों के लिए नीचे दिए गए संदर्भ गाइड का उपयोग करें.',
    },
  }

  const foods = foodReference[language]
  const t = labels[language]
  const [result, setResult] = useState<{ limit: number; consumed: number; status: string; color: string } | null>(null)

  function calculate() {
    const b = parseFloat(breakfast) || 0
    const l = parseFloat(lunch) || 0
    const d = parseFloat(dinner) || 0
    const s = parseFloat(snacks) || 0
    const bev = parseFloat(beverages) || 0
    
    const consumed = b + l + d + s + bev
    const limit = isDiabetic ? 25 : 50
    const pct = (consumed / limit) * 100
    const status = pct <= 60 ? t.good : pct <= 100 ? t.moderate : t.over
    const color = pct <= 60 ? 'text-emerald-600' : pct <= 100 ? 'text-amber-600' : 'text-red-600'
    setResult({ limit, consumed, status, color })
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-900/20">
        <p className="text-xs text-blue-800 dark:text-blue-300">{t.helpText}</p>
      </div>
      
      <div className="flex items-center gap-2">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-slate-300">
          <input type="checkbox" checked={isDiabetic} onChange={e => setIsDiabetic(e.target.checked)} className="h-4 w-4 accent-[#1A5C38]" />
          {t.diabetic}
        </label>
      </div>

      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-slate-300">{t.breakfast}</label>
          <input type="number" value={breakfast} onChange={e => setBreakfast(e.target.value)} placeholder="0"
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-slate-300">{t.lunch}</label>
          <input type="number" value={lunch} onChange={e => setLunch(e.target.value)} placeholder="0"
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-slate-300">{t.dinner}</label>
          <input type="number" value={dinner} onChange={e => setDinner(e.target.value)} placeholder="0"
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-slate-300">{t.snacks}</label>
          <input type="number" value={snacks} onChange={e => setSnacks(e.target.value)} placeholder="0"
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-slate-300">{t.beverages}</label>
          <input type="number" value={beverages} onChange={e => setBeverages(e.target.value)} placeholder="0"
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500" />
        </div>
      </div>

      <button onClick={calculate} className="w-full rounded-xl bg-[#1A5C38] py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
        {t.calculate}
      </button>
      {result && (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="rounded-xl bg-white p-3 shadow-sm dark:bg-slate-900">
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-50">{result.consumed}g</p>
              <p className="text-[11px] text-gray-500 dark:text-slate-400">{t.consumed}</p>
            </div>
            <div className="rounded-xl bg-white p-3 shadow-sm dark:bg-slate-900">
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-50">{result.limit}g</p>
              <p className="text-[11px] text-gray-500 dark:text-slate-400">{t.limit}</p>
            </div>
          </div>
          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-slate-700">
            <div className={`h-full rounded-full transition-all ${result.consumed > result.limit ? 'bg-red-500' : result.consumed > result.limit * 0.6 ? 'bg-amber-500' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min((result.consumed / result.limit) * 100, 100)}%` }} />
          </div>
          <p className={`mt-2 text-center text-sm font-semibold ${result.color}`}>{result.status}</p>
          <UpgradeCTA result={`${result.consumed}g sugar consumed vs ${result.limit}g limit`} price={price} language={language} />
        </div>
      )}

      {/* Food Reference Guide */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/60">
        <button 
          onClick={() => setShowFoodRef(!showFoodRef)}
          className="flex w-full items-center justify-between text-left"
        >
          <span className="text-sm font-semibold text-gray-900 dark:text-slate-100">{t.foodRefToggle}</span>
          <span className="text-xs text-[#1A5C38] dark:text-emerald-400">{showFoodRef ? '▲ Hide' : '▼ Show'}</span>
        </button>
        
        {showFoodRef && (
          <div className="mt-3 max-h-64 overflow-y-auto">
            <p className="mb-2 text-xs font-medium text-gray-600 dark:text-slate-400">{t.foodRefTitle}</p>
            <div className="space-y-1">
              {foods.map((f, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900">
                  <span className="text-gray-800 dark:text-slate-200">{f.name}</span>
                  <span className="font-semibold text-amber-600">{f.sugar}g</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function WaterIntakeCalculator({ price, language }: { price: string; language: 'en' | 'te' | 'hi' }) {
  const [weight, setWeight] = useState('')
  const [activity, setActivity] = useState<'low' | 'moderate' | 'high'>('moderate')
  const [climate, setClimate] = useState<'cool' | 'hot'>('hot')
  const [result, setResult] = useState<{ liters: number; glasses: number; tip: string } | null>(null)

  const labels = {
    en: {
      weight: 'Weight (kg)',
      activityLevel: 'Activity Level',
      climate: 'Climate',
      calculate: 'Calculate Water Intake',
      perDay: 'Per day',
      glasses: 'Glasses (250ml)',
      low: 'Low',
      moderate: 'Moderate',
      high: 'High',
      cool: 'Cool / AC',
      hot: 'Hot / Humid',
      tipLow: 'Drink small sips throughout the day',
      tipMod: 'Keep a 1L bottle and refill twice',
      tipHigh: 'Spread intake — drink a glass every hour',
    },
    te: {
      weight: 'బరువు (కిలోలు)',
      activityLevel: 'చురుకుదనం స్థాయి',
      climate: 'వాతావరణం',
      calculate: 'నీటి అవసరం లెక్కించండి',
      perDay: 'రోజుకు',
      glasses: 'గ్లాసులు (250ml)',
      low: 'తక్కువ',
      moderate: 'మోస్తరు',
      high: 'అధికం',
      cool: 'చల్లగా / AC',
      hot: 'వేడిగా / తేమగా',
      tipLow: 'రోజంతా చిన్న సిప్స్ తాగండి',
      tipMod: '1L బాటిల్ ఉంచండి మరియు రెండుసార్లు నింపండి',
      tipHigh: 'ప్రతి గంటకు ఒక గ్లాసు తాగండి',
    },
    hi: {
      weight: 'वजन (किलो)',
      activityLevel: 'गतिविधि स्तर',
      climate: 'जलवायु',
      calculate: 'पानी की जरूरत गणना करें',
      perDay: 'प्रति दिन',
      glasses: 'गिलास (250ml)',
      low: 'कम',
      moderate: 'मध्यम',
      high: 'उच्च',
      cool: 'ठंडा / AC',
      hot: 'गर्म / नम',
      tipLow: 'पूरे दिन छोटे घूंट पिएं',
      tipMod: '1L की बोतल रखें और दो बार भरें',
      tipHigh: 'हर घंटे एक गिलास पिएं',
    },
  }

  const t = labels[language]

  function calculate() {
    const w = parseFloat(weight)
    if (!w) return
    let base = w * 0.033
    if (activity === 'moderate') base += 0.35
    if (activity === 'high') base += 0.7
    if (climate === 'hot') base += 0.5
    const liters = Math.round(base * 10) / 10
    const glasses = Math.round(liters / 0.25)
    const tip = liters < 2 ? t.tipLow : liters < 3 ? t.tipMod : t.tipHigh
    setResult({ liters, glasses, tip })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-slate-300">{t.weight}</label>
        <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 65"
          className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500" />
      </div>
      <div>
        <p className="mb-2 text-xs font-medium text-gray-700 dark:text-slate-300">{t.activityLevel}</p>
        <div className="grid grid-cols-3 gap-2">
          {(['low', 'moderate', 'high'] as const).map(a => (
            <button key={a} type="button" onClick={() => setActivity(a)}
              className={`rounded-xl border py-2 text-xs font-medium transition ${activity === a ? 'border-[#1A5C38] bg-emerald-50 text-[#1A5C38] dark:border-emerald-500 dark:bg-emerald-900/20 dark:text-emerald-400' : 'border-gray-200 bg-white text-gray-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
              {a === 'low' ? t.low : a === 'moderate' ? t.moderate : t.high}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-medium text-gray-700 dark:text-slate-300">{t.climate}</p>
        <div className="grid grid-cols-2 gap-2">
          {(['cool', 'hot'] as const).map(c => (
            <button key={c} type="button" onClick={() => setClimate(c)}
              className={`rounded-xl border py-2 text-xs font-medium transition ${climate === c ? 'border-[#1A5C38] bg-emerald-50 text-[#1A5C38] dark:border-emerald-500 dark:bg-emerald-900/20 dark:text-emerald-400' : 'border-gray-200 bg-white text-gray-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
              {c === 'hot' ? <span className="flex items-center justify-center gap-1"><Sun size={12} /> {t.hot}</span> : <span className="flex items-center justify-center gap-1"><Snowflake size={12} /> {t.cool}</span>}
            </button>
          ))}
        </div>
      </div>
      <button onClick={calculate} className="w-full rounded-xl bg-[#1A5C38] py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
        {t.calculate}
      </button>
      {result && (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="rounded-xl bg-[#1A5C38] p-3 shadow-sm">
              <p className="text-3xl font-bold text-white">{result.liters}L</p>
              <p className="text-[11px] text-emerald-100">{t.perDay}</p>
            </div>
            <div className="rounded-xl bg-white p-3 shadow-sm dark:bg-slate-900">
              <p className="text-3xl font-bold text-gray-900 dark:text-slate-50">{result.glasses}</p>
              <p className="text-[11px] text-gray-500 dark:text-slate-400">{t.glasses}</p>
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-gray-600 dark:text-slate-400"><Lightbulb size={12} className="inline mr-1 text-amber-500" />{result.tip}</p>
          <UpgradeCTA result={`${result.liters}L water/day needed`} price={price} language={language} />
        </div>
      )}
    </div>
  )
}

function WaistHipCalculator({ price, language }: { price: string; language: 'en' | 'te' | 'hi' }) {
  const [waist, setWaist] = useState('')
  const [hip, setHip] = useState('')
  const [gender, setGender] = useState<'male' | 'female'>('female')
  const [result, setResult] = useState<{ ratio: number; risk: string; color: string; detail: string } | null>(null)

  const labels = {
    en: {
      gender: 'Gender',
      female: 'Female',
      male: 'Male',
      waist: 'Waist (cm)',
      hip: 'Hip (cm)',
      waistHelp: 'Measure at navel level',
      hipHelp: 'Widest part of hips',
      calculate: 'Calculate Ratio',
      lowRisk: 'Low Risk',
      modRisk: 'Moderate Risk',
      highRisk: 'High Risk',
      lowDetail: 'Healthy fat distribution',
      modDetail: 'Some abdominal fat accumulation',
      highDetail: 'High abdominal obesity — consult a doctor',
    },
    te: {
      gender: 'లింగం',
      female: 'స్త్రీ',
      male: 'పురుషుడు',
      waist: 'నడుము (సెం.మీ)',
      hip: 'హిప్ (సెం.మీ)',
      waistHelp: 'నాభి స్థాయిలో కొలవండి',
      hipHelp: 'హిప్స్ యొక్క వెడల్పు భాగం',
      calculate: 'రేషియో లెక్కించండి',
      lowRisk: 'తక్కువ రిస్క్',
      modRisk: 'మోస్తరు రిస్క్',
      highRisk: 'అధిక రిస్క్',
      lowDetail: 'ఆరోగ్యకరమైన కొవ్వు పంపిణీ',
      modDetail: 'కొంత పొత్తికడుపు కొవ్వు చేరడం',
      highDetail: 'అధిక పొత్తికడుపు ఊబకాయం — వైద్యుడిని సంప్రదించండి',
    },
    hi: {
      gender: 'लिंग',
      female: 'महिला',
      male: 'पुरुष',
      waist: 'कमर (सें.मी)',
      hip: 'कूल्हा (सें.मी)',
      waistHelp: 'नाभि स्तर पर मापें',
      hipHelp: 'कूल्हों का सबसे चौड़ा भाग',
      calculate: 'अनुपात गणना करें',
      lowRisk: 'कम जोखिम',
      modRisk: 'मध्यम जोखिम',
      highRisk: 'उच्च जोखिम',
      lowDetail: 'स्वस्थ वसा वितरण',
      modDetail: 'कुछ पेट की चर्बी संचय',
      highDetail: 'उच्च पेट की मोटापा — डॉक्टर से परामर्श लें',
    },
  }

  const t = labels[language]

  function calculate() {
    const w = parseFloat(waist), h = parseFloat(hip)
    if (!w || !h || h === 0) return
    const ratio = Math.round((w / h) * 1000) / 1000
    let risk = '', color = '', detail = ''
    if (gender === 'female') {
      if (ratio < 0.8) { risk = t.lowRisk; color = 'text-emerald-600'; detail = t.lowDetail }
      else if (ratio < 0.85) { risk = t.modRisk; color = 'text-amber-600'; detail = t.modDetail }
      else { risk = t.highRisk; color = 'text-red-600'; detail = t.highDetail }
    } else {
      if (ratio < 0.9) { risk = t.lowRisk; color = 'text-emerald-600'; detail = t.lowDetail }
      else if (ratio < 1.0) { risk = t.modRisk; color = 'text-amber-600'; detail = t.modDetail }
      else { risk = t.highRisk; color = 'text-red-600'; detail = t.highDetail }
    }
    setResult({ ratio, risk, color, detail })
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-xs font-medium text-gray-700 dark:text-slate-300">{t.gender}</p>
        <div className="grid grid-cols-2 gap-2">
          {(['female', 'male'] as const).map(g => (
            <button key={g} type="button" onClick={() => setGender(g)}
              className={`rounded-xl border py-2 text-xs font-medium transition ${gender === g ? 'border-[#1A5C38] bg-emerald-50 text-[#1A5C38] dark:border-emerald-500 dark:bg-emerald-900/20 dark:text-emerald-400' : 'border-gray-200 bg-white text-gray-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
              {g === 'female' ? t.female : t.male}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-slate-300">{t.waist}</label>
          <input type="number" value={waist} onChange={e => setWaist(e.target.value)} placeholder="e.g. 80"
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500" />
          <p className="mt-1 text-[10px] text-gray-400">{t.waistHelp}</p>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-slate-300">{t.hip}</label>
          <input type="number" value={hip} onChange={e => setHip(e.target.value)} placeholder="e.g. 95"
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500" />
          <p className="mt-1 text-[10px] text-gray-400">{t.hipHelp}</p>
        </div>
      </div>
      <button onClick={calculate} className="w-full rounded-xl bg-[#1A5C38] py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
        {t.calculate}
      </button>
      {result && (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800/60">
          <p className="text-4xl font-bold text-gray-900 dark:text-slate-50">{result.ratio}</p>
          <p className={`mt-1 text-sm font-semibold ${result.color}`}>{result.risk}</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">{result.detail}</p>
          <UpgradeCTA result={`WHR ${result.ratio} — ${result.risk}`} price={price} language={language} />
        </div>
      )}
    </div>
  )
}

export default function HealthToolsClient() {
  const [activeTool, setActiveTool] = useState<Tool>('bmi')
  const { language } = useLanguage()
  const tools = toolsMeta[language]
  const [featuredPlanPrice, setFeaturedPlanPrice] = useState<string>('₹299')

  useEffect(() => {
    // Fetch featured plan price
    fetch('/api/plans?featured=true&limit=1')
      .then((r) => r.json())
      .then((data) => {
        if (data && data.length > 0) {
          setFeaturedPlanPrice(`${data[0].currency}${data[0].price}`)
        }
      })
      .catch(() => {})
  }, [])

  const panelTitles = {
    te: {
      bmi: { title: 'BMI కాలిక్యులేటర్', sub: 'బాడీ మాస్ ఇండెక్స్ — మీ ఎత్తుకు ఆరోగ్యకరమైన బరువు సూచిక.' },
      calorie: { title: 'కేలరీ కాలిక్యులేటర్', sub: 'Mifflin-St Jeor సమీకరణం ఉపయోగించి మీ రోజువారీ కేలరీ అవసరాలు లెక్కించండి.' },
      'ideal-weight': { title: 'ఆదర్శ బరువు కాలిక్యులేటర్', sub: 'BMI మరియు Robinson ఫార్ములా ఆధారంగా మీ ఆరోగ్యకరమైన బరువు పరిధి.' },
      sugar: { title: 'షుగర్ ఇన్‌టేక్ చెకర్', sub: 'WHO సిఫార్సు చేసిన రోజువారీ పరిమితితో పోల్చి మీరు ఈరోజు ఎంత చక్కెర తిన్నారో తనిఖీ చేయండి.' },
      water: { title: 'నీటి అవసరం కాలిక్యులేటర్', sub: 'బరువు, చురుకుదనం మరియు వాతావరణం ఆధారంగా మీ శరీరానికి రోజుకు ఎంత నీరు అవసరమో తెలుసుకోండి.' },
      'waist-hip': { title: 'వెయిస్ట్-హిప్ రేషియో', sub: 'పొట్ట ఊబకాయం రిస్క్ కొలవండి — గుండె జబ్బు మరియు మధుమేహానికి BMI కంటే మెరుగైన సూచిక.' },
    },
    hi: {
      bmi: { title: 'BMI कैलकुलेटर', sub: 'बॉडी मास इंडेक्स — आपकी ऊंचाई के लिए स्वस्थ वजन का संकेतक।' },
      calorie: { title: 'कैलोरी कैलकुलेटर', sub: 'Mifflin-St Jeor समीकरण से अपनी दैनिक कैलोरी जरूरत (TDEE) जानें।' },
      'ideal-weight': { title: 'आदर्श वजन कैलकुलेटर', sub: 'BMI और Robinson फॉर्मूला के आधार पर अपना स्वस्थ वजन सीमा जानें।' },
      sugar: { title: 'शुगर इनटेक चेकर', sub: 'WHO की अनुशंसित दैनिक सीमा से तुलना करें कि आज आपने कितनी चीनी खाई।' },
      water: { title: 'पानी की जरूरत कैलकुलेटर', sub: 'वजन, गतिविधि और जलवायु के आधार पर जानें कि आपके शरीर को रोज कितना पानी चाहिए।' },
      'waist-hip': { title: 'कमर-कूल्हा अनुपात', sub: 'पेट की मोटापा जोखिम मापें — हृदय रोग और मधुमेह के लिए BMI से बेहतर संकेतक।' },
    },
    en: {
      bmi: { title: 'BMI Calculator', sub: 'Body Mass Index — a quick indicator of healthy weight for your height.' },
      calorie: { title: 'Calorie Calculator', sub: 'Calculate your Total Daily Energy Expenditure (TDEE) using the Mifflin-St Jeor equation.' },
      'ideal-weight': { title: 'Ideal Weight Calculator', sub: 'Find your healthy weight range based on height using BMI and Robinson formula.' },
      sugar: { title: 'Sugar Intake Checker', sub: 'Check how much sugar you consumed today vs the WHO recommended daily limit.' },
      water: { title: 'Water Intake Calculator', sub: 'Find out how much water your body needs daily based on weight, activity, and climate.' },
      'waist-hip': { title: 'Waist-Hip Ratio', sub: 'Measure abdominal obesity risk — a better indicator than BMI for heart disease and diabetes.' },
    },
  }

  const panel = panelTitles[language][activeTool]
  const heroTitle = language === 'te' ? 'హెల్త్ టూల్స్' : language === 'hi' ? 'हेल्थ टूल्स' : 'Health Tools'
  const heroSub = language === 'te' ? 'మీ శరీరాన్ని అర్థం చేసుకోవడానికి ఉచిత కాలిక్యులేటర్లు.' : language === 'hi' ? 'अपने शरीर को समझने के लिए मुफ्त कैलकुलेटर।' : 'Free calculators to understand your body and guide your nutrition journey.'
  const disclaimer = language === 'te'
    ? '⚠ ఈ టూల్స్ సమాచార ప్రయోజనాల కోసం మాత్రమే మరియు వృత్తిపరమైన వైద్య సలహాను భర్తీ చేయవు.'
    : language === 'hi'
    ? '⚠ ये टूल्स केवल सूचनात्मक उद्देश्यों के लिए हैं और पेशेवर चिकित्सा सलाह का विकल्प नहीं हैं।'
    : '⚠ These tools are for informational purposes only and do not replace professional medical advice. Consult a qualified nutritionist or doctor before making dietary changes.'

  return (
    <div className="bg-white dark:bg-slate-950">
      {/* Hero */}
      <section className="bg-[#F0FAF4] dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h1 className="font-nunito text-3xl font-bold text-[#1A5C38] dark:text-emerald-400">{heroTitle}</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">{heroSub}</p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-6 md:flex-row">

          {/* Tool selector sidebar */}
          <div className="flex gap-2 overflow-x-auto pb-1 md:w-56 md:flex-col md:overflow-visible md:pb-0">
            {tools.map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTool(t.id)}
                className={`flex shrink-0 items-center gap-3 rounded-2xl border px-4 py-3 text-left transition md:w-full ${
                  activeTool === t.id
                    ? 'border-[#1A5C38] bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-900/20'
                    : 'border-gray-200 bg-white hover:border-emerald-200 dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-emerald-700'
                }`}
              >
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${activeTool === t.id ? 'bg-emerald-100 text-[#1A5C38] dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-slate-400'}`}>{t.icon}</span>
                <div>
                  <p className={`text-[13px] font-semibold ${activeTool === t.id ? 'text-[#1A5C38] dark:text-emerald-400' : 'text-gray-800 dark:text-slate-200'}`}>{t.label}</p>
                  <p className="hidden text-[11px] text-gray-500 dark:text-slate-400 md:block">{t.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Calculator panel */}
          <div className="flex-1 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800/60">
            <h2 className="mb-1 font-nunito text-xl font-bold text-gray-900 dark:text-slate-50">{panel.title}</h2>
            <p className="mb-5 text-xs text-gray-500 dark:text-slate-400">{panel.sub}</p>
            {activeTool === 'bmi' && <BMICalculator price={featuredPlanPrice} language={language} />}
            {activeTool === 'calorie' && <CalorieCalculator price={featuredPlanPrice} language={language} />}
            {activeTool === 'ideal-weight' && <IdealWeightCalculator price={featuredPlanPrice} language={language} />}
            {activeTool === 'sugar' && <SugarIntakeChecker price={featuredPlanPrice} language={language} />}
            {activeTool === 'water' && <WaterIntakeCalculator price={featuredPlanPrice} language={language} />}
            {activeTool === 'waist-hip' && <WaistHipCalculator price={featuredPlanPrice} language={language} />}
          </div>
        </div>

        {/* Info strip */}
        <div className="mt-8 rounded-2xl border border-gray-100 bg-gray-50 p-4 text-xs text-gray-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          {disclaimer}
        </div>

        {/* Inline promotion below tools */}
        <div className="mt-6">
          <PromotionBlock placement="blog-inline" language={language} />
        </div>
      </div>
    </div>
  )
}

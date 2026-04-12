'use client'

import React, { useState } from 'react'
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

function UpgradeCTA({ result }: { result: string }) {
  return (
    <div className="mt-6 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-5 dark:border-amber-700 dark:from-amber-900/20 dark:to-orange-900/20">
      <div className="flex items-start gap-3">
        <Star size={22} className="shrink-0 text-amber-500 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-bold text-amber-900 dark:text-amber-200">Want a personalized diet plan?</p>
          <p className="mt-1 text-xs text-amber-800 dark:text-amber-300">
            Based on your result ({result}), our nutritionists have curated a Telugu meal plan tailored for you.
            Get structured 4-week plans, grocery lists, and blood-sugar friendly recipes.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href="/diet-plans#premium"
              className="inline-flex items-center rounded-full bg-[#D97706] px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:opacity-90"
            >
              Upgrade to Premium Plan ₹299 →
            </Link>
            <Link
              href="/diet-plans#free"
              className="inline-flex items-center rounded-full border border-amber-400 px-4 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100 dark:text-amber-300 dark:hover:bg-amber-900/30"
            >
              Try Free Plan First
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function BMICalculator() {
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [result, setResult] = useState<{ bmi: number; category: string; color: string } | null>(null)

  function calculate() {
    const h = parseFloat(height) / 100
    const w = parseFloat(weight)
    if (!h || !w || h <= 0 || w <= 0) return
    const bmi = w / (h * h)
    let category = '', color = ''
    if (bmi < 18.5) { category = 'Underweight'; color = 'text-blue-600' }
    else if (bmi < 25) { category = 'Normal weight'; color = 'text-emerald-600' }
    else if (bmi < 30) { category = 'Overweight'; color = 'text-amber-600' }
    else { category = 'Obese'; color = 'text-red-600' }
    setResult({ bmi: Math.round(bmi * 10) / 10, category, color })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-slate-300">Height (cm)</label>
          <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="e.g. 165"
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-slate-300">Weight (kg)</label>
          <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 65"
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500" />
        </div>
      </div>
      <button onClick={calculate} className="w-full rounded-xl bg-[#1A5C38] py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
        Calculate BMI
      </button>
      {result && (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800/60">
          <p className="text-4xl font-bold text-gray-900 dark:text-slate-50">{result.bmi}</p>
          <p className={`mt-1 text-sm font-semibold ${result.color}`}>{result.category}</p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-slate-700">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-400 via-emerald-400 via-amber-400 to-red-500" style={{ width: `${Math.min((result.bmi / 40) * 100, 100)}%` }} />
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-gray-400">
            <span>Underweight</span><span>Normal</span><span>Overweight</span><span>Obese</span>
          </div>
          <UpgradeCTA result={`BMI ${result.bmi} — ${result.category}`} />
        </div>
      )}
    </div>
  )
}

function CalorieCalculator() {
  const [age, setAge] = useState('')
  const [gender, setGender] = useState<'male' | 'female'>('female')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [activity, setActivity] = useState('1.375')
  const [result, setResult] = useState<{ bmr: number; tdee: number; goal: string } | null>(null)

  const activityLevels = [
    { value: '1.2', label: 'Sedentary (desk job, no exercise)' },
    { value: '1.375', label: 'Lightly active (1–3 days/week)' },
    { value: '1.55', label: 'Moderately active (3–5 days/week)' },
    { value: '1.725', label: 'Very active (6–7 days/week)' },
    { value: '1.9', label: 'Extra active (physical job + gym)' },
  ]

  function calculate() {
    const a = parseFloat(age), h = parseFloat(height), w = parseFloat(weight), act = parseFloat(activity)
    if (!a || !h || !w) return
    const bmr = gender === 'male'
      ? 10 * w + 6.25 * h - 5 * a + 5
      : 10 * w + 6.25 * h - 5 * a - 161
    const tdee = Math.round(bmr * act)
    const goal = tdee < 1600 ? 'Low calorie needs — focus on nutrient-dense foods'
      : tdee < 2200 ? 'Moderate calorie needs — balanced diet recommended'
      : 'High calorie needs — ensure adequate protein & complex carbs'
    setResult({ bmr: Math.round(bmr), tdee, goal })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-slate-300">Age (years)</label>
          <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="e.g. 30"
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-slate-300">Gender</label>
          <select value={gender} onChange={e => setGender(e.target.value as 'male' | 'female')}
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-slate-300">Height (cm)</label>
          <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="e.g. 160"
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-slate-300">Weight (kg)</label>
          <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 60"
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500" />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-slate-300">Activity Level</label>
        <select value={activity} onChange={e => setActivity(e.target.value)}
          className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
          {activityLevels.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
        </select>
      </div>
      <button onClick={calculate} className="w-full rounded-xl bg-[#1A5C38] py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
        Calculate Calories
      </button>
      {result && (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="rounded-xl bg-white p-3 shadow-sm dark:bg-slate-900">
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-50">{result.bmr}</p>
              <p className="text-[11px] text-gray-500 dark:text-slate-400">BMR (base calories)</p>
            </div>
            <div className="rounded-xl bg-[#1A5C38] p-3 shadow-sm">
              <p className="text-2xl font-bold text-white">{result.tdee}</p>
              <p className="text-[11px] text-emerald-100">Daily calories (TDEE)</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-600 dark:text-slate-400">{result.goal}</p>
          <UpgradeCTA result={`${result.tdee} kcal/day TDEE`} />
        </div>
      )}
    </div>
  )
}

function IdealWeightCalculator() {
  const [height, setHeight] = useState('')
  const [gender, setGender] = useState<'male' | 'female'>('female')
  const [result, setResult] = useState<{ min: number; max: number; robinson: number } | null>(null)

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
          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-slate-300">Height (cm)</label>
          <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="e.g. 162"
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-slate-300">Gender</label>
          <select value={gender} onChange={e => setGender(e.target.value as 'male' | 'female')}
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </div>
      </div>
      <button onClick={calculate} className="w-full rounded-xl bg-[#1A5C38] py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
        Calculate Ideal Weight
      </button>
      {result && (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="rounded-xl bg-white p-3 shadow-sm dark:bg-slate-900">
              <p className="text-xl font-bold text-gray-900 dark:text-slate-50">{result.min}–{result.max} kg</p>
              <p className="text-[11px] text-gray-500 dark:text-slate-400">Healthy BMI range</p>
            </div>
            <div className="rounded-xl bg-[#1A5C38] p-3 shadow-sm">
              <p className="text-xl font-bold text-white">{result.robinson} kg</p>
              <p className="text-[11px] text-emerald-100">Robinson formula</p>
            </div>
          </div>
          <UpgradeCTA result={`Ideal weight ${result.min}–${result.max} kg`} />
        </div>
      )}
    </div>
  )
}

function SugarIntakeChecker() {
  const [weight, setWeight] = useState('')
  const [isDiabetic, setIsDiabetic] = useState(false)
  const [foods, setFoods] = useState([
    { name: 'Tea with 2 tsp sugar', sugar: 8 },
    { name: 'Biscuits (2 pcs)', sugar: 6 },
    { name: 'Fruit juice (200ml)', sugar: 20 },
    { name: 'Rice (1 cup)', sugar: 0 },
    { name: 'Banana', sugar: 14 },
    { name: 'Soft drink (300ml)', sugar: 32 },
  ])
  const [checked, setChecked] = useState<number[]>([])
  const [result, setResult] = useState<{ limit: number; consumed: number; status: string; color: string } | null>(null)

  function calculate() {
    const w = parseFloat(weight)
    if (!w) return
    const limit = isDiabetic ? 25 : 50
    const consumed = checked.reduce((sum, i) => sum + foods[i].sugar, 0)
    const pct = (consumed / limit) * 100
    const status = pct <= 60 ? 'Good — well within limit' : pct <= 100 ? 'Moderate — approaching limit' : 'Over limit — reduce sugar intake'
    const color = pct <= 60 ? 'text-emerald-600' : pct <= 100 ? 'text-amber-600' : 'text-red-600'
    setResult({ limit, consumed, status, color })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-slate-300">Weight (kg)</label>
          <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 65"
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500" />
        </div>
        <div className="flex items-end pb-1">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-slate-300">
            <input type="checkbox" checked={isDiabetic} onChange={e => setIsDiabetic(e.target.checked)} className="h-4 w-4 accent-[#1A5C38]" />
            Diabetic / pre-diabetic
          </label>
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-medium text-gray-700 dark:text-slate-300">What did you eat today? (tick all that apply)</p>
        <div className="grid grid-cols-2 gap-2">
          {foods.map((f, i) => (
            <label key={i} className={`flex cursor-pointer items-center gap-2 rounded-xl border p-2.5 text-xs transition ${checked.includes(i) ? 'border-[#1A5C38] bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-900/20' : 'border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800'}`}>
              <input type="checkbox" checked={checked.includes(i)} onChange={() => setChecked(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i])} className="h-3.5 w-3.5 accent-[#1A5C38]" />
              <span className="flex-1 text-gray-800 dark:text-slate-200">{f.name}</span>
              <span className="font-semibold text-amber-600">{f.sugar}g</span>
            </label>
          ))}
        </div>
      </div>
      <button onClick={calculate} className="w-full rounded-xl bg-[#1A5C38] py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
        Check Sugar Intake
      </button>
      {result && (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="rounded-xl bg-white p-3 shadow-sm dark:bg-slate-900">
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-50">{result.consumed}g</p>
              <p className="text-[11px] text-gray-500 dark:text-slate-400">Sugar consumed</p>
            </div>
            <div className="rounded-xl bg-white p-3 shadow-sm dark:bg-slate-900">
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-50">{result.limit}g</p>
              <p className="text-[11px] text-gray-500 dark:text-slate-400">Daily limit (WHO)</p>
            </div>
          </div>
          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-slate-700">
            <div className={`h-full rounded-full transition-all ${result.consumed > result.limit ? 'bg-red-500' : result.consumed > result.limit * 0.6 ? 'bg-amber-500' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min((result.consumed / result.limit) * 100, 100)}%` }} />
          </div>
          <p className={`mt-2 text-center text-sm font-semibold ${result.color}`}>{result.status}</p>
          <UpgradeCTA result={`${result.consumed}g sugar consumed vs ${result.limit}g limit`} />
        </div>
      )}
    </div>
  )
}

function WaterIntakeCalculator() {
  const [weight, setWeight] = useState('')
  const [activity, setActivity] = useState<'low' | 'moderate' | 'high'>('moderate')
  const [climate, setClimate] = useState<'cool' | 'hot'>('hot')
  const [result, setResult] = useState<{ liters: number; glasses: number; tip: string } | null>(null)

  function calculate() {
    const w = parseFloat(weight)
    if (!w) return
    let base = w * 0.033
    if (activity === 'moderate') base += 0.35
    if (activity === 'high') base += 0.7
    if (climate === 'hot') base += 0.5
    const liters = Math.round(base * 10) / 10
    const glasses = Math.round(liters / 0.25)
    const tip = liters < 2 ? 'Drink small sips throughout the day' : liters < 3 ? 'Keep a 1L bottle and refill twice' : 'Spread intake — drink a glass every hour'
    setResult({ liters, glasses, tip })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-slate-300">Weight (kg)</label>
        <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 65"
          className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500" />
      </div>
      <div>
        <p className="mb-2 text-xs font-medium text-gray-700 dark:text-slate-300">Activity Level</p>
        <div className="grid grid-cols-3 gap-2">
          {(['low', 'moderate', 'high'] as const).map(a => (
            <button key={a} type="button" onClick={() => setActivity(a)}
              className={`rounded-xl border py-2 text-xs font-medium capitalize transition ${activity === a ? 'border-[#1A5C38] bg-emerald-50 text-[#1A5C38] dark:border-emerald-500 dark:bg-emerald-900/20 dark:text-emerald-400' : 'border-gray-200 bg-white text-gray-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
              {a}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-medium text-gray-700 dark:text-slate-300">Climate</p>
        <div className="grid grid-cols-2 gap-2">
          {(['cool', 'hot'] as const).map(c => (
            <button key={c} type="button" onClick={() => setClimate(c)}
              className={`rounded-xl border py-2 text-xs font-medium capitalize transition ${climate === c ? 'border-[#1A5C38] bg-emerald-50 text-[#1A5C38] dark:border-emerald-500 dark:bg-emerald-900/20 dark:text-emerald-400' : 'border-gray-200 bg-white text-gray-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
              {c === 'hot' ? <span className="flex items-center justify-center gap-1"><Sun size={12} /> Hot / Humid</span> : <span className="flex items-center justify-center gap-1"><Snowflake size={12} /> Cool / AC</span>}
            </button>
          ))}
        </div>
      </div>
      <button onClick={calculate} className="w-full rounded-xl bg-[#1A5C38] py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
        Calculate Water Intake
      </button>
      {result && (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="rounded-xl bg-[#1A5C38] p-3 shadow-sm">
              <p className="text-3xl font-bold text-white">{result.liters}L</p>
              <p className="text-[11px] text-emerald-100">Per day</p>
            </div>
            <div className="rounded-xl bg-white p-3 shadow-sm dark:bg-slate-900">
              <p className="text-3xl font-bold text-gray-900 dark:text-slate-50">{result.glasses}</p>
              <p className="text-[11px] text-gray-500 dark:text-slate-400">Glasses (250ml)</p>
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-gray-600 dark:text-slate-400"><Lightbulb size={12} className="inline mr-1 text-amber-500" />{result.tip}</p>
          <UpgradeCTA result={`${result.liters}L water/day needed`} />
        </div>
      )}
    </div>
  )
}

function WaistHipCalculator() {
  const [waist, setWaist] = useState('')
  const [hip, setHip] = useState('')
  const [gender, setGender] = useState<'male' | 'female'>('female')
  const [result, setResult] = useState<{ ratio: number; risk: string; color: string; detail: string } | null>(null)

  function calculate() {
    const w = parseFloat(waist), h = parseFloat(hip)
    if (!w || !h || h === 0) return
    const ratio = Math.round((w / h) * 1000) / 1000
    let risk = '', color = '', detail = ''
    if (gender === 'female') {
      if (ratio < 0.8) { risk = 'Low Risk'; color = 'text-emerald-600'; detail = 'Healthy fat distribution' }
      else if (ratio < 0.85) { risk = 'Moderate Risk'; color = 'text-amber-600'; detail = 'Some abdominal fat accumulation' }
      else { risk = 'High Risk'; color = 'text-red-600'; detail = 'High abdominal obesity — consult a doctor' }
    } else {
      if (ratio < 0.9) { risk = 'Low Risk'; color = 'text-emerald-600'; detail = 'Healthy fat distribution' }
      else if (ratio < 1.0) { risk = 'Moderate Risk'; color = 'text-amber-600'; detail = 'Some abdominal fat accumulation' }
      else { risk = 'High Risk'; color = 'text-red-600'; detail = 'High abdominal obesity — consult a doctor' }
    }
    setResult({ ratio, risk, color, detail })
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-xs font-medium text-gray-700 dark:text-slate-300">Gender</p>
        <div className="grid grid-cols-2 gap-2">
          {(['female', 'male'] as const).map(g => (
            <button key={g} type="button" onClick={() => setGender(g)}
              className={`rounded-xl border py-2 text-xs font-medium capitalize transition ${gender === g ? 'border-[#1A5C38] bg-emerald-50 text-[#1A5C38] dark:border-emerald-500 dark:bg-emerald-900/20 dark:text-emerald-400' : 'border-gray-200 bg-white text-gray-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
              {g}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-slate-300">Waist (cm)</label>
          <input type="number" value={waist} onChange={e => setWaist(e.target.value)} placeholder="e.g. 80"
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500" />
          <p className="mt-1 text-[10px] text-gray-400">Measure at navel level</p>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-slate-300">Hip (cm)</label>
          <input type="number" value={hip} onChange={e => setHip(e.target.value)} placeholder="e.g. 95"
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500" />
          <p className="mt-1 text-[10px] text-gray-400">Widest part of hips</p>
        </div>
      </div>
      <button onClick={calculate} className="w-full rounded-xl bg-[#1A5C38] py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
        Calculate Ratio
      </button>
      {result && (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800/60">
          <p className="text-4xl font-bold text-gray-900 dark:text-slate-50">{result.ratio}</p>
          <p className={`mt-1 text-sm font-semibold ${result.color}`}>{result.risk}</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">{result.detail}</p>
          <UpgradeCTA result={`WHR ${result.ratio} — ${result.risk}`} />
        </div>
      )}
    </div>
  )
}

export default function HealthToolsClient() {
  const [activeTool, setActiveTool] = useState<Tool>('bmi')
  const { language } = useLanguage()
  const tools = toolsMeta[language]

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
      <section className="mt-16 bg-[#F0FAF4] dark:bg-slate-900">
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
            {activeTool === 'bmi' && <BMICalculator />}
            {activeTool === 'calorie' && <CalorieCalculator />}
            {activeTool === 'ideal-weight' && <IdealWeightCalculator />}
            {activeTool === 'sugar' && <SugarIntakeChecker />}
            {activeTool === 'water' && <WaterIntakeCalculator />}
            {activeTool === 'waist-hip' && <WaistHipCalculator />}
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

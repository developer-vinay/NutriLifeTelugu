'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import LikeSaveButtons from '@/components/ui/LikeSaveButtons'
import { useLanguage } from '@/components/LanguageProvider'
import { UtensilsCrossed, Eye } from 'lucide-react'

type DBRecipe = {
  _id: string
  title: string
  slug: string
  description?: string
  content: string
  category?: string
  tag?: string
  language?: string
  heroImage?: string
  prepTimeMinutes?: number
  cookTimeMinutes?: number
  servings?: number
  ingredients: string[]
  nutritionFacts?: Record<string, number>
  likes?: number
  views: number
  isPublished: boolean
}

type Props = { recipe: DBRecipe; related: DBRecipe[] }

const UI = {
  te: {
    back: '← అన్ని రెసిపీలు',
    prep: 'తయారీ సమయం',
    cook: 'వండే సమయం',
    servings: 'వడ్డింపులు',
    ingredients: 'కావాల్సిన పదార్థాలు',
    nutrition: 'పోషక విలువలు',
    method: 'తయారీ విధానం',
    more: 'మరిన్ని రెసిపీలు',
  },
  en: {
    back: '← All Recipes',
    prep: 'Prep',
    cook: 'Cook',
    servings: 'Servings',
    ingredients: 'Ingredients',
    nutrition: 'Nutrition Facts',
    method: 'Method',
    more: 'More Recipes',
  },
}

export default function RecipeDetailClient({ recipe, related }: Props) {
  const { setLanguage } = useLanguage()

  // Sync language to match the recipe being read
  useEffect(() => {
    if (recipe.language === 'te' || recipe.language === 'en') {
      setLanguage(recipe.language)
    }
  }, [recipe.language, setLanguage])

  const lang = (recipe.language === 'te' ? 'te' : 'en') as 'te' | 'en'
  const t = UI[lang]
  const nf = recipe.nutritionFacts ?? {}

  return (
    <div className="bg-white dark:bg-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <Link href="/recipes" className="text-sm text-[#1A5C38] hover:underline dark:text-emerald-400">
          {t.back}
        </Link>

        <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
          {recipe.heroImage ? (
            <img src={recipe.heroImage} alt={recipe.title} className="h-56 w-full object-cover md:h-80" />
          ) : (
            <div className="flex h-56 items-center justify-center bg-emerald-50 dark:bg-slate-700 md:h-80"><UtensilsCrossed size={48} className="text-emerald-300" /></div>
          )}
          <div className="space-y-4 p-6">
            {recipe.tag && (
              <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-[#1A5C38] dark:bg-emerald-900/30 dark:text-emerald-400">
                {recipe.tag}
              </span>
            )}
            <h1 className="font-nunito text-3xl font-bold text-gray-900 dark:text-slate-50">{recipe.title}</h1>
            {recipe.description && <p className="text-sm text-gray-600 dark:text-slate-400">{recipe.description}</p>}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-slate-400">
              {recipe.prepTimeMinutes && <span>{t.prep}: {recipe.prepTimeMinutes} min</span>}
              {recipe.cookTimeMinutes && <span>{t.cook}: {recipe.cookTimeMinutes} min</span>}
              {recipe.servings && <span>{t.servings}: {recipe.servings}</span>}
              {recipe.views > 0 && <span className="flex items-center gap-1"><Eye size={13} /> {recipe.views.toLocaleString('en-IN')} views</span>}
            </div>
            {/* Like / Save */}
            <LikeSaveButtons
              contentId={recipe._id}
              contentType="recipe"
              initialLikes={recipe.likes ?? 0}
            />
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {recipe.ingredients.length > 0 && (
            <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
              <h2 className="mb-3 font-nunito text-xl font-semibold text-gray-900 dark:text-slate-50">{t.ingredients}</h2>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-slate-300">
                {recipe.ingredients.map((ing) => (
                  <li key={ing} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1A5C38]" />
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {Object.keys(nf).length > 0 && (
            <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
              <h2 className="mb-3 font-nunito text-xl font-semibold text-gray-900 dark:text-slate-50">{t.nutrition}</h2>
              <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-slate-700">
                <table className="min-w-full text-sm">
                  <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                    {Object.entries(nf).map(([k, v]) => (
                      <tr key={k} className="dark:bg-slate-800">
                        <td className="px-3 py-2 font-medium capitalize text-gray-700 dark:text-slate-300">{k}</td>
                        <td className="px-3 py-2 text-right text-gray-600 dark:text-slate-400">{String(v)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>

        {recipe.content && (
          <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
            <h2 className="mb-3 font-nunito text-xl font-semibold text-gray-900 dark:text-slate-50">{t.method}</h2>
            <div
              className="prose max-w-none text-sm text-gray-700 dark:prose-invert dark:text-slate-300"
              dangerouslySetInnerHTML={{ __html: recipe.content }}
            />
          </section>
        )}

        {related.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-3 font-nunito text-lg font-semibold text-gray-900 dark:text-slate-50">{t.more}</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/recipes/${r.slug}`}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-transform duration-200 hover:scale-[1.02] hover:border-emerald-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-emerald-600"
                >
                  {r.heroImage
                    ? <img src={r.heroImage} alt={r.title} className="h-36 w-full object-cover" />
                    : <div className="flex h-36 items-center justify-center bg-emerald-50 dark:bg-slate-700"><UtensilsCrossed size={28} className="text-emerald-300" /></div>
                  }
                  <div className="p-4">
                    {r.tag && <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-[#1A5C38] dark:bg-emerald-900/30 dark:text-emerald-400">{r.tag}</span>}
                    <p className="mt-2 line-clamp-2 font-nunito text-sm font-semibold text-gray-900 group-hover:text-[#1A5C38] dark:text-slate-100 dark:group-hover:text-emerald-400">{r.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

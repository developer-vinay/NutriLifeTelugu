import Link from 'next/link'
import { notFound } from 'next/navigation'
import { connectDB } from '@/lib/mongodb'
import { Post } from '@/models/Post'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const categories = ['weight-loss', 'diabetes', 'gut-health', 'thyroid', 'immunity', 'kids-nutrition'] as const

const categoryMeta: Record<string, { title: string; description: string }> = {
  'weight-loss': { title: 'బరువు తగ్గడం', description: 'తెలుగు ఇంట్లో పాటించగల సింపుల్ వెయిట్ లాస్ టిప్స్.' },
  diabetes: { title: 'మధుమేహం', description: 'షుగర్ కంట్రోల్ కోసం ఆహార సూచనలు & రిసిపీ ఐడియాస్.' },
  'gut-health': { title: 'గట్ హెల్త్', description: 'జీర్ణశక్తి మెరుగుపడేందుకు సైన్స్-బేస్డ్ హ్యాబిట్స్.' },
  thyroid: { title: 'థైరాయిడ్', description: 'థైరాయిడ్ & హార్మోన్లకు అనుకూలమైన ఫుడ్ గైడ్.' },
  immunity: { title: 'రోగనిరోధక శక్తి', description: 'ఇమ్యూనిటీ పెంచే దైనందిన ఆహార అలవాట్లు.' },
  'kids-nutrition': { title: 'పిల్లల పోషణ', description: 'పిల్లల ఎదుగుదలకు బ్యాలెన్స్ డైట్ & టిఫిన్ ఐడియాస్.' },
}

export function generateStaticParams() {
  return categories.map((category) => ({ category }))
}

export default async function HealthTipsCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params

  if (!categories.includes(category as any)) notFound()

  const meta = categoryMeta[category]

  await connectDB()
  const posts = await Post.find({ isPublished: true, category }).sort({ createdAt: -1 }).limit(12).lean()

  return (
    <div className="bg-white dark:bg-slate-900">
      <section className="mt-16 bg-[#F0FAF4] dark:bg-slate-800">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h1 className="font-nunito text-3xl font-bold text-[#1A5C38] dark:text-emerald-400">{meta.title}</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">{meta.description}</p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10">
        {posts.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-500">వ్యాసాలు త్వరలో వస్తాయి.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <Link
                key={p._id.toString()}
                href={`/blog/${p.slug}`}
                className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition-transform duration-200 hover:scale-[1.02] hover:border-emerald-200 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-emerald-600"
              >
                {p.heroImage ? (
                  <img src={p.heroImage} alt={p.title} className="h-32 w-full object-cover" />
                ) : (
                  <div className="flex h-32 items-center justify-center bg-emerald-50 text-3xl">🥗</div>
                )}
                <div className="p-4">
                  {p.tag && (
                    <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-[#1A5C38]">{p.tag}</span>
                  )}
                  <p className="mt-2 line-clamp-2 font-nunito text-base font-semibold text-gray-900 group-hover:text-[#1A5C38]">{p.title}</p>
                  {p.excerpt && <p className="mt-2 line-clamp-2 text-sm text-gray-600">{p.excerpt}</p>}
                  <p className="mt-2 text-xs text-gray-500">{p.readTimeMinutes ?? 5} min read</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

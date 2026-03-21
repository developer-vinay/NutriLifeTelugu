import { connectDB } from '@/lib/mongodb'
import { PremiumPlan } from '@/models/PremiumPlan'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const freePlans = [
  { title: '7-రోజుల వెయిట్ లాస్ ప్లాన్', desc: 'ఉచిత PDF — ప్రారంభించండి.' },
  { title: 'డయాబెటిస్ ఫ్రెండ్లీ ప్లాన్', desc: 'షుగర్ కంట్రోల్ ఫోకస్.' },
  { title: 'మిల్లెట్స్ మీల్ చార్ట్', desc: 'తెలుగు మిల్లెట్స్ రిసిపీలు.' },
  { title: 'గట్ హెల్త్ ప్లాన్', desc: 'జీర్ణశక్తి మెరుగుపడే మెనూ.' },
  { title: 'థైరాయిడ్ సపోర్ట్ ప్లాన్', desc: 'సింపుల్ రోజువారీ సూచనలు.' },
  { title: 'పిల్లల పోషణ ప్లాన్', desc: 'టిఫిన్ & డిన్నర్ ఐడియాస్.' },
]

export default async function DietPlansPage() {
  await connectDB()
  const plans = await PremiumPlan.find({ isActive: true }).sort({ createdAt: -1 }).lean() as any[]

  return (
    <div className="bg-white dark:bg-slate-950">
      <section className="mt-16 bg-[#F0FAF4] dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h1 className="font-nunito text-3xl font-bold text-[#1A5C38] dark:text-emerald-400">డైట్ ప్లాన్స్</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">ఉచిత & ప్రీమియం మీల్ ప్లాన్స్ — తెలుగు కుటుంబాల కోసం.</p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-10 px-4 py-10">
        {/* Free Plans */}
        <section id="free">
          <h2 className="mb-4 font-nunito text-2xl font-bold text-gray-900 dark:text-slate-50">ఉచిత ప్లాన్స్</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {freePlans.map((p) => (
              <div key={p.title} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
                <p className="font-nunito text-lg font-semibold text-gray-900 dark:text-slate-50">{p.title}</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">{p.desc}</p>
                <div className="mt-4 space-y-2">
                  <input type="email" placeholder="మీ ఇమెయిల్"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500" />
                  <button type="button" className="w-full rounded-lg bg-[#1A5C38] px-3 py-2 text-sm font-semibold text-white hover:opacity-90">
                    Download (mock)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Premium Plans — from DB */}
        <section id="premium">
          <h2 className="mb-4 font-nunito text-2xl font-bold text-gray-900 dark:text-slate-50">ప్రీమియం ప్లాన్స్</h2>
          {plans.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-slate-400">Premium plans coming soon.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {plans.map((p) => (
                <div key={p._id.toString()} className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-700 dark:bg-amber-900/20">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-nunito text-xl font-bold text-amber-900 dark:text-amber-200">{p.title}</p>
                      {p.description && <p className="mt-1 text-sm text-amber-800 dark:text-amber-300">{p.description}</p>}
                      <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">{p.durationWeeks}-week plan</p>
                    </div>
                    <div className="text-2xl font-bold text-[#D97706] dark:text-amber-400">{p.currency}{p.price}</div>
                  </div>
                  {p.features?.length > 0 && (
                    <ul className="mt-3 space-y-1">
                      {p.features.map((f: string, i: number) => (
                        <li key={i} className="flex items-center gap-1.5 text-xs text-amber-800 dark:text-amber-300">
                          <span className="text-emerald-600">✓</span>{f}
                        </li>
                      ))}
                    </ul>
                  )}
                  <button type="button" className="mt-4 w-full rounded-lg bg-[#D97706] px-3 py-2 text-sm font-semibold text-white hover:opacity-90">
                    Buy Now — {p.currency}{p.price} (Coming Soon)
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CTA to health tools */}
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-800/50 dark:bg-emerald-900/20">
          <p className="font-nunito text-lg font-bold text-emerald-900 dark:text-emerald-100">Not sure which plan suits you?</p>
          <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-300">Use our free health tools to check your BMI and calorie needs first.</p>
          <Link href="/health-tools" className="mt-4 inline-flex items-center rounded-full bg-[#1A5C38] px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
            Try Health Tools →
          </Link>
        </section>
      </div>
    </div>
  )
}

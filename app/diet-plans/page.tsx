import { connectDB } from '@/lib/mongodb'
import { PremiumPlan } from '@/models/PremiumPlan'
import Link from 'next/link'
import BuyPlanButton from '@/components/payment/BuyPlanButton'
import { Download, CheckCircle2, Leaf, Heart, Baby, Wheat, Activity, Flame } from 'lucide-react'

export const dynamic = 'force-dynamic'

const freePlans = [
  {
    icon: Flame,
    title: '7-రోజుల వెయిట్ లాస్ ప్లాన్',
    titleEn: '7-Day Weight Loss Plan',
    desc: 'ఉచిత PDF — ప్రారంభించండి.',
    color: 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-700',
    iconColor: 'text-orange-500',
  },
  {
    icon: Activity,
    title: 'డయాబెటిస్ ఫ్రెండ్లీ ప్లాన్',
    titleEn: 'Diabetes Friendly Plan',
    desc: 'షుగర్ కంట్రోల్ ఫోకస్.',
    color: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700',
    iconColor: 'text-blue-500',
  },
  {
    icon: Wheat,
    title: 'మిల్లెట్స్ మీల్ చార్ట్',
    titleEn: 'Millets Meal Chart',
    desc: 'తెలుగు మిల్లెట్స్ రిసిపీలు.',
    color: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-700',
    iconColor: 'text-yellow-600',
  },
  {
    icon: Leaf,
    title: 'గట్ హెల్త్ ప్లాన్',
    titleEn: 'Gut Health Plan',
    desc: 'జీర్ణశక్తి మెరుగుపడే మెనూ.',
    color: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-700',
    iconColor: 'text-emerald-600',
  },
  {
    icon: Heart,
    title: 'థైరాయిడ్ సపోర్ట్ ప్లాన్',
    titleEn: 'Thyroid Support Plan',
    desc: 'సింపుల్ రోజువారీ సూచనలు.',
    color: 'bg-pink-50 border-pink-200 dark:bg-pink-900/20 dark:border-pink-700',
    iconColor: 'text-pink-500',
  },
  {
    icon: Baby,
    title: 'పిల్లల పోషణ ప్లాన్',
    titleEn: "Kids Nutrition Plan",
    desc: 'టిఫిన్ & డిన్నర్ ఐడియాస్.',
    color: 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-700',
    iconColor: 'text-purple-500',
  },
]

export default async function DietPlansPage() {
  await connectDB()
  const plans = await PremiumPlan.find({ isActive: true }).sort({ createdAt: -1 }).lean() as any[]

  return (
    <div className="bg-white dark:bg-slate-950">
      {/* Hero */}
      <section className="mt-16 bg-gradient-to-br from-[#1A5C38] to-emerald-600 dark:from-slate-900 dark:to-slate-800">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
                <Leaf size={12} /> Telugu Nutrition
              </span>
              <h1 className="font-nunito text-4xl font-bold text-white">డైట్ ప్లాన్స్</h1>
              <p className="mt-2 max-w-lg text-sm text-emerald-100">
                ఉచిత & ప్రీమియం మీల్ ప్లాన్స్ — తెలుగు కుటుంబాల కోసం ప్రత్యేకంగా రూపొందించబడ్డాయి.
              </p>
            </div>
            <div className="flex flex-col gap-2 text-sm text-emerald-100">
              {['100% Telugu cuisine', 'Diabetic friendly options', 'Printable PDF format', 'Expert nutritionist approved'].map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-300" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick nav */}
      <div className="border-b bg-white dark:border-slate-700 dark:bg-slate-900">
        <div className="mx-auto flex max-w-6xl gap-6 px-4 py-3 text-sm font-medium">
          <a href="#free" className="text-[#1A5C38] hover:underline dark:text-emerald-400">ఉచిత ప్లాన్స్</a>
          <a href="#premium" className="text-[#1A5C38] hover:underline dark:text-emerald-400">ప్రీమియం ప్లాన్స్</a>
          <a href="#tools" className="text-[#1A5C38] hover:underline dark:text-emerald-400">హెల్త్ టూల్స్</a>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-14 px-4 py-12">

        {/* Free Plans */}
        <section id="free">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-1 w-8 rounded-full bg-[#1A5C38]" />
            <h2 className="font-nunito text-2xl font-bold text-gray-900 dark:text-slate-50">ఉచిత ప్లాన్స్</h2>
            <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
              100% Free
            </span>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {freePlans.map((p) => {
              const Icon = p.icon
              return (
                <div key={p.title} className={`group rounded-2xl border p-5 transition hover:-translate-y-1 hover:shadow-md ${p.color}`}>
                  <div className="mb-3 flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-slate-800 ${p.iconColor}`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="font-nunito text-base font-bold text-gray-900 dark:text-slate-50">{p.title}</p>
                      <p className="text-[11px] text-gray-500 dark:text-slate-400">{p.titleEn}</p>
                    </div>
                  </div>
                  <p className="mb-4 text-sm text-gray-600 dark:text-slate-400">{p.desc}</p>
                  <div className="space-y-2">
                    <input
                      type="email"
                      placeholder="మీ ఇమెయిల్"
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500"
                    />
                    <button
                      type="button"
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1A5C38] px-3 py-2 text-sm font-semibold text-white hover:opacity-90 transition"
                    >
                      <Download size={14} /> Download Free PDF
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Premium Plans */}
        <section id="premium">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-1 w-8 rounded-full bg-amber-500" />
            <h2 className="font-nunito text-2xl font-bold text-gray-900 dark:text-slate-50">ప్రీమియం ప్లాన్స్</h2>
            <span className="rounded-full bg-amber-100 px-3 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
              Expert Designed
            </span>
          </div>

          {plans.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-amber-300 bg-amber-50 p-10 text-center dark:border-amber-700 dark:bg-amber-900/10">
              <p className="font-nunito text-lg font-semibold text-amber-800 dark:text-amber-300">Premium plans coming soon</p>
              <p className="mt-1 text-sm text-amber-700 dark:text-amber-400">Personalized meal plans with expert guidance — launching soon.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {plans.map((p) => (
                <div
                  key={p._id.toString()}
                  className="relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-b from-amber-50 to-white shadow-sm dark:border-amber-700 dark:from-amber-900/20 dark:to-slate-800"
                >
                  {/* Top accent */}
                  <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 to-orange-400" />
                  <div className="p-6">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-nunito text-xl font-bold text-gray-900 dark:text-amber-200">{p.title}</p>
                        {p.description && <p className="mt-1 text-sm text-gray-600 dark:text-amber-300">{p.description}</p>}
                        <span className="mt-2 inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                          {p.durationWeeks}-week plan
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-[#D97706] dark:text-amber-400">{p.currency}{p.price}</div>
                        <div className="text-xs text-gray-500 dark:text-slate-400">one-time</div>
                      </div>
                    </div>

                    {p.features?.length > 0 && (
                      <ul className="mb-4 space-y-2">
                        {p.features.map((f: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-slate-300">
                            <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-500" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}

                    <BuyPlanButton
                      planId={p._id.toString()}
                      planTitle={p.title}
                      price={p.price}
                      currency={p.currency}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Health tools CTA */}
        <section id="tools" className="overflow-hidden rounded-2xl bg-gradient-to-r from-[#1A5C38] to-emerald-600 p-8 text-white shadow-lg">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="font-nunito text-2xl font-bold">మీకు ఏ ప్లాన్ సరిపోతుందో తెలుసుకోండి</p>
              <p className="mt-1 text-sm text-emerald-100">
                మా ఉచిత హెల్త్ టూల్స్ ఉపయోగించి మీ BMI, కేలరీలు తనిఖీ చేయండి.
              </p>
              <p className="mt-0.5 text-xs text-emerald-200">Not sure which plan suits you? Check your BMI and calorie needs first.</p>
            </div>
            <Link
              href="/health-tools"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#1A5C38] shadow hover:bg-emerald-50 transition"
            >
              <Activity size={16} /> Try Health Tools →
            </Link>
          </div>
        </section>

        {/* Trust signals */}
        <section className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: CheckCircle2, title: 'Expert Approved', desc: 'All plans reviewed by certified nutritionists' },
            { icon: Leaf, title: 'Telugu Cuisine', desc: 'Traditional ingredients, modern nutrition science' },
            { icon: Download, title: 'Instant Download', desc: 'PDF delivered to your inbox immediately' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1A5C38]/10 dark:bg-emerald-900/30">
                <Icon size={18} className="text-[#1A5C38] dark:text-emerald-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-slate-50">{title}</p>
                <p className="text-xs text-gray-500 dark:text-slate-400">{desc}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}

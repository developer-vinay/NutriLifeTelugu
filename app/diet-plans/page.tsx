import React from 'react'

const freePlans = [
  { title: '7-రోజుల వెయిట్ లాస్ ప్లాన్', desc: 'ఉచిత PDF — ప్రారంభించండి.' },
  { title: 'డయాబెటిస్ ఫ్రెండ్లీ ప్లాన్', desc: 'షుగర్ కంట్రోల్ ఫోకస్.' },
  { title: 'మిల్లెట్స్ మీల్ చార్ట్', desc: 'తెలుగు మిల్లెట్స్ రిసిపీలు.' },
  { title: 'గట్ హెల్త్ ప్లాన్', desc: 'జీర్ణశక్తి మెరుగుపడే మెనూ.' },
  { title: 'థైరాయిడ్ సపోర్ట్ ప్లాన్', desc: 'సింపుల్ రోజువారీ సూచనలు.' },
  { title: 'పిల్లల పోషణ ప్లాన్', desc: 'టిఫిన్ & డిన్నర్ ఐడియాస్.' },
]

const premiumPlans = [
  {
    title: 'Premium 30-Day Meal Plan',
    price: '₹299',
    desc: 'Printable PDF · Shopping list · Diabetic friendly',
  },
  {
    title: 'Premium 60-Day Transformation',
    price: '₹599',
    desc: 'Meal plan + habits tracker · Weekly checklists',
  },
]

export default function DietPlansPage() {
  return (
    <div className="bg-white dark:bg-slate-950">
      <section className="mt-16 bg-[#F0FAF4] dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h1 className="font-nunito text-3xl font-bold text-[#1A5C38] dark:text-emerald-400">
            డైట్ ప్లాన్స్
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">
            ఉచిత & ప్రీమియం మీల్ ప్లాన్స్ — తెలుగు కుటుంబాల కోసం.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-10 px-4 py-10">
        <section id="free">
          <h2 className="mb-4 font-nunito text-2xl font-bold text-gray-900 dark:text-slate-50">
            ఉచిత ప్లాన్స్
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {freePlans.map((p) => (
              <div key={p.title} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
                <p className="font-nunito text-lg font-semibold text-gray-900 dark:text-slate-50">
                  {p.title}
                </p>
                <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">{p.desc}</p>
                <div className="mt-4 space-y-2">
                  <input
                    type="email"
                    placeholder="మీ ఇమెయిల్"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500"
                  />
                  <button
                    type="button"
                    className="w-full rounded-lg bg-[#1A5C38] px-3 py-2 text-sm font-semibold text-white transition-all duration-150 hover:opacity-90 active:scale-95"
                  >
                    Download (mock)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="premium">
          <h2 className="mb-4 font-nunito text-2xl font-bold text-gray-900 dark:text-slate-50">
            ప్రీమియం ప్లాన్స్
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {premiumPlans.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-700 dark:bg-amber-900/20"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-nunito text-xl font-bold text-amber-900 dark:text-amber-200">
                      {p.title}
                    </p>
                    <p className="mt-1 text-sm text-amber-800 dark:text-amber-300">{p.desc}</p>
                  </div>
                  <div className="text-2xl font-bold text-[#D97706] dark:text-amber-400">
                    {p.price}
                  </div>
                </div>
                <button
                  type="button"
                  className="mt-4 w-full rounded-lg bg-[#D97706] px-3 py-2 text-sm font-semibold text-white transition-all duration-150 hover:opacity-90 active:scale-95"
                >
                  Buy (Razorpay TODO)
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

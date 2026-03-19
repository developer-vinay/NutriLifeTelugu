export default function AdvertisePage() {
  return (
    <div className="bg-white dark:bg-slate-950">
      <section className="mt-16 bg-[#F0FAF4] dark:bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <h1 className="font-nunito text-3xl font-bold text-[#1A5C38] dark:text-emerald-400">Advertise with Us</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">Reach 50,000+ Telugu health-conscious readers every month.</p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl space-y-8 px-4 py-10 text-gray-700 dark:text-slate-300">
        <section className="grid gap-4 md:grid-cols-3">
          {[
            { label: '50K+', desc: 'Monthly readers' },
            { label: '10K+', desc: 'Newsletter subscribers' },
            { label: '500+', desc: 'Published recipes & articles' },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <p className="font-nunito text-3xl font-bold text-[#1A5C38] dark:text-emerald-400">{s.label}</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">{s.desc}</p>
            </div>
          ))}
        </section>

        <section>
          <h2 className="mb-3 font-nunito text-xl font-bold text-gray-900 dark:text-slate-50">Ad Formats Available</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2"><span className="text-[#1A5C38] dark:text-emerald-400">✓</span> Banner ads (728×90, 300×250)</li>
            <li className="flex gap-2"><span className="text-[#1A5C38] dark:text-emerald-400">✓</span> Sponsored articles</li>
            <li className="flex gap-2"><span className="text-[#1A5C38] dark:text-emerald-400">✓</span> Newsletter sponsorships</li>
            <li className="flex gap-2"><span className="text-[#1A5C38] dark:text-emerald-400">✓</span> Recipe sponsorships</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-800 dark:bg-emerald-900/20">
          <h2 className="mb-2 font-nunito text-xl font-bold text-[#1A5C38] dark:text-emerald-400">Get in Touch</h2>
          <p className="mb-4 text-sm text-gray-700 dark:text-slate-300">Contact us to discuss advertising opportunities.</p>
          <a href="mailto:advertise@nutrilifetelugu.com"
            className="inline-flex rounded-full bg-[#1A5C38] px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
            advertise@nutrilifetelugu.com
          </a>
        </section>
      </div>
    </div>
  )
}

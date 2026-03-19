const products = [
  { title: 'Premium 30-Day Meal Plan', price: '₹299', desc: 'Printable PDF · Diabetic friendly · Shopping list included', type: 'meal-plans' },
  { title: 'Premium 60-Day Transformation', price: '₹599', desc: 'Meal plan + habits tracker · Weekly checklists', type: 'meal-plans' },
  { title: 'Telugu Nutrition Guide Ebook', price: '₹199', desc: 'Complete guide to healthy eating for Telugu families', type: 'ebooks' },
  { title: 'Millet Cooking Masterclass', price: '₹499', desc: '10 video lessons · Recipes included · Lifetime access', type: 'courses' },
]

export default function ShopPage() {
  return (
    <div className="bg-white dark:bg-slate-950">
      <section className="mt-16 bg-[#F0FAF4] dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h1 className="font-nunito text-3xl font-bold text-[#1A5C38] dark:text-emerald-400">Shop</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">Premium meal plans, ebooks, and courses for Telugu families.</p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div key={p.title} className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-700 dark:bg-amber-900/20">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="font-nunito text-lg font-bold text-amber-900 dark:text-amber-200">{p.title}</p>
                  <p className="mt-1 text-sm text-amber-800 dark:text-amber-300">{p.desc}</p>
                </div>
                <div className="whitespace-nowrap text-2xl font-bold text-[#D97706] dark:text-amber-400">{p.price}</div>
              </div>
              <button
                type="button"
                className="w-full rounded-lg bg-[#D97706] px-3 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Buy Now (Razorpay — Coming Soon)
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

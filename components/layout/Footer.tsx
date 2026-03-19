import Link from 'next/link'
import React from 'react'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="mt-12 bg-[#1A5C38] text-sm text-emerald-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs font-bold text-[#1A5C38]">
              NL
            </div>
            <div>
              <div className="text-sm font-extrabold text-white">
                NutriLife Telugu
              </div>
              <div className="text-[11px] text-emerald-100">
                స్మార్ట్ న్యూట్రిషన్. బెటర్ లైఫ్.
              </div>
            </div>
          </div>
          <p className="mb-3 text-xs text-emerald-100">
            ఆరోగ్యకరమైన తెలుగు రెసిపీలు, డైట్ ప్లాన్స్, హెల్త్ టిప్స్ మీ
            వంటింటి నుండే.
          </p>
          <div className="flex items-center gap-3 text-xs">
            <Link
              href="https://youtube.com"
              target="_blank"
              className="rounded-full bg-emerald-800 px-3 py-1 hover:bg-emerald-700"
            >
              YouTube
            </Link>
            <Link
              href="https://instagram.com"
              target="_blank"
              className="rounded-full bg-emerald-800 px-3 py-1 hover:bg-emerald-700"
            >
              Instagram
            </Link>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-emerald-100">
            Quick Links
          </h3>
          <ul className="space-y-1 text-xs text-emerald-100">
            <li>
              <Link href="/recipes" className="hover:text-white">
                Recipes
              </Link>
            </li>
            <li>
              <Link href="/diet-plans" className="hover:text-white">
                Diet Plans
              </Link>
            </li>
            <li>
              <Link href="/videos" className="hover:text-white">
                Videos
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white">
                About
              </Link>
            </li>
            <li>
              <Link href="/advertise" className="hover:text-white">
                Advertise
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-white">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/disclaimer" className="hover:text-white">
                Disclaimer
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-emerald-100">
            Categories
          </h3>
          <ul className="space-y-1 text-xs text-emerald-100">
            <li>బరువు తగ్గడం</li>
            <li>మధుమేహం</li>
            <li>గట్ హెల్త్</li>
            <li>థైరాయిడ్</li>
            <li>పిల్లల పోషణ</li>
            <li>మిల్లెట్స్</li>
            <li>హెల్త్ చిట్కాలు</li>
          </ul>
        </div>

        <div id="subscribe">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-emerald-100">
            Newsletter
          </h3>
          <p className="mb-2 text-xs text-emerald-100">
            ప్రతి వారం బెస్ట్ రెసిపీలు, హెల్త్ టిప్స్ మీ ఇన్‌బాక్స్ లోకి.
          </p>
          <NewsletterForm />
        </div>
      </div>
      <div className="border-t border-emerald-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 text-[11px] text-emerald-200">
          <p>© {year} NutriLife Telugu. All rights reserved.</p>
          <p>Made with love for Telugu families.</p>
        </div>
      </div>
    </footer>
  )
}

function NewsletterForm() {
  return (
    <form
      action="/api/subscribe"
      method="post"
      className="flex flex-col gap-2 text-xs"
    >
      <input
        type="email"
        name="email"
        required
        placeholder="మీ ఇమెయిల్ ఇక్కడ రాయండి..."
        className="w-full rounded-md border border-emerald-700 bg-emerald-900/40 px-3 py-2 text-xs text-emerald-50 placeholder:text-emerald-300 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
      />
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-md bg-[#D97706] px-3 py-2 font-semibold text-white shadow-sm hover:bg-amber-700"
      >
        Subscribe
      </button>
    </form>
  )
}


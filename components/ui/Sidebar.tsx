import React from 'react'
import Link from 'next/link'
import { Suspense } from 'react'
import PopularPosts from './SidebarPopularPosts'

export default function Sidebar() {
  return (
    <aside className="space-y-4">
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="mb-2 h-6 w-24 rounded bg-gray-100 text-[10px] uppercase tracking-wide text-gray-500">
          AdSense
        </div>
        <div className="flex h-40 items-center justify-center rounded-md border border-dashed border-gray-300 text-[11px] text-gray-500">
          Google AdSense slot
        </div>
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <h3 className="mb-2 text-xs font-semibold text-gray-900">
          ఉచిత న్యూస్‌లెటర్
        </h3>
        <p className="mb-2 text-[11px] text-gray-600">
          ప్రతి వారం బెస్ట్ హెల్త్ టిప్స్, డైట్ ప్లాన్స్, రెసిపీలు.
        </p>
        <form
          action="/api/subscribe"
          method="post"
          className="space-y-2 text-xs"
        >
          <input
            type="email"
            name="email"
            required
            placeholder="మీ ఇమెయిల్ రాయండి..."
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-[11px] placeholder:text-gray-400 focus:border-[#1A5C38] focus:outline-none focus:ring-1 focus:ring-[#1A5C38]"
          />
          <button
            type="submit"
            className="w-full rounded-md bg-[#1A5C38] px-3 py-2 text-[11px] font-semibold text-white hover:bg-emerald-800"
          >
            Subscribe free
          </button>
        </form>
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <h3 className="mb-2 text-xs font-semibold text-gray-900">
          పాపులర్ వ్యాసాలు
        </h3>
        <Suspense
          fallback={
            <div className="space-y-2">
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
              <div className="h-4 w-4/5 animate-pulse rounded bg-gray-100" />
            </div>
          }
        >
          <PopularPosts />
        </Suspense>
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <h3 className="mb-2 text-xs font-semibold text-gray-900">
          తాజా వీడియో
        </h3>
        <div className="aspect-video w-full overflow-hidden rounded-md bg-black">
          {/* Placeholder, real embed wired via homepage/videos page */}
          <iframe
            src="https://www.youtube.com/embed"
            title="Latest video"
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>

      <div className="rounded-xl border bg-[#F0FAF4] p-4 text-xs shadow-sm">
        <p className="mb-2 font-semibold text-[#1A5C38]">
          ఉచిత 7-రోజుల మీల్ ప్లాన్
        </p>
        <p className="mb-3 text-[11px] text-gray-700">
          బరువు తగ్గడానికి సింపుల్, ఈజీ తెలుగు ప్లాన్. డౌన్‌లోడ్ చేసుకోండి.
        </p>
        <Link
          href="/diet-plans"
          className="inline-flex items-center text-[11px] font-semibold text-[#D97706]"
        >
          ప్లాన్ చూడండి →
        </Link>
      </div>
    </aside>
  )
}


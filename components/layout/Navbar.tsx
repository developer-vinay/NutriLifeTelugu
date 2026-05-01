'use client'

import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import ThemeToggle from '@/components/ThemeToggle'
import LanguageToggle from '@/components/LanguageToggle'
import { useLanguage, LANG_LOGOS, BRAND_NAME } from '@/components/LanguageProvider'
import {
  Sunrise, UtensilsCrossed, Moon, GlassWater, Wheat, Leaf,
  Scale, Stethoscope, Wind, Microscope, Shield, Baby,
  FileText, Star, Video, GraduationCap, Zap,
  Flame, Candy, Droplets, Ruler, Salad,
  User, Bookmark, Heart, Settings, LogOut,
} from 'lucide-react'

type Item = { label: string; description: string; href: string; icon: React.ReactNode }

const recipeItems: Item[] = [
  { label: 'Breakfast', description: 'High-fiber millet breakfasts', href: '/recipes?category=breakfast', icon: <Sunrise size={16} /> },
  { label: 'Lunch', description: 'Balanced Telugu lunch plates', href: '/recipes?category=lunch', icon: <UtensilsCrossed size={16} /> },
  { label: 'Dinner', description: 'Light, gut-friendly dinners', href: '/recipes?category=dinner', icon: <Moon size={16} /> },
  { label: 'Snacks & Juices', description: 'Quick evening tiffins & drinks', href: '/recipes?category=snacks-juices', icon: <GlassWater size={16} /> },
  { label: 'Millets & Superfoods', description: 'Ragi, jowar, foxtail ideas', href: '/recipes?category=millets-superfoods', icon: <Wheat size={16} /> },
  { label: 'Diabetic Friendly', description: 'Low GI recipes your doctor loves', href: '/recipes?category=diabetic-friendly', icon: <Leaf size={16} /> },
]
const healthItems: Item[] = [
  { label: 'Weight Loss', description: 'Evidence-based Telugu fat loss tips', href: '/health-tips/weight-loss', icon: <Scale size={16} /> },
  { label: 'Diabetes', description: 'Sugar control with Indian meals', href: '/health-tips/diabetes', icon: <Stethoscope size={16} /> },
  { label: 'Gut Health', description: 'Simple habits for better digestion', href: '/health-tips/gut-health', icon: <Wind size={16} /> },
  { label: 'Thyroid & Hormones', description: 'Food support for hormones', href: '/health-tips/thyroid', icon: <Microscope size={16} /> },
  { label: 'Immunity', description: 'Daily immunity-building foods', href: '/health-tips/immunity', icon: <Shield size={16} /> },
  { label: 'Kids Nutrition', description: 'Tiffin box & growth tips', href: '/health-tips/kids-nutrition', icon: <Baby size={16} /> },
]
const dietItems: Item[] = [
  { label: 'Free Plans', description: 'Downloadable PDFs for beginners', href: '/diet-plans#free', icon: <FileText size={16} /> },
  { label: 'Premium Plans', description: 'Structured 4-week transformations', href: '/diet-plans#premium', icon: <Star size={16} /> },
]
const videoItems: Item[] = [
  { label: 'Cooking Videos', description: 'Step-by-step Telugu recipes', href: '/videos?type=cooking', icon: <Video size={16} /> },
  { label: 'Health Education', description: 'Doctor-backed explainer videos', href: '/videos?type=education', icon: <GraduationCap size={16} /> },
  { label: 'Reels & Shorts', description: 'Quick tips under 60 seconds', href: '/videos?type=shorts', icon: <Zap size={16} /> },
]
const healthToolItems: Item[] = [
  { label: 'BMI Calculator', description: 'Check your Body Mass Index', href: '/health-tools', icon: <Scale size={16} /> },
  { label: 'Calorie Calculator', description: 'Find your daily calorie needs (TDEE)', href: '/health-tools', icon: <Flame size={16} /> },
  { label: 'Sugar Intake Checker', description: 'Daily sugar limit & food check', href: '/health-tools', icon: <Candy size={16} /> },
  { label: 'Water Intake', description: 'How much water you need daily', href: '/health-tools', icon: <Droplets size={16} /> },
  { label: 'Waist-Hip Ratio', description: 'Abdominal obesity risk check', href: '/health-tools', icon: <Ruler size={16} /> },
  { label: 'Diet Plans', description: 'Free & premium meal plans', href: '/diet-plans', icon: <Salad size={16} /> },
]

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function NavLink({ href, pathname, children }: { href: string; pathname: string; children: React.ReactNode }) {
  const active = pathname === href || pathname.startsWith(href + '/')
  return (
    <Link href={href} className={`rounded-lg px-3 py-2 text-sm font-medium transition ${active ? 'bg-emerald-50 text-[#1A5C38] dark:bg-emerald-900/30 dark:text-emerald-400' : 'text-gray-700 hover:bg-gray-50 hover:text-[#1A5C38] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-emerald-400'}`}>
      {children}
    </Link>
  )
}

function Dropdown({ label, items, open, onEnter, onLeave }: {
  label: string; items: Item[]; open: boolean; onEnter: () => void; onLeave: () => void
}) {
  return (
    <div className="relative" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <button type="button" className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${open ? 'bg-emerald-50 text-[#1A5C38] dark:bg-emerald-900/30 dark:text-emerald-400' : 'text-gray-700 hover:bg-gray-50 hover:text-[#1A5C38] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-emerald-400'}`}>
        {label}<ChevronDown open={open} />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 w-80"
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}>
          {/* Invisible bridge — fills the gap so mouse doesn't leave the hover zone */}
          <div className="h-2 w-full" />
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
            <div className="border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-white px-4 py-2.5 dark:border-slate-700 dark:from-emerald-900/20 dark:to-slate-900">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#1A5C38] dark:text-emerald-400">{label}</p>
            </div>
            <div className="p-2">
              {items.map((item) => (
                <Link key={item.label} href={item.href} className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-gray-50 dark:hover:bg-slate-800">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-lg transition group-hover:bg-emerald-100 dark:bg-slate-800 dark:group-hover:bg-emerald-900/40">
                    {item.icon}
                  </span>
                  <span>
                    <div className="text-[13px] font-semibold text-gray-900 group-hover:text-[#1A5C38] dark:text-slate-100 dark:group-hover:text-emerald-400">{item.label}</div>
                    <div className="text-[11px] text-gray-500 dark:text-slate-400">{item.description}</div>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function MobileDropdown({ label, items }: { label: string; items: Item[] }) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button type="button" onClick={() => setOpen((p) => !p)} className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 dark:text-slate-200 dark:hover:bg-slate-800">
        <span>{label}</span><ChevronDown open={open} />
      </button>
      {open && (
        <div className="mt-1 space-y-0.5 rounded-xl bg-gray-50 p-2 dark:bg-slate-800">
          {items.map((item) => (
            <Link key={item.label} href={item.href} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-white hover:text-[#1A5C38] dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-emerald-400">
              <span className="text-base">{item.icon}</span>{item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function UserMenu() {
  const { data: session, status } = useSession()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (status === 'loading') {
    return <div className="h-9 w-9 animate-pulse rounded-full bg-gray-200 dark:bg-slate-700" />
  }

  if (!session?.user) {
    return (
      <Link
        href="/login"
        className="rounded-full bg-[#1A5C38] px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 active:scale-95"
      >
        Sign In / Sign Up
      </Link>
    )
  }

  const initials = (session.user.name?.[0] ?? session.user.email?.[0] ?? 'U').toUpperCase()

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border-2 border-[#1A5C38]/30 bg-emerald-50 text-sm font-bold text-[#1A5C38] transition hover:border-[#1A5C38] hover:shadow-md dark:bg-emerald-900/30 dark:text-emerald-400"
        aria-label="User menu"
      >
        {session.user.image
          ? <img src={session.user.image} alt={session.user.name ?? ''} className="h-full w-full object-cover" />
          : initials
        }
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center gap-3 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-white px-4 py-3.5 dark:border-slate-700 dark:from-emerald-900/20 dark:to-slate-900">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#1A5C38] text-sm font-bold text-white">
              {session.user.image
                ? <img src={session.user.image} alt="" className="h-full w-full object-cover" />
                : initials
              }
            </div>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-gray-900 dark:text-slate-100">{session.user.name ?? 'User'}</p>
              <p className="truncate text-[11px] text-gray-500 dark:text-slate-400">{session.user.email}</p>
            </div>
          </div>
          <div className="p-2">
            <Link href="/profile" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] text-gray-700 transition hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-slate-800">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/40"><User size={14} className="text-[#1A5C38] dark:text-emerald-400" /></span>
              My Profile
            </Link>
            <Link href="/profile#saved" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] text-gray-700 transition hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-slate-800">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/40"><Bookmark size={14} className="text-blue-600 dark:text-blue-400" /></span>
              Saved Posts
            </Link>
            <Link href="/profile#liked" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] text-gray-700 transition hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-slate-800">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/40"><Heart size={14} className="text-red-500 dark:text-red-400" /></span>
              Liked Posts
            </Link>
            <Link href="/profile#settings" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] text-gray-700 transition hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-slate-800">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 dark:bg-slate-700"><Settings size={14} className="text-gray-500 dark:text-slate-400" /></span>
              Settings
            </Link>
            <div className="my-1.5 border-t border-gray-100 dark:border-slate-700" />
            <button
              type="button"
              onClick={() => { setOpen(false); signOut({ callbackUrl: '/' }) }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/40"><LogOut size={14} className="text-red-500 dark:text-red-400" /></span>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function MobileUserSection({ session, onClose }: { session: ReturnType<typeof useSession>['data']; onClose: () => void }) {
  const [open, setOpen] = useState(false)
  if (!session?.user) return null
  const initials = (session.user.name?.[0] ?? session.user.email?.[0] ?? 'U').toUpperCase()
  return (
    <div>
      {/* Clickable user row — toggles menu */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center gap-3 rounded-xl bg-emerald-50 px-3 py-2.5 transition hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#1A5C38] text-xs font-bold text-white">
          {session.user.image
            ? <img src={session.user.image} alt="" className="h-full w-full object-cover" />
            : initials}
        </div>
        <div className="min-w-0 flex-1 text-left">
          <p className="truncate text-[13px] font-semibold text-gray-900 dark:text-slate-100">{session.user.name ?? 'User'}</p>
          <p className="truncate text-[11px] text-gray-500 dark:text-slate-400">{session.user.email}</p>
        </div>
        <ChevronDown open={open} />
      </button>

      {/* Collapsible links */}
      {open && (
        <div className="mt-1 space-y-0.5">
          <Link href="/profile" onClick={onClose} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-slate-800"><User size={14} /> My Profile</Link>
          <Link href="/profile#saved" onClick={onClose} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-slate-800"><Bookmark size={14} /> Saved Posts</Link>
          <Link href="/profile#liked" onClick={onClose} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-slate-800"><Heart size={14} /> Liked Posts</Link>
          <button
            type="button"
            onClick={() => { onClose(); signOut({ callbackUrl: '/' }) }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      )}
    </div>
  )
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const { data: session } = useSession()
  const { language } = useLanguage()
  const pathname = usePathname()

  const siteName = BRAND_NAME

  // Disable language toggle while reading a blog post (language is set by the article)
  const isReadingPost = /^\/blog\/[^/]+/.test(pathname)

  const dd = (label: string) => ({
    open: openDropdown === label,
    onEnter: () => {
      if (closeTimer.current) clearTimeout(closeTimer.current)
      setOpenDropdown(label)
    },
    onLeave: () => {
      closeTimer.current = setTimeout(() => setOpenDropdown(null), 150)
    },
  })

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        <Link href="/" className="flex shrink-0 items-center gap-3">
          <img
            src={LANG_LOGOS[language]}
            alt="NutriLifeMitra"
            className="h-11 w-11 rounded-full object-cover ring-2 ring-[#1A5C38]/20"
          />
          <span className="hidden font-nunito text-[15px] font-bold tracking-wide text-[#1A5C38] sm:block dark:text-emerald-400">
            {siteName}
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex">
          <Dropdown label="Recipes" items={recipeItems} {...dd('Recipes')} />
          <Dropdown label="Health Tips" items={healthItems} {...dd('Health Tips')} />
          <Dropdown label="Diet Plans" items={dietItems} {...dd('Diet Plans')} />
          <Dropdown label="Videos" items={videoItems} {...dd('Videos')} />
          <Dropdown label="Health Tools" items={healthToolItems} {...dd('Health Tools')} />
          <NavLink href="/blog" pathname={pathname}>Blog</NavLink>
          <NavLink href="/shop" pathname={pathname}>Shop</NavLink>
          <NavLink href="/about" pathname={pathname}>About</NavLink>
        </nav>

        {/* Desktop right — Language | Search | Theme | UserMenu */}
        <div className="hidden items-center gap-2 xl:flex">
          <LanguageToggle disabled={isReadingPost} />
          <Link
            href="/search"
            aria-label="Search"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-[#1A5C38] hover:text-[#1A5C38] dark:border-slate-700 dark:text-slate-400 dark:hover:border-emerald-500 dark:hover:text-emerald-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </Link>
          <ThemeToggle />
          <UserMenu />
        </div>

        {/* Mobile right — ThemeToggle + hamburger */}
        <div className="flex items-center gap-2 xl:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen((p) => !p)}
            aria-label="Toggle menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-700 transition hover:bg-gray-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer — slides in from right */}
      {/* Backdrop */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 xl:hidden ${mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      />
      {/* Drawer panel */}
      <div
        className={`fixed bottom-0 right-0 top-0 z-50 flex w-[80vw] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out dark:bg-slate-900 xl:hidden ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4 dark:border-slate-700">
          <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
            <img src={LANG_LOGOS[language]} alt="NutriLifeMitra" className="h-8 w-8 rounded-full object-cover ring-2 ring-[#1A5C38]/20" />
            <span className="font-nunito text-[14px] font-bold text-[#1A5C38] dark:text-emerald-400">{BRAND_NAME}</span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer body — scrollable */}
        <div className="flex-1 space-y-0.5 overflow-y-auto px-4 py-3">
          <MobileDropdown label="Recipes" items={recipeItems} />
          <MobileDropdown label="Health Tips" items={healthItems} />
          <MobileDropdown label="Diet Plans" items={dietItems} />
          <MobileDropdown label="Videos" items={videoItems} />
          <MobileDropdown label="Health Tools" items={healthToolItems} />
          <Link href="/blog" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 dark:text-slate-200 dark:hover:bg-slate-800">Blog</Link>
          <Link href="/shop" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 dark:text-slate-200 dark:hover:bg-slate-800">Shop</Link>
          <Link href="/about" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 dark:text-slate-200 dark:hover:bg-slate-800">About</Link>
          <Link href="/search" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 dark:text-slate-200 dark:hover:bg-slate-800">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            Search
          </Link>
        </div>

        {/* Drawer footer */}
        <div className="border-t border-gray-100 px-4 py-4 dark:border-slate-700">
          {session?.user ? (
            <MobileUserSection session={session} onClose={() => setMobileOpen(false)} />
          ) : (
            <Link href="/login" onClick={() => setMobileOpen(false)} className="block w-full rounded-full bg-[#1A5C38] py-2.5 text-center text-sm font-semibold text-white">
              Sign In / Sign Up
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

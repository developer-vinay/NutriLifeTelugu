'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  ChefHat,
  Video,
  MessageSquare,
  Image,
  CreditCard,
  Megaphone,
  User,
  LogOut,
  Menu,
  X,
  Mail,
  Leaf,
} from 'lucide-react'

interface AdminShellProps {
  children: React.ReactNode
  userName: string
  userEmail: string
  initials: string
  handleLogout: () => void
}

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/posts', label: 'Posts', icon: FileText },
  { href: '/admin/recipes', label: 'Recipes', icon: ChefHat },
  { href: '/admin/videos', label: 'Videos', icon: Video },
  { href: '/admin/plans', label: 'Diet Plans', icon: CreditCard },
  { href: '/admin/promotions', label: 'Promotions', icon: Megaphone },
  { href: '/admin/subscribers', label: 'Subscribers', icon: Mail },
  { href: '/admin/comments', label: 'Comments', icon: MessageSquare },
  { href: '/admin/hero-slides', label: 'Hero Slides', icon: Image },
  { href: '/admin/profile', label: 'Profile', icon: User },
]

export default function AdminShell({
  children,
  userName,
  userEmail,
  initials,
  handleLogout,
}: AdminShellProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#F6F8F6] lg:flex">

      {/* ── Mobile top bar ── */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1A5C38]">
            <Leaf className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-bold text-gray-900">NutriAdmin</span>
        </div>
        <div className="h-8 w-8 rounded-full bg-[#1A5C38] flex items-center justify-center text-xs font-bold text-white">
          {initials}
        </div>
      </header>

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white shadow-xl transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:shadow-none lg:border-r lg:border-gray-200 lg:flex-shrink-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="flex h-14 items-center justify-between border-b border-gray-100 px-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1A5C38]">
              <Leaf className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-bold text-gray-900">NutriAdmin</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* User card */}
        <div className="mx-3 my-3 rounded-xl bg-gradient-to-br from-[#1A5C38] to-emerald-600 p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white ring-2 ring-white/30">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{userName}</p>
              <p className="truncate text-[11px] text-emerald-100">{userEmail}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 pb-2">
          <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Menu</p>
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + '/')
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all
                      ${isActive
                        ? 'bg-[#1A5C38] text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`}
                    />
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-300" />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="border-t border-gray-100 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="min-w-0 flex-1 overflow-x-hidden pt-14 lg:pt-0">
        <div className="w-full max-w-7xl p-4 lg:p-6 xl:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

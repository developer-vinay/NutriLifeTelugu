import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth, signOut } from '@/auth'

export const runtime = 'nodejs'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = session?.user as any as { name?: string; email?: string; role?: string } | undefined

  // Not authenticated or not admin → redirect to login
  if (!user || user.role !== 'admin') {
    redirect('/admin-login')
  }

  const initials = (user.name ?? user.email ?? 'A')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'A'

  async function handleLogout() {
    'use server'
    await signOut({ redirectTo: '/admin-login' })
  }

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <aside className="flex w-60 flex-col bg-[#1A5C38] text-white">
        <div className="flex items-center gap-2 px-4 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-bold text-[#1A5C38]">NL</div>
          <div>
            <div className="text-sm font-semibold uppercase tracking-wide">NutriLifeMithra</div>
            <div className="text-xs text-emerald-100">Admin Panel</div>
          </div>
        </div>
        <nav className="mt-4 flex-1 space-y-1 px-2 text-sm font-medium">
          <NavItem href="/admin/dashboard">Dashboard</NavItem>
          <NavItem href="/admin/posts">Posts</NavItem>
          <NavItem href="/admin/recipes">Recipes</NavItem>
          <NavItem href="/admin/videos">Videos</NavItem>
          <NavItem href="/admin/plans">Premium Plans</NavItem>
          <NavItem href="/admin/subscribers">Subscribers</NavItem>
          <NavItem href="/admin/profile">Profile</NavItem>
        </nav>
        <form action={handleLogout} className="px-2 pb-4 pt-2">
          <button type="submit" className="flex w-full items-center justify-center rounded-md bg-white/10 px-3 py-2 text-sm font-medium text-red-50 transition hover:bg-white/20">
            Logout
          </button>
        </form>
      </aside>
      <main className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b bg-white px-6 py-3">
          <h1 className="text-lg font-semibold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-gray-900">{user.name ?? 'Admin'}</span>
              <span className="text-xs text-gray-500">{user.email ?? ''}</span>
            </div>
            <Link href="/admin/profile" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1A5C38] text-xs font-semibold text-white hover:bg-emerald-800 transition">{initials}</Link>
          </div>
        </header>
        <div className="flex-1 p-6">{children}</div>
      </main>
    </div>
  )
}

function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="flex items-center rounded-md px-3 py-2 text-sm text-emerald-50 transition hover:bg-emerald-700 hover:text-white">
      <span className="mr-2 h-1.5 w-1.5 rounded-full bg-emerald-200" />
      {children}
    </Link>
  )
}

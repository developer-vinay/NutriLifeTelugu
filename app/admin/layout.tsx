import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth, signOut } from '@/auth'
import AdminShell from './AdminShell'

export const runtime = 'nodejs'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const user = session?.user as any as { name?: string; email?: string; role?: string } | undefined

  if (!user || user.role !== 'admin') redirect('/admin-login')

  const initials = (user.name ?? user.email ?? 'A')
    .split(' ').map((p: string) => p[0]).join('').slice(0, 2).toUpperCase() || 'A'

  async function handleLogout() {
    'use server'
    await signOut({ redirectTo: '/admin-login' })
  }

  return (
    <AdminShell
      userName={user.name ?? 'Admin'}
      userEmail={user.email ?? ''}
      initials={initials}
      handleLogout={handleLogout}
    >
      {children}
    </AdminShell>
  )
}

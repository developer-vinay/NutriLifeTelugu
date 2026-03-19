'use client'

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { SessionProvider } from 'next-auth/react'
import type { Session } from 'next-auth'
import Navbar from './Navbar'
import Footer from './Footer'

export default function RootShell({
  children,
  session,
}: {
  children: React.ReactNode
  session: Session | null
}) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin') || pathname === '/admin-login'

  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'))
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  if (isAdmin) {
    return <SessionProvider session={session}>{children}</SessionProvider>
  }

  // Image facts (px):
  // LeftBorder.png  176 × 1496  — leaf content fills full width, scale to 50px
  // RightBorder.png  86 ×  666  — leaf content fills full width, render at 50px
  // DarkBorder.png  373 ×  669  — leaf content on RIGHT side of canvas, anchor right

  return (
    <SessionProvider session={session}>
      <Navbar />
      <div className="relative">
        {/* ── LEFT border ── */}
        {isDark ? (
          // Dark: DarkBorder leaf is on the right side of its 373px canvas
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-[80px] xl:block"
            style={{
              backgroundImage: 'url(/DarkBorder.png)',
              backgroundRepeat: 'repeat-y',
              backgroundSize: '80px auto',
              backgroundPosition: 'right top',
            }}
          />
        ) : (
          // Light: LeftBorder 176px wide, scale to 50px
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-[50px] xl:block"
            style={{
              backgroundImage: 'url(/LeftBorder.png)',
              backgroundRepeat: 'repeat-y',
              backgroundSize: '50px auto',
              backgroundPosition: 'left top',
            }}
          />
        )}

        {/* ── RIGHT border ── */}
        {isDark ? (
          // Dark: DarkBorder flipped — leaf content on right side, anchor left so it shows
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-[80px] xl:block"
            style={{
              backgroundImage: 'url(/DarkBorder.png)',
              backgroundRepeat: 'repeat-y',
              backgroundSize: '80px auto',
              backgroundPosition: 'left top',
            }}
          />
        ) : (
          // Light: RightBorder 86px wide, scale to 50px
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-[50px] xl:block"
            style={{
              backgroundImage: 'url(/RightBorder.png)',
              backgroundRepeat: 'repeat-y',
              backgroundSize: '50px auto',
              backgroundPosition: 'left top',
            }}
          />
        )}

        <main className="min-h-screen bg-white pt-[73px] dark:bg-slate-950">{children}</main>
      </div>
      <Footer />
    </SessionProvider>
  )
}

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

  return (
    <SessionProvider session={session}>
      <Navbar />
      {/* Wrapper: borders are fixed to viewport sides, main content scrolls normally */}
      <div className="relative">
        {/* ── LEFT border ── */}
        <div className="pointer-events-none fixed inset-y-0 left-0 z-10 hidden w-[88px] xl:block">
          {isDark ? (
            // DarkBorder: leaf content is on the right side of the 373px canvas
            // We show it at 88px wide — the leaf portion is roughly the right ~88px
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'url(/DarkBorder.png)',
                backgroundRepeat: 'repeat-y',
                backgroundSize: '373px auto',
                backgroundPosition: 'right top',
              }}
            />
          ) : (
            // LeftBorder: 176×1496 — render at natural 88px (half) for crisp pixels
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'url(/LeftBorder.png)',
                backgroundRepeat: 'repeat-y',
                backgroundSize: '88px auto',
                backgroundPosition: 'left top',
              }}
            />
          )}
        </div>

        {/* ── RIGHT border ── */}
        <div className="pointer-events-none fixed inset-y-0 right-0 z-10 hidden w-[88px] xl:block">
          {isDark ? (
            // DarkBorder mirrored: scaleX(-1) so the leaf (right side) now faces inward
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'url(/DarkBorder.png)',
                backgroundRepeat: 'repeat-y',
                backgroundSize: '373px auto',
                backgroundPosition: 'left top',
                transform: 'scaleX(-1)',
              }}
            />
          ) : (
            // RightBorder: 86×666 — render at natural 86px for crisp pixels
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'url(/RightBorder.png)',
                backgroundRepeat: 'repeat-y',
                backgroundSize: '86px auto',
                backgroundPosition: 'left top',
              }}
            />
          )}
        </div>

        <main className="min-h-screen bg-white pt-[73px] dark:bg-slate-950">{children}</main>
      </div>
      {/* Footer sits above the fixed borders */}
      <div className="relative z-20">
        <Footer />
      </div>
    </SessionProvider>
  )
}

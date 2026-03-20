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
      <div className="relative">

        {/* LEFT border — fixed to viewport edges, above content */}
        <div
          aria-hidden
          className="pointer-events-none fixed bottom-0 left-0 top-0 z-30"
          style={{
            width: 'clamp(16px, 3.5vw, 60px)',
            backgroundImage: isDark ? 'url(/DarkBorder.png)' : 'url(/LeftBorder.png)',
            backgroundRepeat: 'repeat-y',
            backgroundSize: '100% auto',
            backgroundPosition: 'left top',
          }}
        />

        {/* RIGHT border — fixed to viewport edges, above content */}
        <div
          aria-hidden
          className="pointer-events-none fixed bottom-0 right-0 top-0 z-30"
          style={{
            width: 'clamp(14px, 3vw, 50px)',
            backgroundImage: isDark ? 'url(/DarkBorder.png)' : 'url(/RightBorder.png)',
            backgroundRepeat: 'repeat-y',
            backgroundSize: '100% auto',
            backgroundPosition: 'left top',
            transform: isDark ? 'scaleX(-1)' : undefined,
          }}
        />

        <main className="min-h-screen bg-white pt-[73px] dark:bg-slate-950">
          {children}
        </main>
      </div>
      <div className="relative z-20">
        <Footer />
      </div>
    </SessionProvider>
  )
}

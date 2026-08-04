import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { ZoroAssistant } from '../components/ZoroAssistant'

/** Public site shell: navbar, page content, footer and the Zoro AI assistant. */
export function ClientLayout() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ZoroAssistant />
    </div>
  )
}

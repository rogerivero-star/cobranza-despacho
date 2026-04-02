'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Navbar({ userRole }: { userRole?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  if (pathname === '/login') return null

  const handleLogout = async () => {
    setMenuOpen(false)
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  const navLinks = [
    { href: '/', label: 'Dashboard' },
    { href: '/clientes', label: 'Clientes' },
    { href: '/reportes', label: 'Reportes' },
    ...(userRole === 'admin' ? [{ href: '/configuracion', label: 'Configuración' }] : []),
  ]

  return (
    <>
      <nav className="navbar">
        {/* Logo */}
        <Link href="/" className="navbar-logo">
          <div className="navbar-logo-icon">C</div>
          <span className="navbar-logo-text">
            COBRANZA <span style={{ color: 'var(--accent)' }}>DESPACHO</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="navbar-links">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link"
              style={{ color: 'white' }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Logout */}
        <div className="navbar-actions">
          <button onClick={handleLogout} className="btn navbar-logout-btn">
            Cerrar Sesión
          </button>
        </div>

        {/* Hamburger Button (mobile only) */}
        <button
          className="navbar-hamburger"
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
        >
          <span className={`hamburger-line ${menuOpen ? 'open-1' : ''}`} />
          <span className={`hamburger-line ${menuOpen ? 'open-2' : ''}`} />
          <span className={`hamburger-line ${menuOpen ? 'open-3' : ''}`} />
        </button>
      </nav>

      {/* Mobile Drawer Overlay */}
      {menuOpen && (
        <div className="mobile-overlay" onClick={() => setMenuOpen(false)} />
      )}

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${menuOpen ? 'mobile-drawer-open' : ''}`}>
        <div className="mobile-drawer-header">
          <span className="navbar-logo-text" style={{ fontSize: '1rem' }}>
            COBRANZA <span style={{ color: 'var(--accent)' }}>DESPACHO</span>
          </span>
        </div>

        <nav className="mobile-drawer-nav">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`mobile-nav-link ${pathname === link.href ? 'mobile-nav-link-active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mobile-drawer-footer">
          <div className="mobile-user-badge">
            <span className="mobile-user-dot" />
            <span style={{ fontSize: '0.875rem', opacity: 0.7 }}>
              {userRole === 'admin' ? 'Administrador' : 'Socio'}
            </span>
          </div>
          <button onClick={handleLogout} className="btn mobile-logout-btn">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </>
  )
}

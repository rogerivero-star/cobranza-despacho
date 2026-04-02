'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

export default function Navbar({ userRole }: { userRole?: string }) {
  const router = useRouter()
  const pathname = usePathname()

  if (pathname === '/login') return null

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <nav style={{ 
      backgroundColor: 'var(--primary)', 
      color: 'white', 
      padding: '0.75rem 2rem', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
        <Link href="/" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem',
          textDecoration: 'none' 
        }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            backgroundColor: 'var(--accent)', 
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            color: 'var(--primary)'
          }}>
            C
          </div>
          <span style={{ 
            fontSize: '1.25rem', 
            fontWeight: 700, 
            letterSpacing: '-0.02em',
            color: 'white'
          }}>
            COBRANZA <span style={{ color: 'var(--accent)' }}>DESPACHO</span>
          </span>
        </Link>
        
        <div style={{ display: 'flex', gap: '2rem', marginTop: '4px' }}>
          <Link href="/" className="nav-link" style={{ color: 'white' }}>Dashboard</Link>
          <Link href="/clientes" className="nav-link" style={{ color: 'white' }}>Clientes</Link>
          <Link href="/reportes" className="nav-link" style={{ color: 'white' }}>Reportes</Link>
          {userRole === 'admin' && (
            <Link href="/configuracion" className="nav-link" style={{ color: 'white' }}>Configuración</Link>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <button 
          onClick={handleLogout} 
          className="btn" 
          style={{ 
            fontSize: '0.8125rem', 
            color: 'rgba(255,255,255,0.7)',
            padding: '0.5rem 1rem',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 'var(--radius)'
          }}
        >
          Cerrar Sesión
        </button>
      </div>
    </nav>
  )
}

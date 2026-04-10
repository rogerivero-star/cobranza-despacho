import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { updateUser, registerUser } from '@/app/actions'
import prisma from '@/lib/prisma'
import DeleteUserButton from '@/components/DeleteUserButton'

export default async function ConfiguracionPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')

  // Only allow 'admin' to access this page
  if (!session || session.value !== 'admin') {
    redirect('/')
  }

  const users = await prisma.user.findMany({
    orderBy: { id: 'asc' }
  })

  return (
    <div className="container" style={{ maxWidth: '1000px', padding: '2rem 1rem' }}>
      <h1 style={{ marginBottom: '2rem', fontWeight: 800 }}>Configuración del Sistema</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        {/* SECCIÓN 1: MI CUENTA */}
        <div className="card">
          <h2 style={{ marginBottom: '0.5rem', color: 'var(--primary)', fontSize: '1.25rem' }}>Mi Cuenta (Admin)</h2>
          <p style={{ color: 'var(--muted-foreground)', marginBottom: '1.5rem', fontSize: '0.8125rem' }}>
            Actualiza tus credenciales de acceso principal.
          </p>

          <form action={updateUser} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="newUsername">Usuario</label>
              <input type="text" id="newUsername" name="newUsername" defaultValue="admin" required />
            </div>

            <div className="form-group">
              <label htmlFor="currentPassword">Contraseña Actual</label>
              <input type="password" id="currentPassword" name="currentPassword" required />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">Nueva Contraseña</label>
              <input type="password" id="newPassword" name="newPassword" required />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
              <input type="password" id="confirmPassword" name="confirmPassword" required />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
              Actualizar Mi Cuenta
            </button>
          </form>
        </div>

        {/* SECCIÓN 2: GESTIÓN DE USUARIOS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card">
            <h2 style={{ marginBottom: '0.5rem', color: 'var(--primary)', fontSize: '1.25rem' }}>Gestionar Usuarios</h2>
            <p style={{ color: 'var(--muted-foreground)', marginBottom: '1.5rem', fontSize: '0.8125rem' }}>
              Usuarios con acceso al sistema de cobranza.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {users.map((user) => (
                <div key={user.id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '0.75rem',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid var(--muted)'
                }}>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.username}</span>
                    {user.username === 'admin' && (
                      <span style={{ 
                        marginLeft: '0.5rem', 
                        fontSize: '0.7rem', 
                        padding: '0.1rem 0.4rem', 
                        background: 'var(--primary)', 
                        color: 'white', 
                        borderRadius: '4px' 
                      }}>ADMIN</span>
                    )}
                  </div>
                  {user.username !== 'admin' && (
                    <DeleteUserButton userId={user.id} username={user.username} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ borderTop: '4px solid var(--accent)' }}>
            <h2 style={{ marginBottom: '0.5rem', color: 'var(--primary)', fontSize: '1.25rem' }}>Agregar Usuario</h2>
            <p style={{ color: 'var(--muted-foreground)', marginBottom: '1.5rem', fontSize: '0.8125rem' }}>
              Crea una nueva cuenta de acceso.
            </p>

            <form action={registerUser} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="username">Nombre de Usuario</label>
                <input type="text" id="username" name="username" placeholder="Ej: asistente" required />
              </div>

              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input type="password" id="password" name="password" placeholder="Mínimo 8 caracteres" required />
              </div>

              <button type="submit" className="btn btn-accent" style={{ width: '100%', marginTop: '0.5rem' }}>
                + Crear Usuario
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

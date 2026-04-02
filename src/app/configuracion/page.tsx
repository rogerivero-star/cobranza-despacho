import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { updateUser } from '@/app/actions'

export default async function ConfiguracionPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')

  // Only allow 'admin' to access this page
  if (!session || session.value !== 'admin') {
    redirect('/')
  }

  return (
    <div className="container" style={{ maxWidth: '600px', padding: '2rem 1rem' }}>
      <div className="card">
        <h2 style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>Configuración de Cuenta</h2>
        <p style={{ color: 'var(--muted-foreground)', marginBottom: '2rem', fontSize: '0.9rem' }}>
          Actualiza las credenciales de acceso del administrador. 
          <span style={{ color: 'var(--error)', display: 'block', marginTop: '0.5rem' }}>
            * Al confirmar, se cerrará la sesión actual.
          </span>
        </p>

        <form action={updateUser} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label htmlFor="newUsername">Nombre de Usuario Actualizado</label>
            <input 
              type="text" 
              id="newUsername" 
              name="newUsername" 
              defaultValue="admin" 
              required 
            />
          </div>

          <div style={{ height: '1px', backgroundColor: 'rgba(0,0,0,0.05)', margin: '0.5rem 0' }}></div>

          <div className="form-group">
            <label htmlFor="currentPassword">Contraseña Actual</label>
            <input 
              type="password" 
              id="currentPassword" 
              name="currentPassword" 
              placeholder="Ingresa tu contraseña actual"
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">Nueva Contraseña</label>
            <input 
              type="password" 
              id="newPassword" 
              name="newPassword" 
              placeholder="Min. 8 caracteres"
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
            <input 
              type="password" 
              id="confirmPassword" 
              name="confirmPassword" 
              placeholder="Repite la nueva contraseña"
              required 
            />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Actualizar Credenciales
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

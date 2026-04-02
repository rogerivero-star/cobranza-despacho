import prisma from '@/lib/prisma'
import Link from 'next/link'

async function getClientes() {
  return await prisma.client.findMany({
    include: {
      _count: {
        select: { invoices: true }
      }
    },
    orderBy: { name: 'asc' }
  })
}

export default async function ClientesPage() {
  const clientes = await getClientes()

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Directorio de Clientes</h1>
          <p style={{ color: 'var(--muted-foreground)' }}>Gestione la cartera de clientes del despacho</p>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nombre / Razón Social</th>
                <th>Contacto</th>
                <th>Total Facturas</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente: any) => (
                <tr key={cliente.id}>
                  <td style={{ fontWeight: 600 }}>{cliente.name}</td>
                  <td>{cliente.contact || 'No registrado'}</td>
                  <td>{cliente._count.invoices}</td>
                  <td>
                    <Link href={`/clientes/${cliente.id}`} style={{ color: 'var(--accent)', fontSize: '0.875rem' }}>
                      Ver Historial
                    </Link>
                  </td>
                </tr>
              ))}
              {clientes.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '3rem' }}>No hay clientes registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

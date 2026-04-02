import prisma from '@/lib/prisma'
import Link from 'next/link'
import MarkAsPaidButton from '@/components/MarkAsPaidButton'

async function getDashboardData() {
  const invoices = await prisma.invoice.findMany({
    include: { client: true },
    orderBy: { issueDate: 'desc' },
  })

  // Basic stats
  const totalInvoiced = invoices.reduce((acc: number, inv) => acc + inv.amount, 0)
  const totalPaid = invoices.filter(inv => inv.isPaid).reduce((acc: number, inv) => acc + inv.amount, 0)
  const totalPending = totalInvoiced - totalPaid

  return { invoices, totalPaid, totalPending, totalInvoiced }
}

function getStatusColor(issueDate: Date, isPaid: boolean) {
  if (isPaid) return 'status-green'
  
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - issueDate.getTime())
  const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30))

  if (diffMonths === 0) return 'status-green'
  if (diffMonths >= 1 && diffMonths <= 2) return 'status-yellow'
  return 'status-red'
}

export default async function DashboardPage() {
  const { invoices, totalPaid, totalPending, totalInvoiced } = await getDashboardData()

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Resumen Ejecutivo</h1>
          <p style={{ color: 'var(--muted-foreground)' }}>Estado actual de la cobranza del despacho</p>
        </div>
        <Link href="/facturas/nueva" className="btn btn-primary">
          + Nueva Factura
        </Link>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.5rem' }}>Total Cobrado</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--success)' }}>
            ${totalPaid.toLocaleString('es-MX')}
          </p>
        </div>
        <div className="card" style={{ borderLeft: '4px solid var(--warning)' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.5rem' }}>Pendiente</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--warning)' }}>
            ${totalPending.toLocaleString('es-MX')}
          </p>
        </div>
        <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.5rem' }}>Total Facturado</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 700 }}>
            ${totalInvoiced.toLocaleString('es-MX')}
          </p>
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Últimos Registros</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Estatus</th>
                <th>Cliente</th>
                <th>Factura #</th>
                <th>Fecha Emisión</th>
                <th>Monto</th>
                <th>Elaborada</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td>
                    <span className={`status-indicator ${getStatusColor(inv.issueDate, inv.isPaid)}`}></span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                      {inv.isPaid ? 'PAGADA' : 'PENDIENTE'}
                    </span>
                  </td>
                  <td>{inv.client.name}</td>
                  <td>{inv.noInvoice ? 'Pago sin factura' : (inv.invoiceNumber || '---')}</td>
                  <td>{inv.issueDate.toLocaleDateString('es-MX')}</td>
                  <td style={{ fontWeight: 600 }}>${inv.amount.toLocaleString('es-MX')}</td>
                  <td>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px',
                      background: inv.isPrepared ? '#dcfce7' : '#fee2e2',
                      color: inv.isPrepared ? '#166534' : '#991b1b'
                    }}>
                      {inv.isPrepared ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      {!inv.isPaid && <MarkAsPaidButton invoiceId={inv.id} />}
                      <Link href={`/facturas/${inv.id}`} style={{ color: 'var(--muted-foreground)', fontSize: '0.8125rem' }}>
                        Ver
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted-foreground)' }}>
                    No hay registros de facturación aún.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

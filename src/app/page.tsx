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

type Category = 'cobrado' | 'pendiente' | 'facturado' | 'todos'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const params = await searchParams
  const category = (params.category as Category) || 'todos'
  
  const { invoices: allInvoices, totalPaid, totalPending, totalInvoiced } = await getDashboardData()

  const filteredInvoices = allInvoices.filter(inv => {
    if (category === 'cobrado') return inv.isPaid
    if (category === 'pendiente') return !inv.isPaid
    return true
  })

  // Dynamic values for the UI
  const tableTitle = category === 'cobrado' ? 'Facturas Cobradas' : 
                     category === 'pendiente' ? 'Facturas Pendientes' : 
                     'Todos los Registros'

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
        <Link 
          href="/?category=cobrado" 
          className="card" 
          style={{ 
            borderLeft: '4px solid var(--success)',
            backgroundColor: category === 'cobrado' ? '#f0fdf4' : 'var(--card)',
            boxShadow: category === 'cobrado' ? '0 0 0 2px var(--success), var(--shadow-lg)' : 'var(--shadow)',
            transition: 'all 0.2s ease'
          }}
        >
          <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.5rem' }}>Total Cobrado</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--success)' }}>
            ${totalPaid.toLocaleString('es-MX')}
          </p>
        </Link>
        <Link 
          href="/?category=pendiente" 
          className="card" 
          style={{ 
            borderLeft: '4px solid var(--warning)',
            backgroundColor: category === 'pendiente' ? '#fffbeb' : 'var(--card)',
            boxShadow: category === 'pendiente' ? '0 0 0 2px var(--warning), var(--shadow-lg)' : 'var(--shadow)',
            transition: 'all 0.2s ease'
          }}
        >
          <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.5rem' }}>Pendiente</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--warning)' }}>
            ${totalPending.toLocaleString('es-MX')}
          </p>
        </Link>
        <Link 
          href="/?category=facturado" 
          className="card" 
          style={{ 
            borderLeft: '4px solid var(--primary)',
            backgroundColor: category === 'facturado' || category === 'todos' ? '#f8fafc' : 'var(--card)',
            boxShadow: (category === 'facturado' || category === 'todos') ? '0 0 0 2px var(--primary), var(--shadow-lg)' : 'var(--shadow)',
            transition: 'all 0.2s ease'
          }}
        >
          <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.5rem' }}>Total Facturado</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 700 }}>
            ${totalInvoiced.toLocaleString('es-MX')}
          </p>
        </Link>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>{tableTitle}</h2>
          {category !== 'todos' && (
            <Link href="/" style={{ fontSize: '0.875rem', color: 'var(--accent)', fontWeight: 600 }}>
              Ver todo
            </Link>
          )}
        </div>
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
              {filteredInvoices.map((inv) => (
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

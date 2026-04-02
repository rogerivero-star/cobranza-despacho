import prisma from '@/lib/prisma'
import PrintButton from '@/components/PrintButton'

async function getReportData() {
  const invoices = await prisma.invoice.findMany({
    include: { client: true },
    orderBy: { issueDate: 'desc' },
  })

  const now = new Date()
  const currentMonth = now.getMonth()

  const delayedInvoices = invoices.filter((inv: any) => {
    if (inv.isPaid) return false
    const diffTime = Math.abs(now.getTime() - inv.issueDate.getTime())
    const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30))
    return diffMonths >= 1
  })

  const paidThisMonth = invoices
    .filter((inv: any) => inv.isPaid && inv.paymentDate && inv.paymentDate.getMonth() === currentMonth)
    .reduce((acc: number, inv: any) => acc + inv.amount, 0)

  return { invoices, delayedInvoices, paidThisMonth }
}

export default async function ReportsPage() {
  const { invoices, delayedInvoices, paidThisMonth } = await getReportData()

  return (
    <div className="container">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Reporte Mensual de Cobranza</h1>
        <p style={{ color: 'var(--muted-foreground)' }}>Análisis de resultados y clientes con retraso</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div className="card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Clientes con Retraso (Semáforo Amarillo/Rojo)</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Factura</th>
                  <th>Monto</th>
                  <th>Atraso</th>
                </tr>
              </thead>
              <tbody>
                {delayedInvoices.map((inv: any) => {
                  const now = new Date()
                  const diffTime = Math.abs(now.getTime() - inv.issueDate.getTime())
                  const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30))
                  return (
                    <tr key={inv.id}>
                      <td>{inv.client.name}</td>
                      <td>{inv.noInvoice ? 'Sin Factura' : inv.invoiceNumber}</td>
                      <td style={{ color: 'var(--error)', fontWeight: 600 }}>${inv.amount.toLocaleString('es-MX')}</td>
                      <td>
                        <span style={{ 
                          color: diffMonths >= 3 ? 'var(--error)' : 'var(--warning)',
                          fontWeight: 700 
                        }}>
                          {diffMonths} mes(es)
                        </span>
                      </td>
                    </tr>
                  )
                })}
                {delayedInvoices.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted-foreground)' }}>
                      No hay registros con retraso actualmente.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card" style={{ height: 'min-content' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Desempeño Global</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>Cobrado este mes</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success)' }}>
                ${paidThisMonth.toLocaleString('es-MX')}
              </p>
            </div>
            <div style={{ padding: '1.25rem', background: '#f3f4f6', borderRadius: 'var(--radius)', border: '1px solid var(--muted)' }}>
              <p style={{ fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--primary)' }}>RESUMEN DE CARTERA</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--muted-foreground)' }}>Total Facturado</span>
                <span style={{ fontWeight: 600 }}>${invoices.reduce((a: number, b: any) => a + b.amount, 0).toLocaleString('es-MX')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--error)' }}>
                <span>Total en Atraso</span>
                <span style={{ fontWeight: 700 }}>${delayedInvoices.reduce((a: number, b: any) => a + b.amount, 0).toLocaleString('es-MX')}</span>
              </div>
            </div>
            <PrintButton />
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          nav { display: none !important; }
          .btn { display: none !important; }
          body { background: white !important; }
          .container { padding: 0 !important; max-width: 100% !important; }
          .card { box-shadow: none !important; border: 1px solid #eee !important; }
        }
      `}} />
    </div>
  )
}

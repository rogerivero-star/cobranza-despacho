import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function InvoiceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const invoice = await prisma.invoice.findUnique({
    where: { id: parseInt(id) },
    include: { client: true }
  })

  if (!invoice) notFound()

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Detalle de Facturación</h1>
          <p style={{ color: 'var(--muted-foreground)' }}>Expediente: {invoice.client.name}</p>
        </div>
        <Link href="/" style={{ fontSize: '0.875rem' }}>← Volver al Dashboard</Link>
      </div>

      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
          <div>
            <h3 style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>INFORMACIÓN CLIENTE</h3>
            <p style={{ fontWeight: 700, fontSize: '1.25rem' }}>{invoice.client.name}</p>
          </div>
          <div>
            <h3 style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>ESTADO DE PAGO</h3>
            <span style={{ 
              backgroundColor: invoice.isPaid ? 'var(--success)' : 'var(--warning)', 
              color: 'white', 
              padding: '0.25rem 0.75rem', 
              borderRadius: '20px', 
              fontSize: '0.75rem',
              fontWeight: 700
            }}>
              {invoice.isPaid ? 'LIQUIDADA' : 'PENDIENTE'}
            </span>
          </div>
          <hr style={{ gridColumn: 'span 2', border: 0, borderTop: '1px solid var(--muted)', margin: '1rem 0' }} />
          <div>
            <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>Monto de Honorarios</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>${invoice.amount.toLocaleString('es-MX')}</p>
          </div>
          <div>
            <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>Número de Factura</p>
            <p style={{ fontWeight: 600 }}>{invoice.noInvoice ? 'Pago sin factura' : (invoice.invoiceNumber || '---')}</p>
          </div>
          <div>
            <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>Fecha de Emisión</p>
            <p>{invoice.issueDate.toLocaleDateString('es-MX')}</p>
          </div>
          <div>
            <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>Factura Elaborada</p>
            <p>{invoice.isPrepared ? 'Sí' : 'No'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

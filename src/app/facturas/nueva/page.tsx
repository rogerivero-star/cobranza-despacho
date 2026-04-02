'use client'

import { createInvoice } from '@/app/actions'
import { useState } from 'react'

export default function NewInvoicePage() {
  const [noInvoice, setNoInvoice] = useState(false)

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Nuevo Registro de Cobranza</h1>
        <p style={{ color: 'var(--muted-foreground)' }}>Ingrese los detalles de la facturación o pago</p>
      </div>

      <div className="card">
        <form action={createInvoice}>
          <div className="form-group">
            <label htmlFor="clientName">Nombre del Cliente</label>
            <input type="text" id="clientName" name="clientName" placeholder="Ej: Corporativo Jurídico S.A." required />
          </div>

          <div className="form-group">
            <label htmlFor="amount">Monto de Honorarios (MXN)</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 600 }}>$</span>
              <input type="number" step="0.01" id="amount" name="amount" style={{ paddingLeft: '2rem' }} placeholder="0.00" required />
            </div>
          </div>

          <div className="form-group" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: '#f9fafb',
            borderRadius: 'var(--radius)'
          }}>
            <input 
              type="checkbox" 
              id="noInvoice" 
              name="noInvoice" 
              checked={noInvoice} 
              onChange={(e) => setNoInvoice(e.target.checked)}
              style={{ width: '18px', height: '18px' }}
            />
            <label htmlFor="noInvoice" style={{ margin: 0, fontWeight: 600 }}>Pago sin factura</label>
          </div>

          {!noInvoice && (
            <>
              <div className="form-group">
                <label htmlFor="invoiceNumber">Número de Factura</label>
                <input type="text" id="invoiceNumber" name="invoiceNumber" placeholder="Ej: F-2024-001" required={!noInvoice} />
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <input type="checkbox" id="isPrepared" name="isPrepared" style={{ width: '18px', height: '18px' }} />
                <label htmlFor="isPrepared" style={{ margin: 0 }}>Factura Elaborada (Sí)</label>
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="issueDate">Fecha de Emisión</label>
            <input type="date" id="issueDate" name="issueDate" defaultValue={new Date().toISOString().split('T')[0]} />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '1rem' }}>
              Guardar Registro
            </button>
            <button type="button" onClick={() => window.history.back()} className="btn" style={{ 
              flex: 1, 
              border: '1px solid var(--muted)',
              backgroundColor: 'white'
            }}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

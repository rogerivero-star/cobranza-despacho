'use client'

import { markAsPaid } from '@/app/actions'
import { useState } from 'react'

export default function MarkAsPaidButton({ invoiceId }: { invoiceId: number }) {
  const [loading, setLoading] = useState(false)

  const handleMarkAsPaid = async () => {
    if (!confirm('¿Confirma que este monto ha sido pagado?')) return
    
    setLoading(true)
    try {
      await markAsPaid(invoiceId)
    } catch (error) {
      alert('Error al actualizar el estado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={handleMarkAsPaid} 
      disabled={loading}
      className="btn"
      style={{ 
        padding: '0.25rem 0.75rem', 
        fontSize: '0.75rem', 
        backgroundColor: '#dcfce7', 
        color: '#166534',
        border: '1px solid #166534',
        borderRadius: '4px'
      }}
    >
      {loading ? '...' : 'Marcar Pagada'}
    </button>
  )
}

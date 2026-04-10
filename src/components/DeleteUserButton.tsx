'use client'

import { deleteUser } from '@/app/actions'
import { useState } from 'react'

export default function DeleteUserButton({ userId, username }: { userId: number, username: string }) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (username === 'admin') return
    if (!confirm(`¿Estás seguro de que deseas eliminar al usuario "${username}"?`)) return
    
    setLoading(true)
    try {
      await deleteUser(userId)
    } catch (error: any) {
      alert(error.message || 'Error al eliminar usuario')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={handleDelete} 
      disabled={loading || username === 'admin'}
      style={{ 
        padding: '0.4rem 0.8rem', 
        fontSize: '0.75rem', 
        backgroundColor: '#fee2e2', 
        color: '#991b1b',
        border: '1px solid #f87171',
        borderRadius: '6px',
        opacity: (loading || username === 'admin') ? 0.5 : 1,
        cursor: (loading || username === 'admin') ? 'not-allowed' : 'pointer'
      }}
    >
      {loading ? '...' : 'Eliminar'}
    </button>
  )
}

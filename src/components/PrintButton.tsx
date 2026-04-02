'use client'

export default function PrintButton() {
  return (
    <button 
      className="btn btn-primary" 
      style={{ width: '100%', marginTop: '1rem' }}
      onClick={() => window.print()}
    >
      Descargar / Imprimir Reporte
    </button>
  )
}

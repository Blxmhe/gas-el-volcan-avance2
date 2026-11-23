import { Alert, Spinner } from 'react-bootstrap'

// Muestra "Cargando…" o el error mientras llegan los datos del backend.
// Si no hay nada que mostrar (ya cargó y no hubo error), no dibuja nada.
function EstadoCarga({ cargando, error, textoCargando = 'Cargando…' }) {
  if (cargando) {
    return (
      <div className="d-flex align-items-center gap-2 text-muted my-4" role="status">
        <Spinner animation="border" size="sm" /> <span>{textoCargando}</span>
      </div>
    )
  }
  if (error) {
    return (
      <Alert variant="danger" className="my-3">
        {error}
      </Alert>
    )
  }
  return null
}

export default EstadoCarga

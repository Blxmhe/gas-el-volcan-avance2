import { Badge } from 'react-bootstrap'

// Color de cada estado del pedido
const COLORES = { PENDIENTE: 'warning', ENTREGADO: 'success', CANCELADO: 'secondary' }

// Etiqueta de color con el estado del pedido (PENDIENTE / ENTREGADO / CANCELADO)
function EstadoPedido({ estado }) {
  return (
    <Badge bg={COLORES[estado] ?? 'dark'} text={estado === 'PENDIENTE' ? 'dark' : undefined}>
      {estado}
    </Badge>
  )
}

export default EstadoPedido

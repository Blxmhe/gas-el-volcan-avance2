import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Accordion, Button, Container, Table } from 'react-bootstrap'
import EstadoCarga from '../components/EstadoCarga'
import EstadoPedido from '../components/EstadoPedido'
import { mensajeDeError } from '../services/api'
import PedidosService from '../services/pedidosService'
import { formatearFechaHora } from '../utils/formatearFecha'
import { formatearPrecio } from '../utils/formatearPrecio'

// Los pedidos del usuario que inició sesión (GET /api/v1/pedidos/mis-pedidos)
export default function MisPedidos() {
  const [pedidos, setPedidos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true
    PedidosService.misPedidos()
      .then((lista) => {
        if (activo) setPedidos(lista)
      })
      .catch((e) => {
        if (activo) setError(mensajeDeError(e, 'No se pudieron cargar tus pedidos.'))
      })
      .finally(() => {
        if (activo) setCargando(false)
      })
    return () => {
      activo = false
    }
  }, [])

  return (
    <Container as="main" className="py-4">
      <h1>Mis pedidos</h1>

      <EstadoCarga cargando={cargando} error={error} textoCargando="Cargando tus pedidos…" />

      {!cargando && !error && pedidos.length === 0 && (
        <>
          <p>Todavía no has realizado pedidos.</p>
          <Button as={Link} to="/productos" variant="primary">
            Ver productos
          </Button>
        </>
      )}

      {pedidos.length > 0 && (
        <Accordion alwaysOpen>
          {pedidos.map((pedido) => (
            <Accordion.Item eventKey={String(pedido.id)} key={pedido.id}>
              <Accordion.Header>
                <span className="me-3">Pedido N° {pedido.id}</span>
                <span className="me-3 text-muted">{formatearFechaHora(pedido.fecha)}</span>
                <span className="me-3">
                  <EstadoPedido estado={pedido.estado} />
                </span>
                <strong>{formatearPrecio(pedido.total)}</strong>
              </Accordion.Header>
              <Accordion.Body>
                <Table responsive size="sm" className="mb-0">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Precio</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedido.detalles.map((detalle) => (
                      <tr key={detalle.codigoProducto}>
                        <td>{detalle.nombreProducto}</td>
                        <td>{formatearPrecio(detalle.precioUnitario)}</td>
                        <td>{detalle.cantidad}</td>
                        <td>{formatearPrecio(detalle.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
    </Container>
  )
}

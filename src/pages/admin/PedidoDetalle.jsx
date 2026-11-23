import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Alert, Button, Card, Table } from 'react-bootstrap'
import AdminLayout from '../../components/AdminLayout'
import EstadoCarga from '../../components/EstadoCarga'
import EstadoPedido from '../../components/EstadoPedido'
import { useAuth } from '../../context/useAuth'
import { useProductos } from '../../context/useProductos'
import { mensajeDeError } from '../../services/api'
import PedidosService from '../../services/pedidosService'
import { formatearFechaHora } from '../../utils/formatearFecha'
import { formatearPrecio } from '../../utils/formatearPrecio'

// Detalle de un pedido. Administrador y Vendedor lo ven; solo el Administrador puede
// marcarlo como entregado, cancelarlo (devuelve el stock) o eliminarlo (solo si está cancelado).
export default function PedidoDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { esAdmin } = useAuth()
  const { recargar } = useProductos()

  const [pedido, setPedido] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [errorAccion, setErrorAccion] = useState('')

  useEffect(() => {
    let activo = true
    PedidosService.obtener(id)
      .then((encontrado) => {
        if (activo) setPedido(encontrado)
      })
      .catch((e) => {
        if (activo) setError(mensajeDeError(e, 'No se pudo cargar el pedido.'))
      })
      .finally(() => {
        if (activo) setCargando(false)
      })
    return () => {
      activo = false
    }
  }, [id])

  async function cambiarEstado(estado) {
    const aviso =
      estado === 'CANCELADO'
        ? '¿Cancelar este pedido? Las unidades volverán al stock.'
        : '¿Marcar este pedido como entregado?'
    if (!window.confirm(aviso)) return
    setErrorAccion('')
    try {
      setPedido(await PedidosService.cambiarEstado(pedido.id, estado))
      // Cancelar devuelve unidades al stock: se actualiza el catálogo
      await recargar()
    } catch (e) {
      setErrorAccion(mensajeDeError(e, 'No se pudo cambiar el estado.'))
    }
  }

  async function eliminar() {
    if (!window.confirm('¿Eliminar este pedido cancelado? Esta acción no se puede deshacer.')) return
    setErrorAccion('')
    try {
      await PedidosService.eliminar(pedido.id)
      navigate('/admin/pedidos')
    } catch (e) {
      setErrorAccion(mensajeDeError(e, 'No se pudo eliminar el pedido.'))
    }
  }

  return (
    <AdminLayout>
      <h2>Detalle del pedido {pedido ? `N° ${pedido.id}` : ''}</h2>

      <EstadoCarga cargando={cargando} error={error} textoCargando="Cargando pedido…" />
      {errorAccion && <Alert variant="danger">{errorAccion}</Alert>}

      {pedido && (
        <>
          <Card className="mb-3">
            <Card.Body>
              <p className="mb-1">
                <strong>Fecha:</strong> {formatearFechaHora(pedido.fecha)}
              </p>
              <p className="mb-1">
                <strong>Cliente:</strong> {pedido.usuarioNombre} ({pedido.usuarioCorreo}) · RUN {pedido.usuarioRun}
              </p>
              <p className="mb-0">
                <strong>Estado:</strong> <EstadoPedido estado={pedido.estado} />
              </p>
            </Card.Body>
          </Card>

          <Table striped bordered responsive className="table-admin">
            <thead className="table-dark">
              <tr>
                <th>Código</th>
                <th>Producto</th>
                <th>Precio unitario</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {pedido.detalles.map((detalle) => (
                <tr key={detalle.codigoProducto}>
                  <td>{detalle.codigoProducto}</td>
                  <td>{detalle.nombreProducto}</td>
                  <td>{formatearPrecio(detalle.precioUnitario)}</td>
                  <td>{detalle.cantidad}</td>
                  <td>{formatearPrecio(detalle.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <p className="fs-5 fw-bold">Total: {formatearPrecio(pedido.total)}</p>

          <div className="d-flex gap-2 flex-wrap">
            <Button as={Link} to="/admin/pedidos" variant="outline-secondary">
              Volver a pedidos
            </Button>
            {esAdmin && pedido.estado === 'PENDIENTE' && (
              <>
                <Button variant="success" onClick={() => cambiarEstado('ENTREGADO')}>
                  Marcar como entregado
                </Button>
                <Button variant="warning" onClick={() => cambiarEstado('CANCELADO')}>
                  Cancelar pedido
                </Button>
              </>
            )}
            {esAdmin && pedido.estado === 'CANCELADO' && (
              <Button variant="danger" onClick={eliminar}>
                Eliminar pedido
              </Button>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  )
}

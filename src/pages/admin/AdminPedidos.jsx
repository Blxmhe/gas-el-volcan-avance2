import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Table } from 'react-bootstrap'
import AdminLayout from '../../components/AdminLayout'
import EstadoCarga from '../../components/EstadoCarga'
import EstadoPedido from '../../components/EstadoPedido'
import { mensajeDeError } from '../../services/api'
import PedidosService from '../../services/pedidosService'
import { formatearFechaHora } from '../../utils/formatearFecha'
import { formatearPrecio } from '../../utils/formatearPrecio'

// Lista de todos los pedidos. La pueden ver el Administrador y el Vendedor (solo lectura aquí;
// el detalle permite al Administrador cambiar el estado).
export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true
    PedidosService.listar()
      .then((lista) => {
        if (activo) setPedidos(lista)
      })
      .catch((e) => {
        if (activo) setError(mensajeDeError(e, 'No se pudieron cargar los pedidos.'))
      })
      .finally(() => {
        if (activo) setCargando(false)
      })
    return () => {
      activo = false
    }
  }, [])

  return (
    <AdminLayout>
      <h2>Pedidos</h2>
      <p className="text-muted">Pedidos creados desde el carrito de compras.</p>

      <EstadoCarga cargando={cargando} error={error} textoCargando="Cargando pedidos…" />

      {!cargando && !error && pedidos.length === 0 && <p>Todavía no hay pedidos.</p>}

      {pedidos.length > 0 && (
        <Table striped bordered hover responsive className="table-admin mt-3">
          <thead className="table-dark">
            <tr>
              <th>N°</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Estado</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id}>
                <td>{pedido.id}</td>
                <td>{formatearFechaHora(pedido.fecha)}</td>
                <td>{pedido.usuarioNombre}</td>
                <td>
                  <EstadoPedido estado={pedido.estado} />
                </td>
                <td>{formatearPrecio(pedido.total)}</td>
                <td>
                  <Button as={Link} to={`/admin/pedidos/${pedido.id}`} variant="outline-primary" size="sm">
                    Ver detalle
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </AdminLayout>
  )
}

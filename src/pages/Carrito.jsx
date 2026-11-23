import { useState } from 'react'
import { Alert, Button, Container, Table } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import EstadoCarga from '../components/EstadoCarga'
import ImagenProducto from '../components/ImagenProducto'
import { useAuth } from '../context/useAuth'
import { useCarrito } from '../context/useCarrito'
import { useProductos } from '../context/useProductos'
import { mensajeDeError } from '../services/api'
import PedidosService from '../services/pedidosService'
import { formatearPrecio } from '../utils/formatearPrecio'
import './Carrito.css'

function Carrito() {
  const { carrito, quitarDelCarrito, actualizarCantidad, vaciarCarrito } = useCarrito()
  const { buscarProducto, recargar, cargando } = useProductos()
  const { estaAutenticado, esAdmin, esCliente } = useAuth()
  const navigate = useNavigate()
  const ubicacion = useLocation()

  // Estado del pago: pedido creado (para mostrar la confirmación), error y "procesando"
  const [pedidoCreado, setPedidoCreado] = useState(null)
  const [errorPago, setErrorPago] = useState('')
  const [procesando, setProcesando] = useState(false)

  // Solo los clientes (y el administrador) pueden comprar; el vendedor solo consulta pedidos
  const puedeComprar = esCliente || esAdmin

  // Une cada item del carrito ({ codigo, cantidad }) con los datos de su producto.
  // Si un producto ya no existe en el catálogo, se salta.
  const filas = []
  carrito.forEach((item) => {
    const producto = buscarProducto(item.codigo)
    if (producto) {
      filas.push({
        producto,
        cantidad: item.cantidad,
        subtotal: producto.precioResidencial * item.cantidad,
      })
    }
  })

  // Total a pagar: suma de los subtotales
  let total = 0
  filas.forEach((fila) => {
    total = total + fila.subtotal
  })

  // Botones − y +: cambian la cantidad y avisan si no hay stock
  function cambiarCantidad(codigo, nuevaCantidad) {
    const error = actualizarCantidad(codigo, nuevaCantidad)
    if (error) {
      alert(error)
    }
  }

  // "Pagar": crea el pedido en el backend (POST /api/v1/pedidos). El backend calcula el total,
  // revisa el stock y lo descuenta; si algo falla no se guarda nada.
  async function pagar() {
    // Sin sesión: se lleva al login y, al entrar, vuelve al carrito (el carrito no se pierde)
    if (!estaAutenticado) {
      navigate('/login', { state: { from: ubicacion } })
      return
    }

    setErrorPago('')
    setProcesando(true)
    try {
      const pedido = await PedidosService.crear(
        carrito.map(({ codigo, cantidad }) => ({ codigo, cantidad })),
      )
      vaciarCarrito()
      setPedidoCreado(pedido)
      // El stock cambió: se vuelve a pedir el catálogo para mostrar los valores nuevos
      await recargar()
    } catch (e) {
      setErrorPago(mensajeDeError(e, 'No se pudo crear el pedido.'))
      // Si el problema fue el stock, se actualiza el catálogo para ver lo disponible hoy
      await recargar()
    } finally {
      setProcesando(false)
    }
  }

  // Confirmación después de pagar
  if (pedidoCreado) {
    return (
      <Container as="main" className="py-4">
        <h1>¡Pedido realizado!</h1>
        <Alert variant="success">
          Tu pedido <strong>N° {pedidoCreado.id}</strong> quedó registrado por un total de{' '}
          <strong>{formatearPrecio(pedidoCreado.total)}</strong>. Estado: {pedidoCreado.estado}.
        </Alert>
        <div className="d-flex gap-2 flex-wrap">
          <Button as={Link} to="/mis-pedidos" variant="primary">
            Ver mis pedidos
          </Button>
          <Button as={Link} to="/productos" variant="outline-primary">
            Seguir comprando
          </Button>
        </div>
      </Container>
    )
  }

  // Mientras llega el catálogo no se puede saber si los productos del carrito existen
  if (cargando && carrito.length > 0) {
    return (
      <Container as="main" className="py-4">
        <h1>Mi carrito de compras</h1>
        <EstadoCarga cargando textoCargando="Cargando tu carrito…" />
      </Container>
    )
  }

  if (filas.length === 0) {
    return (
      <Container as="main" className="py-4">
        <h1>Mi carrito de compras</h1>
        <p>Tu carrito está vacío.</p>
        <Button as={Link} to="/productos" variant="primary">
          Ver productos
        </Button>
      </Container>
    )
  }

  return (
    <Container as="main" className="py-4">
      <h1>Mi carrito de compras</h1>

      <Table responsive className="tabla-carrito">
        <thead>
          <tr>
            <th></th>
            <th>Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filas.map(({ producto, cantidad, subtotal }) => (
            <tr key={producto.codigo}>
              <td>
                <ImagenProducto producto={producto} className="imagen-carrito" />
              </td>
              <td>{producto.nombre}</td>
              <td>{formatearPrecio(producto.precioResidencial)}</td>
              <td className="text-nowrap">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => cambiarCantidad(producto.codigo, cantidad - 1)}
                >
                  −
                </Button>
                <span className="cantidad">{cantidad}</span>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => cambiarCantidad(producto.codigo, cantidad + 1)}
                >
                  +
                </Button>
              </td>
              <td>{formatearPrecio(subtotal)}</td>
              <td>
                <Button
                  variant="outline-primary"
                  onClick={() => quitarDelCarrito(producto.codigo)}
                >
                  Quitar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <p className="total-carrito">Total: {formatearPrecio(total)}</p>

      {errorPago && (
        <Alert variant="danger" role="alert">
          {errorPago}
        </Alert>
      )}
      {estaAutenticado && !puedeComprar && (
        <Alert variant="warning">Tu tipo de usuario no puede realizar compras.</Alert>
      )}
      {!estaAutenticado && (
        <p className="text-muted">Para pagar tienes que iniciar sesión (tu carrito se conserva).</p>
      )}

      <Button
        type="button"
        variant="primary"
        onClick={pagar}
        disabled={procesando || (estaAutenticado && !puedeComprar)}
      >
        {procesando ? 'Procesando…' : 'Pagar'}
      </Button>
    </Container>
  )
}

export default Carrito

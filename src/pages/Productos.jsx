import { useState, useEffect } from 'react'
import { Col, Container, Row, Spinner, Alert } from 'react-bootstrap'
import TarjetaProducto from '../components/TarjetaProducto'

function Productos() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const cargarDatos = () => {
    setCargando(true)
    setError(null)
    
    fetch('http://localhost:5000/api/productos')
      .then(res => {
        if (!res.ok) throw new Error('Error del servidor')
        return res.json()
      })
      .then(data => {
        // ✅ Adaptamos los datos para que coincidan con TarjetaProducto
        const adaptados = data.map(p => ({
          ...p,
          codigo: p._id,              // _id (MongoDB) -> codigo (TarjetaProducto)
          precioResidencial: p.precios ? p.precios.residencial : 0,
          precioComercial: p.precios ? p.precios.comercial : 0
        }))
        setProductos(adaptados)
        setCargando(false)
      })
      .catch(err => {
        console.error('Error:', err)
        setError('No se pudo conectar con la base de datos. ¿El servidor está corriendo?')
        setCargando(false)
      })
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  if (cargando) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Cargando productos desde MongoDB...</p>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <h4>⚠️ Error de conexión</h4>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={cargarDatos}>
            Reintentar conexión
          </button>
        </Alert>
      </Container>
    )
  }

  return (
    <Container as="main" className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Nuestros Productos</h1>
        <button className="btn btn-outline-secondary btn-sm" onClick={cargarDatos}>
          🔄 Actualizar
        </button>
      </div>

      <Row xs={1} sm={2} md={3} lg={4} className="g-3">
        {productos.map(producto => (
          <Col key={producto.codigo}>
            <TarjetaProducto producto={producto} />
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default Productos
import { useState, useEffect } from 'react'
import { Button, Col, Container, Row, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import TarjetaProducto from '../components/TarjetaProducto'

function Home() {
  const [destacados, setDestacados] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    fetch('http://localhost:5000/api/productos')
      .then(res => res.json())
      .then(data => {
        // ✅ Adaptamos los datos igual que en Productos
        const adaptados = data.map(p => ({
          ...p,
          codigo: p._id,
          precioResidencial: p.precios ? p.precios.residencial : 0,
          precioComercial: p.precios ? p.precios.comercial : 0
        }))
        // Mostramos los primeros 4 como "destacados"
        setDestacados(adaptados.slice(0, 4))
        setCargando(false)
      })
      .catch(err => {
        console.error('Error:', err)
        setCargando(false)
      })
  }, [])

  if (cargando) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    )
  }

  return (
    <Container as="main" className="py-4">
      <section className="hero text-center py-5">
        <h1>Bienvenido a Distribuidora de gas "El Volcán"</h1>
        <p>
          Cilindros de gas, reguladores, mangueras y accesorios, con despacho a
          domicilio en Chillán y alrededores.
        </p>
        <Button as={Link} to="/productos" variant="primary">
          Ver productos
        </Button>
      </section>

      <h2 className="my-4">Productos destacados</h2>
      <Row xs={1} sm={2} md={3} lg={4} className="g-3">
        {destacados.map((producto) => (
          <Col key={producto.codigo}>
            <TarjetaProducto producto={producto} />
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default Home
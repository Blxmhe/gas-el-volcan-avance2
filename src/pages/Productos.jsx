import { Col, Container, Row } from 'react-bootstrap'
import TarjetaProducto from '../components/TarjetaProducto'
import EstadoCarga from '../components/EstadoCarga'
import { useProductos } from '../context/useProductos'

function Productos() {
  const { productos, cargando, error } = useProductos()
  return (
    <Container as="main" className="py-4">
      <h1 className="mb-4">Nuestros Productos</h1>

      <EstadoCarga cargando={cargando} error={error} textoCargando="Cargando productos…" />

      <Row xs={1} sm={2} md={3} lg={4} className="g-3">
        {productos.map((producto) => (
          <Col key={producto.codigo}>
            <TarjetaProducto producto={producto} />
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default Productos

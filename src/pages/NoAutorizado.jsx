import { Button, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'

// Se muestra cuando alguien con sesión intenta abrir una página que su rol no permite
export default function NoAutorizado() {
  return (
    <Container as="main" className="py-5 text-center">
      <h1>Acceso no autorizado</h1>
      <p className="text-muted">Tu tipo de usuario no tiene permiso para ver esta página.</p>
      <Button as={Link} to="/" variant="primary">
        Volver al inicio
      </Button>
    </Container>
  )
}

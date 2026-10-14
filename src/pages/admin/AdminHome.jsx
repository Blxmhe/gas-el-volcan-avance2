// src/pages/admin/AdminHome.jsx
import { Row, Col, Card } from 'react-bootstrap';
import AdminLayout from '../../components/AdminLayout';

export default function AdminHome({ setPagina }) {
  return (
    <AdminLayout paginaActual="admin-home" setPagina={setPagina}>
      <h2>Dashboard de Administración</h2>
      <p className="text-muted">Resumen general del sistema</p>

      <Row className="g-4 mt-2">
        <Col md={6}>
          <Card className="shadow-sm border-primary">
            <Card.Body>
              <Card.Title>Total de Productos</Card.Title>
              <h3 className="display-6 text-primary">5</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm border-success">
            <Card.Body>
              <Card.Title>Total de Usuarios</Card.Title>
              <h3 className="display-6 text-success">3</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </AdminLayout>
  );
}
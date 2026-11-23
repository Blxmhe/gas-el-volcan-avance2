import { useEffect, useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import AdminLayout from '../../components/AdminLayout';
import EstadoCarga from '../../components/EstadoCarga';
import { useProductos } from '../../context/useProductos';
import { mensajeDeError } from '../../services/api';
import BlogsService from '../../services/blogsService';
import PedidosService from '../../services/pedidosService';
import UsuariosService from '../../services/usuariosService';

// Dashboard del Administrador: cuántos registros hay de cada tipo (se piden al backend).
// El Vendedor no llega aquí: App.jsx lo manda directo a la lista de pedidos.
export default function AdminHome() {
  const { productos } = useProductos();
  const [totales, setTotales] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;
    Promise.all([UsuariosService.listar(), PedidosService.listar(), BlogsService.listar()])
      .then(([usuarios, pedidos, blogs]) => {
        if (activo) setTotales({ usuarios: usuarios.length, pedidos: pedidos.length, blogs: blogs.length });
      })
      .catch((e) => {
        if (activo) setError(mensajeDeError(e, 'No se pudieron cargar los totales.'));
      });
    // Si el usuario sale de la página antes de que respondan, se ignora la respuesta
    return () => {
      activo = false;
    };
  }, []);

  // Tarjeta con un número grande
  const tarjeta = (titulo, valor, color) => (
    <Col md={6} lg={3}>
      <Card className={`shadow-sm border-${color} h-100`}>
        <Card.Body>
          <Card.Title>{titulo}</Card.Title>
          <h3 className={`display-6 text-${color}`}>{valor}</h3>
        </Card.Body>
      </Card>
    </Col>
  );

  return (
    <AdminLayout paginaActual="admin-home">
      <h2>Dashboard de Administración</h2>
      <p className="text-muted">Resumen general del sistema</p>

      <EstadoCarga cargando={!totales && !error} error={error} />

      <Row className="g-4 mt-2">
        {tarjeta('Total de Productos', productos.length, 'primary')}
        {totales && tarjeta('Total de Usuarios', totales.usuarios, 'success')}
        {totales && tarjeta('Total de Pedidos', totales.pedidos, 'warning')}
        {totales && tarjeta('Total de Blogs', totales.blogs, 'info')}
      </Row>
    </AdminLayout>
  );
}

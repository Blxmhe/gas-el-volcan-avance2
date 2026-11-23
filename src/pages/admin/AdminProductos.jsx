import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Table, Button } from 'react-bootstrap';
import AdminLayout from '../../components/AdminLayout';
import EstadoCarga from '../../components/EstadoCarga';
import { useAuth } from '../../context/useAuth';
import { useProductos } from '../../context/useProductos';
import { mensajeDeError } from '../../services/api';
import ProductosService from '../../services/productosService';

// Lista de productos. El Administrador puede crear, editar y eliminar;
// el Vendedor solo puede ver la lista y abrir el detalle de cada producto.
export default function AdminProductos() {
  const { productos, cargando, error, recargar } = useProductos();
  const { esAdmin } = useAuth();
  const [errorAccion, setErrorAccion] = useState('');

  async function eliminar(producto) {
    if (!window.confirm(`¿Eliminar el producto "${producto.nombre}"? Esta acción no se puede deshacer.`)) return;
    setErrorAccion('');
    try {
      await ProductosService.eliminar(producto.codigo);
      await recargar();
    } catch (e) {
      // Por ejemplo 409: el producto ya está en pedidos y no se puede borrar
      setErrorAccion(mensajeDeError(e, 'No se pudo eliminar el producto.'));
    }
  }

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <h2 className="mb-0">{esAdmin ? 'Gestión de Productos' : 'Productos'}</h2>
        {esAdmin && (
          <Button as={Link} to="/admin/productos/nuevo" variant="primary">
            Nuevo producto
          </Button>
        )}
      </div>

      <EstadoCarga cargando={cargando} error={error} textoCargando="Cargando productos…" />
      {errorAccion && (
        <Alert variant="danger" className="mt-3" dismissible onClose={() => setErrorAccion('')}>
          {errorAccion}
        </Alert>
      )}

      <Table striped bordered hover responsive className="table-admin mt-3">
        <thead className="table-dark">
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((prod) => (
            <tr key={prod.codigo}>
              <td>{prod.codigo}</td>
              <td>{prod.nombre}</td>
              <td>${Number(prod.precioResidencial).toLocaleString('es-CL')}</td>
              <td>{prod.stock}</td>
              <td className="text-nowrap">
                {esAdmin ? (
                  <>
                    <Button
                      as={Link}
                      to={`/admin/productos/editar/${prod.codigo}`}
                      variant="warning"
                      size="sm"
                      className="me-2"
                    >
                      Editar
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => eliminar(prod)}>
                      Eliminar
                    </Button>
                  </>
                ) : (
                  <Button as={Link} to={`/productos/${prod.codigo}`} variant="outline-primary" size="sm">
                    Ver detalle
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </AdminLayout>
  );
}

import { Table, Button } from 'react-bootstrap';
import AdminLayout from '../../components/AdminLayout';
import { productos } from '../../data/productos';

export default function AdminProductos() {
  return (
    <AdminLayout>
      <h2>Gestión de Productos</h2>
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
              <td>${prod.precioResidencial.toLocaleString('es-CL')}</td>
              <td>{prod.stock}</td>
              <td>
                <Button variant="warning" size="sm">
                  Editar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </AdminLayout>
  );
}
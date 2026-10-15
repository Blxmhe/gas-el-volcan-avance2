// src/pages/admin/AdminUsuarios.jsx
import { Table, Button } from 'react-bootstrap';
import AdminLayout from '../../components/AdminLayout';
import { usuariosPrueba } from '../../data/usuarios';

export default function AdminUsuarios() {
  return (
    <AdminLayout paginaActual="admin-usuarios">
      <h2>Gestión de Usuarios</h2>
      <Table striped bordered hover responsive className="table-admin mt-3">
        <thead className="table-dark">
          <tr>
            <th>RUN</th>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Correo</th>
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuariosPrueba.map((usr) => (
            <tr key={usr.run}>
              <td>{usr.run}</td>
              <td>{usr.nombre}</td>
              <td>{usr.apellidos}</td>
              <td>{usr.correo}</td>
              <td>{usr.tipo}</td>
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
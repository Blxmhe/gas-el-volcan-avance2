// src/pages/admin/AdminUsuarios.jsx
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Table, Button } from 'react-bootstrap';
import AdminLayout from '../../components/AdminLayout';
import EstadoCarga from '../../components/EstadoCarga';
import { mensajeDeError } from '../../services/api';
import UsuariosService from '../../services/usuariosService';

// Lista de usuarios (solo Administrador): crear, editar y eliminar
export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [errorAccion, setErrorAccion] = useState('');

  const cargar = useCallback(async () => {
    try {
      setUsuarios(await UsuariosService.listar());
      setError('');
    } catch (e) {
      setError(mensajeDeError(e, 'No se pudieron cargar los usuarios.'));
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    // Carga inicial de la lista (solo cambia estado cuando el backend responde)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargar();
  }, [cargar]);

  async function eliminar(usuario) {
    if (!window.confirm(`¿Eliminar al usuario ${usuario.nombre} ${usuario.apellidos}? Esta acción no se puede deshacer.`)) return;
    setErrorAccion('');
    try {
      await UsuariosService.eliminar(usuario.run);
      await cargar();
    } catch (e) {
      // Por ejemplo 409: es tu propio usuario, o ya tiene pedidos
      setErrorAccion(mensajeDeError(e, 'No se pudo eliminar el usuario.'));
    }
  }

  return (
    <AdminLayout paginaActual="admin-usuarios">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <h2 className="mb-0">Gestión de Usuarios</h2>
        <Button as={Link} to="/admin/usuarios/nuevo" variant="primary">
          Nuevo usuario
        </Button>
      </div>

      <EstadoCarga cargando={cargando} error={error} textoCargando="Cargando usuarios…" />
      {errorAccion && (
        <Alert variant="danger" className="mt-3" dismissible onClose={() => setErrorAccion('')}>
          {errorAccion}
        </Alert>
      )}

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
          {usuarios.map((usr) => (
            <tr key={usr.run}>
              <td>{usr.run}</td>
              <td>{usr.nombre}</td>
              <td>{usr.apellidos}</td>
              <td>{usr.correo}</td>
              <td>{usr.tipoUsuario}</td>
              <td className="text-nowrap">
                <Button
                  as={Link}
                  to={`/admin/usuarios/editar/${usr.run}`}
                  variant="warning"
                  size="sm"
                  className="me-2"
                >
                  Editar
                </Button>
                <Button variant="danger" size="sm" onClick={() => eliminar(usr)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </AdminLayout>
  );
}

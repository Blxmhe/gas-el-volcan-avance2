import React from 'react';
import { obtenerUsuarios } from '../../data/usuarios';

const AdminUsuarios = () => {
  // Obtenemos la lista de usuarios dinámicamente
  const usuarios = obtenerUsuarios ? obtenerUsuarios() : [];

  return (
    <div className="container py-4">
      <h2 className="mb-4">Gestión de Usuarios</h2>
      
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length > 0 ? (
                  usuarios.map((usuario) => (
                    <tr key={usuario.id}>
                      <td>{usuario.id}</td>
                      <td>{usuario.nombre || usuario.name}</td>
                      <td>{usuario.email}</td>
                      <td>
                        <span className={`badge ${usuario.rol === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                          {usuario.rol || 'Usuario'}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-success">Activo</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-3">
                      No hay usuarios registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsuarios;
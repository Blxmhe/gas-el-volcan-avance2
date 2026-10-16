import React from 'react';
import { Link } from 'react-router-dom';
import { productos } from '../data/productos';
import { obtenerUsuarios } from '../data/usuarios';

const AdminHome = () => {
  // Obtenemos los conteos dinámicos
  const totalProductos = productos ? productos.length : 0;
  const totalUsuarios = obtenerUsuarios ? obtenerUsuarios().length : 0;

  return (
    <div className="container py-4">
      <h2 className="mb-4">Panel de Administración</h2>
      
      <div className="row g-4 mb-4">
        {/* Tarjeta de Productos */}
        <div className="col-md-6">
          <div className="card text-white bg-primary shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Total de Productos</h5>
              <p className="display-4 fw-bold my-2">{totalProductos}</p>
              <p className="card-text">Productos registrados en el catálogo actual.</p>
            </div>
            <div className="card-footer bg-transparent border-top-0">
              <Link to="/admin/productos" className="btn btn-light text-primary fw-semibold">
                Gestionar Productos
              </Link>
            </div>
          </div>
        </div>

        {/* Tarjeta de Usuarios */}
        <div className="col-md-6">
          <div className="card text-white bg-success shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Total de Usuarios</h5>
              <p className="display-4 fw-bold my-2">{totalUsuarios}</p>
              <p className="card-text">Usuarios registrados en el sistema.</p>
            </div>
            <div className="card-footer bg-transparent border-top-0">
              <Link to="/admin/usuarios" className="btn btn-light text-success fw-semibold">
                Gestionar Usuarios
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
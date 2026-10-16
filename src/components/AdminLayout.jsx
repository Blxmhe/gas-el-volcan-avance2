import React from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { logout } from '../data/usuarios';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-layout d-flex" style={{ minHeight: '100vh' }}>
      {/* Barra lateral / Sidebar */}
      <aside className="admin-sidebar bg-dark text-white p-3" style={{ width: '250px' }}>
        <h4 className="mb-4 text-center fw-bold text-primary">Panel Admin</h4>
        
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item mb-1">
            <NavLink 
              to="/admin" 
              end 
              className={({ isActive }) => `nav-link text-white ${isActive ? 'active bg-primary' : ''}`}
            >
              <i className="bi bi-speedometer2 me-2"></i>
              Dashboard
            </NavLink>
          </li>
          <li className="nav-item mb-1">
            <NavLink 
              to="/admin/productos" 
              className={({ isActive }) => `nav-link text-white ${isActive ? 'active bg-primary' : ''}`}
            >
              <i className="bi bi-box-seam me-2"></i>
              Productos
            </NavLink>
          </li>
          <li className="nav-item mb-1">
            <NavLink 
              to="/admin/usuarios" 
              className={({ isActive }) => `nav-link text-white ${isActive ? 'active bg-primary' : ''}`}
            >
              <i className="bi bi-people me-2"></i>
              Usuarios
            </NavLink>
          </li>
        </ul>

        <hr className="bg-secondary" />

        {/* Enlaces de Ver sitio y Cerrar sesión */}
        <div className="d-grid gap-2">
          <Link to="/" className="btn btn-outline-light btn-sm text-start">
            <i className="bi bi-house-door me-2"></i>
            Ver sitio
          </Link>
          <button onClick={handleLogout} className="btn btn-outline-danger btn-sm text-start">
            <i className="bi bi-box-arrow-right me-2"></i>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido principal del panel */}
      <main className="admin-content flex-grow-1 p-4 bg-light">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
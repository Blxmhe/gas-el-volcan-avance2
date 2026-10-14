// src/components/AdminLayout.jsx
import React from 'react';
import '../styles/admin.css';

export default function AdminLayout({ children, paginaActual, setPagina }) {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h4>Panel Admin</h4>
        <ul className="admin-menu">
          <li>
            <button
              className={paginaActual === 'admin-home' ? 'active' : ''}
              onClick={() => setPagina('admin-home')}
            >
              Dashboard
            </button>
          </li>
          <li>
            <button
              className={paginaActual === 'admin-productos' ? 'active' : ''}
              onClick={() => setPagina('admin-productos')}
            >
              Productos
            </button>
          </li>
          <li>
            <button
              className={paginaActual === 'admin-usuarios' ? 'active' : ''}
              onClick={() => setPagina('admin-usuarios')}
            >
              Usuarios
            </button>
          </li>
        </ul>
      </aside>
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}
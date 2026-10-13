// src/App.jsx
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// Importación de las páginas creadas
import Nosotros from './pages/Nosotros';
import Blogs from './pages/Blogs';
import BlogDetalle1 from './pages/BlogDetalle1';
import BlogDetalle2 from './pages/BlogDetalle2';
import AdminHome from './pages/admin/AdminHome';
import AdminProductos from './pages/admin/AdminProductos';
import AdminUsuarios from './pages/admin/AdminUsuarios';

export default function App() {
  const [pagina, setPagina] = useState('nosotros');

  const renderPagina = () => {
    switch (pagina) {
      case 'nosotros':
        return <Nosotros />;
      case 'blogs':
        return <Blogs setPagina={setPagina} />;
      case 'blog-detalle-1':
        return <BlogDetalle1 setPagina={setPagina} />;
      case 'blog-detalle-2':
        return <BlogDetalle2 setPagina={setPagina} />;
      case 'admin-home':
        return <AdminHome setPagina={setPagina} />;
      case 'admin-productos':
        return <AdminProductos setPagina={setPagina} />;
      case 'admin-usuarios':
        return <AdminUsuarios setPagina={setPagina} />;
      default:
        return <Nosotros />;
    }
  };

  return (
    <div>
      {/* Menú de navegación rápido para probar todas tus vistas */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3 mb-3">
        <span className="navbar-brand">Gas El Volcán</span>
        <div className="navbar-nav">
          <button className="nav-link btn btn-link" onClick={() => setPagina('nosotros')}>Nosotros</button>
          <button className="nav-link btn btn-link" onClick={() => setPagina('blogs')}>Blogs</button>
          <button className="nav-link btn btn-link text-warning" onClick={() => setPagina('admin-home')}>Panel Admin</button>
        </div>
      </nav>

      {/* Renderizado de la vista según la página activa */}
      {renderPagina()}
    </div>
  );
}
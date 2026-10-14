import React from 'react';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Contexto y Componentes compartidos del equipo
import { CarritoProvider } from './context/CarritoContext';
import Menu from './components/Menu';
import PiePagina from './components/PiePagina';

// Páginas principales y del equipo
import Home from './pages/Home';
import ProductoDetalle from './pages/ProductoDetalle';

// Tus Importaciones (Institucional, Blog y Admin)
import Nosotros from './pages/Nosotros';
import Blogs from './pages/Blogs';
import BlogDetalle1 from './pages/BlogDetalle1';
import BlogDetalle2 from './pages/BlogDetalle2';
import AdminHome from './pages/admin/AdminHome';
import AdminProductos from './pages/admin/AdminProductos';
import AdminUsuarios from './pages/admin/AdminUsuarios';

export default function App() {
  return (
    <CarritoProvider>
      <Menu />
      
      <main className="container my-4">
        <Routes>
          {/* Rutas compartidas de tu equipo */}
          <Route path="/" element={<Home />} />
          <Route path="/producto/:id" element={<ProductoDetalle />} />

          {/* Tus Rutas */}
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/1" element={<BlogDetalle1 />} />
          <Route path="/blogs/2" element={<BlogDetalle2 />} />
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/admin/productos" element={<AdminProductos />} />
          <Route path="/admin/usuarios" element={<AdminUsuarios />} />
        </Routes>
      </main>

      <PiePagina />
    </CarritoProvider>
  );
}
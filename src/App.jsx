import { Routes, Route } from 'react-router-dom';

// Componentes generales
import Home from './pages/Home';
import Blogs from './pages/Blogs';
import BlogDetalle1 from './pages/BlogDetalle1';
import BlogDetalle2 from './pages/BlogDetalle2';

// Componentes de Administración
import AdminLayout from './components/AdminLayout';
import AdminProductos from './pages/admin/AdminProductos';
import AdminUsuarios from './pages/admin/AdminUsuarios';

function App() {
  return (
    <Routes>
      {/* Rutas Principales */}
      <Route path="/" element={<Home />} />
      <Route path="/blogs" element={<Blogs />} />

      {/* Punto 1: Rutas de detalle de Blogs */}
      <Route path="/blogs/1" element={<BlogDetalle1 />} />
      <Route path="/blogs/2" element={<BlogDetalle2 />} />

      {/* Punto 1: Rutas del Panel de Administración */}
      <Route path="/admin" element={<AdminLayout />} />
      <Route path="/admin/productos" element={<AdminProductos />} />
      <Route path="/admin/usuarios" element={<AdminUsuarios />} />
    </Routes>
  );
}

export default App;
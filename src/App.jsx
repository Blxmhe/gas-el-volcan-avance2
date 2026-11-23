import { Navigate, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import { CarritoProvider } from './context/CarritoContext'
import { ProductosProvider } from './context/ProductosProvider'
import { useAuth } from './context/useAuth'
import { ROL_ADMIN, ROL_CLIENTE, ROLES_PANEL } from './utils/roles'
import Menu from './components/Menu'
import PiePagina from './components/PiePagina'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Productos from './pages/Productos'
import ProductoDetalle from './pages/ProductoDetalle'
import Nosotros from './pages/Nosotros'
import Blogs from './pages/Blogs'
import BlogDetalle from './pages/BlogDetalle'
import Contacto from './pages/Contacto'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Carrito from './pages/Carrito'
import MisPedidos from './pages/MisPedidos'
import NoAutorizado from './pages/NoAutorizado'
import AdminHome from './pages/admin/AdminHome'
import AdminProductos from './pages/admin/AdminProductos'
import AdminUsuarios from './pages/admin/AdminUsuarios'
import AdminBlogs from './pages/admin/AdminBlogs'
import AdminPedidos from './pages/admin/AdminPedidos'
import PedidoDetalle from './pages/admin/PedidoDetalle'
import ProductoNuevo from './pages/admin/ProductoNuevo'
import ProductoEditar from './pages/admin/ProductoEditar'
import UsuarioNuevo from './pages/admin/UsuarioNuevo'
import UsuarioEditar from './pages/admin/UsuarioEditar'
import BlogNuevo from './pages/admin/BlogNuevo'
import BlogEditar from './pages/admin/BlogEditar'
import './App.css'

// Página de entrada del panel: el Administrador ve el dashboard;
// el Vendedor solo tiene productos y pedidos, así que va directo a los pedidos.
function InicioAdmin() {
  const { esVendedor } = useAuth()
  return esVendedor ? <Navigate to="/admin/pedidos" replace /> : <AdminHome />
}

// Las rutas de /admin se protegen por rol con <ProtectedRoute roles={[...]}>:
//   - Administrador: todo el panel.
//   - Vendedor: solo lista y detalle de productos, y lista y detalle de pedidos.
// El BrowserRouter vive en main.jsx
function App() {
  return (
    <AuthProvider>
      <ProductosProvider>
        <CarritoProvider>
          {/* min-vh-100 + flex-grow-1: el footer queda abajo aunque la página tenga poco contenido */}
          <div className="d-flex flex-column min-vh-100">
            <Menu />
            <div className="flex-grow-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/productos" element={<Productos />} />
                <Route path="/productos/:codigo" element={<ProductoDetalle />} />
                <Route path="/nosotros" element={<Nosotros />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/blogs/:id" element={<BlogDetalle />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Registro />} />
                <Route path="/carrito" element={<Carrito />} />
                <Route path="/no-autorizado" element={<NoAutorizado />} />

                <Route
                  path="/mis-pedidos"
                  element={
                    <ProtectedRoute roles={[ROL_CLIENTE, ROL_ADMIN]}>
                      <MisPedidos />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute roles={ROLES_PANEL}>
                      <InicioAdmin />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/productos"
                  element={
                    <ProtectedRoute roles={ROLES_PANEL}>
                      <AdminProductos />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/pedidos"
                  element={
                    <ProtectedRoute roles={ROLES_PANEL}>
                      <AdminPedidos />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/pedidos/:id"
                  element={
                    <ProtectedRoute roles={ROLES_PANEL}>
                      <PedidoDetalle />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/usuarios"
                  element={
                    <ProtectedRoute roles={[ROL_ADMIN]}>
                      <AdminUsuarios />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/blogs"
                  element={
                    <ProtectedRoute roles={[ROL_ADMIN]}>
                      <AdminBlogs />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/productos/nuevo"
                  element={
                    <ProtectedRoute roles={[ROL_ADMIN]}>
                      <ProductoNuevo />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/productos/editar/:codigo"
                  element={
                    <ProtectedRoute roles={[ROL_ADMIN]}>
                      <ProductoEditar />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/usuarios/nuevo"
                  element={
                    <ProtectedRoute roles={[ROL_ADMIN]}>
                      <UsuarioNuevo />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/usuarios/editar/:run"
                  element={
                    <ProtectedRoute roles={[ROL_ADMIN]}>
                      <UsuarioEditar />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/blogs/nuevo"
                  element={
                    <ProtectedRoute roles={[ROL_ADMIN]}>
                      <BlogNuevo />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/blogs/editar/:id"
                  element={
                    <ProtectedRoute roles={[ROL_ADMIN]}>
                      <BlogEditar />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
            <PiePagina />
          </div>
        </CarritoProvider>
      </ProductosProvider>
    </AuthProvider>
  )
}

export default App

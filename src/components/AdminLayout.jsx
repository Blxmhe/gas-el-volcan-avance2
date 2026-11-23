import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import '../styles/admin.css';

// Marco del panel de administración (menú lateral + contenido).
// Quién puede entrar lo decide ProtectedRoute en App.jsx; aquí solo se decide
// qué enlaces ve cada rol:
//   - Administrador: Dashboard, Productos, Usuarios, Blogs y Pedidos.
//   - Vendedor: solo Productos (lista y detalle) y Pedidos (lista y detalle).
export default function AdminLayout({ children }) {
  const { esAdmin } = useAuth();

  const claseActiva = ({ isActive }) => (isActive ? 'active' : '');

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h4>Panel Admin</h4>
        <ul className="admin-menu">
          {esAdmin && (
            <li>
              <NavLink to="/admin" end className={claseActiva}>
                Dashboard
              </NavLink>
            </li>
          )}
          <li>
            <NavLink to="/admin/productos" className={claseActiva}>
              Productos
            </NavLink>
          </li>
          {esAdmin && (
            <li>
              <NavLink to="/admin/usuarios" className={claseActiva}>
                Usuarios
              </NavLink>
            </li>
          )}
          {esAdmin && (
            <li>
              <NavLink to="/admin/blogs" className={claseActiva}>
                Blogs
              </NavLink>
            </li>
          )}
          <li>
            <NavLink to="/admin/pedidos" className={claseActiva}>
              Pedidos
            </NavLink>
          </li>
        </ul>
      </aside>
      <main className="admin-content">
        {children || <Outlet />}
      </main>
    </div>
  );
}

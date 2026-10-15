import { NavLink, Outlet } from 'react-router-dom';
import '../styles/admin.css';

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h4>Panel Admin</h4>
        <ul className="admin-menu">
          <li>
            <NavLink
              to="/admin"
              end
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/productos"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Productos
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/usuarios"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Usuarios
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
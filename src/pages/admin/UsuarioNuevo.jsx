// src/pages/admin/UsuarioNuevo.jsx
// Página para crear un usuario: usa el formulario y guarda con el servicio.

import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/AdminLayout'
import UsuarioForm from '../../components/UsuarioForm'
import { agregarUsuario } from '../../services/usuariosService'

export default function UsuarioNuevo() {
  const navigate = useNavigate()

  // Se ejecuta cuando el formulario ya validó los datos
  const manejarGuardar = (usuario) => {
    agregarUsuario(usuario)
    navigate('/admin/usuarios')
  }

  return (
    <AdminLayout>
      <h2>Nuevo Usuario</h2>
      <div className="mt-3 col-12 col-md-10 col-lg-6">
        <UsuarioForm onGuardar={manejarGuardar} />
      </div>
    </AdminLayout>
  )
}
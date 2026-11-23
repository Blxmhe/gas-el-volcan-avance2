// src/pages/admin/UsuarioNuevo.jsx
// Página para crear un usuario: usa el formulario y lo guarda en el backend (POST /api/v1/usuarios).
// El RUN se valida con validarRUN (dígito verificador), hecho por B.

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert } from 'react-bootstrap'
import AdminLayout from '../../components/AdminLayout'
import UsuarioForm from '../../components/UsuarioForm'
import { mensajeDeError } from '../../services/api'
import UsuariosService from '../../services/usuariosService'
import { validarRUN } from '../../utils/validacionRun'

export default function UsuarioNuevo() {
  const navigate = useNavigate()
  const [errorGuardado, setErrorGuardado] = useState('')
  // Usuarios actuales: el formulario los usa para avisar si el RUN o el correo ya existen
  const [usuarios, setUsuarios] = useState([])

  useEffect(() => {
    UsuariosService.listar()
      .then(setUsuarios)
      .catch(() => {
        // Si falla, el backend igual rechaza los duplicados con un 409
      })
  }, [])

  // Se ejecuta cuando el formulario ya validó los datos
  const manejarGuardar = async (usuario) => {
    try {
      await UsuariosService.crear(usuario)
      navigate('/admin/usuarios')
    } catch (e) {
      // 409 = RUN o correo repetidos (el backend es la última barrera)
      setErrorGuardado(mensajeDeError(e, 'No se pudo guardar el usuario.'))
    }
  }

  return (
    <AdminLayout>
      <h2>Nuevo Usuario</h2>
      <div className="mt-3 col-12 col-md-10 col-lg-6">
        {errorGuardado && <Alert variant="danger">{errorGuardado}</Alert>}
        <UsuarioForm onGuardar={manejarGuardar} validarRun={validarRUN} usuariosExistentes={usuarios} />
      </div>
    </AdminLayout>
  )
}
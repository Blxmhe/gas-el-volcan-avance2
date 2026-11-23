// src/pages/admin/UsuarioEditar.jsx
// Página para editar un usuario: lee el RUN desde la URL,
// precarga el formulario y guarda los cambios en el backend (PUT /api/v1/usuarios/{run}).

import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Alert } from 'react-bootstrap'
import AdminLayout from '../../components/AdminLayout'
import EstadoCarga from '../../components/EstadoCarga'
import UsuarioForm from '../../components/UsuarioForm'
import { mensajeDeError } from '../../services/api'
import UsuariosService from '../../services/usuariosService'

export default function UsuarioEditar() {
  const { run } = useParams()
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState(null)
  const [usuarios, setUsuarios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [errorGuardado, setErrorGuardado] = useState('')

  // Pide el usuario (para precargar el formulario) y la lista (para revisar correos repetidos)
  useEffect(() => {
    let activo = true
    Promise.all([UsuariosService.obtener(run).catch(() => null), UsuariosService.listar().catch(() => [])])
      .then(([encontrado, lista]) => {
        if (!activo) return
        setUsuario(encontrado)
        setUsuarios(lista)
      })
      .finally(() => {
        if (activo) setCargando(false)
      })
    return () => {
      activo = false
    }
  }, [run])

  // Se ejecuta cuando el formulario ya validó los datos
  const manejarGuardar = async (cambios) => {
    try {
      // El formulario no edita el teléfono: se conserva el que ya tenía el usuario
      await UsuariosService.actualizar(run, { ...cambios, telefono: usuario.telefono })
      navigate('/admin/usuarios')
    } catch (e) {
      setErrorGuardado(mensajeDeError(e, 'No se pudo guardar el usuario.'))
    }
  }

  return (
    <AdminLayout>
      <h2>Editar Usuario</h2>

      <EstadoCarga cargando={cargando} textoCargando="Cargando usuario…" />

      {usuario ? (
        <div className="mt-3 col-12 col-md-10 col-lg-6">
          {errorGuardado && <Alert variant="danger">{errorGuardado}</Alert>}
          <UsuarioForm
            key={run}
            usuarioInicial={usuario}
            modoEditar
            onGuardar={manejarGuardar}
            usuariosExistentes={usuarios}
          />
        </div>
      ) : (
        !cargando && (
          <Alert variant="warning" className="mt-3">
            No se encontró un usuario con el RUN {run}.{' '}
            <Link to="/admin/usuarios">Volver a usuarios</Link>
          </Alert>
        )
      )}
    </AdminLayout>
  )
}
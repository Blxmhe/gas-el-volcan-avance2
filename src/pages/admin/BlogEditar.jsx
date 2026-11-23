// src/pages/admin/BlogEditar.jsx
// Página para editar un artículo: lee el id desde la URL, precarga el formulario y guarda los cambios
// en el backend (PUT /api/v1/blogs/{id}). La fecha de publicación original se conserva.

import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Alert } from 'react-bootstrap'
import AdminLayout from '../../components/AdminLayout'
import BlogForm from '../../components/BlogForm'
import EstadoCarga from '../../components/EstadoCarga'
import { mensajeDeError } from '../../services/api'
import BlogsService from '../../services/blogsService'

export default function BlogEditar() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [blog, setBlog] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [errorGuardado, setErrorGuardado] = useState('')

  useEffect(() => {
    let activo = true
    BlogsService.obtener(id)
      .then((encontrado) => {
        if (activo) setBlog(encontrado)
      })
      .catch(() => {
        // Sin artículo: se muestra el aviso "No se encontró"
      })
      .finally(() => {
        if (activo) setCargando(false)
      })
    return () => {
      activo = false
    }
  }, [id])

  // Se ejecuta cuando el formulario ya validó los datos
  const manejarGuardar = async (cambios) => {
    try {
      await BlogsService.actualizar(id, cambios)
      navigate('/admin/blogs')
    } catch (e) {
      setErrorGuardado(mensajeDeError(e, 'No se pudo guardar el artículo.'))
    }
  }

  return (
    <AdminLayout>
      <h2>Editar Artículo</h2>

      <EstadoCarga cargando={cargando} textoCargando="Cargando artículo…" />

      {blog ? (
        <div className="mt-3 col-12 col-md-10 col-lg-8">
          {errorGuardado && <Alert variant="danger">{errorGuardado}</Alert>}
          <BlogForm key={id} blogInicial={blog} modoEditar onGuardar={manejarGuardar} />
        </div>
      ) : (
        !cargando && (
          <Alert variant="warning" className="mt-3">
            No se encontró un artículo con el número {id}. <Link to="/admin/blogs">Volver a blogs</Link>
          </Alert>
        )
      )}
    </AdminLayout>
  )
}

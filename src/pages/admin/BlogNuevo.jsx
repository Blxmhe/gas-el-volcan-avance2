// src/pages/admin/BlogNuevo.jsx
// Página para publicar un artículo: usa el formulario y lo guarda en el backend (POST /api/v1/blogs).

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert } from 'react-bootstrap'
import AdminLayout from '../../components/AdminLayout'
import BlogForm from '../../components/BlogForm'
import { mensajeDeError } from '../../services/api'
import BlogsService from '../../services/blogsService'

export default function BlogNuevo() {
  const navigate = useNavigate()
  const [errorGuardado, setErrorGuardado] = useState('')

  // Se ejecuta cuando el formulario ya validó los datos
  const manejarGuardar = async (blog) => {
    try {
      await BlogsService.crear(blog)
      navigate('/admin/blogs')
    } catch (e) {
      setErrorGuardado(mensajeDeError(e, 'No se pudo guardar el artículo.'))
    }
  }

  return (
    <AdminLayout>
      <h2>Nuevo Artículo</h2>
      <div className="mt-3 col-12 col-md-10 col-lg-8">
        {errorGuardado && <Alert variant="danger">{errorGuardado}</Alert>}
        <BlogForm onGuardar={manejarGuardar} />
      </div>
    </AdminLayout>
  )
}

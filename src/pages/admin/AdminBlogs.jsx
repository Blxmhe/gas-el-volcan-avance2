import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Alert, Button, Table } from 'react-bootstrap'
import AdminLayout from '../../components/AdminLayout'
import EstadoCarga from '../../components/EstadoCarga'
import { mensajeDeError } from '../../services/api'
import BlogsService from '../../services/blogsService'
import { formatearFecha } from '../../utils/formatearFecha'

// Mantenedor de blogs (solo Administrador): crear, editar y eliminar artículos
export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [errorAccion, setErrorAccion] = useState('')

  const cargar = useCallback(async () => {
    try {
      setBlogs(await BlogsService.listar())
      setError('')
    } catch (e) {
      setError(mensajeDeError(e, 'No se pudieron cargar los blogs.'))
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    // Carga inicial de la lista (solo cambia estado cuando el backend responde)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargar()
  }, [cargar])

  async function eliminar(blog) {
    if (!window.confirm(`¿Eliminar el artículo "${blog.titulo}"? Esta acción no se puede deshacer.`)) return
    setErrorAccion('')
    try {
      await BlogsService.eliminar(blog.id)
      await cargar()
    } catch (e) {
      setErrorAccion(mensajeDeError(e, 'No se pudo eliminar el artículo.'))
    }
  }

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <h2 className="mb-0">Gestión de Blogs</h2>
        <Button as={Link} to="/admin/blogs/nuevo" variant="primary">
          Nuevo artículo
        </Button>
      </div>

      <EstadoCarga cargando={cargando} error={error} textoCargando="Cargando blogs…" />
      {errorAccion && (
        <Alert variant="danger" className="mt-3" dismissible onClose={() => setErrorAccion('')}>
          {errorAccion}
        </Alert>
      )}

      <Table striped bordered hover responsive className="table-admin mt-3">
        <thead className="table-dark">
          <tr>
            <th>N°</th>
            <th>Título</th>
            <th>Categoría</th>
            <th>Publicado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog.id}>
              <td>{blog.id}</td>
              <td>{blog.titulo}</td>
              <td>{blog.categoria}</td>
              <td>{formatearFecha(blog.fechaPublicacion)}</td>
              <td className="text-nowrap">
                <Button
                  as={Link}
                  to={`/admin/blogs/editar/${blog.id}`}
                  variant="warning"
                  size="sm"
                  className="me-2"
                >
                  Editar
                </Button>
                <Button variant="danger" size="sm" onClick={() => eliminar(blog)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </AdminLayout>
  )
}

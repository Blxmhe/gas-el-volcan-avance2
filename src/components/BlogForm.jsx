// src/components/BlogForm.jsx
// Formulario reutilizable de blog: sirve para "nuevo" y para "editar".
// Props:
//   blogInicial: datos para precargar el formulario (solo al editar)
//   modoEditar: true al editar
//   onGuardar: función que recibe el artículo ya validado

import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { validarBlog } from '../utils/validacionesBlog'

const VACIO = { titulo: '', resumen: '', contenido: '', categoria: '', imagen: '' }

// Convierte los datos del blog a texto para poder mostrarlos en los campos
function aTexto(blog) {
  const resultado = {}
  Object.keys(VACIO).forEach((clave) => {
    resultado[clave] = String(blog[clave] ?? '')
  })
  return resultado
}

function BlogForm({ blogInicial = null, modoEditar = false, onGuardar = () => {} }) {
  const [valores, setValores] = useState(() => (blogInicial ? aTexto(blogInicial) : VACIO))
  const [errores, setErrores] = useState({})

  const manejarCambio = (evento) => {
    const { name, value } = evento.target
    setValores((anterior) => ({ ...anterior, [name]: value }))
    // Al escribir, se borra el error de ese campo
    setErrores((anterior) => ({ ...anterior, [name]: undefined }))
  }

  const manejarEnvio = (evento) => {
    evento.preventDefault()

    const erroresEncontrados = validarBlog(valores)
    setErrores(erroresEncontrados)
    if (Object.keys(erroresEncontrados).length > 0) return

    onGuardar({
      titulo: valores.titulo.trim(),
      resumen: valores.resumen.trim(),
      contenido: valores.contenido.trim(),
      categoria: valores.categoria.trim(),
      imagen: valores.imagen.trim(),
    })
  }

  // Campo de texto con su mensaje de error
  const campo = (name, etiqueta, props = {}) => (
    <Form.Group className="mb-3" controlId={name}>
      <Form.Label>{etiqueta}</Form.Label>
      <Form.Control
        name={name}
        value={valores[name]}
        onChange={manejarCambio}
        isInvalid={!!errores[name]}
        autoComplete="off"
        {...props}
      />
      <Form.Control.Feedback type="invalid">{errores[name]}</Form.Control.Feedback>
    </Form.Group>
  )

  return (
    <Form onSubmit={manejarEnvio} noValidate>
      {campo('titulo', 'Título', { type: 'text', maxLength: 150 })}
      {campo('resumen', 'Resumen', { as: 'textarea', rows: 2, maxLength: 300 })}
      {campo('contenido', 'Contenido', { as: 'textarea', rows: 8, maxLength: 5000 })}
      {campo('categoria', 'Categoría (opcional)', { type: 'text', maxLength: 50, placeholder: 'Ej: Consejos útiles' })}
      {campo('imagen', 'Imagen (opcional)', { type: 'text', placeholder: 'Ej: imagen-blog2.jpg' })}

      <Button variant="primary" type="submit" className="me-2">
        {modoEditar ? 'Guardar cambios' : 'Publicar artículo'}
      </Button>
      <Button as={Link} to="/admin/blogs" variant="outline-secondary">
        Cancelar
      </Button>
    </Form>
  )
}

export default BlogForm

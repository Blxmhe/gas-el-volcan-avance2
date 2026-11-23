// src/pages/admin/ProductoEditar.jsx
// Página para editar un producto: lee el código desde la URL,
// precarga el formulario y guarda los cambios en el backend (PUT /api/v1/productos/{codigo}).

import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Alert } from 'react-bootstrap'
import AdminLayout from '../../components/AdminLayout'
import EstadoCarga from '../../components/EstadoCarga'
import ProductoForm from '../../components/ProductoForm'
import { useProductos } from '../../context/useProductos'
import { mensajeDeError } from '../../services/api'
import ProductosService from '../../services/productosService'

export default function ProductoEditar() {
  const { codigo } = useParams()
  const navigate = useNavigate()
  const { buscarProducto, cargando, recargar } = useProductos()
  const producto = buscarProducto(codigo)
  const [errorGuardado, setErrorGuardado] = useState('')

  // Se ejecuta cuando el formulario ya validó los datos
  const manejarGuardar = async (cambios) => {
    try {
      await ProductosService.actualizar(codigo, cambios)
      await recargar()
      navigate('/admin/productos')
    } catch (e) {
      setErrorGuardado(mensajeDeError(e, 'No se pudo guardar el producto.'))
    }
  }

  return (
    <AdminLayout>
      <h2>Editar Producto</h2>

      <EstadoCarga cargando={cargando && !producto} textoCargando="Cargando producto…" />

      {producto ? (
        <div className="mt-3 col-12 col-md-10 col-lg-6">
          {errorGuardado && <Alert variant="danger">{errorGuardado}</Alert>}
          <ProductoForm
            key={codigo}
            productoInicial={producto}
            modoEditar
            onGuardar={manejarGuardar}
          />
        </div>
      ) : (
        !cargando && (
          <Alert variant="warning" className="mt-3">
            No se encontró un producto con el código {codigo}.{' '}
            <Link to="/admin/productos">Volver a productos</Link>
          </Alert>
        )
      )}
    </AdminLayout>
  )
}
// src/pages/admin/ProductoNuevo.jsx
// Página para crear un producto: usa el formulario y lo guarda en el backend (POST /api/v1/productos).

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert } from 'react-bootstrap'
import AdminLayout from '../../components/AdminLayout'
import ProductoForm from '../../components/ProductoForm'
import { useProductos } from '../../context/useProductos'
import { mensajeDeError } from '../../services/api'
import ProductosService from '../../services/productosService'

export default function ProductoNuevo() {
  const navigate = useNavigate()
  const { recargar } = useProductos()
  const [errorGuardado, setErrorGuardado] = useState('')

  // Se ejecuta cuando el formulario ya validó los datos
  const manejarGuardar = async (producto) => {
    try {
      await ProductosService.crear(producto)
      await recargar()
      navigate('/admin/productos')
    } catch (e) {
      setErrorGuardado(mensajeDeError(e, 'No se pudo guardar el producto.'))
    }
  }

  return (
    <AdminLayout>
      <h2>Nuevo Producto</h2>
      <div className="mt-3 col-12 col-md-10 col-lg-6">
        {errorGuardado && <Alert variant="danger">{errorGuardado}</Alert>}
        <ProductoForm onGuardar={manejarGuardar} />
      </div>
    </AdminLayout>
  )
}
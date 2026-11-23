import { useCallback, useEffect, useState } from 'react'
import { ProductosContext } from './useProductos'
import ProductosService from '../services/productosService'
import { mensajeDeError } from '../services/api'

// Carga el catálogo desde el backend una vez y lo comparte con toda la app
// (tienda, carrito y panel de administración leen siempre la misma lista).
export function ProductosProvider({ children }) {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  // Vuelve a pedir el catálogo al backend. Se usa después de comprar (el stock cambió)
  // y después de crear, editar o eliminar un producto en el panel.
  const recargar = useCallback(async () => {
    try {
      setProductos(await ProductosService.listar())
      setError('')
    } catch (e) {
      setError(mensajeDeError(e, 'No se pudieron cargar los productos.'))
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    // Carga inicial del catálogo (la función solo cambia estado cuando el backend responde)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    recargar()
  }, [recargar])

  function buscarProducto(codigo) {
    return productos.find((p) => p.codigo === codigo)
  }

  // Productos de la misma categoría (para la sección "Relacionados" del detalle)
  function obtenerRelacionados(producto) {
    return productos.filter((p) => p.categoria === producto.categoria && p.codigo !== producto.codigo)
  }

  // Los primeros 4 productos (para el Home)
  const destacados = productos.slice(0, 4)

  return (
    <ProductosContext
      value={{ productos, cargando, error, recargar, buscarProducto, obtenerRelacionados, destacados }}
    >
      {children}
    </ProductosContext>
  )
}

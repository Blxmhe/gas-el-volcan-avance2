import { createContext, useContext } from 'react'

// El "canal" por donde ProductosProvider comparte el catálogo con los componentes
export const ProductosContext = createContext(null)

// Atajo para leer el catálogo desde cualquier componente
export function useProductos() {
  const contexto = useContext(ProductosContext)
  if (!contexto) {
    throw new Error('useProductos debe usarse dentro de <ProductosProvider>')
  }
  return contexto
}

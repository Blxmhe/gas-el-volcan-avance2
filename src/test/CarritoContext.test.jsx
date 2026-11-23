import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { CarritoProvider } from '../context/CarritoContext'
import { useCarrito } from '../context/useCarrito'

// El carrito consulta el stock en el catálogo (que en la app viene del backend).
// Aquí se reemplaza por un catálogo fijo para no necesitar el servidor.
const catalogo = [
  { codigo: 'CL001', nombre: 'Cilindro GLP 5 kg', precioResidencial: 6500, stock: 80 },
  { codigo: 'RG002', nombre: 'Regulador de alta presión', precioResidencial: 18990, stock: 12 },
]
vi.mock('../context/useProductos', () => ({
  useProductos: () => ({ buscarProducto: (codigo) => catalogo.find((p) => p.codigo === codigo) }),
}))

// Monta el carrito dentro de su Provider para poder probar sus funciones
function renderizarCarrito() {
  return renderHook(() => useCarrito(), { wrapper: CarritoProvider })
}

describe('CarritoContext (Parte A: carrito de compras)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('agrega un producto y actualiza el total de unidades', () => {
    const { result } = renderizarCarrito()
    let mensaje

    act(() => {
      mensaje = result.current.agregarAlCarrito('CL001', 2)
    })

    expect(mensaje).toBe('Producto agregado al carrito')
    expect(result.current.carrito).toEqual([{ codigo: 'CL001', cantidad: 2 }])
    expect(result.current.totalUnidades).toBe(2)
  })

  it('no agrega más unidades que el stock disponible', () => {
    const { result } = renderizarCarrito()
    let mensaje

    act(() => {
      mensaje = result.current.agregarAlCarrito('RG002', 13) // stock de RG002: 12
    })

    expect(mensaje).toContain('No hay suficiente stock')
    expect(result.current.carrito).toEqual([])
  })

  it('avisa si el producto no existe en el catálogo', () => {
    const { result } = renderizarCarrito()
    let mensaje

    act(() => {
      mensaje = result.current.agregarAlCarrito('XX999', 1)
    })

    expect(mensaje).toBe('Producto no encontrado')
  })

  it('vaciarCarrito deja el carrito sin productos (se usa después de pagar)', () => {
    const { result } = renderizarCarrito()

    act(() => {
      result.current.agregarAlCarrito('CL001', 2)
    })
    act(() => {
      result.current.vaciarCarrito()
    })

    expect(result.current.carrito).toEqual([])
    expect(result.current.totalUnidades).toBe(0)
  })
})

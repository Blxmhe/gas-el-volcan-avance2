import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { CarritoProvider } from '../context/CarritoContext'
import { useCarrito } from '../context/useCarrito'

// Monta el carrito dentro de su Provider para poder probar sus funciones
function renderizarCarrito() {
  return renderHook(() => useCarrito(), { wrapper: CarritoProvider })
}

describe('CarritoContext (Parte A: carrito de compras)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('empieza con el carrito vacío y 0 unidades', () => {
    const { result } = renderizarCarrito()

    expect(result.current.carrito).toEqual([])
    expect(result.current.totalUnidades).toBe(0)
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

  it('suma la cantidad si el mismo producto se agrega dos veces', () => {
    const { result } = renderizarCarrito()

    act(() => {
      result.current.agregarAlCarrito('CL001', 2)
    })
    act(() => {
      result.current.agregarAlCarrito('CL001', 3)
    })

    expect(result.current.carrito).toEqual([{ codigo: 'CL001', cantidad: 5 }])
    expect(result.current.totalUnidades).toBe(5)
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

  it('rechaza cantidades inválidas y productos que no existen', () => {
    const { result } = renderizarCarrito()
    let mensajeCantidad
    let mensajeProducto

    act(() => {
      mensajeCantidad = result.current.agregarAlCarrito('CL001', 0)
      mensajeProducto = result.current.agregarAlCarrito('XX999', 1)
    })

    expect(mensajeCantidad).toContain('cantidad válida')
    expect(mensajeProducto).toBe('Producto no encontrado')
    expect(result.current.carrito).toEqual([])
  })

  it('quita un producto del carrito', () => {
    const { result } = renderizarCarrito()
    act(() => {
      result.current.agregarAlCarrito('CL001', 1)
    })

    act(() => {
      result.current.quitarDelCarrito('CL001')
    })

    expect(result.current.carrito).toEqual([])
  })

  it('actualiza la cantidad, y si la nueva cantidad es 0 elimina el producto', () => {
    const { result } = renderizarCarrito()
    act(() => {
      result.current.agregarAlCarrito('CL001', 1)
    })

    act(() => {
      result.current.actualizarCantidad('CL001', 4)
    })
    expect(result.current.carrito[0].cantidad).toBe(4)

    act(() => {
      result.current.actualizarCantidad('CL001', 0)
    })
    expect(result.current.carrito).toEqual([])
  })

  it('guarda el carrito en localStorage cada vez que cambia', () => {
    const { result } = renderizarCarrito()

    act(() => {
      result.current.agregarAlCarrito('CL001', 2)
    })

    const guardado = JSON.parse(localStorage.getItem('carrito'))
    expect(guardado).toEqual([{ codigo: 'CL001', cantidad: 2 }])
  })
})
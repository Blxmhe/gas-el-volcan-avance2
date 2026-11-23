import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Carrito from '../pages/Carrito'
import PedidosService from '../services/pedidosService'
import { formatearPrecio } from '../utils/formatearPrecio'

// --- Simulaciones: la prueba no necesita backend ---
const vaciarCarrito = vi.fn()
const recargar = vi.fn().mockResolvedValue()
let sesion = {}

vi.mock('../services/pedidosService', () => ({ default: { crear: vi.fn() } }))
vi.mock('../context/useAuth', () => ({ useAuth: () => sesion }))
vi.mock('../context/useCarrito', () => ({
  useCarrito: () => ({
    carrito: [{ codigo: 'CL002', cantidad: 3 }],
    quitarDelCarrito: vi.fn(),
    actualizarCantidad: vi.fn(),
    vaciarCarrito,
  }),
}))
vi.mock('../context/useProductos', () => ({
  useProductos: () => ({
    cargando: false,
    recargar,
    buscarProducto: (codigo) =>
      codigo === 'CL002'
        ? { codigo: 'CL002', nombre: 'Cilindro GLP 11 kg', categoria: 'Cilindros de Gas', precioResidencial: 12000, stock: 200 }
        : undefined,
  }),
}))

function mostrarCarrito() {
  return render(
    <MemoryRouter initialEntries={['/carrito']}>
      <Routes>
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/login" element={<p>Pantalla de login</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('Carrito: botón "Pagar" (crea el pedido en el backend)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    recargar.mockResolvedValue()
  })

  it('un cliente con sesión paga: se envía el pedido, se vacía el carrito y se muestra la confirmación', async () => {
    sesion = { estaAutenticado: true, esCliente: true, esAdmin: false }
    PedidosService.crear.mockResolvedValue({ id: 7, total: 36000, estado: 'PENDIENTE' })
    const usuario = userEvent.setup()
    mostrarCarrito()

    expect(screen.getByText(`Total: ${formatearPrecio(36000)}`)).toBeInTheDocument()
    await usuario.click(screen.getByRole('button', { name: 'Pagar' }))

    await waitFor(() => expect(screen.getByText('¡Pedido realizado!')).toBeInTheDocument())
    expect(PedidosService.crear).toHaveBeenCalledWith([{ codigo: 'CL002', cantidad: 3 }])
    expect(vaciarCarrito).toHaveBeenCalledTimes(1)
    expect(recargar).toHaveBeenCalled() // el stock cambió: se vuelve a pedir el catálogo
    expect(screen.getByText('N° 7')).toBeInTheDocument()
  })

  it('si el backend responde que no hay stock, muestra el mensaje y NO vacía el carrito', async () => {
    sesion = { estaAutenticado: true, esCliente: true, esAdmin: false }
    PedidosService.crear.mockRejectedValue({
      response: { status: 409, data: { mensaje: 'No hay suficiente stock de Cilindro GLP 11 kg (disponible: 2, pedido: 3)' } },
    })
    const usuario = userEvent.setup()
    mostrarCarrito()

    await usuario.click(screen.getByRole('button', { name: 'Pagar' }))

    expect(await screen.findByText(/No hay suficiente stock de Cilindro GLP 11 kg/)).toBeInTheDocument()
    expect(vaciarCarrito).not.toHaveBeenCalled()
  })

  it('sin sesión, "Pagar" lleva al login y no crea ningún pedido', async () => {
    sesion = { estaAutenticado: false, esCliente: false, esAdmin: false }
    const usuario = userEvent.setup()
    mostrarCarrito()

    await usuario.click(screen.getByRole('button', { name: 'Pagar' }))

    expect(await screen.findByText('Pantalla de login')).toBeInTheDocument()
    expect(PedidosService.crear).not.toHaveBeenCalled()
  })

  it('un Vendedor no puede comprar: el botón queda deshabilitado', () => {
    sesion = { estaAutenticado: true, esCliente: false, esAdmin: false }
    mostrarCarrito()

    expect(screen.getByRole('button', { name: 'Pagar' })).toBeDisabled()
    expect(screen.getByText(/no puede realizar compras/i)).toBeInTheDocument()
  })
})

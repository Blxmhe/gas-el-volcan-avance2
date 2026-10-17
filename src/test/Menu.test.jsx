import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Menu from '../components/Menu'

// Mock del carrito: el Menú solo necesita el total de unidades
vi.mock('../context/useCarrito', () => ({
  useCarrito: () => ({ totalUnidades: 3 }),
}))

// Deja una sesión iniciada en localStorage, igual que hace loginUsuario
function iniciarSesionComo(tipoUsuario) {
  localStorage.setItem(
    'usuarioActivo',
    JSON.stringify({ nombre: 'Daniel Soto', tipoUsuario }),
  )
}

// El Menú usa <Link> y useNavigate, por eso se renderiza dentro de un MemoryRouter
function mostrarMenu() {
  return render(
    <MemoryRouter>
      <Menu />
    </MemoryRouter>,
  )
}

describe('Menu (barra de navegación con sesión)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('sin sesión muestra "Iniciar sesión" y "Registrar usuario"', () => {
    mostrarMenu()

    expect(screen.getByText('Iniciar sesión')).toBeInTheDocument()
    expect(screen.getByText('Registrar usuario')).toBeInTheDocument()
    expect(screen.queryByText('Cerrar sesión')).not.toBeInTheDocument()
  })

  it('con sesión de Administrador muestra su nombre, "Ir a Admin" y "Cerrar sesión"', () => {
    iniciarSesionComo('Administrador')

    mostrarMenu()

    expect(screen.getByText(/Daniel/)).toBeInTheDocument()
    expect(screen.getByText('Ir a Admin')).toBeInTheDocument()
    expect(screen.getByText('Cerrar sesión')).toBeInTheDocument()
    expect(screen.queryByText('Iniciar sesión')).not.toBeInTheDocument()
  })

  it('un Cliente con sesión no ve el botón "Ir a Admin"', () => {
    iniciarSesionComo('Cliente')

    mostrarMenu()

    expect(screen.getByText('Cerrar sesión')).toBeInTheDocument()
    expect(screen.queryByText('Ir a Admin')).not.toBeInTheDocument()
  })

  it('al presionar "Cerrar sesión" borra la sesión y vuelve el botón de iniciar sesión', async () => {
    iniciarSesionComo('Administrador')
    const usuario = userEvent.setup()
    mostrarMenu()

    await usuario.click(screen.getByText('Cerrar sesión'))

    expect(localStorage.getItem('usuarioActivo')).toBeNull()
    expect(screen.getByText('Iniciar sesión')).toBeInTheDocument()
  })

  it('muestra el total de unidades del carrito', () => {
    mostrarMenu()

    expect(screen.getByText(/Cart \(3\)/)).toBeInTheDocument()
  })
})
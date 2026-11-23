import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Menu from '../components/Menu'
import { AuthProvider } from '../context/AuthProvider'

// Mock del carrito: el Menú solo necesita el total de unidades
vi.mock('../context/useCarrito', () => ({
  useCarrito: () => ({ totalUnidades: 3 }),
}))

// El cierre de sesión llama al backend: se simula para que la prueba no necesite el servidor
vi.mock('../services/authService', () => ({
  default: { logout: vi.fn().mockResolvedValue({}) },
}))

// Deja una sesión iniciada en localStorage, igual que hace el login
function iniciarSesionComo(tipoUsuario) {
  localStorage.setItem(
    'sesion',
    JSON.stringify({
      accessToken: 'a',
      refreshToken: 'r',
      correo: 'usuario@duoc.cl',
      nombre: 'Daniel Soto',
      tipoUsuario,
    }),
  )
}

// El Menú usa <Link>, useNavigate y useAuth: se renderiza dentro de un MemoryRouter y un AuthProvider
function mostrarMenu() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <Menu />
      </AuthProvider>
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
    expect(screen.queryByText('Ir a Admin')).not.toBeInTheDocument()
  })

  it('con sesión de Administrador muestra su nombre, "Ir a Admin" y "Cerrar sesión"', () => {
    iniciarSesionComo('Administrador')

    mostrarMenu()

    expect(screen.getByText(/Daniel/)).toBeInTheDocument()
    expect(screen.getByText('Ir a Admin')).toBeInTheDocument()
    expect(screen.getByText('Cerrar sesión')).toBeInTheDocument()
    expect(screen.queryByText('Iniciar sesión')).not.toBeInTheDocument()
  })

  it('con sesión de Vendedor muestra "Ir a Admin" pero no "Mis pedidos"', () => {
    iniciarSesionComo('Vendedor')

    mostrarMenu()

    expect(screen.getByText('Ir a Admin')).toBeInTheDocument()
    expect(screen.queryByText('Mis pedidos')).not.toBeInTheDocument()
  })

  it('con sesión de Cliente muestra "Mis pedidos" y no muestra "Ir a Admin"', () => {
    iniciarSesionComo('Cliente')

    mostrarMenu()

    expect(screen.getByText('Mis pedidos')).toBeInTheDocument()
    expect(screen.queryByText('Ir a Admin')).not.toBeInTheDocument()
  })

  it('al presionar "Cerrar sesión" borra la sesión y vuelve el botón de iniciar sesión', async () => {
    iniciarSesionComo('Administrador')
    const usuario = userEvent.setup()
    mostrarMenu()

    await usuario.click(screen.getByText('Cerrar sesión'))

    await waitFor(() => expect(screen.getByText('Iniciar sesión')).toBeInTheDocument())
    expect(localStorage.getItem('sesion')).toBeNull()
  })
})

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'
import { AuthProvider } from '../context/AuthProvider'

// Deja una sesión iniciada con el rol indicado (o ninguna si tipoUsuario es null)
function iniciarSesionComo(tipoUsuario) {
  if (tipoUsuario) {
    localStorage.setItem(
      'sesion',
      JSON.stringify({ accessToken: 'a', refreshToken: 'r', correo: 'x@duoc.cl', nombre: 'X', tipoUsuario }),
    )
  }
}

// Monta una ruta /admin protegida solo para Administrador, más las páginas a las que redirige
function mostrarRutaAdmin() {
  return render(
    <MemoryRouter initialEntries={['/admin']}>
      <AuthProvider>
        <Routes>
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['Administrador']}>
                <p>Panel secreto</p>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<p>Pantalla de login</p>} />
          <Route path="/no-autorizado" element={<p>Acceso no autorizado</p>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  )
}

describe('ProtectedRoute (rutas protegidas por sesión y rol)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('sin sesión redirige al login', () => {
    mostrarRutaAdmin()

    expect(screen.getByText('Pantalla de login')).toBeInTheDocument()
    expect(screen.queryByText('Panel secreto')).not.toBeInTheDocument()
  })

  it('con un rol no permitido (Cliente) redirige a "No autorizado"', () => {
    iniciarSesionComo('Cliente')

    mostrarRutaAdmin()

    expect(screen.getByText('Acceso no autorizado')).toBeInTheDocument()
    expect(screen.queryByText('Panel secreto')).not.toBeInTheDocument()
  })

  it('con un rol no permitido (Vendedor) tampoco entra a una ruta solo de Administrador', () => {
    iniciarSesionComo('Vendedor')

    mostrarRutaAdmin()

    expect(screen.getByText('Acceso no autorizado')).toBeInTheDocument()
  })

  it('con el rol permitido (Administrador) muestra la página', () => {
    iniciarSesionComo('Administrador')

    mostrarRutaAdmin()

    expect(screen.getByText('Panel secreto')).toBeInTheDocument()
  })
})

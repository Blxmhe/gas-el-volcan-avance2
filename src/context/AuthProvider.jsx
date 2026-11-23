import { useEffect, useState } from 'react'
import { AuthContext } from './useAuth'
import AuthService from '../services/authService'
import { borrarSesion, guardarSesion, leerSesion } from '../services/sesionStorage'
import { ROL_ADMIN, ROL_CLIENTE, ROL_VENDEDOR, ROLES_PANEL } from '../utils/roles'

// Envuelve la app y comparte la sesión (quién inició sesión y con qué rol) con todos los componentes
export function AuthProvider({ children }) {
  // Al cargar (o recargar) la página, la sesión se recupera desde localStorage
  const [sesion, setSesion] = useState(() => leerSesion())

  // Si la renovación del token falla (ver api.js), se cierra la sesión en toda la aplicación
  useEffect(() => {
    const alExpirar = () => setSesion(null)
    window.addEventListener('sesion-expirada', alExpirar)
    return () => window.removeEventListener('sesion-expirada', alExpirar)
  }, [])

  // Inicia sesión: pide los tokens al backend, los guarda y devuelve los datos del usuario.
  // Si el backend rechaza las credenciales, lanza el error (la página lo muestra).
  async function login(correo, password) {
    const respuesta = await AuthService.login(correo, password)
    guardarSesion(respuesta.data)
    setSesion(respuesta.data)
    return respuesta.data
  }

  // Cierra la sesión: revoca el refresh token en el servidor y borra la sesión local.
  // Aunque el servidor no responda, la sesión local se borra igual.
  async function logout() {
    try {
      if (sesion?.refreshToken) await AuthService.logout(sesion.refreshToken)
    } catch {
      // Sin conexión o token ya vencido: igual se cierra la sesión en este navegador
    } finally {
      borrarSesion()
      setSesion(null)
    }
  }

  const tipo = sesion?.tipoUsuario
  const valor = {
    usuario: sesion ? { correo: sesion.correo, nombre: sesion.nombre, tipoUsuario: tipo } : null,
    estaAutenticado: Boolean(sesion),
    esAdmin: tipo === ROL_ADMIN,
    esVendedor: tipo === ROL_VENDEDOR,
    esCliente: tipo === ROL_CLIENTE,
    puedeAdministrar: ROLES_PANEL.includes(tipo),
    login,
    logout,
  }

  return <AuthContext value={valor}>{children}</AuthContext>
}

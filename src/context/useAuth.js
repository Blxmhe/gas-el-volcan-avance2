import { createContext, useContext } from 'react'

// El "canal" por donde AuthProvider comparte la sesión con los componentes
export const AuthContext = createContext(null)

// Atajo para leer la sesión desde cualquier componente
export function useAuth() {
  const contexto = useContext(AuthContext)
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  }
  return contexto
}

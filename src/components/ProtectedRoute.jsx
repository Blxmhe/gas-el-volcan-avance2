import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

// Protege una ruta: exige sesión iniciada y, opcionalmente, uno de los roles indicados.
//   <ProtectedRoute roles={['Administrador']}> ...página... </ProtectedRoute>
//   - Sin sesión: lleva al login y recuerda a dónde quería ir.
//   - Con sesión pero con un rol no permitido: lleva a "No autorizado".
function ProtectedRoute({ roles, children }) {
  const { usuario } = useAuth()
  const ubicacion = useLocation()

  if (!usuario) {
    return <Navigate to="/login" replace state={{ from: ubicacion }} />
  }
  if (roles && !roles.includes(usuario.tipoUsuario)) {
    return <Navigate to="/no-autorizado" replace />
  }
  return children
}

export default ProtectedRoute

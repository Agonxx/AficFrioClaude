/**
 * Componente de Rota Protegida por Role
 * Verifica se o usuário tem a role necessária para acessar a rota
 */
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export function RoleRoute({ children, roles, redirectTo = '/' }) {
  const { user, isAuthenticated, loading } = useAuth()

  // Aguarda carregar autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // Se não está autenticado, vai para login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Verifica se tem a role necessária
  const allowedRoles = Array.isArray(roles) ? roles : [roles]
  const hasPermission = allowedRoles.includes(user?.role)

  if (!hasPermission) {
    // Redireciona para a página apropriada baseado na role do usuário
    return <Navigate to={redirectTo} replace />
  }

  return children
}
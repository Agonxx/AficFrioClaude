/**
 * Componente de Rota Protegida
 * Redireciona para login se usuário não estiver autenticado
 */
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { PageLoading } from '../ui'

export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return <PageLoading />
  }

  // Redireciona para login se não autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

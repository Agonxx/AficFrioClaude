/**
 * Componente principal da aplicação
 * Configura rotas e contextos
 */
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ProtectedRoute } from './components/layout'
import { Login, OSList, OSForm, OSView } from './pages'
import { Produtos, Marcas, Tecnicos } from './pages/cadastros'
import { PageLoading } from './components/ui'

// Componente que redireciona usuários logados
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <PageLoading />
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}

// Rotas da aplicação
function AppRoutes() {
  return (
    <Routes>
      {/* Rota pública - Login */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Rotas protegidas - Ordens de Serviço */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <OSList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/os/nova"
        element={
          <ProtectedRoute>
            <OSForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/os/:id"
        element={
          <ProtectedRoute>
            <OSView />
          </ProtectedRoute>
        }
      />

      <Route
        path="/os/:id/editar"
        element={
          <ProtectedRoute>
            <OSForm />
          </ProtectedRoute>
        }
      />

      {/* Rotas protegidas - Cadastros */}
      <Route
        path="/cadastros/produtos"
        element={
          <ProtectedRoute>
            <Produtos />
          </ProtectedRoute>
        }
      />

      <Route
        path="/cadastros/marcas"
        element={
          <ProtectedRoute>
            <Marcas />
          </ProtectedRoute>
        }
      />

      <Route
        path="/cadastros/tecnicos"
        element={
          <ProtectedRoute>
            <Tecnicos />
          </ProtectedRoute>
        }
      />

      {/* Rota 404 - Redireciona para home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

// Componente App principal
function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App

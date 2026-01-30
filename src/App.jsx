/**
 * Componente principal da aplicação
 * Configura rotas e contextos com controle de acesso por role
 */
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ProtectedRoute, RoleRoute } from './components/layout'
import { Login, OSList, OSForm, OSView, Dashboard, Clientes, Calendario } from './pages'
import { Produtos, Marcas, Tecnicos } from './pages/cadastros'
import { SuperAdminDashboard, SuperAdminEmpresas } from './pages/super-admin'
import { AdminConfiguracoes, AdminUsuarios } from './pages/admin'
import { PageLoading } from './components/ui'

// Componente que redireciona usuários logados
function PublicRoute({ children }) {
  const { isAuthenticated, loading, isSuperAdmin } = useAuth()

  if (loading) {
    return <PageLoading />
  }

  if (isAuthenticated) {
    // Super admin vai para seu dashboard, outros vão para home
    return <Navigate to={isSuperAdmin() ? '/super-admin' : '/'} replace />
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

      {/* ============================================ */}
      {/* ROTAS SUPER ADMIN */}
      {/* ============================================ */}
      <Route
        path="/super-admin"
        element={
          <RoleRoute roles={['super_admin']} redirectTo="/">
            <SuperAdminDashboard />
          </RoleRoute>
        }
      />

      <Route
        path="/super-admin/empresas"
        element={
          <RoleRoute roles={['super_admin']} redirectTo="/">
            <SuperAdminEmpresas />
          </RoleRoute>
        }
      />

      {/* ============================================ */}
      {/* ROTAS ADMIN EMPRESA */}
      {/* ============================================ */}
      <Route
        path="/admin/configuracoes"
        element={
          <RoleRoute roles={['admin_empresa']} redirectTo="/">
            <AdminConfiguracoes />
          </RoleRoute>
        }
      />

      <Route
        path="/admin/usuarios"
        element={
          <RoleRoute roles={['admin_empresa']} redirectTo="/">
            <AdminUsuarios />
          </RoleRoute>
        }
      />

      {/* ============================================ */}
      {/* ROTAS USUÁRIO (admin_empresa e user) */}
      {/* ============================================ */}

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <RoleRoute roles={['admin_empresa', 'user']} redirectTo="/super-admin">
            <Dashboard />
          </RoleRoute>
        }
      />

      {/* Lista de OS - Home */}
      <Route
        path="/"
        element={
          <RoleRoute roles={['admin_empresa', 'user']} redirectTo="/super-admin">
            <OSList />
          </RoleRoute>
        }
      />

      <Route
        path="/os/nova"
        element={
          <RoleRoute roles={['admin_empresa', 'user']} redirectTo="/">
            <OSForm />
          </RoleRoute>
        }
      />

      <Route
        path="/os/:id"
        element={
          <RoleRoute roles={['admin_empresa', 'user']} redirectTo="/">
            <OSView />
          </RoleRoute>
        }
      />

      <Route
        path="/os/:id/editar"
        element={
          <RoleRoute roles={['admin_empresa', 'user']} redirectTo="/">
            <OSForm />
          </RoleRoute>
        }
      />

      {/* Calendário */}
      <Route
        path="/calendario"
        element={
          <RoleRoute roles={['admin_empresa', 'user']} redirectTo="/">
            <Calendario />
          </RoleRoute>
        }
      />

      {/* Rotas de Cadastros (admin_empresa e user) */}
      <Route
        path="/cadastros/clientes"
        element={
          <RoleRoute roles={['admin_empresa', 'user']} redirectTo="/">
            <Clientes />
          </RoleRoute>
        }
      />

      <Route
        path="/cadastros/produtos"
        element={
          <RoleRoute roles={['admin_empresa', 'user']} redirectTo="/">
            <Produtos />
          </RoleRoute>
        }
      />

      <Route
        path="/cadastros/marcas"
        element={
          <RoleRoute roles={['admin_empresa', 'user']} redirectTo="/">
            <Marcas />
          </RoleRoute>
        }
      />

      <Route
        path="/cadastros/tecnicos"
        element={
          <RoleRoute roles={['admin_empresa', 'user']} redirectTo="/">
            <Tecnicos />
          </RoleRoute>
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

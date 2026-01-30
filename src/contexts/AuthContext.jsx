import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/api'
import { STORAGE_KEYS } from '../utils/constants'

// Cria o contexto de autenticação
const AuthContext = createContext(null)

// Provider do contexto
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Verifica autenticação ao carregar
  useEffect(() => {
    checkAuth()
  }, [])

  // Verifica se usuário está autenticado
  const checkAuth = async () => {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER)
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN)

      if (storedUser && token) {
        // Valida token com o backend
        const result = await authService.validateToken()

        if (result.valid) {
          setUser(JSON.parse(storedUser))
        } else {
          // Token inválido - limpa dados
          logout()
        }
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  // Realiza login
  const login = async (email, password) => {
    try {
      const result = await authService.login(email, password)

      if (result.success) {
        const { user: userData, token } = result.data

        // Salva no localStorage
        localStorage.setItem(STORAGE_KEYS.TOKEN, token)
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData))

        setUser(userData)
        return { success: true }
      }

      return { success: false, error: result.error }
    } catch (error) {
      console.error('Erro no login:', error)
      return { success: false, error: 'Erro ao realizar login' }
    }
  }

  // Realiza logout
  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Erro no logout:', error)
    } finally {
      setUser(null)
      localStorage.removeItem(STORAGE_KEYS.TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)
    }
  }

  // Verifica se usuário tem determinada role
  const hasRole = (role) => {
    if (!user) return false
    if (Array.isArray(role)) {
      return role.includes(user.role)
    }
    return user.role === role
  }

  // Atalhos para verificar roles
  const isSuperAdmin = () => hasRole('super_admin')
  const isAdminEmpresa = () => hasRole('admin_empresa')
  const isUser = () => hasRole('user')

  // Valores expostos pelo contexto
  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    hasRole,
    isSuperAdmin,
    isAdminEmpresa,
    isUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook para usar o contexto
export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }

  return context
}

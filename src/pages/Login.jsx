/**
 * Página de Login
 */
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button, Input, Card, CardContent } from '../components/ui'
import { validateLoginForm } from '../utils/validators'

export function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

  // Pega a rota de origem para redirecionar após login
  const from = location.state?.from?.pathname || '/'

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Limpa erro do campo ao digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    if (loginError) {
      setLoginError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Valida formulário
    const validation = validateLoginForm(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    setLoading(true)
    setLoginError('')

    try {
      const result = await login(formData.email, formData.password)

      if (result.success) {
        navigate(from, { replace: true })
      } else {
        setLoginError(result.error || 'Erro ao realizar login')
      }
    } catch (error) {
      setLoginError('Erro ao conectar com o servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800 px-4">
      <div className="w-full max-w-md">
        {/* Logo e título */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-12 h-12 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">AficFrio</h1>
          <p className="text-primary-200 mt-1">Sistema de Ordens de Serviço</p>
        </div>

        {/* Card de login */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 text-center mb-6">
              Acesse sua conta
            </h2>

            {loginError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 text-center">{loginError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                error={errors.email}
                required
                autoComplete="email"
              />

              <Input
                label="Senha"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                error={errors.password}
                required
                autoComplete="current-password"
              />

              <Button
                type="submit"
                className="w-full mt-2"
                loading={loading}
              >
                Entrar
              </Button>
            </form>

            {/* Dica para desenvolvimento */}
            <div className="mt-6 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 text-center">
                <strong>Ambiente de desenvolvimento:</strong><br />
                Use qualquer email válido com a senha <code className="bg-gray-200 px-1 rounded">123456</code>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

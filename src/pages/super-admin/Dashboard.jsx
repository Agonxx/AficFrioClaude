/**
 * Dashboard do Super Admin
 * Visão geral de todas as empresas e métricas do sistema
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../../components/layout'
import { Card, CardHeader, CardTitle, CardContent, Loading } from '../../components/ui'
import { empresasService } from '../../services/multitenancy'

export function SuperAdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [empresas, setEmpresas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [statsRes, empresasRes] = await Promise.all([
        empresasService.getStats(),
        empresasService.getAll()
      ])

      if (statsRes.success) setStats(statsRes.data)
      if (empresasRes.success) setEmpresas(empresasRes.data)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-12">
          <Loading size="lg" />
        </div>
      </Layout>
    )
  }

  const StatCard = ({ title, value, subtitle, color = 'primary', icon }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className={`text-3xl font-bold text-${color}-600 mt-1`}>{value}</p>
            {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
          </div>
          <div className={`p-3 bg-${color}-100 rounded-full`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <Layout>
      {/* Cabeçalho */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Painel Super Admin</h1>
        <p className="text-gray-600">Visão geral do sistema</p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Empresas"
          value={stats?.totalEmpresas || 0}
          subtitle={`${stats?.empresasAtivas || 0} ativas`}
          color="blue"
          icon={
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        />
        <StatCard
          title="Usuários"
          value={stats?.totalUsuarios || 0}
          subtitle={`${stats?.usuariosAtivos || 0} ativos`}
          color="green"
          icon={
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
        <StatCard
          title="Plano Premium"
          value={empresas.filter(e => e.plano === 'premium').length}
          color="purple"
          icon={
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          }
        />
        <StatCard
          title="Plano Básico"
          value={empresas.filter(e => e.plano === 'basico').length}
          color="gray"
          icon={
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
        />
      </div>

      {/* Lista de empresas recentes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Empresas Cadastradas</CardTitle>
            <button
              onClick={() => navigate('/super-admin/empresas')}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Ver todas
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Empresa</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">CNPJ</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Plano</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {empresas.slice(0, 5).map(empresa => (
                  <tr key={empresa.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">{empresa.nome}</p>
                      <p className="text-sm text-gray-500">{empresa.email}</p>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{empresa.cnpj}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full
                        ${empresa.plano === 'premium'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {empresa.plano === 'premium' ? 'Premium' : 'Básico'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full
                        ${empresa.ativo
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {empresa.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </Layout>
  )
}

/**
 * Dashboard para Admin Empresa e Usuários
 * Exibe métricas e resumo das Ordens de Serviço
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/layout'
import { Card, CardContent, Loading } from '../components/ui'
import { osService } from '../services/api'
import { formatOSNumber, formatDate, getLabelByValue, getStatusColor, getCategoryColor } from '../utils/helpers'
import { OS_STATUS, OS_CATEGORIES } from '../utils/constants'

export function Dashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [ordens, setOrdens] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    abertas: 0,
    emAndamento: 0,
    concluidas: 0,
    canceladas: 0,
    orcamentos: 0,
    vendas: 0,
    garantias: 0
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const result = await osService.getAll()
      if (result.success) {
        const data = result.data
        setOrdens(data)

        // Calcula estatísticas
        setStats({
          total: data.length,
          abertas: data.filter(os => os.status === 'aberta').length,
          emAndamento: data.filter(os => os.status === 'em_andamento').length,
          concluidas: data.filter(os => os.status === 'concluida').length,
          canceladas: data.filter(os => os.status === 'cancelada').length,
          orcamentos: data.filter(os => os.categoria === 'orcamento').length,
          vendas: data.filter(os => os.categoria === 'venda').length,
          garantias: data.filter(os => os.categoria === 'garantia').length
        })
      }
    } finally {
      setLoading(false)
    }
  }

  // Pega as últimas 5 OS
  const recentOrdens = ordens.slice(0, 5)

  // Pega OS urgentes (abertas há mais de 7 dias)
  const urgentOrdens = ordens.filter(os => {
    if (os.status !== 'aberta' && os.status !== 'em_andamento') return false
    const dataAbertura = new Date(os.dataAbertura)
    const hoje = new Date()
    const diffDias = Math.floor((hoje - dataAbertura) / (1000 * 60 * 60 * 24))
    return diffDias > 7
  })

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-12">
          <Loading size="lg" />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      {/* Cabeçalho */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-1">Visão geral das ordens de serviço</p>
      </div>

      {/* Cards de Estatísticas - Status */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total de OS</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Abertas</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.abertas}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Em Andamento</p>
                <p className="text-2xl font-bold text-blue-600">{stats.emAndamento}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Concluídas</p>
                <p className="text-2xl font-bold text-green-600">{stats.concluidas}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cards de Categorias */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-500">Orçamentos</p>
            <p className="text-xl font-bold text-purple-600">{stats.orcamentos}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-500">Vendas</p>
            <p className="text-xl font-bold text-indigo-600">{stats.vendas}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-500">Garantias</p>
            <p className="text-xl font-bold text-orange-600">{stats.garantias}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* OS Urgentes */}
        {urgentOrdens.length > 0 && (
          <Card>
            <div className="px-4 py-3 border-b border-gray-200 bg-red-50">
              <h3 className="font-semibold text-red-800 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                OS Pendentes há mais de 7 dias ({urgentOrdens.length})
              </h3>
            </div>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200">
                {urgentOrdens.slice(0, 5).map(os => (
                  <div
                    key={os.id}
                    onClick={() => navigate(`/os/${os.id}`)}
                    className="p-4 hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-medium text-primary-600">{formatOSNumber(os.id)}</span>
                        <span className="mx-2 text-gray-400">-</span>
                        <span className="text-gray-900">{os.clienteNome}</span>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(os.status)}`}>
                        {getLabelByValue(OS_STATUS, os.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Aberta em {formatDate(os.dataAbertura)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Últimas OS */}
        <Card className={urgentOrdens.length === 0 ? 'lg:col-span-2' : ''}>
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Últimas Ordens de Serviço</h3>
          </div>
          <CardContent className="p-0">
            {recentOrdens.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Nenhuma ordem de serviço cadastrada.
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {recentOrdens.map(os => (
                  <div
                    key={os.id}
                    onClick={() => navigate(`/os/${os.id}`)}
                    className="p-4 hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-primary-600">{formatOSNumber(os.id)}</span>
                        <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded ${getCategoryColor(os.categoria)}`}>
                          {getLabelByValue(OS_CATEGORIES, os.categoria)}
                        </span>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(os.status)}`}>
                        {getLabelByValue(OS_STATUS, os.status)}
                      </span>
                    </div>
                    <p className="text-gray-900 mt-1">{os.clienteNome}</p>
                    <p className="text-sm text-gray-500">{formatDate(os.dataAbertura)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-primary-600 hover:text-primary-800 font-medium"
            >
              Ver todas as OS
            </button>
          </div>
        </Card>
      </div>
    </Layout>
  )
}

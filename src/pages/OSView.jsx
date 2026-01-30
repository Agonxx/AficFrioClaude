/**
 * Página de Visualização de Ordem de Serviço
 */
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Layout } from '../components/layout'
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Loading
} from '../components/ui'
import { ContractPrint } from '../components/ContractPrint'
import { osService } from '../services/api'
import { produtosService, marcasService, tecnicosService } from '../services/cadastros'
import { configEmpresaService } from '../services/multitenancy'
import { useAuth } from '../contexts/AuthContext'
import {
  formatDate,
  formatPhone,
  formatOSNumber,
  formatMoney,
  formatFullAddress,
  getLabelByValue,
  getStatusColor,
  getCategoryColor
} from '../utils/helpers'
import {
  OS_STATUS,
  OS_CATEGORIES,
  PAYMENT_METHODS
} from '../utils/constants'

export function OSView() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useAuth()

  const [ordem, setOrdem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showPrint, setShowPrint] = useState(false)
  const [activeTab, setActiveTab] = useState('defeito')

  // Mapas para lookup de nomes
  const [produtosMap, setProdutosMap] = useState({})
  const [marcasMap, setMarcasMap] = useState({})
  const [tecnicosMap, setTecnicosMap] = useState({})
  const [empresa, setEmpresa] = useState({})

  useEffect(() => {
    loadOrdem()
    loadCadastros()
  }, [id])

  const loadCadastros = async () => {
    const [produtosRes, marcasRes, tecnicosRes] = await Promise.all([
      produtosService.getAll(),
      marcasService.getAll(),
      tecnicosService.getAll()
    ])

    if (produtosRes.success) {
      const map = {}
      produtosRes.data.forEach(p => { map[p.id] = p.nome })
      setProdutosMap(map)
    }

    if (marcasRes.success) {
      const map = {}
      marcasRes.data.forEach(m => { map[m.id] = m.nome })
      setMarcasMap(map)
    }

    if (tecnicosRes.success) {
      const map = {}
      tecnicosRes.data.forEach(t => { map[t.id] = t.nome })
      setTecnicosMap(map)
    }

    // Carrega dados da empresa para impressão
    if (user?.empresaId) {
      const empresaRes = await configEmpresaService.get(user.empresaId)
      if (empresaRes.success) {
        setEmpresa(empresaRes.data)
      }
    }
  }

  // Helpers para obter nomes
  const getProdutoNome = (id) => produtosMap[id] || '-'
  const getMarcaNome = (id) => marcasMap[id] || '-'
  const getTecnicoNome = (id) => tecnicosMap[id] || 'Não atribuído'

  const loadOrdem = async () => {
    try {
      setLoading(true)
      const result = await osService.getById(id)
      if (result.success) {
        setOrdem(result.data)
      } else {
        setError('Ordem de serviço não encontrada')
      }
    } catch (err) {
      setError('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    setShowPrint(true)
    setTimeout(() => {
      window.print()
    }, 100)
  }

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja excluir esta ordem de serviço?')) {
      return
    }

    try {
      const result = await osService.delete(id)
      if (result.success) {
        navigate('/')
      } else {
        alert('Erro ao excluir ordem de serviço')
      }
    } catch (err) {
      alert('Erro ao conectar com o servidor')
    }
  }

  // Componente para exibir um campo
  const InfoField = ({ label, value, className = '' }) => (
    <div className={className}>
      <dt className="text-xs font-medium text-gray-500 uppercase">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900">{value || '-'}</dd>
    </div>
  )

  // Badges
  const StatusBadge = ({ status }) => {
    const label = getLabelByValue(OS_STATUS, status)
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
        {label}
      </span>
    )
  }

  const CategoryBadge = ({ category }) => {
    const label = getLabelByValue(OS_CATEGORIES, category)
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded text-sm font-medium ${getCategoryColor(category)}`}>
        {label}
      </span>
    )
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

  if (error) {
    return (
      <Layout>
        <Card className="p-6 text-center">
          <p className="text-red-600">{error}</p>
          <Button variant="secondary" className="mt-4" onClick={() => navigate('/')}>
            Voltar para lista
          </Button>
        </Card>
      </Layout>
    )
  }

  const tabs = [
    { id: 'defeito', label: 'Defeito', content: ordem.defeito },
    { id: 'pendencias', label: 'Pendências', content: ordem.pendencias },
    { id: 'historicoVisitas', label: 'Visitas', content: ordem.historicoVisitas },
    { id: 'garantias', label: 'Garantias', content: ordem.garantias }
  ]

  return (
    <>
      {/* Visualização normal */}
      <div className={showPrint ? 'hidden' : ''}>
        <Layout>
          {/* Cabeçalho */}
          <div className="mb-6">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar para lista
            </button>

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-bold text-gray-900">
                    OS {formatOSNumber(ordem.id)}
                  </h2>
                  <CategoryBadge category={ordem.categoria} />
                  <StatusBadge status={ordem.status} />
                </div>
                <p className="text-gray-600 mt-1">
                  Aberta em {formatDate(ordem.dataAbertura)}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={handlePrint}>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Imprimir
                </Button>
                <Button onClick={() => navigate(`/os/${id}/editar`)}>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Coluna principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cliente */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Cliente</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InfoField label="Nome" value={ordem.clienteNome} className="sm:col-span-2" />
                    <InfoField label="Telefone" value={formatPhone(ordem.clienteTelefone)} />
                  </dl>
                </CardContent>
              </Card>

              {/* Endereço */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Endereço</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-900">
                    {formatFullAddress(ordem)}
                  </p>
                  {ordem.enderecoPontoReferencia && (
                    <p className="text-sm text-gray-500 mt-2">
                      <span className="font-medium">Referência:</span> {ordem.enderecoPontoReferencia}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Equipamento */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Equipamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <InfoField label="Produto" value={getProdutoNome(ordem.equipamentoTipo)} />
                    <InfoField label="Marca" value={getMarcaNome(ordem.equipamentoMarca)} />
                    <InfoField label="Modelo" value={ordem.equipamentoModelo} />
                  </dl>
                </CardContent>
              </Card>

              {/* Detalhes - Tabs */}
              <Card>
                <CardHeader className="pb-0 border-b-0">
                  <div className="flex flex-wrap gap-1 border-b border-gray-200">
                    {tabs.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors
                          ${activeTab === tab.id
                            ? 'border-primary-600 text-primary-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  {tabs.map(tab => (
                    activeTab === tab.id && (
                      <div key={tab.id}>
                        {tab.content ? (
                          <p className="text-gray-700 whitespace-pre-wrap">{tab.content}</p>
                        ) : (
                          <p className="text-gray-400 italic">Nenhuma informação registrada</p>
                        )}
                      </div>
                    )
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Coluna lateral */}
            <div className="space-y-6">
              {/* Serviço */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Serviço</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-4">
                    <InfoField
                      label="Técnico"
                      value={getTecnicoNome(ordem.tecnicoId)}
                    />
                    <InfoField
                      label="Deslocamento"
                      value={ordem.deslocamento ? formatMoney(ordem.deslocamento) : '-'}
                    />
                  </dl>
                </CardContent>
              </Card>

              {/* Pagamento */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Pagamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-4">
                    <InfoField
                      label="Forma de Pagamento"
                      value={getLabelByValue(PAYMENT_METHODS, ordem.formaPagamento)}
                    />
                    <div>
                      <dt className="text-xs font-medium text-gray-500 uppercase">Valor Total</dt>
                      <dd className="mt-1 text-2xl font-bold text-gray-900">
                        {ordem.valorTotal ? formatMoney(ordem.valorTotal) : 'R$ 0,00'}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              {/* Ações */}
              <Card>
                <CardContent className="py-4">
                  <Button variant="danger" className="w-full" onClick={handleDelete}>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Excluir OS
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </Layout>
      </div>

      {/* Área de impressão */}
      {showPrint && (
        <ContractPrint
          ordem={ordem}
          onClose={() => setShowPrint(false)}
          produtosMap={produtosMap}
          marcasMap={marcasMap}
          empresa={empresa}
        />
      )}
    </>
  )
}

/**
 * Página de Lista de Ordens de Serviço
 */
import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/layout'
import { Button, Badge, Card, Loading, Select } from '../components/ui'
import { osService } from '../services/api'
import { produtosService, marcasService, tecnicosService } from '../services/cadastros'
import {
  formatDate,
  formatOSNumber,
  formatPhone,
  getLabelByValue,
  getStatusColor,
  getCategoryColor
} from '../utils/helpers'
import { OS_STATUS, OS_CATEGORIES } from '../utils/constants'
import { exportToCSV, exportToPDF, getOSExportColumns } from '../utils/export'

export function OSList() {
  const navigate = useNavigate()
  const [ordens, setOrdens] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')

  // Mapas para lookup de nomes
  const [produtosMap, setProdutosMap] = useState({})
  const [marcasMap, setMarcasMap] = useState({})
  const [tecnicosMap, setTecnicosMap] = useState({})

  // Filtros
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    status: '',
    categoria: '',
    tecnicoId: '',
    dataInicio: '',
    dataFim: ''
  })

  useEffect(() => {
    loadOrdens()
    loadCadastros()
  }, [])

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
  }

  // Handler para mudança de filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  // Limpa todos os filtros
  const clearFilters = () => {
    setFilters({
      status: '',
      categoria: '',
      tecnicoId: '',
      dataInicio: '',
      dataFim: ''
    })
  }

  // Verifica se há filtros ativos
  const hasActiveFilters = Object.values(filters).some(v => v !== '')

  // Exportar para CSV
  const handleExportCSV = () => {
    const columns = getOSExportColumns(produtosMap, marcasMap, tecnicosMap)
    exportToCSV(filteredOrdens, 'ordens-servico', columns)
  }

  // Exportar para PDF
  const handleExportPDF = () => {
    const columns = getOSExportColumns(produtosMap, marcasMap, tecnicosMap)
    const subtitle = hasActiveFilters ? 'Relatório filtrado' : 'Relatório completo'
    exportToPDF(filteredOrdens, 'Ordens de Serviço', columns, { subtitle })
  }

  const loadOrdens = async () => {
    try {
      setLoading(true)
      const result = await osService.getAll()
      if (result.success) {
        setOrdens(result.data)
      } else {
        setError('Erro ao carregar ordens de serviço')
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor')
    } finally {
      setLoading(false)
    }
  }

  // Helper para obter nome do produto/marca
  const getProdutoNome = (id) => produtosMap[id] || '-'
  const getMarcaNome = (id) => marcasMap[id] || '-'

  // Filtra ordens baseado no termo de busca e filtros
  const filteredOrdens = useMemo(() => {
    let result = ordens

    // Filtro de busca textual
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      result = result.filter(os =>
        os.clienteNome.toLowerCase().includes(term) ||
        String(os.id).includes(term) ||
        getProdutoNome(os.equipamentoTipo).toLowerCase().includes(term) ||
        getMarcaNome(os.equipamentoMarca).toLowerCase().includes(term)
      )
    }

    // Filtro por status
    if (filters.status) {
      result = result.filter(os => os.status === filters.status)
    }

    // Filtro por categoria
    if (filters.categoria) {
      result = result.filter(os => os.categoria === filters.categoria)
    }

    // Filtro por técnico
    if (filters.tecnicoId) {
      result = result.filter(os => String(os.tecnicoId) === filters.tecnicoId)
    }

    // Filtro por data início
    if (filters.dataInicio) {
      const dataInicio = new Date(filters.dataInicio)
      result = result.filter(os => new Date(os.dataAbertura) >= dataInicio)
    }

    // Filtro por data fim
    if (filters.dataFim) {
      const dataFim = new Date(filters.dataFim)
      dataFim.setHours(23, 59, 59, 999)
      result = result.filter(os => new Date(os.dataAbertura) <= dataFim)
    }

    return result
  }, [ordens, searchTerm, filters, produtosMap, marcasMap])

  // Opções para filtro de técnicos
  const tecnicosOptions = useMemo(() => {
    return [
      { value: '', label: 'Todos' },
      ...Object.entries(tecnicosMap).map(([id, nome]) => ({
        value: String(id),
        label: nome
      }))
    ]
  }, [tecnicosMap])

  const handleRowClick = (id) => {
    navigate(`/os/${id}`)
  }

  // Componente Badge customizado para status
  const StatusBadge = ({ status }) => {
    const label = getLabelByValue(OS_STATUS, status)
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
        {label}
      </span>
    )
  }

  // Componente Badge para categoria
  const CategoryBadge = ({ category }) => {
    const label = getLabelByValue(OS_CATEGORIES, category)
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(category)}`}>
        {label}
      </span>
    )
  }

  return (
    <Layout>
      {/* Cabeçalho */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Ordens de Serviço</h2>
            <p className="text-gray-600 mt-1">Gerencie todas as ordens de serviço</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {/* Botões de Exportação */}
            <div className="flex gap-2">
              <Button variant="secondary" onClick={handleExportCSV} title="Exportar CSV">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                CSV
              </Button>
              <Button variant="secondary" onClick={handleExportPDF} title="Exportar PDF">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                PDF
              </Button>
            </div>
            <Button onClick={() => navigate('/os/nova')}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nova OS
            </Button>
          </div>
        </div>
      </div>

      {/* Barra de busca e filtros */}
      <Card className="mb-6">
        <div className="p-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar por número, cliente ou equipamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <Button
              variant={showFilters ? 'primary' : 'secondary'}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filtros
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </Button>
          </div>

          {/* Painel de Filtros */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Todos</option>
                    {OS_STATUS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                  <select
                    name="categoria"
                    value={filters.categoria}
                    onChange={handleFilterChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Todas</option>
                    {OS_CATEGORIES.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Técnico</label>
                  <select
                    name="tecnicoId"
                    value={filters.tecnicoId}
                    onChange={handleFilterChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  >
                    {tecnicosOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data Início</label>
                  <input
                    type="date"
                    name="dataInicio"
                    value={filters.dataInicio}
                    onChange={handleFilterChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data Fim</label>
                  <input
                    type="date"
                    name="dataFim"
                    value={filters.dataFim}
                    onChange={handleFilterChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              {hasActiveFilters && (
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary-600 hover:text-primary-800"
                  >
                    Limpar filtros
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Conteúdo */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loading size="lg" />
        </div>
      ) : error ? (
        <Card className="p-6 text-center">
          <p className="text-red-600">{error}</p>
          <Button variant="secondary" className="mt-4" onClick={loadOrdens}>
            Tentar novamente
          </Button>
        </Card>
      ) : filteredOrdens.length === 0 ? (
        <Card className="p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {searchTerm ? 'Nenhuma OS encontrada' : 'Nenhuma ordem de serviço'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Tente buscar com outros termos.' : 'Comece criando uma nova ordem de serviço.'}
          </p>
          {!searchTerm && (
            <Button className="mt-4" onClick={() => navigate('/os/nova')}>
              Criar primeira OS
            </Button>
          )}
        </Card>
      ) : (
        <>
          {/* Tabela para desktop */}
          <Card className="hidden md:block overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      OS
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Equipamento
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrdens.map((os) => (
                    <tr
                      key={os.id}
                      onClick={() => handleRowClick(os.id)}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-primary-600">
                          {formatOSNumber(os.id)}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <CategoryBadge category={os.categoria} />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {os.clienteNome}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatPhone(os.clienteTelefone)}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-gray-900">
                            {getProdutoNome(os.equipamentoTipo)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {getMarcaNome(os.equipamentoMarca)}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <StatusBadge status={os.status} />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(os.dataAbertura)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Cards para mobile */}
          <div className="md:hidden space-y-4">
            {filteredOrdens.map((os) => (
              <Card
                key={os.id}
                className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleRowClick(os.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-primary-600">
                      {formatOSNumber(os.id)}
                    </span>
                    <CategoryBadge category={os.categoria} />
                  </div>
                  <StatusBadge status={os.status} />
                </div>
                <h3 className="font-medium text-gray-900">{os.clienteNome}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {getProdutoNome(os.equipamentoTipo)} - {getMarcaNome(os.equipamentoMarca)}
                </p>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    {formatDate(os.dataAbertura)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatPhone(os.clienteTelefone)}
                  </span>
                </div>
              </Card>
            ))}
          </div>

          {/* Contador */}
          <p className="text-sm text-gray-500 mt-4 text-center">
            Exibindo {filteredOrdens.length} de {ordens.length} ordens de serviço
          </p>
        </>
      )}
    </Layout>
  )
}

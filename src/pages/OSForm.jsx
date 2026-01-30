/**
 * Página de Cadastro/Edição de Ordem de Serviço
 */
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Layout } from '../components/layout'
import {
  Button,
  Input,
  Textarea,
  Select,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Loading
} from '../components/ui'
import { osService } from '../services/api'
import { buscarCep } from '../services/viaCep'
import { getProdutosOptions, getMarcasOptions, getTecnicosOptions } from '../services/cadastros'
import { clientesService } from '../services/clientes'
import { validateOSForm } from '../utils/validators'
import { formatDate, formatOSNumber } from '../utils/helpers'
import {
  OS_STATUS,
  OS_CATEGORIES,
  PAYMENT_METHODS,
  ESTADOS_BR
} from '../utils/constants'
import { PhotoUpload } from '../components/PhotoUpload'

// Estado inicial do formulário
const initialFormData = {
  categoria: '',
  status: 'aberta',
  // Cliente
  clienteId: '',
  clienteNome: '',
  clienteTelefone: '',
  // Endereço
  enderecoCep: '',
  enderecoRua: '',
  enderecoNumero: '',
  enderecoComplemento: '',
  enderecoBairro: '',
  enderecoCidade: '',
  enderecoUf: '',
  enderecoPontoReferencia: '',
  // Equipamento
  equipamentoTipo: '',
  equipamentoMarca: '',
  equipamentoModelo: '',
  // Serviço
  tecnicoId: '',
  deslocamento: '',
  // Financeiro
  formaPagamento: '',
  valorTotal: '',
  // Detalhes
  defeito: '',
  pendencias: '',
  historicoVisitas: '',
  garantias: '',
  // Fotos
  fotos: []
}

export function OSForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = !!id

  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(isEditing)
  const [loadingCep, setLoadingCep] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [activeTab, setActiveTab] = useState('defeito')

  // Opções dinâmicas dos cadastros
  const [produtosOptions, setProdutosOptions] = useState([])
  const [marcasOptions, setMarcasOptions] = useState([])
  const [tecnicosOptions, setTecnicosOptions] = useState([{ value: '', label: 'Não atribuído' }])

  // Busca de clientes
  const [clienteSearch, setClienteSearch] = useState('')
  const [clienteResults, setClienteResults] = useState([])
  const [showClienteDropdown, setShowClienteDropdown] = useState(false)
  const [searchingCliente, setSearchingCliente] = useState(false)

  // Carrega opções dos cadastros
  useEffect(() => {
    async function loadOptions() {
      const [produtos, marcas, tecnicos] = await Promise.all([
        getProdutosOptions(),
        getMarcasOptions(),
        getTecnicosOptions()
      ])
      setProdutosOptions(produtos)
      setMarcasOptions(marcas)
      setTecnicosOptions(tecnicos)
    }
    loadOptions()
  }, [])

  // Busca clientes conforme digita
  useEffect(() => {
    const searchClientes = async () => {
      if (clienteSearch.length < 2) {
        setClienteResults([])
        return
      }
      setSearchingCliente(true)
      try {
        const result = await clientesService.search(clienteSearch)
        if (result.success) {
          setClienteResults(result.data)
        }
      } finally {
        setSearchingCliente(false)
      }
    }

    const debounce = setTimeout(searchClientes, 300)
    return () => clearTimeout(debounce)
  }, [clienteSearch])

  // Seleciona um cliente e preenche os campos
  const handleSelectCliente = (cliente) => {
    setFormData(prev => ({
      ...prev,
      clienteId: cliente.id,
      clienteNome: cliente.nome,
      clienteTelefone: cliente.telefone,
      enderecoCep: cliente.enderecoCep || prev.enderecoCep,
      enderecoRua: cliente.enderecoRua || prev.enderecoRua,
      enderecoNumero: cliente.enderecoNumero || prev.enderecoNumero,
      enderecoComplemento: cliente.enderecoComplemento || prev.enderecoComplemento,
      enderecoBairro: cliente.enderecoBairro || prev.enderecoBairro,
      enderecoCidade: cliente.enderecoCidade || prev.enderecoCidade,
      enderecoUf: cliente.enderecoUf || prev.enderecoUf,
      enderecoPontoReferencia: cliente.enderecoPontoReferencia || prev.enderecoPontoReferencia
    }))
    setClienteSearch('')
    setShowClienteDropdown(false)
    setClienteResults([])
    // Limpa erros relacionados
    setErrors(prev => ({
      ...prev,
      clienteNome: '',
      clienteTelefone: '',
      enderecoCep: '',
      enderecoRua: '',
      enderecoBairro: '',
      enderecoCidade: '',
      enderecoUf: ''
    }))
  }

  // Limpa seleção de cliente
  const handleClearCliente = () => {
    setFormData(prev => ({
      ...prev,
      clienteId: '',
      clienteNome: '',
      clienteTelefone: '',
      enderecoCep: '',
      enderecoRua: '',
      enderecoNumero: '',
      enderecoComplemento: '',
      enderecoBairro: '',
      enderecoCidade: '',
      enderecoUf: '',
      enderecoPontoReferencia: ''
    }))
  }

  // Carrega dados da OS se estiver editando
  useEffect(() => {
    if (isEditing) {
      loadOS()
    }
  }, [id])

  const loadOS = async () => {
    try {
      setLoadingData(true)
      const result = await osService.getById(id)
      if (result.success) {
        setFormData({ ...initialFormData, ...result.data })
      } else {
        setSubmitError('Ordem de serviço não encontrada')
      }
    } catch (err) {
      setSubmitError('Erro ao carregar dados')
    } finally {
      setLoadingData(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    if (submitError) {
      setSubmitError('')
    }
  }

  // Busca CEP automaticamente
  const handleCepBlur = async () => {
    const cep = formData.enderecoCep.replace(/\D/g, '')
    if (cep.length !== 8) return

    setLoadingCep(true)
    try {
      const result = await buscarCep(cep)
      if (result.success) {
        setFormData(prev => ({
          ...prev,
          enderecoRua: result.data.logradouro || prev.enderecoRua,
          enderecoBairro: result.data.bairro || prev.enderecoBairro,
          enderecoCidade: result.data.cidade || prev.enderecoCidade,
          enderecoUf: result.data.uf || prev.enderecoUf,
          enderecoComplemento: result.data.complemento || prev.enderecoComplemento
        }))
        // Limpa erros de endereço se preencheu
        setErrors(prev => ({
          ...prev,
          enderecoRua: '',
          enderecoBairro: '',
          enderecoCidade: '',
          enderecoUf: ''
        }))
      }
    } catch (err) {
      console.error('Erro ao buscar CEP:', err)
    } finally {
      setLoadingCep(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validation = validateOSForm(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      // Scroll para o primeiro erro
      const firstError = document.querySelector('.text-red-600')
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setLoading(true)
    setSubmitError('')

    try {
      const result = isEditing
        ? await osService.update(id, formData)
        : await osService.create(formData)

      if (result.success) {
        navigate(isEditing ? `/os/${id}` : '/')
      } else {
        setSubmitError(result.error || 'Erro ao salvar')
      }
    } catch (err) {
      setSubmitError('Erro ao conectar com o servidor')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (window.confirm('Deseja cancelar? As alterações não salvas serão perdidas.')) {
      navigate(isEditing ? `/os/${id}` : '/')
    }
  }

  if (loadingData) {
    return (
      <Layout>
        <div className="flex justify-center py-12">
          <Loading size="lg" />
        </div>
      </Layout>
    )
  }

  // Tabs para detalhes
  const tabs = [
    { id: 'defeito', label: 'Defeito' },
    { id: 'pendencias', label: 'Pendências' },
    { id: 'historicoVisitas', label: 'Visitas' },
    { id: 'garantias', label: 'Garantias' },
    { id: 'fotos', label: 'Fotos' }
  ]

  // Handler para atualização de fotos
  const handlePhotosChange = (newPhotos) => {
    setFormData(prev => ({ ...prev, fotos: newPhotos }))
  }

  return (
    <Layout>
      {/* Cabeçalho */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? `Editar OS ${formatOSNumber(formData.id)}` : 'Nova Ordem de Serviço'}
          </h2>
          {isEditing && (
            <span className="text-sm text-gray-500">
              Aberta em {formatDate(formData.dataAbertura)}
            </span>
          )}
        </div>
      </div>

      {submitError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{submitError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Cabeçalho da OS - Categoria, Status */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select
                label="Categoria da OS"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                options={OS_CATEGORIES}
                error={errors.categoria}
                placeholder="Selecione..."
                required
              />

              <Select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={OS_STATUS}
                required
              />

              <Select
                label="Técnico"
                name="tecnicoId"
                value={formData.tecnicoId}
                onChange={handleChange}
                options={tecnicosOptions}
              />

              <Input
                label="Deslocamento (R$)"
                name="deslocamento"
                type="number"
                min="0"
                step="0.01"
                value={formData.deslocamento}
                onChange={handleChange}
                placeholder="0,00"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dados do Cliente */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Busca de Cliente Cadastrado */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar Cliente Cadastrado
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={clienteSearch}
                    onChange={(e) => {
                      setClienteSearch(e.target.value)
                      setShowClienteDropdown(true)
                    }}
                    onFocus={() => setShowClienteDropdown(true)}
                    placeholder="Digite nome, telefone ou CPF/CNPJ..."
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                  {searchingCliente && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loading size="sm" />
                    </div>
                  )}
                  {/* Dropdown de resultados */}
                  {showClienteDropdown && clienteResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                      {clienteResults.map(cliente => (
                        <button
                          key={cliente.id}
                          type="button"
                          onClick={() => handleSelectCliente(cliente)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0"
                        >
                          <div className="font-medium text-gray-900">{cliente.nome}</div>
                          <div className="text-sm text-gray-500">
                            {cliente.telefone} {cliente.enderecoCidade && `- ${cliente.enderecoCidade}/${cliente.enderecoUf}`}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {formData.clienteId && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm text-green-600">Cliente selecionado</span>
                    <button
                      type="button"
                      onClick={handleClearCliente}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Limpar
                    </button>
                  </div>
                )}
              </div>

              {/* Campos do Cliente */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Nome"
                  name="clienteNome"
                  value={formData.clienteNome}
                  onChange={handleChange}
                  placeholder="Nome do cliente"
                  error={errors.clienteNome}
                  required
                  className="sm:col-span-2"
                />

                <Input
                  label="Celular"
                  name="clienteTelefone"
                  value={formData.clienteTelefone}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                  error={errors.clienteTelefone}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Equipamento */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Equipamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Produto"
                  name="equipamentoTipo"
                  value={formData.equipamentoTipo}
                  onChange={handleChange}
                  options={produtosOptions}
                  error={errors.equipamentoTipo}
                  placeholder="Selecione..."
                  required
                />

                <Select
                  label="Marca"
                  name="equipamentoMarca"
                  value={formData.equipamentoMarca}
                  onChange={handleChange}
                  options={marcasOptions}
                  error={errors.equipamentoMarca}
                  placeholder="Selecione..."
                  required
                />

                <Input
                  label="Modelo"
                  name="equipamentoModelo"
                  value={formData.equipamentoModelo}
                  onChange={handleChange}
                  placeholder="Modelo do equipamento"
                  className="sm:col-span-2"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Endereço */}
        <Card className="mt-6">
          <CardHeader className="pb-3">
            <CardTitle>Endereço</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <Input
                  label="CEP"
                  name="enderecoCep"
                  value={formData.enderecoCep}
                  onChange={handleChange}
                  onBlur={handleCepBlur}
                  placeholder="00000-000"
                  error={errors.enderecoCep}
                  required
                />
                {loadingCep && (
                  <span className="text-xs text-primary-600">Buscando...</span>
                )}
              </div>

              <div className="col-span-2 sm:col-span-3 lg:col-span-3">
                <Input
                  label="Rua"
                  name="enderecoRua"
                  value={formData.enderecoRua}
                  onChange={handleChange}
                  placeholder="Logradouro"
                  error={errors.enderecoRua}
                  required
                />
              </div>

              <div className="col-span-1">
                <Input
                  label="Nº"
                  name="enderecoNumero"
                  value={formData.enderecoNumero}
                  onChange={handleChange}
                  placeholder="Nº"
                />
              </div>

              <div className="col-span-1">
                <Input
                  label="Compl."
                  name="enderecoComplemento"
                  value={formData.enderecoComplemento}
                  onChange={handleChange}
                  placeholder="Apto, Bloco"
                />
              </div>

              <div className="col-span-2 sm:col-span-2">
                <Input
                  label="Bairro"
                  name="enderecoBairro"
                  value={formData.enderecoBairro}
                  onChange={handleChange}
                  placeholder="Bairro"
                  error={errors.enderecoBairro}
                  required
                />
              </div>

              <div className="col-span-2 sm:col-span-2">
                <Input
                  label="Cidade"
                  name="enderecoCidade"
                  value={formData.enderecoCidade}
                  onChange={handleChange}
                  placeholder="Cidade"
                  error={errors.enderecoCidade}
                  required
                />
              </div>

              <div className="col-span-1">
                <Select
                  label="UF"
                  name="enderecoUf"
                  value={formData.enderecoUf}
                  onChange={handleChange}
                  options={ESTADOS_BR}
                  error={errors.enderecoUf}
                  placeholder="UF"
                  required
                />
              </div>

              <div className="col-span-2 sm:col-span-4 lg:col-span-6">
                <Input
                  label="Ponto de Referência"
                  name="enderecoPontoReferencia"
                  value={formData.enderecoPontoReferencia}
                  onChange={handleChange}
                  placeholder="Próximo a..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pagamento */}
        <Card className="mt-6">
          <CardHeader className="pb-3">
            <CardTitle>Pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Forma de Pagamento"
                name="formaPagamento"
                value={formData.formaPagamento}
                onChange={handleChange}
                options={PAYMENT_METHODS}
              />

              <Input
                label="Valor Total (R$)"
                name="valorTotal"
                type="number"
                min="0"
                step="0.01"
                value={formData.valorTotal}
                onChange={handleChange}
                placeholder="0,00"
                error={errors.valorTotal}
              />
            </div>
          </CardContent>
        </Card>

        {/* Detalhes - Tabs */}
        <Card className="mt-6">
          <CardHeader className="pb-0 border-b-0">
            <div className="flex flex-wrap gap-1 border-b border-gray-200">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  type="button"
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
            {activeTab === 'defeito' && (
              <Textarea
                label="Defeito Relatado"
                name="defeito"
                value={formData.defeito}
                onChange={handleChange}
                placeholder="Descreva o defeito ou problema relatado pelo cliente..."
                error={errors.defeito}
                rows={5}
                required
              />
            )}

            {activeTab === 'pendencias' && (
              <Textarea
                label="Pendências"
                name="pendencias"
                value={formData.pendencias}
                onChange={handleChange}
                placeholder="Pendências do serviço..."
                rows={5}
              />
            )}

            {activeTab === 'historicoVisitas' && (
              <Textarea
                label="Histórico de Visitas"
                name="historicoVisitas"
                value={formData.historicoVisitas}
                onChange={handleChange}
                placeholder="Histórico de visitas anteriores..."
                rows={5}
              />
            )}

            {activeTab === 'garantias' && (
              <Textarea
                label="Garantias"
                name="garantias"
                value={formData.garantias}
                onChange={handleChange}
                placeholder="Informações sobre garantias..."
                rows={5}
              />
            )}

            {activeTab === 'fotos' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fotos do Serviço
                </label>
                <PhotoUpload
                  photos={formData.fotos || []}
                  onChange={handlePhotosChange}
                  maxPhotos={5}
                />
                <p className="mt-2 text-xs text-gray-500">
                  Adicione fotos do equipamento, defeito ou serviço realizado.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Botões de ação */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            className="sm:w-auto w-full"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={loading}
            className="sm:w-auto w-full"
          >
            {isEditing ? 'Salvar Alterações' : 'Criar Ordem de Serviço'}
          </Button>
        </div>
      </form>
    </Layout>
  )
}

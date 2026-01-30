/**
 * Página de Cadastro de Clientes
 */
import { useState, useEffect } from 'react'
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
  Loading,
  Modal
} from '../components/ui'
import { clientesService } from '../services/clientes'
import { buscarCep } from '../services/viaCep'
import { formatPhone, formatCep } from '../utils/helpers'
import { ESTADOS_BR } from '../utils/constants'

// Estado inicial do formulário
const initialFormData = {
  nome: '',
  telefone: '',
  email: '',
  cpfCnpj: '',
  enderecoCep: '',
  enderecoRua: '',
  enderecoNumero: '',
  enderecoComplemento: '',
  enderecoBairro: '',
  enderecoCidade: '',
  enderecoUf: '',
  enderecoPontoReferencia: '',
  observacoes: ''
}

export function Clientes() {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState(initialFormData)
  const [formErrors, setFormErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [loadingCep, setLoadingCep] = useState(false)

  useEffect(() => {
    loadClientes()
  }, [])

  const loadClientes = async () => {
    try {
      setLoading(true)
      const result = await clientesService.getAll()
      if (result.success) {
        setClientes(result.data)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (cliente = null) => {
    if (cliente) {
      setEditingId(cliente.id)
      setFormData({
        nome: cliente.nome || '',
        telefone: cliente.telefone || '',
        email: cliente.email || '',
        cpfCnpj: cliente.cpfCnpj || '',
        enderecoCep: cliente.enderecoCep || '',
        enderecoRua: cliente.enderecoRua || '',
        enderecoNumero: cliente.enderecoNumero || '',
        enderecoComplemento: cliente.enderecoComplemento || '',
        enderecoBairro: cliente.enderecoBairro || '',
        enderecoCidade: cliente.enderecoCidade || '',
        enderecoUf: cliente.enderecoUf || '',
        enderecoPontoReferencia: cliente.enderecoPontoReferencia || '',
        observacoes: cliente.observacoes || ''
      })
    } else {
      setEditingId(null)
      setFormData(initialFormData)
    }
    setFormErrors({})
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingId(null)
    setFormData(initialFormData)
    setFormErrors({})
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
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
      }
    } finally {
      setLoadingCep(false)
    }
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.nome.trim()) errors.nome = 'Nome é obrigatório'
    if (!formData.telefone.trim()) errors.telefone = 'Telefone é obrigatório'
    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errors = validateForm()

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setSubmitting(true)
    try {
      const result = editingId
        ? await clientesService.update(editingId, formData)
        : await clientesService.create(formData)

      if (result.success) {
        handleCloseModal()
        loadClientes()
      } else {
        setFormErrors({ submit: result.error })
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleAtivo = async (id) => {
    const result = await clientesService.toggleAtivo(id)
    if (result.success) {
      loadClientes()
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      const result = await clientesService.delete(id)
      if (result.success) {
        loadClientes()
      }
    }
  }

  // Filtra clientes
  const filteredClientes = clientes.filter(c =>
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.telefone.includes(searchTerm) ||
    (c.cpfCnpj && c.cpfCnpj.includes(searchTerm))
  )

  return (
    <Layout>
      {/* Cabeçalho */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Clientes</h2>
            <p className="text-gray-600 mt-1">Gerencie o cadastro de clientes</p>
          </div>
          <Button onClick={() => handleOpenModal()}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Novo Cliente
          </Button>
        </div>
      </div>

      {/* Busca */}
      <Card className="mb-6">
        <div className="p-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar por nome, telefone ou CPF/CNPJ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </Card>

      {/* Lista de Clientes */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loading size="lg" />
        </div>
      ) : filteredClientes.length === 0 ? (
        <Card className="p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum cliente encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Tente buscar com outros termos.' : 'Comece cadastrando seu primeiro cliente.'}
          </p>
          {!searchTerm && (
            <Button className="mt-4" onClick={() => handleOpenModal()}>
              Cadastrar Cliente
            </Button>
          )}
        </Card>
      ) : (
        <>
          {/* Tabela Desktop */}
          <Card className="hidden md:block overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefone</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">CPF/CNPJ</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cidade</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredClientes.map(cliente => (
                    <tr key={cliente.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{cliente.nome}</div>
                        {cliente.email && (
                          <div className="text-sm text-gray-500">{cliente.email}</div>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPhone(cliente.telefone)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cliente.cpfCnpj || '-'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cliente.enderecoCidade ? `${cliente.enderecoCidade}/${cliente.enderecoUf}` : '-'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          cliente.ativo
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {cliente.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                        <button
                          onClick={() => handleOpenModal(cliente)}
                          className="text-primary-600 hover:text-primary-900 mr-3"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleToggleAtivo(cliente.id)}
                          className="text-gray-600 hover:text-gray-900 mr-3"
                        >
                          {cliente.ativo ? 'Desativar' : 'Ativar'}
                        </button>
                        <button
                          onClick={() => handleDelete(cliente.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Cards Mobile */}
          <div className="md:hidden space-y-4">
            {filteredClientes.map(cliente => (
              <Card key={cliente.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900">{cliente.nome}</h3>
                    <p className="text-sm text-gray-500">{formatPhone(cliente.telefone)}</p>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    cliente.ativo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {cliente.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                {cliente.enderecoCidade && (
                  <p className="text-sm text-gray-500 mb-3">
                    {cliente.enderecoCidade}/{cliente.enderecoUf}
                  </p>
                )}
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <Button variant="secondary" size="sm" onClick={() => handleOpenModal(cliente)}>
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleAtivo(cliente.id)}
                  >
                    {cliente.ativo ? 'Desativar' : 'Ativar'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <p className="text-sm text-gray-500 mt-4 text-center">
            Exibindo {filteredClientes.length} de {clientes.length} clientes
          </p>
        </>
      )}

      {/* Modal de Cadastro/Edição */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingId ? 'Editar Cliente' : 'Novo Cliente'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          {formErrors.submit && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{formErrors.submit}</p>
            </div>
          )}

          {/* Dados Básicos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Input
              label="Nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              error={formErrors.nome}
              placeholder="Nome completo ou razão social"
              required
              className="sm:col-span-2"
            />

            <Input
              label="Telefone"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              error={formErrors.telefone}
              placeholder="(00) 00000-0000"
              required
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@exemplo.com"
            />

            <Input
              label="CPF/CNPJ"
              name="cpfCnpj"
              value={formData.cpfCnpj}
              onChange={handleChange}
              placeholder="000.000.000-00 ou 00.000.000/0001-00"
              className="sm:col-span-2"
            />
          </div>

          {/* Endereço */}
          <div className="border-t border-gray-200 pt-4 mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Endereço</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="col-span-1">
                <Input
                  label="CEP"
                  name="enderecoCep"
                  value={formData.enderecoCep}
                  onChange={handleChange}
                  onBlur={handleCepBlur}
                  placeholder="00000-000"
                />
                {loadingCep && (
                  <span className="text-xs text-primary-600">Buscando...</span>
                )}
              </div>

              <div className="col-span-2 sm:col-span-3">
                <Input
                  label="Rua"
                  name="enderecoRua"
                  value={formData.enderecoRua}
                  onChange={handleChange}
                  placeholder="Logradouro"
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
                  label="Complemento"
                  name="enderecoComplemento"
                  value={formData.enderecoComplemento}
                  onChange={handleChange}
                  placeholder="Apto, Bloco"
                />
              </div>

              <div className="col-span-2">
                <Input
                  label="Bairro"
                  name="enderecoBairro"
                  value={formData.enderecoBairro}
                  onChange={handleChange}
                  placeholder="Bairro"
                />
              </div>

              <div className="col-span-2">
                <Input
                  label="Cidade"
                  name="enderecoCidade"
                  value={formData.enderecoCidade}
                  onChange={handleChange}
                  placeholder="Cidade"
                />
              </div>

              <div className="col-span-1">
                <Select
                  label="UF"
                  name="enderecoUf"
                  value={formData.enderecoUf}
                  onChange={handleChange}
                  options={ESTADOS_BR}
                  placeholder="UF"
                />
              </div>

              <div className="col-span-2 sm:col-span-4">
                <Input
                  label="Ponto de Referência"
                  name="enderecoPontoReferencia"
                  value={formData.enderecoPontoReferencia}
                  onChange={handleChange}
                  placeholder="Próximo a..."
                />
              </div>
            </div>
          </div>

          {/* Observações */}
          <div className="border-t border-gray-200 pt-4 mb-4">
            <Textarea
              label="Observações"
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              placeholder="Observações sobre o cliente..."
              rows={3}
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button type="submit" loading={submitting}>
              {editingId ? 'Salvar' : 'Cadastrar'}
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  )
}

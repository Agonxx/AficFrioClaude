/**
 * Gerenciamento de Empresas (Super Admin)
 */
import { useState, useEffect } from 'react'
import { Layout } from '../../components/layout'
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Loading
} from '../../components/ui'
import { empresasService } from '../../services/multitenancy'
import { formatPhone } from '../../utils/helpers'

const PLANOS = [
  { value: 'basico', label: 'Básico' },
  { value: 'premium', label: 'Premium' }
]

export function SuperAdminEmpresas() {
  const [empresas, setEmpresas] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingEmpresa, setEditingEmpresa] = useState(null)
  const [formData, setFormData] = useState({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadEmpresas()
  }, [])

  const loadEmpresas = async () => {
    try {
      const result = await empresasService.getAll()
      if (result.success) {
        setEmpresas(result.data)
      }
    } catch (error) {
      console.error('Erro ao carregar empresas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (empresa = null) => {
    if (empresa) {
      setEditingEmpresa(empresa)
      setFormData({ ...empresa })
    } else {
      setEditingEmpresa(null)
      setFormData({
        nome: '',
        nomeFantasia: '',
        cnpj: '',
        email: '',
        telefone: '',
        endereco: '',
        cidade: '',
        uf: '',
        cep: '',
        plano: 'basico'
      })
    }
    setError('')
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingEmpresa(null)
    setFormData({})
    setError('')
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      let result
      if (editingEmpresa) {
        result = await empresasService.update(editingEmpresa.id, formData)
      } else {
        result = await empresasService.create(formData)
      }

      if (result.success) {
        await loadEmpresas()
        handleCloseModal()
      } else {
        setError(result.error)
      }
    } catch (error) {
      setError('Erro ao salvar empresa')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleAtivo = async (id) => {
    try {
      await empresasService.toggleAtivo(id)
      await loadEmpresas()
    } catch (error) {
      console.error('Erro ao alterar status:', error)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta empresa?')) return

    try {
      await empresasService.delete(id)
      await loadEmpresas()
    } catch (error) {
      console.error('Erro ao excluir:', error)
    }
  }

  const filteredEmpresas = empresas.filter(e =>
    e.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.cnpj.includes(searchTerm) ||
    e.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Empresas</h1>
          <p className="text-gray-600">Gerencie as empresas clientes</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nova Empresa
        </Button>
      </div>

      {/* Busca */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <Input
            placeholder="Buscar por nome, CNPJ ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Lista de empresas */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Empresa</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">CNPJ</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Contato</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Plano</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmpresas.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">
                      Nenhuma empresa encontrada
                    </td>
                  </tr>
                ) : (
                  filteredEmpresas.map(empresa => (
                    <tr key={empresa.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900">{empresa.nome}</p>
                        <p className="text-sm text-gray-500">{empresa.nomeFantasia}</p>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{empresa.cnpj}</td>
                      <td className="py-3 px-4">
                        <p className="text-gray-900">{empresa.email}</p>
                        <p className="text-sm text-gray-500">{formatPhone(empresa.telefone)}</p>
                      </td>
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
                        <button
                          onClick={() => handleToggleAtivo(empresa.id)}
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full cursor-pointer
                            ${empresa.ativo
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                            }`}
                        >
                          {empresa.ativo ? 'Ativo' : 'Inativo'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleOpenModal(empresa)}
                          className="text-primary-600 hover:text-primary-700 mr-3"
                          title="Editar"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(empresa.id)}
                          className="text-red-600 hover:text-red-700"
                          title="Excluir"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de cadastro/edição */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingEmpresa ? 'Editar Empresa' : 'Nova Empresa'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Razão Social"
                  name="nome"
                  value={formData.nome || ''}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Nome Fantasia"
                  name="nomeFantasia"
                  value={formData.nomeFantasia || ''}
                  onChange={handleChange}
                />
                <Input
                  label="CNPJ"
                  name="cnpj"
                  value={formData.cnpj || ''}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Telefone"
                  name="telefone"
                  value={formData.telefone || ''}
                  onChange={handleChange}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plano
                  </label>
                  <select
                    name="plano"
                    value={formData.plano || 'basico'}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {PLANOS.map(p => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Endereço"
                  name="endereco"
                  value={formData.endereco || ''}
                  onChange={handleChange}
                  className="md:col-span-2"
                />
                <Input
                  label="Cidade"
                  name="cidade"
                  value={formData.cidade || ''}
                  onChange={handleChange}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="UF"
                    name="uf"
                    value={formData.uf || ''}
                    onChange={handleChange}
                    maxLength={2}
                  />
                  <Input
                    label="CEP"
                    name="cep"
                    value={formData.cep || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <Button type="button" variant="secondary" onClick={handleCloseModal}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  )
}

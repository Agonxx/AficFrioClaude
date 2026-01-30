/**
 * Gestão de Usuários (Admin Empresa)
 */
import { useState, useEffect } from 'react'
import { Layout } from '../../components/layout'
import { Button, Card, CardContent, Input, Loading } from '../../components/ui'
import { useAuth } from '../../contexts/AuthContext'
import { usuariosService } from '../../services/multitenancy'
import { formatPhone } from '../../utils/helpers'

const ROLES = [
  { value: 'admin_empresa', label: 'Administrador' },
  { value: 'user', label: 'Usuário' }
]

export function AdminUsuarios() {
  const { user } = useAuth()
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingUsuario, setEditingUsuario] = useState(null)
  const [formData, setFormData] = useState({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadUsuarios()
  }, [user])

  const loadUsuarios = async () => {
    if (!user?.empresaId) return

    try {
      const result = await usuariosService.getAll(user.empresaId)
      if (result.success) {
        setUsuarios(result.data)
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (usuario = null) => {
    if (usuario) {
      setEditingUsuario(usuario)
      setFormData({ ...usuario })
    } else {
      setEditingUsuario(null)
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        role: 'user',
        empresaId: user.empresaId
      })
    }
    setError('')
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingUsuario(null)
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
      if (editingUsuario) {
        result = await usuariosService.update(editingUsuario.id, formData)
      } else {
        result = await usuariosService.create({
          ...formData,
          empresaId: user.empresaId
        })
      }

      if (result.success) {
        await loadUsuarios()
        handleCloseModal()
      } else {
        setError(result.error)
      }
    } catch (error) {
      setError('Erro ao salvar usuário')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleAtivo = async (id) => {
    try {
      await usuariosService.toggleAtivo(id)
      await loadUsuarios()
    } catch (error) {
      console.error('Erro ao alterar status:', error)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return

    try {
      await usuariosService.delete(id)
      await loadUsuarios()
    } catch (error) {
      console.error('Erro ao excluir:', error)
    }
  }

  const filteredUsuarios = usuarios.filter(u =>
    u.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoleLabel = (role) => {
    const found = ROLES.find(r => r.value === role)
    return found ? found.label : role
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

  return (
    <Layout>
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
          <p className="text-gray-600">Gerencie os usuários da sua empresa</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo Usuário
        </Button>
      </div>

      {/* Busca */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <Input
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Lista de usuários */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsuarios.length === 0 ? (
          <Card className="md:col-span-2 lg:col-span-3">
            <CardContent className="p-8 text-center text-gray-500">
              Nenhum usuário encontrado
            </CardContent>
          </Card>
        ) : (
          filteredUsuarios.map(usuario => (
            <Card key={usuario.id} className={!usuario.ativo ? 'opacity-60' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-700 font-bold text-lg">
                        {usuario.nome.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{usuario.nome}</h3>
                      <p className="text-sm text-gray-500">{usuario.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleOpenModal(usuario)}
                      className="p-1 text-gray-400 hover:text-primary-600"
                      title="Editar"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(usuario.id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                      title="Excluir"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full
                      ${usuario.role === 'admin_empresa'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {getRoleLabel(usuario.role)}
                    </span>
                    <button
                      onClick={() => handleToggleAtivo(usuario.id)}
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full cursor-pointer
                        ${usuario.ativo
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                    >
                      {usuario.ativo ? 'Ativo' : 'Inativo'}
                    </button>
                  </div>
                  {usuario.telefone && (
                    <span className="text-sm text-gray-500">
                      {formatPhone(usuario.telefone)}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal de cadastro/edição */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingUsuario ? 'Editar Usuário' : 'Novo Usuário'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <Input
                  label="Nome"
                  name="nome"
                  value={formData.nome || ''}
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
                    Perfil
                  </label>
                  <select
                    name="role"
                    value={formData.role || 'user'}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    {ROLES.map(r => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
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

/**
 * Componente base para páginas de cadastro (CRUD)
 * Reutilizável para Produtos, Marcas e Técnicos
 */
import { useState, useEffect } from 'react'
import { Layout } from '../../components/layout'
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Loading
} from '../../components/ui'

export function CadastroBase({
  title,
  service,
  fields = [{ name: 'nome', label: 'Nome', required: true }],
  icon
}) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({})
  const [formError, setFormError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  // Carrega dados ao montar
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const result = await service.getAll()
      if (result.success) {
        setItems(result.data)
      } else {
        setError('Erro ao carregar dados')
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor')
    } finally {
      setLoading(false)
    }
  }

  // Inicializa formulário vazio
  const getEmptyForm = () => {
    const empty = {}
    fields.forEach(f => { empty[f.name] = '' })
    return empty
  }

  // Abre formulário para novo item
  const handleNew = () => {
    setFormData(getEmptyForm())
    setEditingId(null)
    setFormError('')
    setShowForm(true)
  }

  // Abre formulário para editar
  const handleEdit = (item) => {
    const data = {}
    fields.forEach(f => { data[f.name] = item[f.name] || '' })
    setFormData(data)
    setEditingId(item.id)
    setFormError('')
    setShowForm(true)
  }

  // Fecha formulário
  const handleCancel = () => {
    setShowForm(false)
    setFormData(getEmptyForm())
    setEditingId(null)
    setFormError('')
  }

  // Salva item
  const handleSave = async (e) => {
    e.preventDefault()

    // Valida campos obrigatórios
    for (const field of fields) {
      if (field.required && !formData[field.name]?.trim()) {
        setFormError(`${field.label} é obrigatório`)
        return
      }
    }

    setSaving(true)
    setFormError('')

    try {
      const result = editingId
        ? await service.update(editingId, formData)
        : await service.create(formData)

      if (result.success) {
        await loadData()
        handleCancel()
      } else {
        setFormError(result.error || 'Erro ao salvar')
      }
    } catch (err) {
      setFormError('Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  // Alterna status ativo/inativo
  const handleToggleAtivo = async (id) => {
    try {
      const result = await service.toggleAtivo(id)
      if (result.success) {
        setItems(items.map(i =>
          i.id === id ? { ...i, ativo: result.data.ativo } : i
        ))
      }
    } catch (err) {
      console.error('Erro ao alterar status:', err)
    }
  }

  // Exclui item
  const handleDelete = async (id, nome) => {
    if (!window.confirm(`Deseja excluir "${nome}"?`)) return

    try {
      const result = await service.delete(id)
      if (result.success) {
        setItems(items.filter(i => i.id !== id))
      } else {
        alert(result.error || 'Erro ao excluir')
      }
    } catch (err) {
      alert('Erro ao excluir')
    }
  }

  // Filtra itens pela busca
  const filteredItems = items.filter(item =>
    item.nome.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Separa ativos e inativos
  const ativos = filteredItems.filter(i => i.ativo)
  const inativos = filteredItems.filter(i => !i.ativo)

  return (
    <Layout>
      {/* Cabeçalho */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center">
            {icon && <span className="mr-3 text-primary-600">{icon}</span>}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
              <p className="text-gray-600 mt-1">
                {items.length} {items.length === 1 ? 'item cadastrado' : 'itens cadastrados'}
              </p>
            </div>
          </div>
          <Button onClick={handleNew}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Novo
          </Button>
        </div>
      </div>

      {/* Formulário modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>
                {editingId ? 'Editar' : 'Novo'} {title.replace(/s$/, '')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave}>
                {formError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{formError}</p>
                  </div>
                )}

                {fields.map(field => (
                  <Input
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    type={field.type || 'text'}
                    value={formData[field.name] || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      [field.name]: e.target.value
                    })}
                    placeholder={field.placeholder || `Digite ${field.label.toLowerCase()}`}
                    required={field.required}
                  />
                ))}

                <div className="flex gap-3 mt-6">
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    onClick={handleCancel}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    loading={saving}
                  >
                    Salvar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

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
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
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
          <Button variant="secondary" className="mt-4" onClick={loadData}>
            Tentar novamente
          </Button>
        </Card>
      ) : filteredItems.length === 0 ? (
        <Card className="p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {searchTerm ? 'Nenhum item encontrado' : 'Nenhum item cadastrado'}
          </h3>
          {!searchTerm && (
            <Button className="mt-4" onClick={handleNew}>
              Cadastrar primeiro item
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Lista de ativos */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                Ativos ({ativos.length})
              </CardTitle>
            </CardHeader>
            <div className="divide-y divide-gray-200">
              {ativos.map(item => (
                <div
                  key={item.id}
                  className="px-6 py-3 flex items-center justify-between hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-gray-900">{item.nome}</p>
                    {item.telefone && (
                      <p className="text-sm text-gray-500">{item.telefone}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleAtivo(item.id)}
                      className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded"
                      title="Desativar"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-1.5 text-primary-600 hover:bg-primary-50 rounded"
                      title="Editar"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.nome)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                      title="Excluir"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
              {ativos.length === 0 && (
                <p className="px-6 py-4 text-sm text-gray-500 text-center">
                  Nenhum item ativo
                </p>
              )}
            </div>
          </Card>

          {/* Lista de inativos */}
          {inativos.length > 0 && (
            <Card className="opacity-75">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-gray-500">
                  Inativos ({inativos.length})
                </CardTitle>
              </CardHeader>
              <div className="divide-y divide-gray-200">
                {inativos.map(item => (
                  <div
                    key={item.id}
                    className="px-6 py-3 flex items-center justify-between hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-medium text-gray-500 line-through">{item.nome}</p>
                      {item.telefone && (
                        <p className="text-sm text-gray-400">{item.telefone}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleAtivo(item.id)}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                        title="Reativar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.nome)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                        title="Excluir"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </Layout>
  )
}

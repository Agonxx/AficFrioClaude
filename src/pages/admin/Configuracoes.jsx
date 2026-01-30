/**
 * Configurações da Empresa (Admin Empresa)
 */
import { useState, useEffect } from 'react'
import { Layout } from '../../components/layout'
import { Button, Card, CardHeader, CardTitle, CardContent, Input, Loading } from '../../components/ui'
import { useAuth } from '../../contexts/AuthContext'
import { configEmpresaService } from '../../services/multitenancy'
import { ESTADOS_BR } from '../../utils/constants'

export function AdminConfiguracoes() {
  const { user } = useAuth()
  const [empresa, setEmpresa] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [activeTab, setActiveTab] = useState('dados')

  useEffect(() => {
    loadEmpresa()
  }, [user])

  const loadEmpresa = async () => {
    if (!user?.empresaId) return

    try {
      const result = await configEmpresaService.get(user.empresaId)
      if (result.success) {
        setEmpresa(result.data)
      }
    } catch (error) {
      console.error('Erro ao carregar empresa:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setEmpresa(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: '', text: '' })

    try {
      const result = await configEmpresaService.update(user.empresaId, empresa)
      if (result.success) {
        setMessage({ type: 'success', text: 'Configurações salvas com sucesso!' })
        setEmpresa(result.data)
      } else {
        setMessage({ type: 'error', text: result.error })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao salvar configurações' })
    } finally {
      setSaving(false)
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

  if (!empresa) {
    return (
      <Layout>
        <Card className="p-6 text-center">
          <p className="text-red-600">Empresa não encontrada</p>
        </Card>
      </Layout>
    )
  }

  const tabs = [
    { id: 'dados', label: 'Dados da Empresa' },
    { id: 'termos', label: 'Termos de Serviço' }
  ]

  return (
    <Layout>
      {/* Cabeçalho */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600">Configure os dados da sua empresa</p>
      </div>

      {/* Mensagem de feedback */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success'
            ? 'bg-green-50 border border-green-200 text-green-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Tab: Dados da Empresa */}
        {activeTab === 'dados' && (
          <Card>
            <CardHeader>
              <CardTitle>Dados da Empresa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Input
                    label="Razão Social"
                    value={empresa.nome}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Para alterar a razão social, entre em contato com o suporte.
                  </p>
                </div>

                <Input
                  label="Nome Fantasia"
                  name="nomeFantasia"
                  value={empresa.nomeFantasia || ''}
                  onChange={handleChange}
                />

                <Input
                  label="CNPJ"
                  value={empresa.cnpj}
                  disabled
                  className="bg-gray-50"
                />

                <Input
                  label="Email"
                  value={empresa.email}
                  disabled
                  className="bg-gray-50"
                />

                <Input
                  label="Telefone"
                  name="telefone"
                  value={empresa.telefone || ''}
                  onChange={handleChange}
                />

                <div className="md:col-span-2">
                  <Input
                    label="Endereço"
                    name="endereco"
                    value={empresa.endereco || ''}
                    onChange={handleChange}
                  />
                </div>

                <Input
                  label="Cidade"
                  name="cidade"
                  value={empresa.cidade || ''}
                  onChange={handleChange}
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      UF
                    </label>
                    <select
                      name="uf"
                      value={empresa.uf || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Selecione</option>
                      {ESTADOS_BR.map(e => (
                        <option key={e.value} value={e.value}>{e.label}</option>
                      ))}
                    </select>
                  </div>
                  <Input
                    label="CEP"
                    name="cep"
                    value={empresa.cep || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tab: Termos de Serviço */}
        {activeTab === 'termos' && (
          <Card>
            <CardHeader>
              <CardTitle>Termos de Serviço</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Estes termos serão exibidos no contrato impresso das ordens de serviço.
              </p>
              <textarea
                name="termos"
                value={empresa.termos || ''}
                onChange={handleChange}
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Digite os termos e condições de serviço..."
              />
            </CardContent>
          </Card>
        )}

        {/* Botão salvar */}
        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>
      </form>
    </Layout>
  )
}

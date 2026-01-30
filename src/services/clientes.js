/**
 * Serviço de Clientes
 * Gerencia cadastro de clientes com persistência em localStorage
 */

const STORAGE_KEY = 'techos_clientes'

// Dados iniciais padrão
const DEFAULT_CLIENTES = [
  {
    id: 1,
    nome: 'João Silva',
    telefone: '11999990001',
    email: 'joao@email.com',
    cpfCnpj: '123.456.789-00',
    enderecoCep: '01310100',
    enderecoRua: 'Rua das Flores',
    enderecoNumero: '123',
    enderecoComplemento: 'Apto 45',
    enderecoBairro: 'Centro',
    enderecoCidade: 'São Paulo',
    enderecoUf: 'SP',
    enderecoPontoReferencia: 'Próximo ao mercado',
    observacoes: '',
    ativo: true,
    criadoEm: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    nome: 'Maria Santos',
    telefone: '11988887777',
    email: 'maria@email.com',
    cpfCnpj: '987.654.321-00',
    enderecoCep: '01310200',
    enderecoRua: 'Av. Brasil',
    enderecoNumero: '500',
    enderecoComplemento: '',
    enderecoBairro: 'Jardins',
    enderecoCidade: 'São Paulo',
    enderecoUf: 'SP',
    enderecoPontoReferencia: '',
    observacoes: 'Cliente preferencial',
    ativo: true,
    criadoEm: '2025-01-15T00:00:00.000Z'
  },
  {
    id: 3,
    nome: 'Empresa ABC LTDA',
    telefone: '1133334444',
    email: 'contato@empresaabc.com',
    cpfCnpj: '12.345.678/0001-90',
    enderecoCep: '04567890',
    enderecoRua: 'Rua Industrial',
    enderecoNumero: '1000',
    enderecoComplemento: 'Galpão 5',
    enderecoBairro: 'Industrial',
    enderecoCidade: 'São Paulo',
    enderecoUf: 'SP',
    enderecoPontoReferencia: 'Em frente ao posto Shell',
    observacoes: 'Contrato de manutenção mensal',
    ativo: true,
    criadoEm: '2025-02-01T00:00:00.000Z'
  }
]

// Inicializa dados se não existirem
function initializeData() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CLIENTES))
    return DEFAULT_CLIENTES
  }
  return JSON.parse(stored)
}

// Simula delay de rede
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Gera próximo ID
function getNextId(items) {
  if (items.length === 0) return 1
  return Math.max(...items.map(item => item.id)) + 1
}

/**
 * Serviço de Clientes
 */
export const clientesService = {
  async getAll() {
    await delay(200)
    const clientes = initializeData()
    return {
      success: true,
      data: clientes.sort((a, b) => a.nome.localeCompare(b.nome))
    }
  },

  async getAtivos() {
    await delay(200)
    const clientes = initializeData()
    return {
      success: true,
      data: clientes
        .filter(c => c.ativo)
        .sort((a, b) => a.nome.localeCompare(b.nome))
    }
  },

  async getById(id) {
    await delay(100)
    const clientes = initializeData()
    const cliente = clientes.find(c => c.id === Number(id))

    if (!cliente) {
      return { success: false, error: 'Cliente não encontrado' }
    }

    return { success: true, data: cliente }
  },

  async search(term) {
    await delay(150)
    const clientes = initializeData()
    const termLower = term.toLowerCase()

    const filtered = clientes
      .filter(c => c.ativo)
      .filter(c =>
        c.nome.toLowerCase().includes(termLower) ||
        c.telefone.includes(term) ||
        (c.cpfCnpj && c.cpfCnpj.includes(term))
      )
      .sort((a, b) => a.nome.localeCompare(b.nome))
      .slice(0, 10) // Limita a 10 resultados

    return { success: true, data: filtered }
  },

  async create(data) {
    await delay(300)
    const clientes = initializeData()

    // Verifica se já existe com mesmo CPF/CNPJ
    if (data.cpfCnpj) {
      const exists = clientes.some(
        c => c.cpfCnpj && c.cpfCnpj.replace(/\D/g, '') === data.cpfCnpj.replace(/\D/g, '')
      )
      if (exists) {
        return { success: false, error: 'Já existe um cliente com este CPF/CNPJ' }
      }
    }

    const newCliente = {
      ...data,
      id: getNextId(clientes),
      ativo: true,
      criadoEm: new Date().toISOString()
    }

    clientes.push(newCliente)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clientes))

    return { success: true, data: newCliente }
  },

  async update(id, data) {
    await delay(300)
    const clientes = initializeData()
    const index = clientes.findIndex(c => c.id === Number(id))

    if (index === -1) {
      return { success: false, error: 'Cliente não encontrado' }
    }

    // Verifica se já existe outro com mesmo CPF/CNPJ
    if (data.cpfCnpj) {
      const exists = clientes.some(
        c => c.id !== Number(id) &&
             c.cpfCnpj &&
             c.cpfCnpj.replace(/\D/g, '') === data.cpfCnpj.replace(/\D/g, '')
      )
      if (exists) {
        return { success: false, error: 'Já existe um cliente com este CPF/CNPJ' }
      }
    }

    clientes[index] = { ...clientes[index], ...data, id: Number(id) }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clientes))

    return { success: true, data: clientes[index] }
  },

  async delete(id) {
    await delay(200)
    const clientes = initializeData()
    const index = clientes.findIndex(c => c.id === Number(id))

    if (index === -1) {
      return { success: false, error: 'Cliente não encontrado' }
    }

    clientes.splice(index, 1)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clientes))

    return { success: true }
  },

  async toggleAtivo(id) {
    await delay(200)
    const clientes = initializeData()
    const index = clientes.findIndex(c => c.id === Number(id))

    if (index === -1) {
      return { success: false, error: 'Cliente não encontrado' }
    }

    clientes[index].ativo = !clientes[index].ativo
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clientes))

    return { success: true, data: clientes[index] }
  }
}

// Função para obter opções formatadas para select
export async function getClientesOptions() {
  const result = await clientesService.getAtivos()
  if (result.success) {
    return result.data.map(c => ({
      value: String(c.id),
      label: `${c.nome} - ${c.telefone}`
    }))
  }
  return []
}

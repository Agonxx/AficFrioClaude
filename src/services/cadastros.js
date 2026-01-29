/**
 * Serviço de Cadastros
 * Gerencia Produtos, Marcas e Técnicos com persistência em localStorage
 */

// Chaves do localStorage
const STORAGE_KEYS = {
  PRODUTOS: 'aficfrio_produtos',
  MARCAS: 'aficfrio_marcas',
  TECNICOS: 'aficfrio_tecnicos'
}

// Dados iniciais padrão
const DEFAULT_PRODUTOS = [
  { id: 1, nome: 'Ar Condicionado Split', ativo: true },
  { id: 2, nome: 'Ar Condicionado Janela', ativo: true },
  { id: 3, nome: 'Ar Condicionado Cassete', ativo: true },
  { id: 4, nome: 'Ar Condicionado Piso Teto', ativo: true },
  { id: 5, nome: 'Geladeira', ativo: true },
  { id: 6, nome: 'Freezer', ativo: true },
  { id: 7, nome: 'Lavadora de Roupas', ativo: true },
  { id: 8, nome: 'Secadora', ativo: true },
  { id: 9, nome: 'Lava e Seca', ativo: true },
  { id: 10, nome: 'Micro-ondas', ativo: true },
  { id: 11, nome: 'Fogão', ativo: true },
  { id: 12, nome: 'Cooktop', ativo: true },
  { id: 13, nome: 'Bebedouro', ativo: true }
]

const DEFAULT_MARCAS = [
  { id: 1, nome: 'Samsung', ativo: true },
  { id: 2, nome: 'LG', ativo: true },
  { id: 3, nome: 'Brastemp', ativo: true },
  { id: 4, nome: 'Consul', ativo: true },
  { id: 5, nome: 'Electrolux', ativo: true },
  { id: 6, nome: 'Midea', ativo: true },
  { id: 7, nome: 'Springer', ativo: true },
  { id: 8, nome: 'Carrier', ativo: true },
  { id: 9, nome: 'Daikin', ativo: true },
  { id: 10, nome: 'Fujitsu', ativo: true },
  { id: 11, nome: 'Gree', ativo: true },
  { id: 12, nome: 'Philco', ativo: true },
  { id: 13, nome: 'Panasonic', ativo: true }
]

const DEFAULT_TECNICOS = [
  { id: 1, nome: 'Carlos Silva', telefone: '11999990001', ativo: true },
  { id: 2, nome: 'Roberto Santos', telefone: '11999990002', ativo: true },
  { id: 3, nome: 'João Oliveira', telefone: '11999990003', ativo: true }
]

// Inicializa dados se não existirem
function initializeData(key, defaultData) {
  const stored = localStorage.getItem(key)
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(defaultData))
    return defaultData
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
 * Serviço genérico de CRUD
 */
function createCrudService(storageKey, defaultData) {
  return {
    async getAll() {
      await delay(200)
      const items = initializeData(storageKey, defaultData)
      return {
        success: true,
        data: items.sort((a, b) => a.nome.localeCompare(b.nome))
      }
    },

    async getAtivos() {
      await delay(200)
      const items = initializeData(storageKey, defaultData)
      return {
        success: true,
        data: items
          .filter(item => item.ativo)
          .sort((a, b) => a.nome.localeCompare(b.nome))
      }
    },

    async getById(id) {
      await delay(100)
      const items = initializeData(storageKey, defaultData)
      const item = items.find(i => i.id === Number(id))

      if (!item) {
        return { success: false, error: 'Item não encontrado' }
      }

      return { success: true, data: item }
    },

    async create(data) {
      await delay(300)
      const items = initializeData(storageKey, defaultData)

      // Verifica se já existe com mesmo nome
      const exists = items.some(
        i => i.nome.toLowerCase() === data.nome.toLowerCase()
      )
      if (exists) {
        return { success: false, error: 'Já existe um item com este nome' }
      }

      const newItem = {
        ...data,
        id: getNextId(items),
        ativo: data.ativo !== false
      }

      items.push(newItem)
      localStorage.setItem(storageKey, JSON.stringify(items))

      return { success: true, data: newItem }
    },

    async update(id, data) {
      await delay(300)
      const items = initializeData(storageKey, defaultData)
      const index = items.findIndex(i => i.id === Number(id))

      if (index === -1) {
        return { success: false, error: 'Item não encontrado' }
      }

      // Verifica se já existe outro com mesmo nome
      const exists = items.some(
        i => i.id !== Number(id) && i.nome.toLowerCase() === data.nome.toLowerCase()
      )
      if (exists) {
        return { success: false, error: 'Já existe um item com este nome' }
      }

      items[index] = { ...items[index], ...data, id: Number(id) }
      localStorage.setItem(storageKey, JSON.stringify(items))

      return { success: true, data: items[index] }
    },

    async delete(id) {
      await delay(200)
      const items = initializeData(storageKey, defaultData)
      const index = items.findIndex(i => i.id === Number(id))

      if (index === -1) {
        return { success: false, error: 'Item não encontrado' }
      }

      items.splice(index, 1)
      localStorage.setItem(storageKey, JSON.stringify(items))

      return { success: true }
    },

    async toggleAtivo(id) {
      await delay(200)
      const items = initializeData(storageKey, defaultData)
      const index = items.findIndex(i => i.id === Number(id))

      if (index === -1) {
        return { success: false, error: 'Item não encontrado' }
      }

      items[index].ativo = !items[index].ativo
      localStorage.setItem(storageKey, JSON.stringify(items))

      return { success: true, data: items[index] }
    }
  }
}

// Exporta serviços específicos
export const produtosService = createCrudService(STORAGE_KEYS.PRODUTOS, DEFAULT_PRODUTOS)
export const marcasService = createCrudService(STORAGE_KEYS.MARCAS, DEFAULT_MARCAS)
export const tecnicosService = {
  ...createCrudService(STORAGE_KEYS.TECNICOS, DEFAULT_TECNICOS),

  // Sobrescreve create para incluir telefone
  async create(data) {
    await delay(300)
    const items = initializeData(STORAGE_KEYS.TECNICOS, DEFAULT_TECNICOS)

    const exists = items.some(
      i => i.nome.toLowerCase() === data.nome.toLowerCase()
    )
    if (exists) {
      return { success: false, error: 'Já existe um técnico com este nome' }
    }

    const newItem = {
      id: getNextId(items),
      nome: data.nome,
      telefone: data.telefone || '',
      ativo: data.ativo !== false
    }

    items.push(newItem)
    localStorage.setItem(STORAGE_KEYS.TECNICOS, JSON.stringify(items))

    return { success: true, data: newItem }
  }
}

// Função para obter opções formatadas para select
export async function getProdutosOptions() {
  const result = await produtosService.getAtivos()
  if (result.success) {
    return result.data.map(p => ({ value: String(p.id), label: p.nome }))
  }
  return []
}

export async function getMarcasOptions() {
  const result = await marcasService.getAtivos()
  if (result.success) {
    return result.data.map(m => ({ value: String(m.id), label: m.nome }))
  }
  return []
}

export async function getTecnicosOptions() {
  const result = await tecnicosService.getAtivos()
  if (result.success) {
    return [
      { value: '', label: 'Não atribuído' },
      ...result.data.map(t => ({ value: String(t.id), label: t.nome }))
    ]
  }
  return [{ value: '', label: 'Não atribuído' }]
}

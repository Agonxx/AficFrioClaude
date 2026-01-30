/**
 * Serviço de Multi-tenancy
 * Gerencia Empresas e Usuários
 */

const STORAGE_KEYS = {
  EMPRESAS: 'techos_empresas',
  USUARIOS: 'techos_usuarios'
}

// Dados iniciais de empresas (exemplos)
const DEFAULT_EMPRESAS = [
  {
    id: 1,
    nome: 'Empresa Exemplo LTDA',
    nomeFantasia: 'Empresa Exemplo',
    cnpj: '12.345.678/0001-90',
    email: 'contato@empresa.com',
    telefone: '11999999999',
    endereco: 'Rua Exemplo, 123',
    cidade: 'São Paulo',
    uf: 'SP',
    cep: '01310100',
    logo: null,
    termos: '',
    plano: 'premium',
    ativo: true,
    criadoEm: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    nome: 'Refrigeração Express',
    nomeFantasia: 'Refrigeração Express LTDA',
    cnpj: '98.765.432/0001-10',
    email: 'contato@refrigeracaoexpress.com',
    telefone: '21988888888',
    endereco: 'Av. Brasil, 500',
    cidade: 'Rio de Janeiro',
    uf: 'RJ',
    cep: '20040020',
    logo: null,
    termos: '',
    plano: 'basico',
    ativo: true,
    criadoEm: '2025-02-15T00:00:00.000Z'
  }
]

// Dados iniciais de usuários
const DEFAULT_USUARIOS = [
  {
    id: 1,
    nome: 'Super Admin',
    email: 'super@admin.com',
    role: 'super_admin',
    empresaId: null,
    ativo: true,
    criadoEm: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    nome: 'Admin Empresa',
    email: 'admin@empresa.com',
    role: 'admin_empresa',
    empresaId: 1,
    ativo: true,
    criadoEm: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 3,
    nome: 'Usuário Teste',
    email: 'usuario@empresa.com',
    telefone: '11999990001',
    role: 'user',
    empresaId: 1,
    ativo: true,
    criadoEm: '2025-01-05T00:00:00.000Z'
  },
  {
    id: 4,
    nome: 'Técnico Exemplo',
    email: 'tecnico@empresa.com',
    telefone: '11999990002',
    role: 'user',
    empresaId: 1,
    ativo: true,
    criadoEm: '2025-01-10T00:00:00.000Z'
  },
  {
    id: 5,
    nome: 'Admin Refrigeração',
    email: 'admin@refrigeracaoexpress.com',
    role: 'admin_empresa',
    empresaId: 2,
    ativo: true,
    criadoEm: '2025-02-15T00:00:00.000Z'
  }
]

// Helpers
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

function initializeData(key, defaultData) {
  const stored = localStorage.getItem(key)
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(defaultData))
    return defaultData
  }
  return JSON.parse(stored)
}

function getNextId(items) {
  if (items.length === 0) return 1
  return Math.max(...items.map(item => item.id)) + 1
}

/**
 * Serviço de Empresas (Super Admin)
 */
export const empresasService = {
  async getAll() {
    await delay(300)
    const empresas = initializeData(STORAGE_KEYS.EMPRESAS, DEFAULT_EMPRESAS)
    return {
      success: true,
      data: empresas.sort((a, b) => a.nome.localeCompare(b.nome))
    }
  },

  async getById(id) {
    await delay(200)
    const empresas = initializeData(STORAGE_KEYS.EMPRESAS, DEFAULT_EMPRESAS)
    const empresa = empresas.find(e => e.id === Number(id))

    if (!empresa) {
      return { success: false, error: 'Empresa não encontrada' }
    }

    return { success: true, data: empresa }
  },

  async create(data) {
    await delay(400)
    const empresas = initializeData(STORAGE_KEYS.EMPRESAS, DEFAULT_EMPRESAS)

    const exists = empresas.some(e => e.cnpj === data.cnpj)
    if (exists) {
      return { success: false, error: 'Já existe uma empresa com este CNPJ' }
    }

    const newEmpresa = {
      ...data,
      id: getNextId(empresas),
      ativo: true,
      criadoEm: new Date().toISOString()
    }

    empresas.push(newEmpresa)
    localStorage.setItem(STORAGE_KEYS.EMPRESAS, JSON.stringify(empresas))

    return { success: true, data: newEmpresa }
  },

  async update(id, data) {
    await delay(400)
    const empresas = initializeData(STORAGE_KEYS.EMPRESAS, DEFAULT_EMPRESAS)
    const index = empresas.findIndex(e => e.id === Number(id))

    if (index === -1) {
      return { success: false, error: 'Empresa não encontrada' }
    }

    empresas[index] = { ...empresas[index], ...data, id: Number(id) }
    localStorage.setItem(STORAGE_KEYS.EMPRESAS, JSON.stringify(empresas))

    return { success: true, data: empresas[index] }
  },

  async delete(id) {
    await delay(300)
    const empresas = initializeData(STORAGE_KEYS.EMPRESAS, DEFAULT_EMPRESAS)
    const index = empresas.findIndex(e => e.id === Number(id))

    if (index === -1) {
      return { success: false, error: 'Empresa não encontrada' }
    }

    empresas.splice(index, 1)
    localStorage.setItem(STORAGE_KEYS.EMPRESAS, JSON.stringify(empresas))

    return { success: true }
  },

  async toggleAtivo(id) {
    await delay(200)
    const empresas = initializeData(STORAGE_KEYS.EMPRESAS, DEFAULT_EMPRESAS)
    const index = empresas.findIndex(e => e.id === Number(id))

    if (index === -1) {
      return { success: false, error: 'Empresa não encontrada' }
    }

    empresas[index].ativo = !empresas[index].ativo
    localStorage.setItem(STORAGE_KEYS.EMPRESAS, JSON.stringify(empresas))

    return { success: true, data: empresas[index] }
  },

  async getStats() {
    await delay(300)
    const empresas = initializeData(STORAGE_KEYS.EMPRESAS, DEFAULT_EMPRESAS)
    const usuarios = initializeData(STORAGE_KEYS.USUARIOS, DEFAULT_USUARIOS)

    return {
      success: true,
      data: {
        totalEmpresas: empresas.length,
        empresasAtivas: empresas.filter(e => e.ativo).length,
        totalUsuarios: usuarios.filter(u => u.role !== 'super_admin').length,
        usuariosAtivos: usuarios.filter(u => u.role !== 'super_admin' && u.ativo).length
      }
    }
  }
}

/**
 * Serviço de Usuários
 */
export const usuariosService = {
  async getAll(empresaId = null) {
    await delay(300)
    let usuarios = initializeData(STORAGE_KEYS.USUARIOS, DEFAULT_USUARIOS)

    // Se empresaId fornecido, filtra por empresa
    if (empresaId) {
      usuarios = usuarios.filter(u => u.empresaId === Number(empresaId))
    }

    return {
      success: true,
      data: usuarios
        .filter(u => u.role !== 'super_admin')
        .sort((a, b) => a.nome.localeCompare(b.nome))
    }
  },

  async getById(id) {
    await delay(200)
    const usuarios = initializeData(STORAGE_KEYS.USUARIOS, DEFAULT_USUARIOS)
    const usuario = usuarios.find(u => u.id === Number(id))

    if (!usuario) {
      return { success: false, error: 'Usuário não encontrado' }
    }

    return { success: true, data: usuario }
  },

  async create(data) {
    await delay(400)
    const usuarios = initializeData(STORAGE_KEYS.USUARIOS, DEFAULT_USUARIOS)

    const exists = usuarios.some(u => u.email.toLowerCase() === data.email.toLowerCase())
    if (exists) {
      return { success: false, error: 'Já existe um usuário com este email' }
    }

    const newUsuario = {
      ...data,
      id: getNextId(usuarios),
      ativo: true,
      criadoEm: new Date().toISOString()
    }

    usuarios.push(newUsuario)
    localStorage.setItem(STORAGE_KEYS.USUARIOS, JSON.stringify(usuarios))

    return { success: true, data: newUsuario }
  },

  async update(id, data) {
    await delay(400)
    const usuarios = initializeData(STORAGE_KEYS.USUARIOS, DEFAULT_USUARIOS)
    const index = usuarios.findIndex(u => u.id === Number(id))

    if (index === -1) {
      return { success: false, error: 'Usuário não encontrado' }
    }

    // Verifica email duplicado
    const emailExists = usuarios.some(
      u => u.id !== Number(id) && u.email.toLowerCase() === data.email.toLowerCase()
    )
    if (emailExists) {
      return { success: false, error: 'Já existe um usuário com este email' }
    }

    usuarios[index] = { ...usuarios[index], ...data, id: Number(id) }
    localStorage.setItem(STORAGE_KEYS.USUARIOS, JSON.stringify(usuarios))

    return { success: true, data: usuarios[index] }
  },

  async delete(id) {
    await delay(300)
    const usuarios = initializeData(STORAGE_KEYS.USUARIOS, DEFAULT_USUARIOS)
    const index = usuarios.findIndex(u => u.id === Number(id))

    if (index === -1) {
      return { success: false, error: 'Usuário não encontrado' }
    }

    usuarios.splice(index, 1)
    localStorage.setItem(STORAGE_KEYS.USUARIOS, JSON.stringify(usuarios))

    return { success: true }
  },

  async toggleAtivo(id) {
    await delay(200)
    const usuarios = initializeData(STORAGE_KEYS.USUARIOS, DEFAULT_USUARIOS)
    const index = usuarios.findIndex(u => u.id === Number(id))

    if (index === -1) {
      return { success: false, error: 'Usuário não encontrado' }
    }

    usuarios[index].ativo = !usuarios[index].ativo
    localStorage.setItem(STORAGE_KEYS.USUARIOS, JSON.stringify(usuarios))

    return { success: true, data: usuarios[index] }
  }
}

/**
 * Serviço de Configurações da Empresa (Admin Empresa)
 */
export const configEmpresaService = {
  async get(empresaId) {
    await delay(200)
    const empresas = initializeData(STORAGE_KEYS.EMPRESAS, DEFAULT_EMPRESAS)
    const empresa = empresas.find(e => e.id === Number(empresaId))

    if (!empresa) {
      return { success: false, error: 'Empresa não encontrada' }
    }

    return { success: true, data: empresa }
  },

  async update(empresaId, data) {
    await delay(400)
    const empresas = initializeData(STORAGE_KEYS.EMPRESAS, DEFAULT_EMPRESAS)
    const index = empresas.findIndex(e => e.id === Number(empresaId))

    if (index === -1) {
      return { success: false, error: 'Empresa não encontrada' }
    }

    // Admin empresa só pode editar alguns campos
    const allowedFields = ['nomeFantasia', 'telefone', 'endereco', 'cidade', 'uf', 'cep', 'logo', 'termos']
    const filteredData = {}
    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        filteredData[field] = data[field]
      }
    })

    empresas[index] = { ...empresas[index], ...filteredData }
    localStorage.setItem(STORAGE_KEYS.EMPRESAS, JSON.stringify(empresas))

    return { success: true, data: empresas[index] }
  }
}
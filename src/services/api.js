/**
 * Serviço de API
 * Preparado para consumir API REST - atualmente usando dados mock
 */

import { STORAGE_KEYS } from '../utils/constants'
import { getCurrentDate } from '../utils/helpers'

// Base URL da API (configurar quando disponível)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Dados mock para desenvolvimento
let mockOrdens = [
  {
    id: 24665,
    categoria: 'orcamento',
    status: 'em_andamento',
    dataAbertura: '2025-10-08T10:30:00.000Z',
    // Cliente
    clienteNome: 'Cleusa de Fátima dos Santos',
    clienteTelefone: '19996770171',
    // Endereço
    enderecoCep: '13280000',
    enderecoRua: 'Arnaldo de Araújo Pinto',
    enderecoNumero: '671',
    enderecoComplemento: '',
    enderecoBairro: 'Jequitibás 1',
    enderecoCidade: 'Santa Gertrudes',
    enderecoUf: 'SP',
    enderecoPontoReferencia: '',
    // Equipamento
    equipamentoTipo: 'lavadora',
    equipamentoMarca: 'electrolux',
    equipamentoModelo: '',
    // Técnico e deslocamento
    tecnicoId: '1',
    deslocamento: 0,
    // Financeiro
    formaPagamento: '',
    valorTotal: 0,
    // Abas de detalhes
    defeito: 'Não está centrifugando',
    pendencias: '',
    historicoVisitas: 'O.S 23617 DIA 07/03 EFETUADO TROCA BOMBA, MANGUEIRA GARANTIA 1 ANO E MÃO DE OBRA 3 MESES',
    garantias: ''
  },
  {
    id: 24666,
    categoria: 'garantia',
    status: 'aberta',
    dataAbertura: '2025-10-09T14:00:00.000Z',
    clienteNome: 'Maria Santos',
    clienteTelefone: '11988887777',
    enderecoCep: '01310100',
    enderecoRua: 'Av. Paulista',
    enderecoNumero: '1000',
    enderecoComplemento: 'Apto 101',
    enderecoBairro: 'Bela Vista',
    enderecoCidade: 'São Paulo',
    enderecoUf: 'SP',
    enderecoPontoReferencia: 'Próximo ao MASP',
    equipamentoTipo: 'ar_split',
    equipamentoMarca: 'samsung',
    equipamentoModelo: 'Wind Free 12000 BTUs',
    tecnicoId: '2',
    deslocamento: 50,
    formaPagamento: '',
    valorTotal: 0,
    defeito: 'Ar condicionado não gela. Serviço realizado há 2 meses.',
    pendencias: '',
    historicoVisitas: '',
    garantias: 'Garantia de 90 dias do serviço anterior - válida até 15/12/2025'
  },
  {
    id: 24667,
    categoria: 'venda',
    status: 'concluida',
    dataAbertura: '2025-10-07T09:00:00.000Z',
    clienteNome: 'Pedro Oliveira',
    clienteTelefone: '11977776666',
    enderecoCep: '04567000',
    enderecoRua: 'Rua do Comércio',
    enderecoNumero: '789',
    enderecoComplemento: '',
    enderecoBairro: 'Vila Nova',
    enderecoCidade: 'São Paulo',
    enderecoUf: 'SP',
    enderecoPontoReferencia: '',
    equipamentoTipo: 'geladeira',
    equipamentoMarca: 'brastemp',
    equipamentoModelo: 'Frost Free 400L',
    tecnicoId: '1',
    deslocamento: 0,
    formaPagamento: 'pix',
    valorTotal: 350,
    defeito: 'Venda de peças - Termostato e borracha da porta',
    pendencias: '',
    historicoVisitas: '',
    garantias: ''
  },
  {
    id: 24668,
    categoria: 'visita',
    status: 'aberta',
    dataAbertura: '2025-10-10T11:00:00.000Z',
    clienteNome: 'Ana Costa',
    clienteTelefone: '11966665555',
    enderecoCep: '07094000',
    enderecoRua: 'Rua Principal',
    enderecoNumero: '321',
    enderecoComplemento: 'Casa',
    enderecoBairro: 'Centro',
    enderecoCidade: 'Guarulhos',
    enderecoUf: 'SP',
    enderecoPontoReferencia: 'Em frente à padaria',
    equipamentoTipo: 'ar_split',
    equipamentoMarca: 'lg',
    equipamentoModelo: 'Dual Inverter 18000 BTUs',
    tecnicoId: '',
    deslocamento: 80,
    formaPagamento: '',
    valorTotal: 0,
    defeito: 'Ar condicionado desligando sozinho após alguns minutos de uso. Cliente solicita visita para diagnóstico.',
    pendencias: 'Agendar visita com o cliente',
    historicoVisitas: '',
    garantias: ''
  }
]

// Contador para novos IDs
let nextId = 24669

// Simula delay de rede
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Headers padrão para requisições
const getHeaders = () => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }
}

/**
 * Serviço de Autenticação
 */
export const authService = {
  async login(email, password) {
    await delay(800)

    if (password === '123456') {
      const mockUser = {
        id: 1,
        name: 'Administrador',
        email: email,
        role: 'admin'
      }
      const mockToken = 'mock_jwt_token_' + Date.now()

      return {
        success: true,
        data: {
          user: mockUser,
          token: mockToken,
          expiresIn: 86400
        }
      }
    }

    return {
      success: false,
      error: 'Email ou senha inválidos'
    }
  },

  async logout() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
    return { success: true }
  },

  async validateToken() {
    await delay(300)
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
    if (!token) return { valid: false }
    return { valid: true }
  }
}

/**
 * Serviço de Ordens de Serviço
 */
export const osService = {
  async getAll() {
    await delay(500)

    return {
      success: true,
      data: [...mockOrdens].sort((a, b) =>
        new Date(b.dataAbertura) - new Date(a.dataAbertura)
      )
    }
  },

  async getById(id) {
    await delay(300)

    const ordem = mockOrdens.find(os => os.id === Number(id))

    if (!ordem) {
      return {
        success: false,
        error: 'Ordem de serviço não encontrada'
      }
    }

    return {
      success: true,
      data: { ...ordem }
    }
  },

  async create(data) {
    await delay(600)

    const newOS = {
      ...data,
      id: nextId++,
      dataAbertura: getCurrentDate()
    }

    mockOrdens.push(newOS)

    return {
      success: true,
      data: newOS
    }
  },

  async update(id, data) {
    await delay(600)

    const index = mockOrdens.findIndex(os => os.id === Number(id))

    if (index === -1) {
      return {
        success: false,
        error: 'Ordem de serviço não encontrada'
      }
    }

    mockOrdens[index] = {
      ...mockOrdens[index],
      ...data,
      id: Number(id)
    }

    return {
      success: true,
      data: mockOrdens[index]
    }
  },

  async delete(id) {
    await delay(400)

    const index = mockOrdens.findIndex(os => os.id === Number(id))

    if (index === -1) {
      return {
        success: false,
        error: 'Ordem de serviço não encontrada'
      }
    }

    mockOrdens.splice(index, 1)

    return { success: true }
  },

  async search(term) {
    await delay(300)

    const termLower = term.toLowerCase()
    const results = mockOrdens.filter(os =>
      os.clienteNome.toLowerCase().includes(termLower) ||
      String(os.id).includes(term)
    )

    return {
      success: true,
      data: results
    }
  }
}

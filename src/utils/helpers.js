/**
 * Funções auxiliares
 */

// Formata data para exibição (DD/MM/YYYY)
export const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR')
}

// Formata data e hora para exibição
export const formatDateTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('pt-BR')
}

// Retorna data atual no formato ISO
export const getCurrentDate = () => {
  return new Date().toISOString()
}

// Retorna data atual formatada para input date
export const getCurrentDateInput = () => {
  return new Date().toISOString().split('T')[0]
}

// Gera ID único (simulação - em produção viria do backend)
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Retorna classe CSS baseada no status da OS
export const getStatusColor = (status) => {
  const colors = {
    'aberta': 'bg-yellow-100 text-yellow-800',
    'aguardando': 'bg-orange-100 text-orange-800',
    'em_andamento': 'bg-blue-100 text-blue-800',
    'concluida': 'bg-green-100 text-green-800',
    'cancelada': 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

// Retorna classe CSS baseada na categoria da OS
export const getCategoryColor = (category) => {
  const colors = {
    'orcamento': 'bg-purple-100 text-purple-800',
    'venda': 'bg-green-100 text-green-800',
    'garantia': 'bg-blue-100 text-blue-800',
    'visita': 'bg-cyan-100 text-cyan-800'
  }
  return colors[category] || 'bg-gray-100 text-gray-800'
}

// Debounce para busca
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Formata número da OS
export const formatOSNumber = (id) => {
  if (typeof id === 'number') {
    return String(id).padStart(5, '0')
  }
  return id
}

// Formata telefone para exibição
export const formatPhone = (phone) => {
  if (!phone) return ''
  const cleanPhone = phone.replace(/\D/g, '')
  if (cleanPhone.length === 11) {
    return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }
  if (cleanPhone.length === 10) {
    return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  return phone
}

// Formata CEP para exibição
export const formatCep = (cep) => {
  if (!cep) return ''
  const cleanCep = cep.replace(/\D/g, '')
  if (cleanCep.length === 8) {
    return cleanCep.replace(/(\d{5})(\d{3})/, '$1-$2')
  }
  return cep
}

// Formata valor monetário para exibição
export const formatMoney = (value) => {
  if (!value && value !== 0) return ''
  const num = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value
  return num.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

// Converte string monetária para número
export const parseMoney = (value) => {
  if (!value) return 0
  // Remove R$, pontos de milhar e troca vírgula por ponto
  const cleaned = String(value)
    .replace('R$', '')
    .replace(/\./g, '')
    .replace(',', '.')
    .trim()
  return parseFloat(cleaned) || 0
}

// Obtém label de uma opção pelo value
export const getLabelByValue = (options, value) => {
  const option = options.find(opt => opt.value === value)
  return option ? option.label : value
}

// Monta endereço completo em uma linha
export const formatFullAddress = (data) => {
  const parts = []

  if (data.enderecoRua) {
    let rua = data.enderecoRua
    if (data.enderecoNumero) rua += `, ${data.enderecoNumero}`
    if (data.enderecoComplemento) rua += ` - ${data.enderecoComplemento}`
    parts.push(rua)
  }

  if (data.enderecoBairro) parts.push(data.enderecoBairro)

  if (data.enderecoCidade) {
    let cidade = data.enderecoCidade
    if (data.enderecoUf) cidade += ` - ${data.enderecoUf}`
    parts.push(cidade)
  }

  if (data.enderecoCep) parts.push(`CEP: ${formatCep(data.enderecoCep)}`)

  return parts.join(', ')
}

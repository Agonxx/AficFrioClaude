/**
 * Validadores de formulário
 */

// Valida se um campo obrigatório está preenchido
export const isRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0
  }
  return value !== null && value !== undefined
}

// Valida formato de email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Valida formato de telefone (aceita vários formatos brasileiros)
export const isValidPhone = (phone) => {
  if (!phone) return false
  const cleanPhone = phone.replace(/\D/g, '')
  return cleanPhone.length >= 10 && cleanPhone.length <= 11
}

// Valida formato de CEP
export const isValidCep = (cep) => {
  if (!cep) return false
  const cleanCep = cep.replace(/\D/g, '')
  return cleanCep.length === 8
}

// Valida valor monetário
export const isValidMoney = (value) => {
  if (!value && value !== 0) return true // opcional
  const num = parseFloat(String(value).replace(',', '.'))
  return !isNaN(num) && num >= 0
}

// Valida formulário de OS
export const validateOSForm = (data) => {
  const errors = {}

  // Categoria obrigatória
  if (!isRequired(data.categoria)) {
    errors.categoria = 'Categoria é obrigatória'
  }

  // Dados do cliente
  if (!isRequired(data.clienteNome)) {
    errors.clienteNome = 'Nome do cliente é obrigatório'
  }

  if (!isRequired(data.clienteTelefone)) {
    errors.clienteTelefone = 'Telefone é obrigatório'
  } else if (!isValidPhone(data.clienteTelefone)) {
    errors.clienteTelefone = 'Telefone inválido'
  }

  // Endereço - CEP e Rua obrigatórios
  if (!isRequired(data.enderecoCep)) {
    errors.enderecoCep = 'CEP é obrigatório'
  } else if (!isValidCep(data.enderecoCep)) {
    errors.enderecoCep = 'CEP inválido'
  }

  if (!isRequired(data.enderecoRua)) {
    errors.enderecoRua = 'Rua é obrigatória'
  }

  if (!isRequired(data.enderecoBairro)) {
    errors.enderecoBairro = 'Bairro é obrigatório'
  }

  if (!isRequired(data.enderecoCidade)) {
    errors.enderecoCidade = 'Cidade é obrigatória'
  }

  if (!isRequired(data.enderecoUf)) {
    errors.enderecoUf = 'UF é obrigatório'
  }

  // Equipamento
  if (!isRequired(data.equipamentoTipo)) {
    errors.equipamentoTipo = 'Tipo de equipamento é obrigatório'
  }

  if (!isRequired(data.equipamentoMarca)) {
    errors.equipamentoMarca = 'Marca é obrigatória'
  }

  // Defeito/problema obrigatório
  if (!isRequired(data.defeito)) {
    errors.defeito = 'Descrição do defeito é obrigatória'
  }

  // Valor - validar se preenchido
  if (data.valorTotal && !isValidMoney(data.valorTotal)) {
    errors.valorTotal = 'Valor inválido'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Valida formulário de login
export const validateLoginForm = (data) => {
  const errors = {}

  if (!isRequired(data.email)) {
    errors.email = 'Email é obrigatório'
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Email inválido'
  }

  if (!isRequired(data.password)) {
    errors.password = 'Senha é obrigatória'
  } else if (data.password.length < 6) {
    errors.password = 'Senha deve ter no mínimo 6 caracteres'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

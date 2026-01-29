/**
 * Serviço de busca de CEP via ViaCEP
 * https://viacep.com.br/
 */

// Busca endereço pelo CEP
export async function buscarCep(cep) {
  // Remove caracteres não numéricos
  const cepLimpo = cep.replace(/\D/g, '')

  // Valida tamanho do CEP
  if (cepLimpo.length !== 8) {
    return {
      success: false,
      error: 'CEP deve ter 8 dígitos'
    }
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
    const data = await response.json()

    // ViaCEP retorna { erro: true } quando CEP não existe
    if (data.erro) {
      return {
        success: false,
        error: 'CEP não encontrado'
      }
    }

    return {
      success: true,
      data: {
        cep: data.cep,
        logradouro: data.logradouro,
        complemento: data.complemento,
        bairro: data.bairro,
        cidade: data.localidade,
        uf: data.uf
      }
    }
  } catch (error) {
    console.error('Erro ao buscar CEP:', error)
    return {
      success: false,
      error: 'Erro ao buscar CEP. Verifique sua conexão.'
    }
  }
}

// Formata CEP para exibição (00000-000)
export function formatarCep(cep) {
  if (!cep) return ''
  const cepLimpo = cep.replace(/\D/g, '')
  if (cepLimpo.length === 8) {
    return cepLimpo.replace(/(\d{5})(\d{3})/, '$1-$2')
  }
  return cep
}

// Valida formato do CEP
export function validarCep(cep) {
  const cepLimpo = cep.replace(/\D/g, '')
  return cepLimpo.length === 8
}

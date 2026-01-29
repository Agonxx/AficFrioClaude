/**
 * Constantes do sistema
 */

// Categorias de OS
export const OS_CATEGORIES = [
  { value: 'orcamento', label: 'Orçamento' },
  { value: 'venda', label: 'Venda Balcão' },
  { value: 'garantia', label: 'Garantia' },
  { value: 'visita', label: 'Visita Técnica' }
]

// Status disponíveis para OS
export const OS_STATUS = [
  { value: 'aberta', label: 'Aberta' },
  { value: 'aguardando', label: 'Aguardando Peça' },
  { value: 'em_andamento', label: 'Em Andamento' },
  { value: 'concluida', label: 'Concluída' },
  { value: 'cancelada', label: 'Cancelada' }
]

// Formas de pagamento
export const PAYMENT_METHODS = [
  { value: '', label: 'Não definido' },
  { value: 'dinheiro', label: 'Dinheiro' },
  { value: 'pix', label: 'PIX' },
  { value: 'cartao_debito', label: 'Cartão Débito' },
  { value: 'cartao_credito', label: 'Cartão Crédito' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'boleto', label: 'Boleto' }
]

// Estados brasileiros
export const ESTADOS_BR = [
  { value: 'AC', label: 'AC' }, { value: 'AL', label: 'AL' },
  { value: 'AP', label: 'AP' }, { value: 'AM', label: 'AM' },
  { value: 'BA', label: 'BA' }, { value: 'CE', label: 'CE' },
  { value: 'DF', label: 'DF' }, { value: 'ES', label: 'ES' },
  { value: 'GO', label: 'GO' }, { value: 'MA', label: 'MA' },
  { value: 'MT', label: 'MT' }, { value: 'MS', label: 'MS' },
  { value: 'MG', label: 'MG' }, { value: 'PA', label: 'PA' },
  { value: 'PB', label: 'PB' }, { value: 'PR', label: 'PR' },
  { value: 'PE', label: 'PE' }, { value: 'PI', label: 'PI' },
  { value: 'RJ', label: 'RJ' }, { value: 'RN', label: 'RN' },
  { value: 'RS', label: 'RS' }, { value: 'RO', label: 'RO' },
  { value: 'RR', label: 'RR' }, { value: 'SC', label: 'SC' },
  { value: 'SP', label: 'SP' }, { value: 'SE', label: 'SE' },
  { value: 'TO', label: 'TO' }
]

// Chaves do localStorage
export const STORAGE_KEYS = {
  TOKEN: 'aficfrio_token',
  USER: 'aficfrio_user',
  OS_LIST: 'aficfrio_os_list'
}

// Dados da empresa para impressão
export const COMPANY_INFO = {
  name: 'AFIC FRIO',
  subtitle: 'Loja 2',
  cnpj: '00.000.000/0001-00',
  address: 'Rua Exemplo, 123 - Centro',
  city: 'São Paulo - SP',
  phone: '(11) 99999-9999',
  email: 'contato@aficfrio.com.br'
}

// Termos de serviço para contrato
export const SERVICE_TERMS = `
1. O prazo de garantia dos serviços prestados é de 90 (noventa) dias, contados a partir da data de conclusão do serviço.

2. A garantia não cobre defeitos causados por mau uso, quedas, variações de energia elétrica, ou interferência de terceiros.

3. O cliente autoriza a realização dos serviços descritos nesta ordem de serviço e se compromete a efetuar o pagamento conforme acordado.

4. O equipamento não retirado em até 90 (noventa) dias após a conclusão do serviço será considerado abandonado.

5. A empresa não se responsabiliza por dados armazenados em equipamentos eletrônicos.

6. O orçamento tem validade de 15 (quinze) dias a partir da data de emissão.

7. O cliente declara ter ciência de todas as condições aqui descritas.
`

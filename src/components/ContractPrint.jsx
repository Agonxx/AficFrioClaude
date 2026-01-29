/**
 * Componente de Impressão de Contrato
 */
import {
  formatDate,
  formatPhone,
  formatOSNumber,
  formatMoney,
  formatCep,
  formatFullAddress,
  getLabelByValue
} from '../utils/helpers'
import {
  COMPANY_INFO,
  SERVICE_TERMS,
  PAYMENT_METHODS
} from '../utils/constants'
import { Button } from './ui'

export function ContractPrint({ ordem, onClose, produtosMap = {}, marcasMap = {} }) {
  // Helpers para obter nomes dos cadastros
  const getProdutoNome = (id) => produtosMap[id] || '-'
  const getMarcaNome = (id) => marcasMap[id] || '-'
  return (
    <div className="print-contract">
      {/* Botão de fechar (não aparece na impressão) */}
      <div className="no-print fixed top-4 right-4 z-50">
        <Button onClick={onClose} variant="secondary">
          Fechar
        </Button>
      </div>

      {/* Conteúdo do contrato */}
      <div className="max-w-3xl mx-auto p-8 bg-white min-h-screen">
        {/* Cabeçalho */}
        <header className="border-b-2 border-gray-800 pb-4 mb-4">
          <div className="flex items-start justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center mr-3">
                <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{COMPANY_INFO.name}</h1>
                <p className="text-sm text-gray-600">{COMPANY_INFO.subtitle}</p>
              </div>
            </div>

            {/* Data */}
            <div className="text-right text-sm text-gray-600">
              <p>{formatDate(ordem.dataAbertura)}</p>
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-500">
            <p>{COMPANY_INFO.address} - {COMPANY_INFO.city}</p>
            <p>Tel: {COMPANY_INFO.phone} | {COMPANY_INFO.email}</p>
          </div>
        </header>

        {/* Número da OS e Categoria */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-300">
          <div>
            <span className="text-xs text-gray-500">O.S. Nº</span>
            <span className="ml-2 text-xl font-bold text-primary-700">{formatOSNumber(ordem.id)}</span>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={ordem.categoria === 'venda'}
                readOnly
                className="mr-1"
              />
              VENDA
            </label>
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={ordem.categoria === 'garantia'}
                readOnly
                className="mr-1"
              />
              GARANTIA
            </label>
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={ordem.categoria === 'orcamento'}
                readOnly
                className="mr-1"
              />
              ORÇAMENTO
            </label>
          </div>
        </div>

        {/* Dados do Cliente */}
        <section className="mb-4">
          <h3 className="text-xs font-bold text-white bg-gray-700 px-2 py-1 mb-2">
            DADOS DO CLIENTE
          </h3>
          <div className="grid grid-cols-3 gap-2 text-sm px-1">
            <div className="col-span-2">
              <span className="text-xs text-gray-500">Cliente:</span>
              <span className="ml-1 font-medium">{ordem.clienteNome}</span>
            </div>
            <div>
              <span className="text-xs text-gray-500">Celular:</span>
              <span className="ml-1 font-medium">{formatPhone(ordem.clienteTelefone)}</span>
            </div>
          </div>
        </section>

        {/* Endereço */}
        <section className="mb-4">
          <h3 className="text-xs font-bold text-white bg-gray-700 px-2 py-1 mb-2">
            ENDEREÇO
          </h3>
          <div className="grid grid-cols-4 gap-2 text-sm px-1">
            <div className="col-span-3">
              <span className="text-xs text-gray-500">Rua:</span>
              <span className="ml-1">{ordem.enderecoRua}, {ordem.enderecoNumero}</span>
              {ordem.enderecoComplemento && <span> - {ordem.enderecoComplemento}</span>}
            </div>
            <div>
              <span className="text-xs text-gray-500">CEP:</span>
              <span className="ml-1">{formatCep(ordem.enderecoCep)}</span>
            </div>
            <div className="col-span-2">
              <span className="text-xs text-gray-500">Bairro:</span>
              <span className="ml-1">{ordem.enderecoBairro}</span>
            </div>
            <div>
              <span className="text-xs text-gray-500">Cidade:</span>
              <span className="ml-1">{ordem.enderecoCidade}</span>
            </div>
            <div>
              <span className="text-xs text-gray-500">UF:</span>
              <span className="ml-1">{ordem.enderecoUf}</span>
            </div>
            {ordem.enderecoPontoReferencia && (
              <div className="col-span-4">
                <span className="text-xs text-gray-500">Ponto de Referência:</span>
                <span className="ml-1">{ordem.enderecoPontoReferencia}</span>
              </div>
            )}
          </div>
        </section>

        {/* Equipamento */}
        <section className="mb-4">
          <h3 className="text-xs font-bold text-white bg-gray-700 px-2 py-1 mb-2">
            EQUIPAMENTO
          </h3>
          <div className="grid grid-cols-3 gap-2 text-sm px-1">
            <div>
              <span className="text-xs text-gray-500">Produto:</span>
              <span className="ml-1">{getProdutoNome(ordem.equipamentoTipo)}</span>
            </div>
            <div>
              <span className="text-xs text-gray-500">Marca:</span>
              <span className="ml-1">{getMarcaNome(ordem.equipamentoMarca)}</span>
            </div>
            <div>
              <span className="text-xs text-gray-500">Modelo:</span>
              <span className="ml-1">{ordem.equipamentoModelo || '-'}</span>
            </div>
          </div>
        </section>

        {/* Defeito */}
        <section className="mb-4">
          <h3 className="text-xs font-bold text-white bg-gray-700 px-2 py-1 mb-2">
            DEFEITO RELATADO
          </h3>
          <div className="border border-gray-300 p-2 min-h-[60px] text-sm">
            {ordem.defeito}
          </div>
        </section>

        {/* Orçamento */}
        <section className="mb-4">
          <h3 className="text-xs font-bold text-white bg-gray-700 px-2 py-1 mb-2">
            ORÇAMENTO / PAGAMENTO
          </h3>
          <div className="grid grid-cols-3 gap-4 text-sm px-1">
            <div>
              <span className="text-xs text-gray-500">Forma de Pagamento:</span>
              <span className="ml-1 font-medium">
                {getLabelByValue(PAYMENT_METHODS, ordem.formaPagamento) || '________________'}
              </span>
            </div>
            <div>
              <span className="text-xs text-gray-500">Deslocamento:</span>
              <span className="ml-1 font-medium">
                {ordem.deslocamento ? formatMoney(ordem.deslocamento) : 'R$ _______'}
              </span>
            </div>
            <div>
              <span className="text-xs text-gray-500">VALOR TOTAL:</span>
              <span className="ml-1 font-bold text-lg">
                {ordem.valorTotal ? formatMoney(ordem.valorTotal) : 'R$ _______'}
              </span>
            </div>
          </div>
        </section>

        {/* Termos */}
        <section className="mb-4">
          <h3 className="text-xs font-bold text-white bg-gray-700 px-2 py-1 mb-2">
            TERMOS E CONDIÇÕES
          </h3>
          <div className="text-[10px] text-gray-600 leading-tight px-1">
            {SERVICE_TERMS}
          </div>
        </section>

        {/* Assinaturas */}
        <section className="mt-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center">
              <div className="border-t border-gray-800 pt-2 mt-12">
                <p className="text-sm font-medium">{COMPANY_INFO.name}</p>
                <p className="text-xs text-gray-500">Responsável Técnico</p>
              </div>
            </div>
            <div className="text-center">
              <div className="border-t border-gray-800 pt-2 mt-12">
                <p className="text-sm font-medium">{ordem.clienteNome}</p>
                <p className="text-xs text-gray-500">Cliente</p>
              </div>
            </div>
          </div>
        </section>

        {/* Data e local */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>__________________, _____ de ____________________ de ________</p>
        </div>

        {/* Rodapé */}
        <footer className="mt-6 pt-3 border-t border-gray-300 text-center text-[10px] text-gray-400">
          <p>OS {formatOSNumber(ordem.id)} - Emitido em {new Date().toLocaleString('pt-BR')}</p>
        </footer>
      </div>
    </div>
  )
}

/**
 * Utilitários de Exportação
 * Exporta dados para CSV e PDF
 */

import { formatDate, formatPhone, formatMoney, getLabelByValue } from './helpers'
import { OS_STATUS, OS_CATEGORIES } from './constants'

/**
 * Exporta dados para CSV
 */
export function exportToCSV(data, filename, columns) {
  // Cabeçalho
  const header = columns.map(col => col.label).join(';')

  // Linhas de dados
  const rows = data.map(item => {
    return columns.map(col => {
      let value = col.getValue ? col.getValue(item) : item[col.key]
      // Escapa aspas e ponto e vírgula
      if (typeof value === 'string') {
        value = value.replace(/"/g, '""')
        if (value.includes(';') || value.includes('"') || value.includes('\n')) {
          value = `"${value}"`
        }
      }
      return value || ''
    }).join(';')
  })

  // Junta tudo com BOM para UTF-8
  const csvContent = '\uFEFF' + [header, ...rows].join('\n')

  // Cria e baixa o arquivo
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  downloadBlob(blob, `${filename}.csv`)
}

/**
 * Exporta dados para PDF simples (HTML que abre para impressão)
 */
export function exportToPDF(data, title, columns, options = {}) {
  const { subtitle, footer } = options

  // Gera HTML da tabela
  const tableHeaders = columns.map(col => `<th>${col.label}</th>`).join('')
  const tableRows = data.map(item => {
    const cells = columns.map(col => {
      const value = col.getValue ? col.getValue(item) : item[col.key]
      return `<td>${value || '-'}</td>`
    }).join('')
    return `<tr>${cells}</tr>`
  }).join('')

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          font-size: 12px;
        }
        h1 {
          font-size: 18px;
          margin-bottom: 5px;
        }
        .subtitle {
          color: #666;
          margin-bottom: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f5f5f5;
          font-weight: bold;
        }
        tr:nth-child(even) {
          background-color: #fafafa;
        }
        .footer {
          margin-top: 20px;
          padding-top: 10px;
          border-top: 1px solid #ddd;
          font-size: 10px;
          color: #666;
        }
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      ${subtitle ? `<p class="subtitle">${subtitle}</p>` : ''}
      <table>
        <thead><tr>${tableHeaders}</tr></thead>
        <tbody>${tableRows}</tbody>
      </table>
      <p class="footer">
        Total de registros: ${data.length}<br>
        ${footer || `Gerado em ${new Date().toLocaleString('pt-BR')}`}
      </p>
      <script>window.print();</script>
    </body>
    </html>
  `

  // Abre em nova janela para impressão/PDF
  const printWindow = window.open('', '_blank')
  printWindow.document.write(html)
  printWindow.document.close()
}

/**
 * Configuração de colunas para exportação de OS
 */
export function getOSExportColumns(produtosMap = {}, marcasMap = {}, tecnicosMap = {}) {
  return [
    { key: 'id', label: 'Nº OS', getValue: (os) => String(os.id).padStart(6, '0') },
    { key: 'dataAbertura', label: 'Data Abertura', getValue: (os) => formatDate(os.dataAbertura) },
    { key: 'categoria', label: 'Categoria', getValue: (os) => getLabelByValue(OS_CATEGORIES, os.categoria) },
    { key: 'status', label: 'Status', getValue: (os) => getLabelByValue(OS_STATUS, os.status) },
    { key: 'clienteNome', label: 'Cliente' },
    { key: 'clienteTelefone', label: 'Telefone', getValue: (os) => formatPhone(os.clienteTelefone) },
    { key: 'equipamentoTipo', label: 'Produto', getValue: (os) => produtosMap[os.equipamentoTipo] || '-' },
    { key: 'equipamentoMarca', label: 'Marca', getValue: (os) => marcasMap[os.equipamentoMarca] || '-' },
    { key: 'tecnicoId', label: 'Técnico', getValue: (os) => tecnicosMap[os.tecnicoId] || 'Não atribuído' },
    { key: 'valorTotal', label: 'Valor Total', getValue: (os) => os.valorTotal ? formatMoney(os.valorTotal) : '-' }
  ]
}

/**
 * Helper para download de blob
 */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Página de Cadastro de Produtos
 */
import { CadastroBase } from './CadastroBase'
import { produtosService } from '../../services/cadastros'

export function Produtos() {
  return (
    <CadastroBase
      title="Produtos"
      service={produtosService}
      fields={[
        { name: 'nome', label: 'Nome do Produto', required: true, placeholder: 'Ex: Ar Condicionado Split' }
      ]}
      icon={
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      }
    />
  )
}

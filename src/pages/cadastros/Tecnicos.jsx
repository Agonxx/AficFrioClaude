/**
 * Página de Cadastro de Técnicos
 */
import { CadastroBase } from './CadastroBase'
import { tecnicosService } from '../../services/cadastros'

export function Tecnicos() {
  return (
    <CadastroBase
      title="Técnicos"
      service={tecnicosService}
      fields={[
        { name: 'nome', label: 'Nome do Técnico', required: true, placeholder: 'Nome completo' },
        { name: 'telefone', label: 'Telefone', required: false, placeholder: '(00) 00000-0000' }
      ]}
      icon={
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      }
    />
  )
}

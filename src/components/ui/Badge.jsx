/**
 * Componente Badge para status
 */
import { getStatusColor } from '../../utils/helpers'

export function Badge({ children, variant, className = '' }) {
  // Se variant for um status de OS, usa a cor correspondente
  const colorClass = variant ? getStatusColor(variant) : 'bg-gray-100 text-gray-800'

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        ${colorClass} ${className}
      `}
    >
      {children}
    </span>
  )
}

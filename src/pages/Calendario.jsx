/**
 * Página de Calendário de OS
 * Visualização mensal das ordens de serviço
 */
import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/layout'
import { Card, Loading, Button } from '../components/ui'
import { osService } from '../services/api'
import { formatOSNumber, getLabelByValue, getStatusColor } from '../utils/helpers'
import { OS_STATUS } from '../utils/constants'

// Nomes dos meses em português
const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

// Dias da semana
const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export function Calendario() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [ordens, setOrdens] = useState([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)

  useEffect(() => {
    loadOrdens()
  }, [])

  const loadOrdens = async () => {
    try {
      setLoading(true)
      const result = await osService.getAll()
      if (result.success) {
        setOrdens(result.data)
      }
    } finally {
      setLoading(false)
    }
  }

  // Gera os dias do mês atual
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    // Primeiro dia do mês
    const firstDay = new Date(year, month, 1)
    // Último dia do mês
    const lastDay = new Date(year, month + 1, 0)

    // Dia da semana que o mês começa (0 = Domingo)
    const startDayOfWeek = firstDay.getDay()

    // Total de dias no mês
    const daysInMonth = lastDay.getDate()

    // Array com os dias
    const days = []

    // Dias do mês anterior (vazios)
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push({ day: null, date: null })
    }

    // Dias do mês atual
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      days.push({ day, date })
    }

    return days
  }, [currentDate])

  // Agrupa OS por data
  const ordensByDate = useMemo(() => {
    const grouped = {}
    ordens.forEach(os => {
      const date = new Date(os.dataAbertura).toDateString()
      if (!grouped[date]) {
        grouped[date] = []
      }
      grouped[date].push(os)
    })
    return grouped
  }, [ordens])

  // Navega para mês anterior
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    setSelectedDate(null)
  }

  // Navega para próximo mês
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    setSelectedDate(null)
  }

  // Volta para hoje
  const goToToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(new Date())
  }

  // Obtém OS de uma data específica
  const getOSForDate = (date) => {
    if (!date) return []
    return ordensByDate[date.toDateString()] || []
  }

  // Verifica se é hoje
  const isToday = (date) => {
    if (!date) return false
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  // Verifica se é o dia selecionado
  const isSelected = (date) => {
    if (!date || !selectedDate) return false
    return date.toDateString() === selectedDate.toDateString()
  }

  // OS do dia selecionado
  const selectedDayOrdens = selectedDate ? getOSForDate(selectedDate) : []

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-12">
          <Loading size="lg" />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      {/* Cabeçalho */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Calendário</h2>
            <p className="text-gray-600 mt-1">Visualize as ordens de serviço por data</p>
          </div>
          <Button variant="secondary" onClick={goToToday}>
            Hoje
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendário */}
        <Card className="lg:col-span-2">
          <div className="p-4">
            {/* Navegação do mês */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={prevMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h3 className="text-lg font-semibold text-gray-900">
                {MESES[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Cabeçalho dos dias da semana */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DIAS_SEMANA.map(dia => (
                <div key={dia} className="text-center text-sm font-medium text-gray-500 py-2">
                  {dia}
                </div>
              ))}
            </div>

            {/* Grid do calendário */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((item, index) => {
                const osCount = item.date ? getOSForDate(item.date).length : 0

                return (
                  <button
                    key={index}
                    onClick={() => item.date && setSelectedDate(item.date)}
                    disabled={!item.date}
                    className={`
                      min-h-[60px] p-1 rounded-lg text-left transition-colors
                      ${!item.date ? 'bg-gray-50 cursor-default' : 'hover:bg-gray-100 cursor-pointer'}
                      ${isToday(item.date) ? 'bg-primary-50 border-2 border-primary-500' : ''}
                      ${isSelected(item.date) ? 'bg-primary-100 ring-2 ring-primary-500' : ''}
                    `}
                  >
                    {item.day && (
                      <>
                        <span className={`
                          text-sm font-medium
                          ${isToday(item.date) ? 'text-primary-700' : 'text-gray-900'}
                        `}>
                          {item.day}
                        </span>
                        {osCount > 0 && (
                          <div className="mt-1">
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-700">
                              {osCount} OS
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </Card>

        {/* Detalhes do dia selecionado */}
        <Card>
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">
              {selectedDate
                ? selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
                : 'Selecione uma data'}
            </h3>
          </div>
          <div className="p-4">
            {!selectedDate ? (
              <p className="text-gray-500 text-sm">
                Clique em um dia do calendário para ver as OS.
              </p>
            ) : selectedDayOrdens.length === 0 ? (
              <div className="text-center py-6">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-2 text-sm text-gray-500">Nenhuma OS nesta data</p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-3"
                  onClick={() => navigate('/os/nova')}
                >
                  Criar nova OS
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDayOrdens.map(os => (
                  <div
                    key={os.id}
                    onClick={() => navigate(`/os/${os.id}`)}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-primary-600">
                        {formatOSNumber(os.id)}
                      </span>
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(os.status)}`}>
                        {getLabelByValue(OS_STATUS, os.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-900">{os.clienteNome}</p>
                    <p className="text-xs text-gray-500 mt-1 truncate">{os.defeito}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Legenda */}
      <Card className="mt-6">
        <div className="p-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary-50 border-2 border-primary-500 rounded"></div>
            <span className="text-gray-600">Hoje</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-700">
              N OS
            </span>
            <span className="text-gray-600">Ordens de Serviço no dia</span>
          </div>
        </div>
      </Card>
    </Layout>
  )
}

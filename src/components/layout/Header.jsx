/**
 * Componente Header - Cabeçalho do sistema com navegação por nível de acesso
 */
import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export function Header() {
  const { user, logout, isSuperAdmin, isAdminEmpresa } = useAuth()
  const location = useLocation()
  const [dropdownOpen, setDropdownOpen] = useState(null)
  const dropdownRef = useRef(null)

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    if (window.confirm('Deseja realmente sair do sistema?')) {
      logout()
    }
  }

  const toggleDropdown = (name) => {
    setDropdownOpen(dropdownOpen === name ? null : name)
  }

  // Determina a home baseada na role
  const getHomePath = () => {
    if (isSuperAdmin()) return '/super-admin'
    return '/'
  }

  // Verifica se está em uma rota específica
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/' || location.pathname.startsWith('/os')
    return location.pathname.startsWith(path)
  }

  // Badge da role
  const getRoleBadge = () => {
    if (isSuperAdmin()) return { label: 'Super Admin', color: 'bg-red-100 text-red-700' }
    if (isAdminEmpresa()) return { label: 'Admin', color: 'bg-purple-100 text-purple-700' }
    return { label: 'Usuário', color: 'bg-gray-100 text-gray-700' }
  }

  const roleBadge = getRoleBadge()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo e nome */}
          <div className="flex items-center">
            <Link to={getHomePath()} className="flex items-center">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <div className="ml-3 hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">TechOS</h1>
                <p className="text-xs text-gray-500">Gestão de Ordens de Serviço</p>
              </div>
            </Link>

            {/* Menu de navegação */}
            <nav className="ml-8 flex items-center space-x-1" ref={dropdownRef}>

              {/* === SUPER ADMIN === */}
              {isSuperAdmin() && (
                <>
                  <Link
                    to="/super-admin"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors
                      ${location.pathname === '/super-admin'
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                      </svg>
                      Dashboard
                    </span>
                  </Link>
                  <Link
                    to="/super-admin/empresas"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors
                      ${location.pathname.startsWith('/super-admin/empresas')
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      Empresas
                    </span>
                  </Link>
                </>
              )}

              {/* === ADMIN EMPRESA e USER === */}
              {!isSuperAdmin() && (
                <>
                  {/* Link Dashboard */}
                  <Link
                    to="/dashboard"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors
                      ${location.pathname === '/dashboard'
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                      </svg>
                      <span className="hidden md:inline">Dashboard</span>
                      <span className="md:hidden">Dash</span>
                    </span>
                  </Link>

                  {/* Link Ordens de Serviço */}
                  <Link
                    to="/"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors
                      ${isActive('/')
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="hidden md:inline">Ordens de Serviço</span>
                      <span className="md:hidden">OS</span>
                    </span>
                  </Link>

                  {/* Link Calendário */}
                  <Link
                    to="/calendario"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors
                      ${location.pathname === '/calendario'
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="hidden md:inline">Calendário</span>
                      <span className="md:hidden">Cal</span>
                    </span>
                  </Link>

                  {/* Dropdown Cadastros */}
                  <div className="relative">
                    <button
                      onClick={() => toggleDropdown('cadastros')}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center
                        ${isActive('/cadastros')
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <span className="hidden md:inline">Cadastros</span>
                      <span className="md:hidden">Cad.</span>
                      <svg className={`w-4 h-4 ml-1 transition-transform ${dropdownOpen === 'cadastros' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {dropdownOpen === 'cadastros' && (
                      <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                        <Link to="/cadastros/clientes" onClick={() => setDropdownOpen(null)}
                          className={`flex items-center px-4 py-2 text-sm ${location.pathname === '/cadastros/clientes' ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Clientes
                        </Link>
                        <Link to="/cadastros/produtos" onClick={() => setDropdownOpen(null)}
                          className={`flex items-center px-4 py-2 text-sm ${location.pathname === '/cadastros/produtos' ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          Produtos
                        </Link>
                        <Link to="/cadastros/marcas" onClick={() => setDropdownOpen(null)}
                          className={`flex items-center px-4 py-2 text-sm ${location.pathname === '/cadastros/marcas' ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          Marcas
                        </Link>
                        <Link to="/cadastros/tecnicos" onClick={() => setDropdownOpen(null)}
                          className={`flex items-center px-4 py-2 text-sm ${location.pathname === '/cadastros/tecnicos' ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Técnicos
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Menu Admin Empresa */}
                  {isAdminEmpresa() && (
                    <div className="relative">
                      <button
                        onClick={() => toggleDropdown('admin')}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center
                          ${isActive('/admin')
                            ? 'bg-primary-100 text-primary-700'
                            : 'text-gray-600 hover:bg-gray-100'
                          }`}
                      >
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="hidden md:inline">Administração</span>
                        <span className="md:hidden">Admin</span>
                        <svg className={`w-4 h-4 ml-1 transition-transform ${dropdownOpen === 'admin' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {dropdownOpen === 'admin' && (
                        <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                          <Link to="/admin/usuarios" onClick={() => setDropdownOpen(null)}
                            className={`flex items-center px-4 py-2 text-sm ${location.pathname === '/admin/usuarios' ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            Usuários
                          </Link>
                          <Link to="/admin/configuracoes" onClick={() => setDropdownOpen(null)}
                            className={`flex items-center px-4 py-2 text-sm ${location.pathname === '/admin/configuracoes' ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            Configurações
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </nav>
          </div>

          {/* Usuário e logout */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="flex items-center gap-2 justify-end">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${roleBadge.color}`}>
                  {roleBadge.label}
                </span>
              </div>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Sair"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

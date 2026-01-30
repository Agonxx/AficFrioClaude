# TechOS - Sistema de Gestão de Ordens de Serviço

Sistema web SaaS multi-tenant para gerenciamento de ordens de serviço para assistências técnicas.

## Funcionalidades

### Multi-tenancy
- **3 níveis de usuário**: Super Admin, Admin Empresa, Usuário
- **Gestão de empresas**: Cadastro e configuração de empresas clientes
- **Gestão de usuários**: Cada empresa gerencia seus próprios usuários

### Ordens de Serviço
- **CRUD completo** - Criar, visualizar, editar, excluir
- **Filtros avançados** - Por status, categoria, técnico e período
- **Exportação** - CSV e PDF
- **Upload de fotos** - Até 5 fotos por OS (mock)
- **Impressão de contrato** - Documento formatado para impressão

### Cadastros
- **Clientes** - Cadastro completo com endereço e busca integrada na OS
- **Produtos** - Tipos de equipamentos
- **Marcas** - Fabricantes
- **Técnicos** - Profissionais responsáveis

### Dashboard
- **Métricas** - Total de OS, abertas, em andamento, concluídas
- **Categorias** - Orçamentos, vendas, garantias
- **OS urgentes** - Pendentes há mais de 7 dias
- **Últimas OS** - Visualização rápida

### Calendário
- **Visualização mensal** - OS organizadas por data
- **Navegação** - Mês anterior/próximo
- **Detalhes** - Clique no dia para ver as OS

### Outros
- **Busca de CEP** - Preenchimento automático via ViaCEP
- **Responsivo** - Interface adaptada para desktop e mobile

## Tecnologias

- **React 18** - Biblioteca UI
- **Vite** - Build tool
- **React Router** - Navegação SPA
- **Tailwind CSS** - Estilização
- **LocalStorage** - Persistência de dados (mock)

## Estrutura do Projeto

```
src/
├── components/
│   ├── layout/           # Header, Layout, ProtectedRoute, RoleRoute
│   ├── ui/               # Button, Input, Select, Card, Modal, etc.
│   ├── ContractPrint.jsx # Impressão de contrato
│   └── PhotoUpload.jsx   # Upload de fotos
├── contexts/
│   └── AuthContext.jsx   # Autenticação e controle de roles
├── pages/
│   ├── admin/            # Configurações, Usuários (Admin Empresa)
│   ├── super-admin/      # Dashboard, Empresas (Super Admin)
│   ├── cadastros/        # Produtos, Marcas, Técnicos
│   ├── Clientes.jsx      # Cadastro de clientes
│   ├── Dashboard.jsx     # Dashboard com métricas
│   ├── Calendario.jsx    # Visualização de calendário
│   ├── OSList.jsx        # Lista de OS com filtros
│   ├── OSForm.jsx        # Criar/Editar OS
│   └── OSView.jsx        # Visualizar OS
├── services/
│   ├── api.js            # Serviço de OS (mock)
│   ├── cadastros.js      # Produtos, Marcas, Técnicos
│   ├── clientes.js       # Serviço de clientes
│   ├── multitenancy.js   # Empresas e usuários
│   └── viaCep.js         # Integração ViaCEP
├── utils/
│   ├── constants.js      # Constantes do sistema
│   ├── helpers.js        # Funções utilitárias
│   ├── validators.js     # Validações de formulário
│   └── export.js         # Exportação CSV/PDF
└── App.jsx               # Rotas principais
```

## Instalação

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## Credenciais de Teste

| Tipo | Email | Senha |
|------|-------|-------|
| Super Admin | super@admin.com | 123456 |
| Admin Empresa | admin@empresa.com | 123456 |
| Usuário | usuario@empresa.com | 123456 |

## Rotas

### Super Admin
| Rota | Descrição |
|------|-----------|
| `/super-admin` | Dashboard do Super Admin |
| `/super-admin/empresas` | Gerenciar empresas |

### Admin Empresa
| Rota | Descrição |
|------|-----------|
| `/admin/configuracoes` | Configurações da empresa |
| `/admin/usuarios` | Gerenciar usuários |

### Admin Empresa e Usuário
| Rota | Descrição |
|------|-----------|
| `/dashboard` | Dashboard com métricas |
| `/` | Lista de ordens de serviço |
| `/os/nova` | Criar nova OS |
| `/os/:id` | Visualizar OS |
| `/os/:id/editar` | Editar OS |
| `/calendario` | Calendário de OS |
| `/cadastros/clientes` | Gerenciar clientes |
| `/cadastros/produtos` | Gerenciar produtos |
| `/cadastros/marcas` | Gerenciar marcas |
| `/cadastros/tecnicos` | Gerenciar técnicos |

## Próximos Passos

- [ ] Integração com backend real (API REST)
- [ ] Banco de dados (PostgreSQL/MySQL)
- [ ] Autenticação JWT
- [ ] Campo de data prevista para conclusão no calendário
- [ ] Notificações por WhatsApp/Email
- [ ] Relatórios gerenciais

## Licença

Projeto privado - TechOS

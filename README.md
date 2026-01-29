# AFIC FRIO - Sistema de Ordens de Serviço

Sistema web para gerenciamento de ordens de serviço para assistência técnica de ar condicionado e eletrodomésticos.

## Funcionalidades

- **Autenticação** - Login/logout com proteção de rotas
- **Ordens de Serviço** - CRUD completo (criar, visualizar, editar, excluir)
- **Cadastros** - Gerenciamento de Produtos, Marcas e Técnicos
- **Busca de CEP** - Preenchimento automático de endereço via ViaCEP
- **Impressão** - Geração de contrato/ordem de serviço para impressão
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
│   ├── layout/          # Header, Layout, ProtectedRoute
│   ├── ui/              # Button, Input, Select, Card, etc.
│   └── ContractPrint.jsx
├── contexts/
│   └── AuthContext.jsx  # Contexto de autenticação
├── pages/
│   ├── cadastros/       # Produtos, Marcas, Técnicos
│   ├── Login.jsx
│   ├── OSList.jsx       # Lista de OS
│   ├── OSForm.jsx       # Criar/Editar OS
│   └── OSView.jsx       # Visualizar OS
├── services/
│   ├── api.js           # Serviço de OS (mock)
│   ├── cadastros.js     # Serviço de cadastros
│   └── viaCep.js        # Integração ViaCEP
├── utils/
│   ├── constants.js     # Constantes do sistema
│   ├── helpers.js       # Funções utilitárias
│   └── validators.js    # Validações de formulário
└── App.jsx              # Rotas principais
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

```
Email: admin@aficfrio.com
Senha: 123456
```

## Rotas

| Rota | Descrição |
|------|-----------|
| `/login` | Página de login |
| `/` | Lista de ordens de serviço |
| `/os/nova` | Criar nova OS |
| `/os/:id` | Visualizar OS |
| `/os/:id/editar` | Editar OS |
| `/cadastros/produtos` | Gerenciar produtos |
| `/cadastros/marcas` | Gerenciar marcas |
| `/cadastros/tecnicos` | Gerenciar técnicos |

## Screenshots

### Lista de OS
Interface principal com listagem de todas as ordens de serviço, busca e filtros.

### Formulário de OS
Formulário completo com dados do cliente, endereço (com busca de CEP), equipamento e detalhes do serviço.

### Cadastros
Telas de CRUD para produtos, marcas e técnicos com ativação/desativação.

## Próximos Passos

- [ ] Integração com backend real (API REST)
- [ ] Banco de dados (PostgreSQL/MySQL)
- [ ] Autenticação JWT
- [ ] Upload de fotos do equipamento
- [ ] Relatórios e dashboard
- [ ] Notificações por WhatsApp/Email

## Licença

Projeto privado - AFIC FRIO

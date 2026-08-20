# VELUNTU SaaS — Plataforma Web Multi-Tenant para Agências de Viagem de Alto Padrão 🌍

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-emerald.svg)](https://supabase.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-blue.svg)](https://www.postgresql.org/)

O **Veluntu SaaS** é uma plataforma web moderna e completa para agências de turismo autoral e de alto padrão (especialistas em África: África do Sul, Egito, Madagascar e outros destinos). O sistema oferece um painel administrativo B2B multi-tenant com isolamento seguro de dados por agência, conectado ao **Supabase**, além de uma vitrine pública de luxo para captação de clientes e leads.

---

## 🏛️ Arquitetura do Projeto

```
veluntu/
├── .env                         # Configurações de ambiente (Supabase URL, Keys, DB)
├── .env.example                 # Modelo documentado de variáveis de ambiente
├── package.json                 # Dependências e scripts npm
├── server.js                    # Servidor Express unificado (API + Frontend Estático)
│
├── backend/                     # Camada de Backend (Node.js/Express + Supabase)
│   ├── config/
│   │   ├── database.js          # Pool de conexão PostgreSQL (SSL para Supabase)
│   │   └── supabase.js          # Cliente @supabase/supabase-js
│   ├── controllers/
│   │   ├── authController.js    # Registro de agência, login JWT, perfil e configurações
│   │   ├── packageController.js # CRUD de pacotes turísticos com multi-tenant
│   │   ├── reservationController.js # Gestão de reservas e cálculo de receitas
│   │   ├── statsController.js   # Estatísticas e métricas para o Dashboard
│   │   └── publicController.js  # Endpoints públicos para a vitrine e recepção de leads
│   ├── middleware/
│   │   ├── auth.js              # Validação de token JWT Bearer
│   │   ├── tenant.js            # Isolamento estrito de dados por agência (agency_id)
│   │   └── errorHandler.js      # Tratamento padronizado de erros e exceções
│   ├── routes/
│   │   ├── auth.js              # /api/auth
│   │   ├── packages.js          # /api/packages
│   │   ├── reservations.js      # /api/reservations
│   │   ├── stats.js             # /api/stats
│   │   └── public.js            # /api/public
│   └── scripts/
│       ├── migrate.js           # Criação e atualização de tabelas no Supabase
│       └── seed.js              # Carga inicial com agência demo, pacotes e reservas
│
├── frontend/                    # Portal SaaS Administrativo (B2B)
│   ├── auth.html                # Tela de Login & Registro de Agências
│   ├── dashboard.html           # Painel SaaS completo (KPIs, Pacotes, Reservas, Configurações)
│   ├── css/
│   │   ├── auth.css             # Estilização da autenticação
│   │   └── dashboard.css        # Estilos do painel mantendo o design autoral
│   └── js/
│       ├── config.js            # Configuração pública do cliente (API e Supabase)
│       ├── api.js               # Cliente HTTP universal com auto-detecção de host
│       ├── auth.js              # Fluxo de autenticação, validações e feedback
│       └── dashboard.js         # Lógica do painel, modais, filtros e CRUD
│
├── css/                         # Estilos modulares da vitrine pública de viagens
├── js/                          # Scripts da vitrine e mapas interativos
├── index.html                   # Landing page pública da Veluntu
├── pacotes.html                 # Catálogo público de pacotes com envio de interesse
├── planejar.html                # Planejador de viagem interativo integrado à API
└── fale-com-veluntu.html        # Formulário de contato direto
```

---

## ⚡ Início Rápido

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
Crie ou edite o arquivo `.env` com suas credenciais do Supabase:
```env
PORT=5000
NODE_ENV=development

# Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anonima-aqui
SUPABASE_PUBLISHABLE_KEY=sua-chave-publicavel-aqui

# Conexão Direta PostgreSQL (Supabase)
DB_HOST=db.seu-projeto.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=sua-senha-do-banco
DB_SSL=true

# Autenticação
JWT_SECRET=sua_chave_secreta_jwt
JWT_EXPIRE=7d
```

### 3. Executar Migrações e Dados de Teste
```bash
# Criação das tabelas no banco de dados Supabase
npm run migrate

# Carga opcional de dados de demonstração
npm run seed
```

### 4. Iniciar o Servidor
```bash
# Modo desenvolvimento (com reinício automático):
npm run dev

# Modo produção:
npm start
```

O servidor estará disponível em:
- 📊 **Painel SaaS:** `http://localhost:5000/frontend/dashboard.html` (ou `/dashboard`)
- 🔐 **Login / Registro:** `http://localhost:5000/frontend/auth.html` (ou `/login`)
- 🌍 **Vitrine Pública:** `http://localhost:5000/index.html`
- 📡 **API REST:** `http://localhost:5000/api`

---

## 🔑 Credenciais da Conta Demo

Para testar imediatamente sem criar nova agência:
- **E-mail:** `admin@veluntu.com.br`
- **Senha:** `admin123`

---

## 🗄️ Esquema do Banco de Dados (Supabase PostgreSQL)

| Tabela | Descrição | Chave Principal | Relacionamentos |
|---|---|---|---|
| `agencies` | Inquilinos do SaaS (agências de viagem) | `id` (UUID) | - |
| `users` | Administradores e operadores das agências | `id` (UUID) | `agency_id` &rarr; `agencies.id` |
| `packages` | Pacotes e roteiros turísticos personalizados | `id` (UUID) | `agency_id` &rarr; `agencies.id` |
| `reservations` | Reservas e leads de viajantes | `id` (UUID) | `package_id` &rarr; `packages.id`, `agency_id` &rarr; `agencies.id` |

---

## 🛡️ Segurança e Multi-Tenancy

1. **Isolamento de Dados:** Cada agência só pode visualizar, criar, editar ou excluir seus próprios pacotes e reservas.
2. **Tokens JWT com Assinatura Segura:** O token contém os dados do usuário e o `agency_id`, validado a cada requisição pelo middleware `backend/middleware/auth.js` e `backend/middleware/tenant.js`.
3. **Criptografia:** Senhas criptografadas com `bcryptjs` com salt rounds de alto nível.
4. **Headers de Proteção:** `helmet` e `cors` configurados para proteção contra ataques comuns.

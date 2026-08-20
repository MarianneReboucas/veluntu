# Arquitetura Veluntu SaaS

## 🏗️ Diagrama da Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                          NAVEGADORES                             │
│          (Agências de Viagem acessando o SaaS)                  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
        ┌───────────────────────────────────────┐
        │      FRONTEND (Veluntu UI)            │
        ├───────────────────────────────────────┤
        │ /frontend/auth.html                  │
        │ ├─ Registro de agências              │
        │ └─ Login com email/senha             │
        │                                      │
        │ /frontend/dashboard.html             │
        │ ├─ Criar pacotes de viagem           │
        │ ├─ Gerenciar reservas                │
        │ ├─ Ver estatísticas                  │
        │ └─ Configurações de agência          │
        │                                      │
        │ /frontend/js/api.js                  │
        │ └─ Cliente HTTP (autenticado)        │
        └───────────────────────────────────────┘
                            ↓
        ┌───────────────────────────────────────┐
        │         BACKEND API (Express)         │
        ├───────────────────────────────────────┤
        │  POST   /api/auth/register            │
        │  POST   /api/auth/login               │
        │  GET    /api/packages                 │
        │  POST   /api/packages                 │
        │  PUT    /api/packages/:id             │
        │  DELETE /api/packages/:id             │
        │  GET    /api/reservations             │
        │  POST   /api/reservations             │
        │  PUT    /api/reservations/:id         │
        │                                      │
        │  Middleware:                         │
        │  ├─ auth.js (validação JWT)          │
        │  └─ tenant.js (isolamento de dados)  │
        └───────────────────────────────────────┘
                            ↓
        ┌───────────────────────────────────────┐
        │       BANCO DE DADOS (PostgreSQL)    │
        ├───────────────────────────────────────┤
        │  ┌─ agencies                         │
        │  ├─ users                            │
        │  ├─ packages                         │
        │  └─ reservations                     │
        │                                      │
        │  Isolamento automático por:          │
        │  agency_id (foreign key)             │
        └───────────────────────────────────────┘
```

## 🔄 Fluxo Multi-Tenant Explicado

```
Agência 1                          Agência 2
     ↓                                 ↓
   Login                            Login
   (JWT com agency_id=AAA)         (JWT com agency_id=BBB)
     ↓                                 ↓
  Requisição                       Requisição
  GET /api/packages                GET /api/packages
  Header: Bearer token AAA         Header: Bearer token BBB
     ↓                                 ↓
  Middleware Tenant.js             Middleware Tenant.js
  Valida: agency_id = AAA          Valida: agency_id = BBB
     ↓                                 ↓
  Banco: SELECT * FROM packages    Banco: SELECT * FROM packages
         WHERE agency_id = 'AAA'          WHERE agency_id = 'BBB'
     ↓                                 ↓
  Apenas pacotes da                Apenas pacotes da
  Agência 1 retornados             Agência 2 retornados

✅ Isolamento garantido!
✅ Uma agência nunca vê dados da outra
✅ Impossível de hackear alterando URLs
```

## 📊 Tabelas do Banco de Dados

### agencies
```
┌─────────┬──────────────┬─────────────┐
│ id (UUID) │ name         │ email       │
├──────────┼──────────────┼─────────────┤
│ AAA...   │ Safari Tours │ info@... │
│ BBB...   │ Nilo Travel  │ contact@... │
└────────────┴──────────────┴─────────────┘
Armazena: Todas as agências registradas
```

### users
```
┌─────────┬──────────┬──────────┬────────────┬──────────────┐
│ id      │ agency_id│ email    │ password   │ role         │
├─────────┼──────────┼──────────┼────────────┼──────────────┤
│ USER1   │ AAA...   │ admin@.… │ bcrypt...  │ admin        │
│ USER2   │ BBB...   │ admin@.… │ bcrypt...  │ admin        │
└─────────┴──────────┴──────────┴────────────┴──────────────┘
Relacionamento: users → agencies via agency_id
Efeito: Deletar agência deleta todos seus usuários
```

### packages
```
┌─────────┬──────────┬────────────────┬──────────┬───────┐
│ id      │ agency_id│ title          │ price    │ duration│
├─────────┼──────────┼────────────────┼──────────┼───────┤
│ PKG1    │ AAA...   │ Safari Botswana│ 4500.00  │ 10     │
│ PKG2    │ BBB...   │ Nilo Cruiser   │ 3200.00  │ 5      │
└─────────┴──────────┴────────────────┴──────────┴───────┘
Filtro automático: Apenas pacotes da agência autenticada
```

### reservations
```
┌─────────┬────────────┬──────────────────┬────────────┐
│ id      │ package_id │ client_name      │ status     │
├─────────┼────────────┼──────────────────┼────────────┤
│ RES1    │ PKG1       │ João Silva       │ confirmada │
│ RES2    │ PKG1       │ Maria Santos     │ pendente   │
│ RES3    │ PKG2       │ Pedro Oliveira   │ cancelada  │
└─────────┴────────────┴──────────────────┴────────────┘
Relacionamento: reservations → packages → agencies
```

## 🛡️ Segurança - Camadas de Proteção

```
Layer 1: AUTENTICAÇÃO
  ├─ Usuário entra email/senha
  ├─ Senha verificada com bcryptjs
  └─ JWT token gerado com agency_id incluído

Layer 2: MIDDLEWARE DE AUTH
  ├─ Toda requisição verifica token
  └─ Se inválido → erro 401 Unauthorized

Layer 3: ISOLAMENTO MULTI-TENANT
  ├─ Extrai agency_id do token
  ├─ Valida existência da agência no banco
  └─ Se agência não existe → erro 403 Forbidden

Layer 4: QUERIES SQL
  ├─ Todas as queries filtram: WHERE agency_id = $1
  └─ Impossível retornar dados de outra agência

Layer 5: HEADERS DE SEGURANÇA
  ├─ Helmet.js adiciona headers de proteção
  ├─ CORS apenas do domínio autorizado
  └─ Proteção contra XSS, CSRF, etc.
```

## 📈 Fluxo de Dados - Caso de Uso Real

### Agência "Safari Tours" cria um novo pacote:

```
1️⃣  USER INTERFACE (dashboard.html)
   Admin preenche formulário:
   - Título: "Safari Serengeti"
   - Preço: 5000 USD
   - Duração: 8 dias
   
2️⃣  FRONTEND JAVASCRIPT (dashboard.js)
   handleCreatePackage(e) {
     const data = { title, destination, price... }
     api.createPackage(data, agencyId)
   }
   
3️⃣  API CLIENT (api.js)
   request('/packages', 'POST', data, agencyId) {
     fetch(url, {
       headers: {
         'Authorization': 'Bearer JWT_TOKEN',
         'X-Agency-ID': 'agency-123'
       },
       body: JSON.stringify(data)
     })
   }
   
4️⃣  BACKEND EXPRESS (server.js)
   POST /api/packages →
   
5️⃣  AUTENTICAÇÃO (middleware/auth.js)
   ✓ Token é válido?
   ✓ Não expirou?
   → Extrai user.agency_id = 'agency-123'
   
6️⃣  TENANT MIDDLEWARE (middleware/tenant.js)
   ✓ Agência 'agency-123' existe?
   → req.agencyId = 'agency-123'
   
7️⃣  CONTROLLER (controllers/packageController.js)
   createPackage(req, res) {
     INSERT INTO packages (id, agency_id, title, price...)
     VALUES (new_uuid, 'agency-123', 'Safari Serengeti', 5000...)
   }
   
8️⃣  BANCO DE DADOS (PostgreSQL)
   Insere novo pacote com agency_id = 'agency-123'
   Impossível outra agência acessar este pacote
   
9️⃣  RESPOSTA
   {
     id: "pkg-uuid",
     agency_id: "agency-123",
     title: "Safari Serengeti",
     price: 5000,
     created_at: "2024-08-19..."
   }
   
🔟 ATUALIZAÇÃO DA INTERFACE
   renderPackages() recarrega a lista
   Novo pacote aparece no dashboard
```

## 🚀 Como Escalar para Múltiplas Agências

```
Dia 1: Primeira Agência
├─ Registra em auth.html
├─ Cria 5 pacotes
├─ Recebe 10 reservas
└─ Vê tudo funcionar!

Dia 2-N: Novas Agências
├─ Agência 2 registra independente
├─ Cria seus próprios pacotes
├─ Vê apenas suas reservas
└─ Nenhum conflito de dados

Resultado: Um servidor rodando
           Centenas de agências
           Cada uma vendo dados isolados
           Sem código alterado
```

## 📱 Responsividade

```
Desktop (>768px)          Mobile (<768px)
┌──────────────────┐     ┌──────────────┐
│ [SIDEBAR]        │     │ ☰  TOPBAR   │
│  📊 Dashboard    │ →   ├──────────────┤
│  📦 Pacotes      │     │ (Sidebar com │
│  📅 Reservas     │     │  hamburger)  │
│  ⚙️ Settings     │     │              │
│                  │     │   CONTEÚDO   │
│ ────────────────│     │   (Full      │
│ │ CONTEÚDO      │     │    Width)    │
│ │               │     │              │
│ │               │     │              │
│ └──────────────│     └──────────────┘
└──────────────────┘
```

## 🔗 Fluxos de Dados Principais

### A. Login
```
Email/Senha → Banco verifica → JWT gerado → Dashboard carrega → Pacotes/Reservas mostradas
```

### B. Criar Pacote
```
Formulário → API POST → Middleware valida → INSERT com agency_id → Lista atualizada
```

### C. Criar Reserva
```
Seleciona pacote → Dados cliente → API POST → Valida package_id → INSERT → Contador atualiza
```

### D. Ver Estatísticas
```
Dashboard carrega → API GET /packages → Conta registros → API GET /reservations → Calcula receita
```

---

**Arquitetura SaaS = Uma aplicação, múltiplas agências, dados completamente isolados! 🎉**

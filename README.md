# MesterPont MVP 🔨

Magyar nyelvű TaskRabbit-szerű platform, amely összköti a megbízókat a helyi taskerekkel (mesterekkel).

## 🏗️ Projekt Struktúra

Ez egy monorepo projekt Turborepo-val:

```
mesterpont/
├── apps/
│   ├── web/          # Next.js 14 frontend
│   └── api/          # NestJS backend API
├── packages/
│   ├── database/     # Prisma schema & migrations
│   ├── ui/           # Shared UI components (shadcn/ui)
│   ├── types/        # Shared TypeScript types
│   └── config/       # Shared ESLint & TS configs
└── docker/           # Docker compose for local dev
```

## 🚀 Gyors Indítás

### Előfeltételek
- Node.js 18+
- Docker & Docker Compose
- npm 9+

### Setup

1. **Telepítsd a függőségeket:**
```bash
npm install
```

2. **Indítsd el a Docker környezetet (PostgreSQL + Redis):**
```bash
npm run docker:up
```

3. **Futtasd az adatbázis migrációkat:**
```bash
npm run db:migrate
```

4. **Opcionális: Seed adatok betöltése:**
```bash
npm run db:seed
```

5. **Indítsd el a dev szervereket:**
```bash
npm run dev
```

- 🌐 Frontend: http://localhost:3000
- 🔌 API: http://localhost:4000
- 🗄️ PostgreSQL: localhost:5432
- 🔴 Redis: localhost:6379

## 📦 Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **TanStack Query** (React Query)
- **Zustand** (state management)
- **NextAuth.js** (authentication)
- **Socket.io-client** (real-time chat)

### Backend
- **NestJS** (Node.js framework)
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL** (with PostGIS)
- **Redis** (caching & sessions)
- **Socket.io** (WebSocket)
- **SimplePay** (Hungarian payment gateway)
- **AWS S3** (file storage)

### Infrastructure
- **Docker** (local development)
- **Vercel** (frontend hosting)
- **Railway/Render** (backend hosting)
- **Neon** (serverless PostgreSQL)

## 🎯 MVP Funkciók

### ✅ Backend API (Teljes)
- [x] **Authentication API** - JWT + bcrypt, login/register
- [x] **User Management** - Client/Tasker/Admin roles
- [x] **Tasks API** - CRUD, geolocation filtering, status management
- [x] **Offers API** - Create, accept, reject offers
- [x] **Payments API** - Escrow system (SimplePay ready)
- [x] **Reviews API** - Two-way rating system
- [x] **Messages API** - Real-time chat (Socket.io WebSocket)
- [x] **Files API** - Upload handling (S3 ready)
- [x] **Skills API** - Category management
- [x] **Swagger Documentation** - Auto-generated API docs

### ✅ Frontend UI (Core)
- [x] **Landing Page** - Hero, categories, CTA sections
- [x] **Authentication** - Login & Register pages (Client/Tasker)
- [x] **Dashboard** - User-specific welcome screen
- [x] **Task Browsing** - List and filter open tasks
- [x] **Task Creation** - Form with validation
- [x] **Responsive Design** - Mobile-friendly Tailwind CSS
- [x] **UI Components** - shadcn/ui (Button, Card, Input, Label)

### 🔄 Frontend UI (Backend Ready, UI Pending)
- [ ] Task detail page with offer submission
- [ ] Offer acceptance/rejection UI
- [ ] Real-time chat interface
- [ ] Review submission form
- [ ] Tasker profile pages
- [ ] File upload UI with previews
- [ ] Map integration (Google Maps)
- [ ] Admin dashboard (verification)

### ⏳ Integrations (Not Yet Started)
- [ ] SimplePay production credentials
- [ ] AWS S3 file uploads
- [ ] Email notifications (SendGrid/Mailgun)
- [ ] Google Maps API integration
- [ ] Push notifications

## 🛠️ Fejlesztői Parancsok

```bash
# Fejlesztői mód (hot reload)
npm run dev

# Production build
npm run build

# Linting
npm run lint

# Code formatting
npm run format

# Docker kezelés
npm run docker:up      # Indítás
npm run docker:down    # Leállítás

# Adatbázis
npm run db:migrate     # Migrációk futtatása
npm run db:seed        # Példa adatok betöltése
```

## 📝 Environment Variables

Hozz létre `.env` fájlokat:

### `apps/web/.env.local`
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-key
```

### `apps/api/.env`
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mesterpont
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-jwt-secret
SIMPLEPAY_MERCHANT_ID=your-merchant-id
SIMPLEPAY_SECRET_KEY=your-secret-key
AWS_S3_BUCKET=your-bucket
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
```

## 🧪 Tesztelés

### Test Accounts (After Seeding)
```
Client:  client@mesterpont.hu  / password123
Tasker1: tasker1@mesterpont.hu / password123
Tasker2: tasker2@mesterpont.hu / password123
Tasker3: tasker3@mesterpont.hu / password123
Admin:   admin@mesterpont.hu   / password123
```

### Running Tests
```bash
# Unit tests (coming soon)
npm run test

# E2E tests (coming soon)
npm run test:e2e

# Manual testing
npm run dev
# Then visit http://localhost:3000
```

## 📚 Dokumentáció

- **[Development Guide](./DEVELOPMENT.md)** - Setup, workflow, debugging
- **[Deployment Guide](./DEPLOYMENT.md)** - Production deployment steps
- **[Contributing Guide](./CONTRIBUTING.md)** - Code standards, PR process
- **[API Documentation](http://localhost:4000/api/docs)** - Swagger UI (after `npm run dev`)
- **[Database Schema](./packages/database/prisma/schema.prisma)** - Prisma schema

## 👥 Szerepkörök

- **Megbízó (Client):** Feladatokat ad fel, fizet
- **Tasker (Mester):** Feladatokat vállal, pénzt kap
- **Admin:** Tasker ellenőrzés, moderáció

## 🔒 Biztonság

- HTTPS mindenütt
- JWT auth + HTTP-only cookies
- Rate limiting (Redis)
- CSRF védelem
- XSS védelem
- SQL injection védelem (Prisma)
- Fájl feltöltés validáció
- ID ellenőrzés (manuális + automatikus)

## 📈 Teljesítmény

- Image optimization (Next.js)
- API response caching (Redis)
- Database indexing (Prisma)
- Lazy loading
- Code splitting

## 🚢 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed production deployment instructions.

**Quick start:**
- Frontend: Deploy to Vercel
- Backend: Deploy to Railway/Render
- Database: Use Neon (serverless Postgres)
- File Storage: AWS S3
- Domain: Configure DNS for custom domain

## 📞 Támogatás

Issues: https://github.com/YOUR_ORG/mesterpont/issues

---

**Készítette:** Lead Full-Stack Developer & Tech Architect
**Utolsó frissítés:** 2025-11-06

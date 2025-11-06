# MesterPont - TaskRabbit for Hungary 🔨

A full-stack TaskRabbit-style marketplace platform connecting clients with local taskers (skilled workers) in Hungary.

## ✨ Current Status

🎉 **Full-Stack MVP Complete!** - Production-ready foundation

- ✅ **Backend API**: 100% complete (11 modules, REST + WebSocket)
- ✅ **Frontend UI**: ~90% complete (10+ pages, real-time chat)
- ✅ **Database**: Complete schema + seed data
- ✅ **Infrastructure**: Docker, CI/CD, documentation
- 🔄 **Integrations**: SimplePay/Maps/S3 pending (sandbox ready)

## 🏗️ Project Structure

Monorepo managed with Turborepo:

```
mesterpont/
├── apps/
│   ├── web/          # Next.js 14 frontend
│   └── api/          # NestJS backend API
├── packages/
│   ├── database/     # Prisma schema & migrations
│   ├── types/        # Shared TypeScript types
│   └── config/       # Shared ESLint & TS configs
└── docker/           # Docker compose for local dev
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- npm 9+

### Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Start Docker environment (PostgreSQL + Redis):**
```bash
npm run docker:up
```

3. **Run database migrations:**
```bash
npm run db:migrate
```

4. **Seed database with test data:**
```bash
npm run db:seed
```

5. **Start development servers:**
```bash
npm run dev
```

**Access:**
- 🌐 Frontend: http://localhost:3000
- 🔌 API: http://localhost:4000
- 📚 API Docs: http://localhost:4000/api/docs
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
- **Socket.io-client** (real-time chat)

### Backend
- **NestJS** (Node.js framework)
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL** (with PostGIS for geospatial)
- **Redis** (caching & sessions)
- **Socket.io** (WebSocket)
- **SimplePay** (Hungarian payment gateway)
- **AWS S3** (file storage)

### Infrastructure
- **Docker** (local development)
- **Vercel** (frontend hosting)
- **Railway/Render** (backend hosting)
- **Neon** (serverless PostgreSQL)
- **GitHub Actions** (CI/CD)

## 🎯 MVP Features

### ✅ Backend API (Complete)
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

### ✅ Frontend UI (Complete MVP)
- [x] **Landing Page** - Hero, categories, CTA sections
- [x] **Authentication** - Login & Register pages (Client/Tasker)
- [x] **Dashboard** - User-specific welcome screen
- [x] **Task Browsing** - List and filter open tasks
- [x] **Task Creation** - Form with validation
- [x] **Task Detail Page** - View task, make offers, accept offers
- [x] **My Tasks Page** - Personal task management with filters
- [x] **Real-time Chat** - Socket.io WebSocket chat interface
- [x] **User Profiles** - Tasker profile pages with skills & reviews
- [x] **Admin Dashboard** - Tasker verification interface
- [x] **File Upload Component** - Image upload with preview
- [x] **Responsive Design** - Mobile-friendly Tailwind CSS
- [x] **UI Components** - shadcn/ui (Button, Card, Input, Label, Toast)

### 🔄 Features (Backend Ready, UI Pending)
- [x] Offer submission (implemented)
- [x] Offer acceptance (implemented)
- [x] Chat messages (implemented, real-time works)
- [ ] Review submission form (backend ready, UI pending)
- [ ] Map integration (placeholder, Google Maps pending)
- [ ] Advanced file uploads (basic implemented)

### ⏳ Integrations (Pending)
- [ ] SimplePay production credentials
- [ ] AWS S3 file uploads
- [ ] Email notifications (SendGrid/Mailgun)
- [ ] Google Maps API integration
- [ ] Push notifications

## 🛠️ Development Commands

```bash
# Development mode (hot reload)
npm run dev

# Production build
npm run build

# Linting
npm run lint

# Code formatting
npm run format

# Docker management
npm run docker:up      # Start services
npm run docker:down    # Stop services

# Database
npm run db:migrate     # Run migrations
npm run db:seed        # Load sample data
```

## 📝 Environment Variables

Create `.env` files:

### `apps/web/.env.local`
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-key
NEXT_PUBLIC_WS_URL=http://localhost:4000
```

### `apps/api/.env`
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mesterpont
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d
SIMPLEPAY_MERCHANT_ID=your-merchant-id
SIMPLEPAY_SECRET_KEY=your-secret-key
AWS_S3_BUCKET=your-bucket
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
FRONTEND_URL=http://localhost:3000
```

### `packages/database/.env`
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mesterpont
```

## 🧪 Testing

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

## 📚 Documentation

- **[Development Guide](./DEVELOPMENT.md)** - Setup, workflow, debugging
- **[Deployment Guide](./DEPLOYMENT.md)** - Production deployment steps
- **[Contributing Guide](./CONTRIBUTING.md)** - Code standards, PR process
- **[API Documentation](http://localhost:4000/api/docs)** - Swagger UI (after `npm run dev`)
- **[Database Schema](./packages/database/prisma/schema.prisma)** - Prisma schema

## 👥 User Roles

- **Client:** Posts tasks, pays for services
- **Tasker:** Completes tasks, receives payments
- **Admin:** Verifies taskers, moderates platform

## 🎯 User Flow Example

### Client Journey
1. Register → Login
2. Post a task (e.g., "Assemble IKEA furniture")
3. Review offers from taskers
4. Accept an offer
5. Chat with tasker to coordinate
6. Mark task as complete
7. Payment released from escrow
8. Leave a review

### Tasker Journey
1. Register as tasker
2. Upload ID documents
3. Wait for admin verification
4. Browse available tasks
5. Submit offer with proposed price
6. Chat with client when accepted
7. Complete the task
8. Receive payment
9. Get rated by client

## 🔒 Security

- HTTPS everywhere
- JWT authentication + HTTP-only cookies
- Rate limiting (Redis)
- CSRF protection
- XSS protection
- SQL injection prevention (Prisma)
- File upload validation
- ID verification (manual + automated)

## 📈 Performance

- Image optimization (Next.js)
- API response caching (Redis)
- Database indexing (Prisma)
- Lazy loading
- Code splitting
- Geospatial queries (PostGIS)

## 🚢 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed production deployment instructions.

**Quick overview:**
- **Frontend**: Deploy to Vercel
- **Backend**: Deploy to Railway/Render
- **Database**: Use Neon (serverless Postgres)
- **File Storage**: AWS S3
- **Domain**: Configure DNS for custom domain

## 🌍 Localization

Currently supports:
- 🇭🇺 Hungarian (primary)

Planned:
- 🇬🇧 English
- 🇩🇪 German
- 🇦🇹 Austrian

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## 📊 Project Stats

- **Backend Modules:** 11
- **Frontend Pages:** 10+
- **Database Models:** 11
- **API Endpoints:** 40+
- **Total Files:** 94
- **Lines of Code:** ~5,700

## 📞 Support

- Issues: [GitHub Issues](https://github.com/YOUR_ORG/mesterpont/issues)
- Documentation: See `/docs` folder
- Email: support@mesterpont.hu

## 📄 License

Proprietary - All rights reserved

---

**Built by:** Lead Full-Stack Developer & Tech Architect
**Last Updated:** 2025-11-06
**Version:** 0.1.0 (MVP)

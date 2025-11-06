# MesterPont - Development Guide

## 🛠️ Getting Started

### Prerequisites

- **Node.js 18+** ([Download](https://nodejs.org/))
- **Docker & Docker Compose** ([Download](https://www.docker.com/))
- **Git** ([Download](https://git-scm.com/))
- **npm 9+** (comes with Node.js)

### Initial Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_ORG/mesterpont.git
   cd mesterpont
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start Docker services (PostgreSQL + Redis):**
   ```bash
   npm run docker:up
   ```

4. **Setup environment variables:**

   **packages/database/.env:**
   ```bash
   cp packages/database/.env.example packages/database/.env
   ```

   **apps/api/.env:**
   ```bash
   cp apps/api/.env.example apps/api/.env
   ```

   **apps/web/.env.local:**
   ```bash
   cp apps/web/.env.local.example apps/web/.env.local
   ```

5. **Run database migrations:**
   ```bash
   npm run db:migrate
   ```

6. **Seed database with test data:**
   ```bash
   npm run db:seed
   ```

7. **Start development servers:**
   ```bash
   npm run dev
   ```

   This starts:
   - 🌐 **Frontend:** http://localhost:3000
   - 🔌 **API:** http://localhost:4000
   - 📚 **API Docs:** http://localhost:4000/api/docs

## 📁 Project Structure

```
mesterpont/
├── apps/
│   ├── web/              # Next.js 14 Frontend
│   │   ├── src/
│   │   │   ├── app/      # App Router pages
│   │   │   ├── components/
│   │   │   └── lib/
│   │   └── package.json
│   │
│   └── api/              # NestJS Backend
│       ├── src/
│       │   ├── modules/  # Feature modules
│       │   ├── main.ts
│       │   └── app.module.ts
│       └── package.json
│
├── packages/
│   ├── database/         # Prisma schema & migrations
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── seed.ts
│   │
│   ├── types/            # Shared TypeScript types
│   │   └── src/index.ts
│   │
│   └── config/           # Shared configs
│
├── docker/
│   └── docker-compose.yml
│
├── package.json          # Root monorepo config
└── turbo.json            # Turborepo config
```

## 🎯 Development Workflow

### Creating a New Feature

1. **Create a new branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**

3. **Test locally:**
   ```bash
   npm run dev
   ```

4. **Lint and format:**
   ```bash
   npm run lint
   npm run format
   ```

5. **Build to check for errors:**
   ```bash
   npm run build
   ```

6. **Commit and push:**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   git push origin feature/your-feature-name
   ```

7. **Create Pull Request** on GitHub

### Database Changes

1. **Modify Prisma schema:**
   ```prisma
   // packages/database/prisma/schema.prisma
   model NewModel {
     id String @id @default(uuid())
     // ...
   }
   ```

2. **Create migration:**
   ```bash
   cd packages/database
   npx prisma migrate dev --name add_new_model
   ```

3. **Prisma Client will auto-regenerate**

### Adding a New API Endpoint

1. **Create module (if needed):**
   ```bash
   cd apps/api
   nest generate module feature-name
   nest generate service feature-name
   nest generate controller feature-name
   ```

2. **Implement service logic:**
   ```typescript
   // apps/api/src/modules/feature-name/feature-name.service.ts
   @Injectable()
   export class FeatureNameService {
     constructor(private prisma: PrismaService) {}

     async create(data: CreateDto) {
       return this.prisma.model.create({ data });
     }
   }
   ```

3. **Implement controller:**
   ```typescript
   // apps/api/src/modules/feature-name/feature-name.controller.ts
   @Controller('feature-name')
   export class FeatureNameController {
     constructor(private service: FeatureNameService) {}

     @Post()
     create(@Body() dto: CreateDto) {
       return this.service.create(dto);
     }
   }
   ```

4. **Test with Swagger:** http://localhost:4000/api/docs

### Adding a New Frontend Page

1. **Create page file:**
   ```typescript
   // apps/web/src/app/your-page/page.tsx
   export default function YourPage() {
     return <div>Your Page Content</div>;
   }
   ```

2. **Add to navigation/links**

3. **Test:** http://localhost:3000/your-page

## 🧪 Testing

### Unit Tests (Coming Soon)

```bash
npm run test
```

### E2E Tests (Coming Soon)

```bash
npm run test:e2e
```

### Manual Testing

**Test Accounts (after seeding):**
- **Client:** client@mesterpont.hu / password123
- **Tasker 1:** tasker1@mesterpont.hu / password123
- **Tasker 2:** tasker2@mesterpont.hu / password123
- **Tasker 3:** tasker3@mesterpont.hu / password123
- **Admin:** admin@mesterpont.hu / password123

## 🐛 Debugging

### Backend (NestJS)

1. **VS Code Launch Config:**
   ```json
   {
     "type": "node",
     "request": "launch",
     "name": "Debug API",
     "runtimeExecutable": "npm",
     "runtimeArgs": ["run", "start:debug"],
     "cwd": "${workspaceFolder}/apps/api",
     "console": "integratedTerminal"
   }
   ```

2. **Set breakpoints** and run "Debug API"

### Frontend (Next.js)

1. **Browser DevTools** (Chrome/Firefox)
2. **React Developer Tools** extension
3. **Console logs:** `console.log()` visible in browser console

### Database

**Prisma Studio (GUI):**
```bash
cd packages/database
npx prisma studio
```

Opens GUI at http://localhost:5555

**Database CLI:**
```bash
docker exec -it mesterpont-postgres psql -U postgres -d mesterpont
```

## 📦 Dependencies

### Adding a New Package

**To workspace root:**
```bash
npm install <package-name> -w apps/web
# or
npm install <package-name> -w apps/api
```

**To specific app:**
```bash
cd apps/web
npm install <package-name>
```

## 🔧 Common Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start all dev servers |
| `npm run build` | Build all apps |
| `npm run lint` | Lint all code |
| `npm run format` | Format all code with Prettier |
| `npm run clean` | Clean build artifacts |
| `npm run docker:up` | Start Docker services |
| `npm run docker:down` | Stop Docker services |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed database with test data |

## 🌐 API Documentation

**Swagger UI:** http://localhost:4000/api/docs

**Key Endpoints:**

### Auth
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/register/client` - Register as client
- `POST /api/v1/auth/register/tasker` - Register as tasker
- `GET /api/v1/auth/profile` - Get current user

### Tasks
- `GET /api/v1/tasks` - List tasks
- `POST /api/v1/tasks` - Create task
- `GET /api/v1/tasks/:id` - Get task details
- `PUT /api/v1/tasks/:id` - Update task

### Offers
- `POST /api/v1/offers` - Create offer
- `PUT /api/v1/offers/:id/accept` - Accept offer
- `PUT /api/v1/offers/:id/reject` - Reject offer

### Payments
- `POST /api/v1/payments/task/:taskId` - Create payment
- `PUT /api/v1/payments/:id/release` - Release escrow

### Reviews
- `POST /api/v1/reviews` - Create review
- `GET /api/v1/reviews/user/:userId` - Get user reviews

## 🎨 UI Components

Using **shadcn/ui** components:

```typescript
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

<Button variant="default">Click me</Button>
<Input type="text" placeholder="Enter text" />
<Card>Card content</Card>
```

## 🔐 Authentication Flow

1. User logs in → API returns JWT token
2. Frontend stores token in localStorage (MVP) or httpOnly cookie (production)
3. All authenticated requests include `Authorization: Bearer <token>` header
4. Backend validates token with JwtAuthGuard

## 📊 State Management

- **Server State:** TanStack Query (React Query)
- **Client State:** Zustand (minimal usage)
- **Forms:** Controlled components with useState

## 🚨 Error Handling

### Backend
```typescript
throw new BadRequestException('Invalid data');
throw new UnauthorizedException('Not logged in');
throw new NotFoundException('Resource not found');
```

### Frontend
```typescript
try {
  await api.createTask(data);
} catch (error) {
  setError(error.message);
}
```

## 🎓 Learning Resources

- [Next.js 14 Docs](https://nextjs.org/docs)
- [NestJS Docs](https://docs.nestjs.com/)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query/latest)

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## 📞 Getting Help

- Check existing documentation
- Search GitHub Issues
- Ask in team chat
- Contact tech lead

---

Happy coding! 🚀

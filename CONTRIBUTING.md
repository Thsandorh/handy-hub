# Contributing to MesterPont

Thank you for your interest in contributing to MesterPont! This document provides guidelines and instructions for contributing.

## 🤝 Code of Conduct

Be respectful, professional, and collaborative. We're building something great together!

## 🐛 Reporting Bugs

1. **Check existing issues** to avoid duplicates
2. **Create a new issue** with:
   - Clear, descriptive title
   - Steps to reproduce
   - Expected vs. actual behavior
   - Screenshots (if applicable)
   - Environment (browser, OS, Node version)

## 💡 Suggesting Features

1. **Check roadmap and existing issues**
2. **Create a feature request issue** with:
   - Clear description of the feature
   - Use case / problem it solves
   - Proposed solution (optional)
   - Mockups (if applicable)

## 🔧 Development Process

### 1. Fork & Clone

```bash
git clone https://github.com/YOUR_USERNAME/mesterpont.git
cd mesterpont
```

### 2. Create a Branch

**Branch naming convention:**
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation
- `refactor/description` - Code refactoring
- `test/description` - Tests

```bash
git checkout -b feature/my-awesome-feature
```

### 3. Make Changes

Follow coding standards (see below)

### 4. Test Your Changes

```bash
# Run linter
npm run lint

# Format code
npm run format

# Build
npm run build

# Test manually
npm run dev
```

### 5. Commit

**Commit message convention:**

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, missing semi-colons, etc.
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

**Examples:**
```bash
git commit -m "feat(tasks): add task filtering by distance"
git commit -m "fix(auth): resolve token expiration issue"
git commit -m "docs(readme): update setup instructions"
```

### 6. Push & Create Pull Request

```bash
git push origin feature/my-awesome-feature
```

Then create a PR on GitHub with:
- **Clear title** following commit conventions
- **Description** of what changed and why
- **Screenshots** (for UI changes)
- **Related issues** (e.g., "Closes #123")

## 📋 Coding Standards

### TypeScript

- **Use TypeScript** for all new code
- **Prefer types over any:** Avoid `any`, use proper types
- **Use interfaces** for object shapes
- **Export types** from `@mesterpont/types` if shared

```typescript
// Good
interface UserData {
  id: string;
  name: string;
}

// Bad
const user: any = { id: '1', name: 'John' };
```

### React/Next.js

- **Use functional components** with hooks
- **Prefer server components** when possible (Next.js 14)
- **Use client components** only when needed (`'use client'`)
- **Keep components small** and focused

```typescript
// Good
'use client';

export default function TaskCard({ task }: { task: Task }) {
  const [liked, setLiked] = useState(false);
  return <div>...</div>;
}

// Bad - too complex
export default function MegaComponent() {
  // 500 lines of code
}
```

### NestJS

- **Use dependency injection**
- **Organize by feature modules**
- **Use DTOs** for validation
- **Use guards** for authentication/authorization

```typescript
// Good
@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.task.findMany();
  }
}
```

### Styling

- **Use Tailwind CSS** utility classes
- **Follow existing patterns** in the codebase
- **Responsive design:** Mobile-first
- **Accessibility:** Use semantic HTML, ARIA labels

```tsx
// Good
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
  Click me
</button>

// Bad
<div onClick={handleClick} className="button">
  Click me
</div>
```

### File Naming

- **Components:** PascalCase (`TaskCard.tsx`)
- **Utilities:** camelCase (`formatDate.ts`)
- **Types:** PascalCase (`UserTypes.ts`)
- **Pages (Next.js):** lowercase (`tasks/page.tsx`)

### Imports

```typescript
// Order: React, libraries, absolute imports, relative imports
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { TaskCard } from './TaskCard';
```

## 🧪 Testing

### Writing Tests

```typescript
// Unit test example (when tests are added)
describe('TasksService', () => {
  it('should create a task', async () => {
    const task = await service.create(mockData);
    expect(task.id).toBeDefined();
  });
});
```

### Test Coverage

- Aim for **80%+ coverage** on critical paths
- Test **happy paths and edge cases**
- Mock external dependencies

## 📚 Documentation

- **Update README.md** if setup changes
- **Update DEVELOPMENT.md** for new workflows
- **Add JSDoc comments** for complex functions
- **Update API docs** (Swagger) for new endpoints

```typescript
/**
 * Creates a new task and notifies nearby taskers
 * @param userId - The ID of the client creating the task
 * @param dto - Task creation data
 * @returns Created task with ID
 */
async createTask(userId: string, dto: CreateTaskDto) {
  // ...
}
```

## 🔍 Code Review Process

### For Reviewers

- **Be kind and constructive**
- **Check functionality**, not just code style
- **Test locally** if possible
- **Approve or request changes** within 24-48 hours

### For Authors

- **Respond to feedback** promptly
- **Make requested changes** or discuss alternatives
- **Don't take it personally** - we're all learning!

## 🎯 MVP Priorities

**High Priority:**
- ✅ Core task creation/browsing
- ✅ User authentication
- ✅ Offer system
- 🔄 Payment integration (SimplePay)
- 🔄 Real-time chat
- 🔄 File uploads (S3)

**Medium Priority:**
- Map integration (Google Maps)
- Email notifications
- Admin dashboard
- Mobile responsiveness

**Low Priority:**
- Advanced search/filters
- Analytics dashboard
- Push notifications
- Native mobile app

## 🚀 Release Process

1. **Feature complete** on `develop` branch
2. **Create release branch:** `release/v1.x.x`
3. **QA testing**
4. **Merge to `main`**
5. **Tag release:** `git tag v1.x.x`
6. **Deploy to production**

## 📞 Questions?

- Open a **GitHub Discussion**
- Ask in **team chat**
- Email **tech lead**

---

Thank you for contributing to MesterPont! 🙏

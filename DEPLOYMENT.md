# MesterPont - Deployment Guide

## 🚀 Production Deployment

### Frontend (Next.js) - Vercel

1. **Connect to Vercel:**
   ```bash
   npm install -g vercel
   cd apps/web
   vercel
   ```

2. **Environment Variables (Vercel Dashboard):**
   ```env
   NEXT_PUBLIC_API_URL=https://api.mesterpont.hu/api/v1
   NEXTAUTH_URL=https://mesterpont.hu
   NEXTAUTH_SECRET=<generate-strong-secret>
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=<your-key>
   NEXT_PUBLIC_WS_URL=https://api.mesterpont.hu
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

### Backend (NestJS) - Railway/Render

#### Railway (Recommended)

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and Initialize:**
   ```bash
   railway login
   railway init
   ```

3. **Add PostgreSQL:**
   ```bash
   railway add --database postgresql
   ```

4. **Add Redis:**
   ```bash
   railway add --database redis
   ```

5. **Environment Variables:**
   ```env
   DATABASE_URL=${{ RAILWAY_POSTGRES_URL }}
   REDIS_URL=${{ RAILWAY_REDIS_URL }}
   JWT_SECRET=<generate-strong-secret>
   JWT_EXPIRES_IN=7d
   PORT=4000
   NODE_ENV=production
   FRONTEND_URL=https://mesterpont.hu
   SIMPLEPAY_MERCHANT_ID=<production-merchant-id>
   SIMPLEPAY_SECRET_KEY=<production-secret>
   SIMPLEPAY_SANDBOX=false
   AWS_REGION=eu-central-1
   AWS_ACCESS_KEY_ID=<your-key>
   AWS_SECRET_ACCESS_KEY=<your-secret>
   AWS_S3_BUCKET=mesterpont-uploads-prod
   GOOGLE_MAPS_API_KEY=<your-key>
   ```

6. **Deploy:**
   ```bash
   railway up
   ```

#### Alternative: Render

1. Create new Web Service on Render
2. Connect GitHub repository
3. Build Command: `npm install && npm run build`
4. Start Command: `npm run start:prod`
5. Add environment variables (same as Railway)

### Database - Neon (Serverless Postgres)

1. **Sign up at [Neon.tech](https://neon.tech)**

2. **Create new project** (EU region for Hungary)

3. **Get connection string:**
   ```
   postgresql://user:password@ep-xxx.eu-central-1.aws.neon.tech/mesterpont?sslmode=require
   ```

4. **Run migrations:**
   ```bash
   cd packages/database
   DATABASE_URL="<neon-connection-string>" npm run migrate:deploy
   ```

### File Storage - AWS S3

1. **Create S3 Bucket:**
   ```bash
   aws s3 mb s3://mesterpont-uploads-prod --region eu-central-1
   ```

2. **Configure CORS:**
   ```json
   {
     "CORSRules": [
       {
         "AllowedOrigins": ["https://mesterpont.hu"],
         "AllowedMethods": ["GET", "PUT", "POST"],
         "AllowedHeaders": ["*"]
       }
     ]
   }
   ```

3. **Create IAM User** with S3 access and get credentials

## 🔒 Security Checklist

- [ ] Change all default secrets and passwords
- [ ] Enable HTTPS everywhere (Vercel/Railway handle this)
- [ ] Configure CORS properly
- [ ] Set up rate limiting (Redis)
- [ ] Enable database connection pooling
- [ ] Configure SimplePay production credentials
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Enable database backups
- [ ] Configure CDN for static assets

## 📊 Monitoring

### Recommended Tools:

- **Application Monitoring:** [Sentry](https://sentry.io)
- **Performance:** [Vercel Analytics](https://vercel.com/analytics)
- **Database:** Neon built-in monitoring
- **Logs:** Railway/Render built-in logs

### Setup Sentry:

```bash
npm install @sentry/nextjs @sentry/node
```

**apps/web/sentry.client.config.js:**
```javascript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

**apps/api/src/main.ts:**
```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

## 🔄 CI/CD

GitHub Actions is configured in `.github/workflows/ci.yml`

**Auto-deploy on push to main:**
- Vercel: Automatic (via GitHub integration)
- Railway: Automatic (via GitHub integration)

## 📈 Scaling

### When to scale:

1. **Database:** Upgrade Neon plan or migrate to dedicated Postgres (RDS)
2. **API:** Railway auto-scales, or move to Kubernetes (GKE/EKS)
3. **Redis:** Upgrade to Redis Cloud or ElastiCache
4. **CDN:** Use Cloudflare for static assets

### Load Testing:

```bash
# Install k6
brew install k6

# Run load test
k6 run loadtest.js
```

## 🛟 Backup Strategy

1. **Database:** Neon automatic backups (7 days retention)
2. **S3:** Enable versioning
3. **Secrets:** Store in 1Password/Vault

## 🌍 Domain Setup

1. **Buy domain:** mesterpont.hu
2. **Vercel:** Add custom domain in dashboard
3. **Railway:** Add custom domain for API (api.mesterpont.hu)
4. **DNS Records:**
   ```
   mesterpont.hu       A     76.76.21.21 (Vercel)
   www.mesterpont.hu   CNAME mesterpont.hu
   api.mesterpont.hu   CNAME <railway-subdomain>.railway.app
   ```

## 📞 Support

For deployment issues, contact the team lead or check:
- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Neon Docs](https://neon.tech/docs)

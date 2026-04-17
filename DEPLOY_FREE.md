# Free Deployment Guide: Vercel + Render

This guide walks you through deploying Elegance EMS completely free using Vercel (frontend) and Render (backend).

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         INTERNET                                │
└─────────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┴───────────────────┐
          ▼                                       ▼
┌─────────────────────┐                 ┌─────────────────────┐
│       VERCEL       │                 │       RENDER        │
│     (Frontend)      │────────────────▶│     (Backend)       │
│                     │                 │                     │
│  elegence-ems.vercel│                 │  elegance-api.onren│
│       .app         │                 │      der.com        │
└─────────────────────┘                 └─────────────────────┘
                                                │
                              ┌─────────────────┼─────────────────┐
                              ▼                 ▼                 ▼
                    ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
                    │  SUPABASE    │   │   UPSTASH    │   │    SENDGRID  │
                    │ (PostgreSQL) │   │   (Redis)    │   │  (Email/Git) │
                    │   500MB Free │   │  10k/day     │   │  100/day     │
                    └──────────────┘   └──────────────┘   └──────────────┘
```

---

## Prerequisites

- GitHub account
- Supabase account (free)
- Render account (free)
- Vercel account (free)

---

## Step 1: Database Setup (Supabase)

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click **New Project**
3. Fill in details:
   - **Name**: `elegance-ems`
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to you
4. Click **Create new project**
5. Wait for setup to complete (~2 minutes)

### 1.2 Get Connection String

1. Go to **Settings** → **Database**
2. Scroll to **Connection string** section
3. Select **URI** tab
4. Copy the connection string
5. Replace `<YOUR-PASSWORD>` with the password you set

```
postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

### 1.3 Enable Extensions (Optional)

1. Go to **SQL Editor** in Supabase dashboard
2. Run this query to enable UUID extension:
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

---

## Step 2: Backend Setup (Render)

### 2.1 Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with **GitHub** (recommended)
3. Connect your repository

### 2.2 Create Web Service

1. Click **New +** → **Web Service**
2. Connect your GitHub repository
3. Configure the service:

| Setting | Value |
|---------|-------|
| **Name** | `elegance-api` |
| **Region** | Choose closest |
| **Branch** | `main` |
| **Root Directory** | `server` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | `Free` |

### 2.3 Add Environment Variables

Click **Environment** and add these variables:

```env
# Required
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres
JWT_SECRET=[GENERATE_64_CHAR_RANDOM_STRING]

# CORS - IMPORTANT
FRONTEND_URL=https://elegance-ems.vercel.app

# Optional - Add when needed
# REDIS_URL=redis://default:[PASSWORD]@[HOST]:6379
# SUPABASE_URL=https://[REF].supabase.co
# SUPABASE_KEY=[ANON_KEY]
# SENTRY_DSN=https://[DSN]@sentry.io/[PROJECT]
```

### 2.4 Generate JWT Secret

Run this in your terminal to generate a secure secret:
```bash
openssl rand -base64 64
```

### 2.5 Deploy

1. Click **Create Web Service**
2. Wait for build to complete (~3-5 minutes)
3. Note your **Backend URL** (e.g., `https://elegance-api.onrender.com`)

### 2.6 Run Database Migrations

1. In Render dashboard, click your service
2. Go to **Shell** tab
3. Run these commands:
```bash
npm run db:migrate
npm run db:seed
```

---

## Step 3: Frontend Setup (Vercel)

### 3.1 Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with **GitHub**
3. Authorize Vercel to access your repositories

### 3.2 Import Project

1. Click **Add New** → **Project**
2. Select your repository
3. Configure project settings:

| Setting | Value |
|---------|-------|
| **Framework Preset** | `Vite` |
| **Root Directory** | `./` or `Frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

### 3.3 Add Environment Variable

Click **Environment Variables** and add:

```env
VITE_API_BASE_URL=https://elegance-api.onrender.com/api
```

> ⚠️ **Important**: Use your actual Render backend URL!

### 3.4 Deploy

1. Click **Deploy**
2. Wait for deployment (~2 minutes)
3. Your app is live at: `https://elegance-ems.vercel.app`

### 3.5 Update CORS in Backend

After getting your Vercel URL:

1. Go back to Render dashboard
2. Update `FRONTEND_URL` environment variable with your Vercel URL
3. Redeploy the backend

---

## Step 4: Verify Deployment

### 4.1 Test Backend API

Visit: `https://elegance-api.onrender.com/api/health`

You should see:
```json
{"status":"ok","timestamp":"..."}
```

### 4.2 Test Frontend

Visit: `https://elegance-ems.vercel.app`

### 4.3 Default Login Credentials

After seeding:

| Role | Employee ID | Password |
|------|-------------|----------|
| Root | EJB2026001 | mrnobody009 |
| Admin | EJB2026002 | admin123 |

---

## Free Tier Limits

| Service | Free Tier | Notes |
|---------|-----------|-------|
| **Vercel** | Unlimited | 100GB bandwidth/month |
| **Render** | 500 hours/month | Spins down after 15min inactivity |
| **Supabase** | 500MB database | 1GB file storage |
| **Upstash Redis** | 10,000 commands/day | Serverless |

---

## Troubleshooting

### Backend Cold Start
Render's free tier spins down after 15 minutes. First request may take ~30 seconds.

**Solution**: Use a uptime monitor like UptimeRobot (free) to ping your backend every 15 minutes.

### CORS Errors
If you get CORS errors:

1. Verify `FRONTEND_URL` in Render matches your Vercel URL exactly
2. Include trailing slash: `https://app.vercel.app/`
3. Redeploy backend after changes

### Database Connection Issues
1. Check `DATABASE_URL` is correct
2. Ensure IP whitelist includes Render (usually automatic in Supabase)
3. Check Supabase dashboard for connection errors

### Build Failures
If frontend build fails on Vercel:

1. Ensure `npm run build` works locally
2. Check Node version compatibility (use Node 18+)
3. Review build logs for specific errors

---

## Custom Domain (Optional)

### Vercel Frontend
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed

### Render Backend
1. Go to Service → Settings → Custom Domain
2. Add your subdomain (e.g., `api.yourdomain.com`)
3. Configure DNS CNAME to point to Render

---

## Maintenance Commands

### Run Migrations
```bash
# In Render Shell
npm run db:migrate
```

### Seed Database
```bash
# In Render Shell
npm run db:seed
```

### Rollback Migration
```bash
# In Render Shell
npm run db:rollback
```

---

## Security Checklist

- [ ] Change default passwords after first login
- [ ] Set strong `JWT_SECRET` (64 random characters)
- [ ] Enable Supabase Row Level Security (RLS)
- [ ] Add rate limiting via Render
- [ ] Enable SSL in Supabase (enabled by default)
- [ ] Remove default admin account or change password

---

## Monitoring (Free)

### Error Tracking
1. Create free [Sentry.io](https://sentry.io) account
2. Add `SENTRY_DSN` to Render environment variables

### Uptime Monitoring
1. Create free [UptimeRobot](https://uptimerobot.com) account
2. Add monitor for `https://elegance-api.onrender.com`
3. Set interval to 5 minutes

### Analytics
- Vercel provides built-in analytics (free)
- Supabase provides basic analytics

---

## Cost Summary (Free Tier)

| Service | Monthly Cost | Limits |
|---------|--------------|--------|
| Vercel | $0 | Unlimited |
| Render | $0 | 500 hours |
| Supabase | $0 | 500MB DB |
| Upstash | $0 | 10k/day |
| **Total** | **$0** | |

---

## Need Help?

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs

---

**Happy Deploying! 🚀**

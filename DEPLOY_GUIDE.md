# Deploy Guide: GitHub + Render + Supabase + Vercel

---

## Step 1: GitHub - Push Your Code

### 1. Create a new GitHub repository
1. Go to [github.com](https://github.com) → New Repository
2. Name: `elegance-employee-system`
3. Public or Private
4. Don't initialize with README (we'll push existing code)

### 2. Initialize git and push code (in your project folder)

```bash
# Initialize git
git init

# Add all files (create .gitignore first)
echo "node_modules/
.env
*.sqlite
*.log
dist/
build/" > .gitignore

git add .
git commit -m "Initial commit"

# Add your GitHub repo (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/elegance-employee-system.git

# Push to GitHub
git push -u origin main
```

---

## Step 2: Supabase - Set Up Database

### 1. Create Supabase project
1. Go to [supabase.com](https://supabase.com) → Sign in
2. Click "New Project"
3. Fill details:
   - Organization: Your name
   - Name: `elegance-db`
   - Database Password: Create a strong password (save it!)
   - Region: Near you

### 2. Wait for setup (2-3 minutes)

### 3. Get connection string
1. Go to **Settings** → **Database**
2. Find "Connection string" section
3. Copy the **URI** (looks like: `postgres://postgres:[password]@db-xxx.supabase.co:5432/postgres`)

### 4. Update your code for Supabase

Create a `.env` file in `/server` folder:
```env
# Database - Use Supabase connection string
DATABASE_URL=postgres://postgres:YOUR_PASSWORD@db-xxx.supabase.co:5432/postgres

# Or use individual settings
DB_HOST=db-xxx.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=YOUR_PASSWORD

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-jwt-key-change-this

# Other settings
PORT=443
USE_HTTPS=false
```

### 5. Update knexfile.js for Supabase

```javascript
// server/knexfile.js
export default {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL || {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'postgres',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || ''
    },
    pool: { min: 2, max: 10 },
    migrations: {
      directory: './migrations'
    }
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: { min: 2, max: 10 },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations'
    }
  }
};
```

---

## Step 3: Render - Deploy Backend

### 1. Create Render account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub → Authorize

### 2. Create Web Service
1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - Name: `elegance-api`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node index.js`
   - Free tier: Select "Free"

### 3. Add Environment Variables
Click "Environment" tab and add:
```
DATABASE_URL=postgres://postgres:YOUR_PASSWORD@db-xxx.supabase.co:5432/postgres
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=production
PORT=443
USE_HTTPS=false
```

### 4. Deploy
1. Click "Create Web Service"
2. Wait for build (5-10 mins)
3. Your API will be live at: `https://elegance-api.onrender.com`

---

## Step 4: Vercel - Deploy Frontend

### 1. Prepare frontend for deployment

Update frontend API URL:
- In your React/Vue frontend, find where API calls are made
- Change from `http://localhost:443` to your Render URL

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "Add New..." → "Project"
4. Import your GitHub repo
5. Configure:
   - Framework: `Next.js` or `Other`
   - Build Command: Check your package.json (usually `npm run build` or `vite build`)
   - Output Directory: `dist` or `build`
6. Add Environment Variables:
   ```
   VITE_API_URL=https://elegance-api.onrender.com
   ```

### 3. Deploy
Click Deploy. Your frontend will be live at: `https://your-project.vercel.app`

---

## Summary

| Platform | URL | Purpose |
|----------|-----|---------|
| Supabase | `db-xxx.supabase.co` | PostgreSQL Database |
| Render | `elegance-api.onrender.com` | Node.js API Backend |
| Vercel | `your-app.vercel.app` | Frontend |

---

## Important Notes

1. **CORS**: Update your backend CORS to allow your Vercel domain:
   ```javascript
   // In server/index.js
   origin: [
     process.env.FRONTEND_URL,
     "https://your-app.vercel.app"  // Add this
   ],
   ```

2. **Environment Variables**: Make sure both Render and Vercel have correct env vars

3. **Database Migrations**: Run migrations on Supabase:
   ```bash
   # On your local machine after updating to use Supabase
   cd server
   npm run db:migrate
   ```

4. **Supabase Pool URL**: For better performance, use the Pooler URL:
   ```
   postgres://postgres:password@pooler.supabase.co:6543/postgres
   ```

---

## Troubleshooting

- **Build fails**: Check build logs in Render dashboard
- **Connection refused**: Verify DATABASE_URL is correct
- **CORS errors**: Update CORS origin in backend
- **502 errors**: Make sure backend is running on correct port
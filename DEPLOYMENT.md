# MyPortfolio - Vercel Deployment Guide

## Overview

This portfolio application is a monorepo containing:
- **Frontend**: React + Vite (in `/client` folder)
- **Backend**: Node.js + Express + MongoDB (in `/server` folder)

We'll deploy everything as a **single Vercel project** using:
- Serverless functions for the backend API
- Static hosting for the React frontend

---

## Pre-Deployment Checklist

### 1. Required Files
- ✅ `/api/index.js` - Serverless function entry point
- ✅ `/vercel.json` - Vercel configuration
- ✅ `/client/vite.config.js` - Vite build configuration

### 2. Dependencies Check
Ensure all dependencies are in the **root** `package.json`:
- ✅ Express and backend dependencies are already in root `package.json`
- ✅ Client dependencies are in `client/package.json` (this is fine)

---

## Environment Variables Setup

You'll need to configure these environment variables in Vercel:

### Required Variables:
1. **MONGODB_URI** - Your MongoDB connection string
   ```
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
   ```

2. **JWT_SECRET** - Secret key for JWT tokens (generate a secure random string)
   ```
   Example: use a long random string like: xK9#mP2$vL8@nQ5&rT7
   ```

3. **NODE_ENV** - Set to `production`
   ```
   production
   ```

4. **CLIENT_ORIGIN** - Your Vercel deployment URL (add after first deployment)
   ```
   https://your-app.vercel.app
   ```

---

## Deployment Steps

### Step 1: Push to GitHub
1. Create a new GitHub repository
2. Initialize git in your project (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - ready for deployment"
   ```
3. Add remote and push:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Vercel (via Web Dashboard)

1. **Go to Vercel**: https://vercel.com
2. **Sign in** with GitHub
3. Click **"Add New Project"**
4. **Import** your GitHub repository
5. **Configure Project**:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave as root)
   - **Build Command**: Leave empty (vercel.json handles this)
   - **Output Directory**: Leave empty (vercel.json handles this)
   - **Install Command**: `npm install`

6. **Add Environment Variables**:
   Click "Environment Variables" and add:
   - `MONGODB_URI` = your MongoDB connection string
   - `JWT_SECRET` = your secret key
   - `NODE_ENV` = production

7. Click **"Deploy"**

### Step 3: Post-Deployment Configuration

1. **Wait for deployment** to complete (usually 2-3 minutes)
2. **Copy your deployment URL** (e.g., `https://my-portfolio-abc123.vercel.app`)
3. **Add CLIENT_ORIGIN**:
   - Go to Project Settings → Environment Variables
   - Add: `CLIENT_ORIGIN` = your deployment URL
   - Redeploy the project

### Step 4: Update MongoDB Network Access (if using MongoDB Atlas)

1. Go to MongoDB Atlas dashboard
2. Navigate to **Network Access**
3. Add `0.0.0.0/0` to allow connections from anywhere (Vercel uses dynamic IPs)
   - Or add specific Vercel IP ranges if you prefer

---

## Project Structure Explanation

```
MyPortfolio/
├── api/
│   └── index.js              # Serverless function (wraps Express app)
├── client/
│   ├── src/                  # React source code
│   ├── public/               # Static assets
│   ├── package.json          # Client dependencies
│   └── vite.config.js        # Vite configuration
├── server/
│   ├── express.js            # Express app configuration
│   ├── controllers/          # API controllers
│   ├── models/               # Mongoose models
│   └── routes/               # API routes
├── config/
│   └── config.js             # App configuration
├── vercel.json               # Vercel deployment config
├── package.json              # Root dependencies (backend)
└── server.js                 # Local development server
```

---

## How It Works on Vercel

### Routing:
- **Frontend**: All routes (e.g., `/`, `/about`, `/contact`) → serve React app
- **Backend**: All `/api/*` routes → serverless function in `/api/index.js`

### Build Process:
1. Vercel installs root dependencies
2. Runs `cd client && npm install && npm run build`
3. Builds React app to `client/dist`
4. Creates serverless function from `api/index.js`
5. Routes configured in `vercel.json` handle traffic

### API Calls:
- Development: `http://localhost:3000/api/...`
- Production: `https://your-app.vercel.app/api/...` (same domain, no CORS issues!)

---

## Testing Your Deployment

After deployment, test these endpoints:

1. **Root API**: `https://your-app.vercel.app/api`
   - Should return: `{"message": "Welcome to My Portfolio application."}`

2. **Frontend**: `https://your-app.vercel.app/`
   - Should load your React portfolio

3. **API Routes**: Test your actual API endpoints
   - Auth: `https://your-app.vercel.app/api/auth/signin`
   - Projects: `https://your-app.vercel.app/api/projects`
   - etc.

---

## Troubleshooting

### Build Fails
- Check Vercel build logs in the deployment dashboard
- Ensure all dependencies are listed in `package.json` files
- Verify Node.js version compatibility

### Database Connection Errors
- Verify `MONGODB_URI` environment variable is set correctly
- Check MongoDB Atlas network access settings
- Ensure database user has correct permissions

### CORS Errors
- Add your Vercel URL to `CLIENT_ORIGIN` environment variable
- Redeploy after adding the variable
- The `express.js` CORS configuration should handle it automatically

### 404 on API Routes
- Verify routes in `vercel.json` are correct
- Check that `/api/index.js` exists and exports the Express app
- Look at Vercel function logs in the dashboard

### Environment Variables Not Working
- Environment variables require a redeploy after being added/changed
- Don't commit sensitive data to GitHub
- Check variable names match exactly (case-sensitive)

---

## Local Development vs Production

### Development Mode:
```bash
# Terminal 1: Run backend server
npm run dev

# Runs on: http://localhost:3000
```

The client's Vite dev server proxies `/api` requests to `localhost:3000`.

### Production (Vercel):
- Frontend and backend are on the same domain
- Backend runs as serverless functions
- MongoDB connection persists across function invocations

---

## Continuous Deployment

After initial setup, every push to `main` branch automatically:
1. Triggers a new Vercel deployment
2. Rebuilds the frontend
3. Updates serverless functions
4. Deploys in ~2-3 minutes

To deploy from other branches:
- Push to the branch
- Vercel creates a preview deployment
- Each PR gets its own preview URL

---

## Important Notes

✅ **Single Deployment**: Everything is in ONE Vercel project (not two separate instances)

✅ **Serverless**: Backend runs as serverless functions (no always-on server)

✅ **MongoDB**: Use MongoDB Atlas (cloud) - local MongoDB won't work on Vercel

✅ **Environment Variables**: NEVER commit secrets to GitHub - use Vercel's environment variables

✅ **Build Command**: Handled by `vercel.json`, no need to configure in dashboard

✅ **Custom Domain**: You can add a custom domain in Vercel project settings

---

## Quick Reference Commands

```bash
# Install dependencies
npm install
cd client && npm install

# Local development
npm run dev

# Build for production (test locally)
cd client && npm run build

# Preview production build locally
cd client && npm run preview
```

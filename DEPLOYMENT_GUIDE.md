# StudyIO MVP Deployment Guide

## 🚀 Quick Deployment Guide for Stakeholder Demo

This guide will help you deploy StudyIO to show your stakeholders.

---

## Prerequisites

1. **MongoDB Atlas Account** (Free tier is sufficient for MVP)
   - Sign up at: https://www.mongodb.com/cloud/atlas/register

2. **Hosting Platforms** (Choose one pair):
   
   **Option A (Recommended - Free for MVP):**
   - Frontend: Vercel (https://vercel.com)
   - Backend: Render (https://render.com)
   
   **Option B:**
   - Frontend: Netlify (https://netlify.com)
   - Backend: Railway (https://railway.app)
   
   **Option C:**
   - Both: Heroku (https://heroku.com) - Has free tier limitations

---

## 📋 Step-by-Step Deployment

### STEP 1: Setup MongoDB Atlas (Database)

1. **Create Account & Cluster**
   ```
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Sign up/Login
   - Create a FREE cluster (M0 Sandbox - 512MB)
   - Choose a region closest to you
   - Cluster name: studyio-mvp
   ```

2. **Configure Database Access**
   ```
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Username: studyio_admin
   - Password: Generate secure password (SAVE THIS!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"
   ```

3. **Configure Network Access**
   ```
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production, restrict this later!
   - Click "Confirm"
   ```

4. **Get Connection String**
   ```
   - Go to "Database" in left sidebar
   - Click "Connect" button on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: mongodb+srv://studyio_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   - Replace <password> with your actual password
   - SAVE THIS CONNECTION STRING!
   ```

---

### STEP 2: Deploy Backend to Render

1. **Prepare Backend**
   ```bash
   cd backend
   npm install
   npm run build
   ```

2. **Create Render Account**
   ```
   - Go to https://render.com
   - Sign up with GitHub (recommended)
   ```

3. **Create Web Service**
   ```
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select studyio repository
   - Configure:
     * Name: studyio-backend
     * Region: Choose closest to you
     * Branch: main
     * Root Directory: backend
     * Runtime: Node
     * Build Command: npm install && npm run build
     * Start Command: npm start
     * Instance Type: Free
   ```

4. **Add Environment Variables**
   ```
   In Render dashboard, go to "Environment" tab and add:
   
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=<your-mongodb-connection-string-from-step1>
   JWT_SECRET=<generate-random-32-char-string>
   JWT_EXPIRE=7d
   JWT_COOKIE_EXPIRE=7
   FRONTEND_URL=<will-add-after-frontend-deployment>
   ```

   **To generate JWT_SECRET, run in terminal:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

5. **Deploy**
   ```
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment
   - Once deployed, copy the URL (e.g., https://studyio-backend.onrender.com)
   - SAVE THIS BACKEND URL!
   ```

---

### STEP 3: Deploy Frontend to Vercel

1. **Update Environment File**
   ```bash
   # In frontend/.env.production (already created)
   # Replace with your backend URL from Step 2
   VITE_API_URL=https://studyio-backend.onrender.com/api/v1
   ```

2. **Create Vercel Account**
   ```
   - Go to https://vercel.com
   - Sign up with GitHub
   ```

3. **Import Project**
   ```
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Configure:
     * Framework Preset: Vite
     * Root Directory: frontend
     * Build Command: npm run build
     * Output Directory: dist
     * Install Command: npm install
   ```

4. **Add Environment Variables**
   ```
   - Click "Environment Variables"
   - Add: VITE_API_URL
   - Value: https://studyio-backend.onrender.com/api/v1
   - Apply to: Production, Preview, Development
   ```

5. **Deploy**
   ```
   - Click "Deploy"
   - Wait 2-5 minutes
   - Once deployed, copy the URL (e.g., https://studyio.vercel.app)
   - SAVE THIS FRONTEND URL!
   ```

---

### STEP 4: Update Backend with Frontend URL

1. **Go back to Render**
   ```
   - Open your backend service
   - Go to "Environment" tab
   - Update FRONTEND_URL with your Vercel URL
   - Example: FRONTEND_URL=https://studyio.vercel.app
   - Save changes
   - Service will auto-redeploy
   ```

---

### STEP 5: Seed Database with Initial Data

1. **Connect to Backend Shell** (on Render)
   ```
   - In Render dashboard, go to "Shell" tab
   - Run: npm run seed
   - This will populate your database with initial problems and data
   ```

   **OR use your local machine:**
   ```bash
   # In backend folder, create a temporary .env file
   MONGODB_URI=<your-production-mongodb-uri>
   
   # Run seed
   npm run seed
   ```

2. **Create Admin User**
   ```bash
   npm run create-admin
   # Follow prompts to create admin account
   ```

---

## ✅ Verification Checklist

Test these after deployment:

- [ ] Frontend loads at your Vercel URL
- [ ] Backend health check: `https://your-backend-url.onrender.com/health`
- [ ] Sign up new user
- [ ] Login works
- [ ] Can view problems
- [ ] Code editor loads
- [ ] Navigation works

---

## 🔧 Common Issues & Solutions

### Issue 1: Frontend can't connect to Backend
**Solution:** 
- Check CORS settings in backend
- Verify VITE_API_URL in frontend env
- Check browser console for errors

### Issue 2: Database connection failed
**Solution:**
- Verify MongoDB connection string
- Check IP whitelist in MongoDB Atlas
- Ensure password is correct (no special characters issues)

### Issue 3: Render service sleeping (free tier)
**Solution:**
- First request takes 30-60 seconds to wake up
- Consider upgrading or using cron job to keep alive
- Use service like UptimeRobot to ping every 10 minutes

### Issue 4: Build fails on Vercel/Render
**Solution:**
- Check build logs for specific errors
- Ensure all dependencies are in package.json
- Verify Node version compatibility

---

## 📱 Share with Stakeholders

Once deployed, share:

1. **Live URL:** `https://your-app.vercel.app`
2. **Demo Credentials:**
   ```
   Email: demo@studyio.com
   Password: Demo@123
   ```
3. **Key Features to Demo:**
   - User authentication
   - DSA problem solving interface
   - Code editor with Monaco
   - Progress tracking
   - Multiple subjects (OS, DBMS, LLD)
   - Responsive design

---

## 🔒 Security Notes for MVP

**For stakeholder demo, we've prioritized speed. Before full production:**

- [ ] Restrict MongoDB IP whitelist
- [ ] Add rate limiting
- [ ] Enable HTTPS everywhere
- [ ] Add input validation
- [ ] Implement proper error logging (Sentry)
- [ ] Add monitoring (New Relic / DataDog)
- [ ] Setup CI/CD pipeline
- [ ] Add automated tests
- [ ] Implement database backups

---

## 💰 Costs (MVP - Free Tier)

- **MongoDB Atlas:** FREE (M0 - 512MB)
- **Vercel:** FREE (100GB bandwidth/month)
- **Render:** FREE (750 hours/month)
- **Total:** $0/month for MVP

**Note:** Free tier limitations:
- Render: Service sleeps after 15 min inactivity
- Vercel: 100GB bandwidth limit
- MongoDB: 512MB storage

---

## 🚀 Quick Commands Reference

```bash
# Backend
cd backend
npm install
npm run build
npm start

# Frontend
cd frontend
npm install
npm run build
npm run preview

# Database Seeding
npm run seed
npm run create-admin

# Check Production Build Locally
cd frontend && npm run build && npm run preview
cd backend && npm run build && npm start
```

---

## 📞 Support

If you encounter issues:

1. Check browser console (F12)
2. Check Render logs (backend dashboard)
3. Check Vercel logs (frontend dashboard)
4. Verify all environment variables

---

## 🎯 Next Steps After Demo

If stakeholders approve:

1. Implement user feedback
2. Add analytics (Google Analytics / Mixpanel)
3. Setup proper monitoring
4. Add more DSA problems
5. Implement code execution (Judge0)
6. Add social features (discussions)
7. Mobile app development
8. Marketing & SEO optimization

---

**Good Luck with Your Demo! 🎉**

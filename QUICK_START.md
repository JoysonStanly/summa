# 🎯 Quick Start Deployment Guide for StudyIO

## Your Setup
- **Domain:** studyio.in
- **Frontend:** Will be deployed to Vercel
- **Backend:** Will be deployed to Render
- **Database:** MongoDB Atlas (Free tier)

---

## ⚡ 5-Minute Setup (The Fast Track)

### Step 1: MongoDB (2 minutes)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create account → Create FREE M0 cluster
3. Database Access → Add user: `studyio_admin` → Generate password → Save it!
4. Network Access → Add IP: `0.0.0.0/0` (Allow from anywhere)
5. Click "Connect" → "Connect your application" → Copy connection string
6. Replace `<password>` with your actual password
7. **Save this connection string!**

### Step 2: Deploy Backend to Render (3 minutes)
1. Go to [Render.com](https://render.com) → Sign up with GitHub
2. New → Web Service → Connect your repository
3. Configure:
   - Name: `studyio-backend`
   - Root Directory: `backend`
   - Build: `npm install && npm run build`
   - Start: `npm start`
   - Free tier

4. Add Environment Variables (click "Add Environment Variable"):
   ```
   NODE_ENV          = production
   PORT              = 5000
   MONGODB_URI       = <paste-your-mongodb-connection-string>
   JWT_SECRET        = <generate-below>
   JWT_EXPIRE        = 7d
   JWT_COOKIE_EXPIRE = 7
   FRONTEND_URL      = https://studyio.in
   ```

5. Generate JWT_SECRET (run in terminal):
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Copy output and paste as JWT_SECRET

6. Click "Create Web Service" → Wait 5 minutes
7. **Copy your backend URL** (e.g., `https://studyio-backend.onrender.com`)

### Step 3: Deploy Frontend to Vercel (3 minutes)
1. Go to [Vercel.com](https://vercel.com) → Sign up with GitHub
2. Add New → Project → Import your repository
3. Configure:
   - Framework: Vite
   - Root Directory: `frontend`
   - Build: `npm run build`
   - Output: `dist`

4. Environment Variables:
   ```
   VITE_API_URL = https://studyio-backend.onrender.com/api/v1
   ```

5. Deploy → Wait 2 minutes
6. Go to Settings → Domains → Add `studyio.in`

### Step 4: Configure Domain (5 minutes)
1. Go to your domain registrar (where you bought studyio.in)
2. DNS Settings → Add records:

   **For root domain (@):**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   TTL: Auto
   ```

   **For www:**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   TTL: Auto
   ```

3. Wait 5-10 minutes for DNS to propagate

### Step 5: Seed Database (2 minutes)
On your local machine:

```bash
cd backend

# Create a .env file with your production MongoDB URI
echo "MONGODB_URI=your-production-mongodb-uri" > .env

# Seed the database
npm run seed

# Create admin user
npm run create-admin admin@studyio.in Admin@123! "Admin User"
```

**Alternative:** See [ADMIN_SETUP_GUIDE.md](./ADMIN_SETUP_GUIDE.md) for 3 different methods to create admin account (including using Render Shell or API endpoint).

---

## ✅ Verify Deployment

1. **Backend Health Check:**
   ```
   https://studyio-backend.onrender.com/health
   ```
   Should return: `{"success": true, "message": "StudyIO API is running"}`

2. **Frontend:**
   ```
   https://studyio.in
   ```
   Should load the StudyIO homepage

3. **Test Features:**
   - Sign up new user
   - Login
   - Navigate to a DSA problem
   - Check code editor loads
   - View OS/DBMS content

---

## 🎯 Demo Credentials

Create these accounts for your stakeholder demo:

```bash
cd backend
npm run create-admin
# Email: demo@studyio.in
# Password: Demo@123!
```

---

## ⚠️ Important Notes

### Free Tier Limitations:
- **Render:** Backend sleeps after 15 minutes of inactivity
  - First request takes 30-60 seconds to "wake up"
  - This is normal for free tier!

- **Vercel:** 100GB bandwidth/month
  - More than enough for MVP demo

- **MongoDB:** 512MB storage
  - Sufficient for hundreds of problems

### Security for MVP:
- ✅ HTTPS enabled automatically
- ✅ JWT authentication configured
- ✅ CORS configured properly
- ✅ Environment variables secured
- ⚠️ Rate limiting only in production mode
- ⚠️ Database accessible from anywhere (restrict later)

---

## 🐛 Quick Fixes

### "Cannot connect to backend"
```bash
# Check backend is running
curl https://studyio-backend.onrender.com/health

# Check CORS settings
# Verify FRONTEND_URL in Render = https://studyio.in
```

### "Domain not loading"
```bash
# Check DNS propagation
nslookup studyio.in

# Try in incognito mode (clears DNS cache)
# Wait 10-30 minutes for full propagation
```

### "Build failed"
```bash
# Test locally first
cd frontend
npm install
npm run build

# Check Vercel deployment logs for specific error
```

---

## 📊 What to Show Stakeholders

1. **Homepage** - Clean, professional landing
2. **DSA Problems** - Interactive code editor
3. **Core Subjects** - Organized learning content
4. **Code Editor** - Monaco editor with syntax highlighting
5. **Responsive Design** - Works on mobile/tablet
6. **Fast Loading** - Optimized build
7. **Secure** - HTTPS, authentication

---

## 💡 After Demo

If approved:
1. Upgrade Render to paid ($7/mo) for 24/7 uptime
2. Add more DSA problems
3. Implement code execution (Judge0)
4. Add analytics (Google Analytics)
5. Set up monitoring (Sentry)
6. Consider upgrading MongoDB if needed

---

## 📞 Support Resources

- **Full Guide:** See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Checklist:** See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **MongoDB Atlas:** https://docs.atlas.mongodb.com

---

## 🚀 Deploy Now!

Everything is configured for your domain **studyio.in**. Just follow the steps above!

**Estimated Total Time: 15-20 minutes**

Good luck with your demo! 🎉

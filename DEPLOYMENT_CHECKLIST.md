# 🚀 StudyIO Deployment Checklist for studyio.in

## ✅ Pre-Deployment Checklist

### 1. MongoDB Atlas Setup
- [ ] Create MongoDB Atlas account
- [ ] Create M0 (free) cluster
- [ ] Create database user: `studyio_admin`
- [ ] Whitelist IP: `0.0.0.0/0` (allow all)
- [ ] Copy connection string
- [ ] Replace `<password>` in connection string

### 2. Backend Deployment (Render)
- [ ] Sign up at render.com with GitHub
- [ ] Create new Web Service
- [ ] Connect GitHub repository
- [ ] Configure build settings:
  - Root Directory: `backend`
  - Build Command: `npm install && npm run build`
  - Start Command: `npm start`
  
- [ ] Add environment variables:
  ```
  NODE_ENV=production
  PORT=5000
  MONGODB_URI=<your-mongodb-connection-string>
  JWT_SECRET=<generate-with-crypto>
  JWT_EXPIRE=7d
  JWT_COOKIE_EXPIRE=7
  FRONTEND_URL=https://studyio.in
  ```

- [ ] Deploy backend
- [ ] Verify backend health: `https://studyio-backend.onrender.com/health`
- [ ] Copy backend URL

### 3. Domain Setup for studyio.in
- [ ] Login to your domain registrar (where you bought studyio.in)
- [ ] Go to DNS settings for studyio.in
- [ ] Add the following DNS records:

**If deploying to Vercel:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: Automatic

Type: A
Name: @
Value: 76.76.21.21
TTL: Automatic
```

**If deploying to Netlify:**
```
Type: CNAME
Name: www
Value: <your-site-name>.netlify.app
TTL: Automatic

Type: A
Name: @
Value: 75.2.60.5
TTL: Automatic
```

- [ ] Wait 5-10 minutes for DNS propagation

### 4. Frontend Deployment (Vercel - Recommended)

#### Vercel Setup:
- [ ] Sign up at vercel.com with GitHub
- [ ] Import studyio repository
- [ ] Configure project:
  - Framework: Vite
  - Root Directory: `frontend`
  - Build Command: `npm run build`
  - Output Directory: `dist`
  
- [ ] Add environment variable:
  ```
  VITE_API_URL=https://studyio-backend.onrender.com/api/v1
  ```

- [ ] Deploy
- [ ] Go to Project Settings → Domains
- [ ] Add custom domain: `studyio.in`
- [ ] Add custom domain: `www.studyio.in`
- [ ] Vercel will provide instructions for DNS configuration
- [ ] Wait for SSL certificate (automatic, takes 2-5 min)

#### Alternative: Netlify Setup:
- [ ] Sign up at netlify.com with GitHub
- [ ] New site from Git → Select repository
- [ ] Configure:
  - Base directory: `frontend`
  - Build command: `npm run build`
  - Publish directory: `frontend/dist`
  
- [ ] Add environment variable: `VITE_API_URL=https://studyio-backend.onrender.com/api/v1`
- [ ] Deploy
- [ ] Go to Domain Settings → Add custom domain
- [ ] Add `studyio.in` and configure DNS as shown above

### 5. Update Backend with Frontend URL
- [ ] Go back to Render backend service
- [ ] Environment → Edit `FRONTEND_URL`
- [ ] Set to: `https://studyio.in`
- [ ] Service will auto-redeploy

### 6. Database Seeding
- [ ] Option A: Local machine
  ```bash
  cd backend
  # Create temporary .env with production MONGODB_URI
  npm run seed
  npm run create-admin
  ```

- [ ] Option B: Render Shell
  ```bash
  # In Render dashboard → Shell tab
  npm run seed
  npm run create-admin
  ```

---

## 🧪 Post-Deployment Testing

Test on https://studyio.in

- [ ] Website loads correctly
- [ ] HTTPS is working (green padlock)
- [ ] Sign up new user
- [ ] Login with credentials
- [ ] View DSA problems
- [ ] Code editor loads
- [ ] View OS/DBMS content
- [ ] Check mobile responsiveness
- [ ] Test navigation between pages
- [ ] Check health endpoint: `https://studyio-backend.onrender.com/health`

---

## 📊 Demo Credentials for Stakeholders

Create a demo account:
```
Email: demo@studyio.in
Password: Demo@123!
Role: Student
```

Create an admin account:
```
Email: admin@studyio.in
Password: Admin@123!
Role: Admin
```

---

## 🎯 Stakeholder Demo Script

### Introduction (2 min)
"StudyIO is an all-in-one platform for DSA practice and CS fundamentals."

### Feature Demo (8 min)

1. **Authentication** (1 min)
   - Show signup/login
   - Mention secure JWT authentication

2. **DSA Problem Solving** (3 min)
   - Navigate to Arrays → Two Sum
   - Show problem statement
   - Demonstrate Monaco code editor
   - Show split-pane layout
   - Mention syntax highlighting & auto-completion

3. **Core Subjects** (2 min)
   - Navigate to Operating System
   - Show structured content
   - Demonstrate sidebar navigation
   - Show DBMS and LLD sections

4. **Progress Tracking** (1 min)
   - Show user dashboard
   - Mention streak tracking
   - Show solved problems count

5. **Responsive Design** (1 min)
   - Resize browser window
   - Show mobile layout
   - Demonstrate theme toggle (if implemented)

### Technical Highlights (2 min)
- React + TypeScript frontend
- Node.js + Express backend
- MongoDB database
- Deployed on Vercel (frontend) + Render (backend)
- Domain: studyio.in
- Free tier hosting ($0/month)

### Q&A (3 min)

---

## 🐛 Troubleshooting Common Issues

### Issue: Backend sleeping (Render free tier)
**Symptom:** First request takes 30-60 seconds
**Solution:** 
- Normal behavior on free tier
- Service "wakes up" after first request
- Consider paid tier ($7/month) for always-on
- Or use UptimeRobot to ping every 14 minutes

### Issue: CORS errors
**Symptom:** "Access to XMLHttpRequest blocked by CORS"
**Solution:**
- Verify `FRONTEND_URL` in backend matches `https://studyio.in`
- Check browser console for exact error
- Redeploy backend after environment change

### Issue: Domain not resolving
**Symptom:** "DNS_PROBE_FINISHED_NXDOMAIN"
**Solution:**
- Check DNS settings in domain registrar
- Wait up to 24 hours for DNS propagation (usually 5-10 min)
- Use `nslookup studyio.in` to check DNS
- Try incognito mode (clear DNS cache)

### Issue: Build fails on Vercel
**Symptom:** Build error in deployment logs
**Solution:**
- Check exact error in Vercel logs
- Verify `VITE_API_URL` is set correctly
- Ensure all dependencies in package.json
- Try local build: `cd frontend && npm run build`

### Issue: Can't connect to MongoDB
**Symptom:** "MongoServerError: Authentication failed"
**Solution:**
- Verify connection string format
- Check username/password (no special chars issues)
- Confirm IP whitelist includes 0.0.0.0/0
- Test connection string locally first

---

## 💰 Cost Breakdown (MVP)

| Service | Tier | Cost | Limits |
|---------|------|------|--------|
| MongoDB Atlas | M0 Sandbox | FREE | 512MB storage |
| Render | Free | FREE | Sleeps after 15min inactivity |
| Vercel | Hobby | FREE | 100GB bandwidth/month |
| Domain (studyio.in) | - | ~$10/year | Annual renewal |
| **Total** | - | **~$10/year** | MVP sufficient |

### When to Upgrade?
- **Render ($7/mo):** When you need 24/7 uptime
- **Vercel ($20/mo):** When you exceed 100GB bandwidth
- **MongoDB ($9/mo):** When you exceed 512MB data

---

## 🔐 Security Improvements for Full Production

Before going fully public:

- [ ] Add rate limiting (already configured)
- [ ] Implement input sanitization
- [ ] Add SQL injection protection
- [ ] Set up error logging (Sentry)
- [ ] Add monitoring (New Relic)
- [ ] Implement database backups
- [ ] Add API key for Judge0 (code execution)
- [ ] Set up CI/CD pipeline
- [ ] Add automated tests
- [ ] Implement CSP headers
- [ ] Add DDoS protection (Cloudflare)
- [ ] Regular security audits

---

## 📈 Next Steps After Demo

If stakeholders approve:

### Immediate (Week 1-2)
- [ ] Gather feedback from demo
- [ ] Fix any critical bugs
- [ ] Add Google Analytics
- [ ] Create social media presence
- [ ] Set up email service (SendGrid/Mailgun)

### Short-term (Month 1)
- [ ] Add 50+ more DSA problems
- [ ] Implement code execution (Judge0)
- [ ] Add discussion forums
- [ ] Implement password reset
- [ ] Add profile customization

### Medium-term (Month 2-3)
- [ ] Mobile app (React Native)
- [ ] Add video tutorials
- [ ] Implement subscription plans
- [ ] Add code solutions/editorials
- [ ] Implement leaderboard

### Long-term (Month 4+)
- [ ] AI-powered hints
- [ ] Contest platform
- [ ] Company-specific prep tracks
- [ ] Interview simulator
- [ ] Premium content

---

## 📞 Emergency Contacts

- Render Status: https://status.render.com
- Vercel Status: https://www.vercel-status.com
- MongoDB Status: https://status.cloud.mongodb.com

---

## 🎉 Launch Day Checklist

**1 Day Before:**
- [ ] Test all features thoroughly
- [ ] Create demo accounts
- [ ] Prepare presentation slides
- [ ] Test on multiple devices
- [ ] Check SSL certificate
- [ ] Verify domain is working

**Launch Day:**
- [ ] Final smoke test
- [ ] Monitor error logs
- [ ] Have backup plan ready
- [ ] Note down all feedback
- [ ] Take screenshots/record demo

**After Demo:**
- [ ] Send thank-you email with link
- [ ] Share demo credentials
- [ ] Request detailed feedback
- [ ] Plan follow-up meeting

---

## 🚀 Quick Deploy Commands

```bash
# Test locally before deploying
cd frontend && npm run build && npm run preview
cd backend && npm run build && npm start

# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Test MongoDB connection
cd backend && node -e "require('dotenv').config(); require('./src/config/database').connectDB()"

# Seed production database
cd backend && npm run seed

# Create admin user
cd backend && npm run create-admin
```

---

**Ready to deploy? Follow the checklist step-by-step!**

**Domain:** https://studyio.in  
**Backend:** https://studyio-backend.onrender.com  
**Repository:** https://github.com/JoysonStanly/summa

---

Good luck with your stakeholder demo! 🎉

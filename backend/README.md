# StudyIO Backend API

Production-ready backend for StudyIO educational platform built with Node.js, Express, TypeScript, MongoDB, and Judge0 API.

## 🚀 Features

### ✅ **Phase 1: Authentication System**
- JWT-based authentication with HTTP-only cookies
- Role-based access control (Student, Instructor, Admin)
- Password hashing with bcrypt
- Secure cookie management

### ✅ **Phase 2: Problems & Code Execution**
- DSA problem CRUD operations
- Code submission with Judge0 API integration
- Multi-language support (JavaScript, Python, C++, Java)
- Test case execution with timeout handling
- Progress tracking and streak calculation
- Coin rewards system

### ✅ **Phase 3: Sessions, Subjects, Quizzes & Leaderboard**
- **Hybrid MongoDB + GitHub storage approach**
- Live sessions with Google Meet integration
- Core subjects (OS, DBMS, CN, OOPs, LLD) with GitHub content
- Quiz system with auto-scoring
- Coin-based leaderboard
- Bug tracking system

---

## 🛠️ Tech Stack

- **Runtime**: Node.js + Express
- **Language**: TypeScript
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + HTTP-only Cookies
- **Code Execution**: Judge0 API
- **Content Storage**: Hybrid (MongoDB + GitHub)
- **Security**: Helmet, CORS, Rate Limiting, bcrypt
- **Validation**: express-validator

## � Installation

### **Prerequisites**
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### **1. Install Dependencies**
```bash
npm install
```

### **2. Environment Setup**

Create `.env` file in `backend/` directory:

```env
# Server
NODE_ENV=development
PORT=5000

# MongoDB
MONGO_URI=mongodb://localhost:27017/studyio

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Judge0 API
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=your_judge0_rapidapi_key

# GitHub Content Repository (Hybrid Approach)
GITHUB_OWNER=your-username
GITHUB_REPO=studyio-content
GITHUB_BRANCH=main
GITHUB_TOKEN=ghp_your_token_here  # Optional for public repos
```

### **3. Start Development Server**
```bash
npm run dev
```**Authentication** (`/api/v1/auth`)
```
POST   /register      # Register new user
POST   /login         # Login user
POST   /logout        # Logout user
GET    /me            # Get current user
```

### **Problems** (`/api/v1/problems`)
```
GET    /              # Get all problems
GET    /:id           # Get single problem
POST   /              # Create problem (Admin)
PUT    /:id           # Update problem (Admin)
DELETE /:id           # Delete problem (Admin)
```

### **Sessions** (`/api/v1/sessions`)
```
GET    /              # Get all sessions
POST   /              # Create session (Instructor/Admin)
POST   /:id/register  # Register for session
```

### **Subjects** (`/api/v1`)
```
GET    /subjects      # Get all subjects
GET    /subjects/:id  # Get subject with GitHub content
GET    /modules/:id   # Get module with GitHub content
GET    /topics/:id    # Get topic with GitHub content
```

### **Quizzes** (`/api/v1/quizzes`)
```
GET    /              # Get all quizzes
GET    /:id/questions # Get quiz questions from GitHub
POST   /:id/submit    # Submit quiz attempt
```

### **Leaderboard** (`/api/v1/leaderboard`)
```
GET    /              # Get leaderboard
GET    /rank/:userId  # Get user rank
GET    /top           # Get top performers
```

See [PHASE3-COMPLETE.md](./PHASE3-COMPLETE.md) for complete API documentation.

---

## � Scripts

```bash
npm run dev      # Start development server
npm run build    # Build TypeScript
npm start        # Run production server
```

---

## 📖 Documentation

- [Phase 1 Complete](./PHASE1-COMPLETE.md) - Authentication
- [Phase 2 Complete](./PHASE2-COMPLETE.md) - Problems & Submissions
- [Phase 3 Complete](./PHASE3-COMPLETE.md) - Sessions, Subjects, Quizzes

---

## 🎉 All Phases Complete!

✅ Phase 1: Authentication  
✅ Phase 2: Problems & Submissions  
✅ Phase 3: Sessions, Subjects, Quizzes, Leaderboard

**Ready for production! 🚀**


This is Phase 1 of the backend implementation. Test thoroughly before moving to Phase 2!

---

Built with ❤️ for StudyIO Platform

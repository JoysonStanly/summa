# 🔐 Admin Account Creation Guide for StudyIO

After deploying your application, you need to create an admin account. Here are **3 methods** to do this:

---

## Method 1: Using Local Terminal (Recommended) ✅

This is the **easiest and most reliable** method. Since you're using MongoDB Atlas (cloud database), you can connect from your local machine.

### Steps:

1. **Get your Production MongoDB URI** from MongoDB Atlas
   ```
   mongodb+srv://studyio_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

2. **Create temporary environment file** in backend folder:
   ```bash
   cd backend
   
   # Windows PowerShell
   echo "MONGODB_URI=your-production-mongodb-uri-here" > .env.temp
   ```

3. **Run the create-admin script**:
   ```bash
   # Method A: Interactive (will prompt for details)
   npm run create-admin
   
   # Method B: With command line arguments
   npm run create-admin admin@studyio.in YourPassword123! "Admin Name"
   ```

4. **Verify the admin was created**:
   - Try logging in at https://studyio.in
   - Or check MongoDB Atlas → Database → Browse Collections → Users

5. **Delete the temporary file**:
   ```bash
   rm .env.temp
   ```

---

## Method 2: Using Render Shell (After Backend Deployed)

Once your backend is live on Render, you can create the admin directly in production.

### Steps:

1. **Go to Render Dashboard**
   - Visit https://dashboard.render.com
   - Click on your `studyio-backend` service

2. **Open Shell Tab**
   - Click on "Shell" in the left sidebar
   - This opens a terminal connected to your production server

3. **Run the create-admin command**:
   ```bash
   npm run create-admin admin@studyio.in SecurePass123! "Admin User"
   ```

4. **Verify**:
   - Check the output for success message
   - Try logging in at https://studyio.in

---

## Method 3: Using Setup API Endpoint (NEW!) 🆕

I've added a secure API endpoint that allows creating the **first admin only**. After the first admin exists, this endpoint is disabled for security.

### Steps:

1. **Add SETUP_SECRET to Render Environment Variables**:
   - Go to Render Dashboard → Your Backend Service
   - Click "Environment" tab
   - Add new variable:
     ```
     SETUP_SECRET=your-super-secret-setup-key-12345
     ```
   - Click "Save Changes" (service will redeploy)

2. **Use Postman, Thunder Client, or curl to create admin**:

   **Using Postman:**
   - Method: POST
   - URL: `https://studyio-backend.onrender.com/api/v1/auth/setup-admin`
   - Body (JSON):
     ```json
     {
       "name": "Admin User",
       "email": "admin@studyio.in",
       "password": "SecurePassword123!",
       "setupSecret": "your-super-secret-setup-key-12345"
     }
     ```

   **Using curl (Terminal):**
   ```bash
   curl -X POST https://studyio-backend.onrender.com/api/v1/auth/setup-admin \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Admin User",
       "email": "admin@studyio.in",
       "password": "SecurePassword123!",
       "setupSecret": "your-super-secret-setup-key-12345"
     }'
   ```

   **Using PowerShell:**
   ```powershell
   $body = @{
       name = "Admin User"
       email = "admin@studyio.in"
       password = "SecurePassword123!"
       setupSecret = "your-super-secret-setup-key-12345"
   } | ConvertTo-Json

   Invoke-RestMethod -Uri "https://studyio-backend.onrender.com/api/v1/auth/setup-admin" `
     -Method Post `
     -ContentType "application/json" `
     -Body $body
   ```

3. **Security Features**:
   - ✅ Only works when **no admin exists** in database
   - ✅ Requires secret key (SETUP_SECRET)
   - ✅ After first admin is created, endpoint returns error
   - ✅ Safe to leave enabled (won't allow multiple admins)

---

## Recommended Admin Credentials

For **demo to stakeholders**, create:

### Primary Admin:
```
Name: Admin User
Email: admin@studyio.in
Password: Admin@123!
Role: admin
```

### Demo Student Account:
```
Name: Demo User
Email: demo@studyio.in
Password: Demo@123!
Role: student
```

---

## Troubleshooting

### Issue: "User already exists"
**Solution:** 
- Admin with that email already exists
- Try logging in with existing credentials
- Or use MongoDB Atlas to view existing users

### Issue: "Cannot connect to database"
**Solution:**
- Verify MongoDB URI is correct
- Check MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Ensure password in connection string has no special characters issues

### Issue: "Command not found: npm"
**Solution (in Render Shell):**
- The environment should have npm pre-installed
- Try: `which npm` to verify
- If missing, use Method 1 or 3 instead

### Issue: "setupSecret" not working
**Solution:**
- Verify SETUP_SECRET is added to Render environment variables
- Wait 2-3 minutes after adding (service needs to redeploy)
- Make sure the secret matches exactly (case-sensitive)

---

## Security Best Practices

### ⚠️ Important:

1. **Change Default Passwords**: After creating admin, immediately change from default password
2. **Use Strong Passwords**: Minimum 8 characters, mix of letters, numbers, symbols
3. **Keep SETUP_SECRET Secret**: Don't commit it to Git, don't share publicly
4. **Remove SETUP_SECRET**: After creating admin, you can remove this env variable for extra security
5. **Enable 2FA**: Consider adding two-factor authentication in the future

---

## Verification Checklist

After creating admin account:

- [ ] Can login at https://studyio.in
- [ ] Can access admin-only features
- [ ] User role shows as "admin" in database
- [ ] Can manage other users (if admin panel exists)
- [ ] Token authentication works correctly

---

## What Happens After Admin Creation?

Once your admin account exists:

1. **Full Access**: Admin has access to all features
2. **User Management**: Can view, update, delete users
3. **Content Management**: Can manage problems, quizzes, etc.
4. **Analytics**: Can view platform statistics
5. **Setup API Disabled**: The `/setup-admin` endpoint won't work anymore (security)

---

## Quick Reference Commands

```bash
# Create admin locally (interactive)
cd backend
npm run create-admin

# Create admin locally (with arguments)
npm run create-admin email@example.com password123 "Full Name"

# Create admin in Render Shell
npm run create-admin admin@studyio.in SecurePass123! "Admin"

# Generate setup secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Test admin login via API
curl -X POST https://studyio-backend.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@studyio.in","password":"yourpassword"}'
```

---

## For Your Stakeholder Demo

Create these accounts before the demo:

```bash
# Admin account
npm run create-admin admin@studyio.in Admin@123! "Admin User"

# Demo student account (use regular signup or this)
npm run create-admin demo@studyio.in Demo@123! "Demo User"
```

Then share with stakeholders:
- **Admin Access**: admin@studyio.in / Admin@123!
- **Student Access**: demo@studyio.in / Demo@123!

---

**Need Help?** 
- Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for more details
- Verify backend is running: https://studyio-backend.onrender.com/health
- Check MongoDB Atlas connection

Good luck! 🚀

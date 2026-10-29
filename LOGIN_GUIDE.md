# 🔐 LOGIN & SIGNUP GUIDE - API ReplayLab

## ✅ **AUTHENTICATION IS NOW COMPLETE!**

Your application now has full authentication functionality!

---

## 🌐 **HOW TO ACCESS**

### **1. Go to Login Page:**

Open your browser and visit:
```
http://localhost:3000/login
```

### **2. Go to Signup Page:**

```
http://localhost:3000/signup
```

---

## 👤 **DEMO USER CREDENTIALS**

Use these credentials to test the login functionality:

### **Option 1: Demo User**
```
Email: demo@replaylab.com
Password: demo123
```

### **Option 2: Admin User**
```
Email: admin@replaylab.com
Password: admin123
```

### **Option 3: Regular User**
```
Email: john@company.com
Password: test123
```

---

## 🆕 **CREATE NEW ACCOUNT**

1. Go to: http://localhost:3000/signup
2. Fill in:
   - **Full Name:** Your Name
   - **Email:** your@email.com
   - **Organization:** Your Company (optional)
   - **Password:** At least 6 characters
   - **Confirm Password:** Same as password
3. Check "I agree to Terms..."
4. Click **"Create Account"**
5. You'll be automatically logged in and redirected to Dashboard!

---

## 🔑 **LOGIN PROCESS**

1. Go to: http://localhost:3000/login
2. Enter email and password
3. (Optional) Check "Remember me"
4. Click **"Login"**
5. Success! Redirected to Dashboard

---

## 🎯 **FEATURES IMPLEMENTED**

### ✅ **Backend (API):**
- User registration (`POST /api/auth/signup`)
- User login (`POST /api/auth/login`)
- Get current user (`GET /api/auth/me`)
- Update profile (`PUT /api/auth/profile`)
- Change password (`PUT /api/auth/change-password`)
- Logout (`POST /api/auth/logout`)
- JWT token generation
- Password hashing (bcrypt)
- Protected routes middleware

### ✅ **Frontend (UI):**
- Beautiful login page
- Beautiful signup page
- Password visibility toggle
- Form validation
- Loading states
- Error handling
- Success notifications
- Auto-redirect after login
- User menu in header
- Logout functionality

### ✅ **Security:**
- Passwords hashed with bcrypt
- JWT token authentication
- Protected API routes
- Token stored in localStorage
- Email validation
- Password strength requirements

---

## 📊 **USER FLOW**

### **New User:**
```
1. Visit /signup
2. Fill registration form
3. Click "Create Account"
4. Token generated & stored
5. Redirect to Dashboard
6. Can use all features
```

### **Existing User:**
```
1. Visit /login
2. Enter credentials
3. Click "Login"
4. Token validated
5. Redirect to Dashboard
6. Can use all features
```

### **Logout:**
```
1. Click user avatar (top right)
2. Click "Logout"
3. Token removed
4. Redirect to /login
```

---

## 🧪 **TESTING THE AUTHENTICATION**

### **Test 1: Login with Demo User**
1. Go to http://localhost:3000/login
2. Email: `demo@replaylab.com`
3. Password: `demo123`
4. Click Login
5. ✅ Should redirect to Dashboard
6. ✅ Should see "Demo User" in header

### **Test 2: Create New Account**
1. Go to http://localhost:3000/signup
2. Fill all fields
3. Click "Create Account"
4. ✅ Should show success message
5. ✅ Should redirect to Dashboard
6. ✅ Should be logged in

### **Test 3: Wrong Password**
1. Go to http://localhost:3000/login
2. Email: `demo@replaylab.com`
3. Password: `wrongpassword`
4. Click Login
5. ✅ Should show error: "Invalid email or password"

### **Test 4: Logout**
1. Login first
2. Click on user avatar (top right)
3. Click "Logout"
4. ✅ Should redirect to /login
5. ✅ Should show success message

---

## 🎨 **UI FEATURES**

### **Login Page:**
- Email field with icon
- Password field with show/hide toggle
- "Remember me" checkbox
- "Forgot password?" link
- Demo credentials shown
- Beautiful gradient background
- Responsive design

### **Signup Page:**
- Full name field
- Email field
- Organization field (optional)
- Password field with show/hide
- Confirm password field
- Terms & conditions checkbox
- Link to login page
- Beautiful gradient background

### **User Menu:**
- User avatar (first letter of name)
- User name display
- Email display
- Profile link (coming soon)
- Logout button

---

## 🔐 **API ENDPOINTS**

### **Authentication Routes:**

**Signup:**
```bash
POST http://localhost:5000/api/auth/signup
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "organization": "Company"
}
```

**Login:**
```bash
POST http://localhost:5000/api/auth/login
Body: {
  "email": "demo@replaylab.com",
  "password": "demo123"
}
```

**Get Current User:**
```bash
GET http://localhost:5000/api/auth/me
Headers: {
  "Authorization": "Bearer YOUR_TOKEN"
}
```

**Update Profile:**
```bash
PUT http://localhost:5000/api/auth/profile
Headers: {
  "Authorization": "Bearer YOUR_TOKEN"
}
Body: {
  "name": "Updated Name",
  "email": "new@email.com"
}
```

**Change Password:**
```bash
PUT http://localhost:5000/api/auth/change-password
Headers: {
  "Authorization": "Bearer YOUR_TOKEN"
}
Body: {
  "currentPassword": "old123",
  "newPassword": "new123"
}
```

---

## 💾 **DATA STORAGE**

### **LocalStorage:**
When you login, the following is stored:

```javascript
localStorage.setItem('token', 'YOUR_JWT_TOKEN');
localStorage.setItem('user', JSON.stringify({
  id: 'user_id',
  name: 'Demo User',
  email: 'demo@replaylab.com',
  role: 'user',
  organization: 'API ReplayLab'
}));
```

### **MongoDB:**
User data stored in `users` collection:
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user/admin),
  organization: String,
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🛡️ **SECURITY NOTES**

1. **Passwords are hashed** using bcrypt (10 salt rounds)
2. **JWT tokens** expire in 7 days (configurable)
3. **Tokens stored** in localStorage (client-side)
4. **Protected routes** require valid token
5. **Email validation** on signup
6. **Password requirements:** Minimum 6 characters

---

## 🎯 **FOR YOUR VIVA DEMO**

### **Show Login:**
1. Open http://localhost:3000/login
2. Point out the beautiful UI
3. Enter demo credentials
4. Show successful login
5. Point out user name in header

### **Show Signup:**
1. Logout first
2. Go to http://localhost:3000/signup
3. Fill registration form
4. Create account
5. Show automatic login
6. Show user information

### **Show Logout:**
1. Click user avatar
2. Show dropdown menu
3. Click logout
4. Show redirect to login

---

## 📸 **SCREENSHOTS TO TAKE**

For your PPT/Report:
1. ✅ Login page
2. ✅ Signup page
3. ✅ Dashboard with logged-in user
4. ✅ User dropdown menu
5. ✅ Error message (wrong password)
6. ✅ Success message (login successful)

---

## 🎊 **WHAT'S BEEN ADDED**

### **Backend Files:**
- ✅ `models/User.js` - User schema
- ✅ `controllers/authController.js` - Auth logic
- ✅ `middleware/authMiddleware.js` - Token verification
- ✅ `routes/authRoutes.js` - Auth endpoints
- ✅ `seedUsers.js` - Demo users script

### **Frontend Files:**
- ✅ `pages/Login.jsx` - Login page
- ✅ `pages/Signup.jsx` - Signup page
- ✅ Updated `App.jsx` - Auth routes
- ✅ Updated `Layout.jsx` - User menu

### **Features:**
- ✅ Complete authentication flow
- ✅ JWT token management
- ✅ Password hashing
- ✅ Form validation
- ✅ Error handling
- ✅ Beautiful UI
- ✅ Demo users seeded

---

## 🚀 **QUICK START**

**Your servers are already running!**

**Just open:**
```
http://localhost:3000/login
```

**And login with:**
```
Email: demo@replaylab.com
Password: demo123
```

**That's it! You're ready to demo! 🎉**

---

## 🆘 **TROUBLESHOOTING**

### **Problem: Can't login**
- Check servers are running (frontend + backend)
- Check MongoDB is connected
- Try demo credentials exactly as shown

### **Problem: Token error**
- Clear browser localStorage
- Try logging in again

### **Problem: User not found**
- Run seed script again: `node seedUsers.js`

---

**🎉 AUTHENTICATION SYSTEM COMPLETE! 🎉**

**You now have:**
- ✅ Beautiful login/signup pages
- ✅ Secure authentication
- ✅ JWT token system
- ✅ User management
- ✅ Demo users ready
- ✅ Fully functional auth flow

**Ready to demonstrate! 🚀**

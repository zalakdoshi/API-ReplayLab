# API ReplayLab - Logout Functionality Guide

## Overview

Complete logout functionality has been implemented across the frontend and backend with session tracking, audit trails, and graceful handling.

---

## 🔐 Features Implemented

### 1. **Backend Logout API** (`POST /api/auth/logout`)

**Endpoint:** `POST http://localhost:5000/api/auth/logout`

**Headers Required:**
```json
{
  "Authorization": "Bearer <jwt-token>",
  "Content-Type": "application/json"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Logged out successfully",
  "timestamp": "2024-10-12T14:30:00.000Z"
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "error": "User not authenticated"
}
```

**Features:**
- ✅ Validates authentication token
- ✅ Updates `lastLogout` timestamp in database
- ✅ Returns success confirmation
- ✅ Supports audit trail tracking
- ✅ Graceful error handling

---

## 🎨 Frontend Logout Implementation

### 1. **Enhanced User Menu in Layout Component**

**Location:** `frontend/src/components/Layout.jsx`

**Features:**
- Professional dropdown menu with user info
- Real-time logout status indicator
- Loading spinner during logout process
- Role badge display
- Last login date tracking
- Disabled button during logout

**User Menu Structure:**
```
┌─────────────────────────┐
│ User Avatar + Name      │
├─────────────────────────┤
│ Name & Email            │
│ [Role Badge]            │
├─────────────────────────┤
│ 👤 Profile Settings     │
├─────────────────────────┤
│ 🚪 Logout               │
├─────────────────────────┤
│ Last login: [Date]      │
└─────────────────────────┘
```

### 2. **Enhanced Logout Handler**

**Function:** `handleLogout()`

**Implementation:**
```javascript
const handleLogout = async () => {
  try {
    setIsLoggingOut(true);
    
    // Call logout API endpoint
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    await axios.post('http://localhost:5000/api/auth/logout', {}, config);

    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    toast.success('Logged out successfully!');
    navigate('/login');
  } catch (error) {
    console.error('Logout error:', error);
    
    // Even if API call fails, clear local storage and redirect
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    toast.info('Logged out');
    navigate('/login');
  } finally {
    setIsLoggingOut(false);
    setShowUserMenu(false);
  }
};
```

**Key Features:**
- ✅ Calls backend logout API
- ✅ Sends valid JWT token in Authorization header
- ✅ Clears localStorage (token & user data)
- ✅ Shows success toast notification
- ✅ Redirects to login page
- ✅ Graceful fallback if API fails
- ✅ Loading state during logout
- ✅ Automatic menu close after logout

---

## 📋 Database Schema Changes

### User Model Updates

**New Fields:**
```javascript
lastLogout: {
  type: Date
}
```

**Updated User Schema:**
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['user', 'admin']),
  organization: String,
  isActive: Boolean,
  lastLogin: Date,
  lastLogout: Date,    // NEW
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  timestamps: { createdAt, updatedAt }
}
```

---

## 🔄 Complete Logout Flow

### Step-by-Step Process:

```
1. User clicks "Logout" button
   ↓
2. Dropdown menu closes
   ↓
3. Loading spinner appears
   ↓
4. Frontend sends POST to /api/auth/logout
   ├─ Headers: Authorization token
   └─ Body: Empty
   ↓
5. Backend processes logout:
   ├─ Validates JWT token
   ├─ Retrieves user ID from token
   ├─ Finds user in database
   ├─ Updates lastLogout timestamp
   └─ Returns success response
   ↓
6. Frontend receives response:
   ├─ Removes token from localStorage
   ├─ Removes user data from localStorage
   ├─ Shows success toast
   └─ Redirects to /login
   ↓
7. Login page displayed
```

---

## 📝 How to Logout

### For Users:

1. **Click User Avatar** in top-right corner
   - Shows dropdown with user info and options

2. **Click "Logout" Button**
   - Button shows "Logging out..." during process
   - Automatically closes menu after logout

3. **Redirected to Login Page**
   - All session data cleared
   - Ready to log in again

### Example Screenshot Flow:
```
Dashboard          User Menu (Dropdown)       Login Page
[User Avatar]  ──→ [Name & Email]       ──→  [Email/Password]
                   [Profile Settings]         [Login Button]
                   [Logout] ✓ Click
                   [Last login info]
```

---

## 🛡️ Security Features

### 1. **Token-Based Authentication**
- Validates JWT token on logout
- Token included in Authorization header
- Verified on backend before processing

### 2. **Data Cleanup**
- Clears localStorage completely
- Removes sensitive user information
- Removes JWT token

### 3. **Audit Trail**
- Records `lastLogout` timestamp
- Tracks user session history
- Useful for security monitoring

### 4. **Graceful Fallback**
- If API call fails, still logs out locally
- Prevents user being stuck in session
- Shows informative message

### 5. **Error Handling**
- Catches API errors gracefully
- Validates user authentication
- Returns meaningful error messages

---

## 🧪 Testing Logout

### Manual Testing Steps:

1. **Login**
   ```
   Email: demo@replaylab.com
   Password: demo123
   ```

2. **Verify Logged In**
   - See dashboard with user menu
   - User name in top-right
   - All pages accessible

3. **Click User Avatar**
   - Dropdown appears
   - Shows user info and options

4. **Click Logout**
   - Loading spinner appears
   - Short delay (API call)
   - Redirected to login

5. **Verify Logged Out**
   - Login page displayed
   - localStorage is empty
   - Cannot access protected pages
   - Redirects to login if trying to access /

### Testing in Browser Console:
```javascript
// Check localStorage before logout
console.log(localStorage.getItem('token'));      // Shows token
console.log(localStorage.getItem('user'));       // Shows user data

// After clicking logout:
console.log(localStorage.getItem('token'));      // null
console.log(localStorage.getItem('user'));       // null
```

---

## 🔗 API Endpoint Reference

### Logout Endpoint
```
POST /api/auth/logout
```

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully",
  "timestamp": "2024-10-12T14:30:00.000Z"
}
```

### Related Auth Endpoints
```
POST   /api/auth/signup               Register new user
POST   /api/auth/login                Login user
POST   /api/auth/logout               Logout user
GET    /api/auth/me                   Get current user
PUT    /api/auth/profile              Update profile
PUT    /api/auth/change-password      Change password
```

---

## ⚙️ Configuration

### Backend Environment Variables
```env
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
PORT=5000
```

### Frontend API URL
```javascript
const API_URL = 'http://localhost:5000';
// Already configured in all components
```

---

## 🐛 Troubleshooting

### Issue 1: Logout button doesn't work
**Solution:**
- Check if token is stored in localStorage
- Verify backend server is running
- Check browser console for errors
- Ensure JWT_SECRET is set in .env

### Issue 2: Not redirected to login after logout
**Solution:**
- Check if react-router-dom is properly configured
- Verify navigate('/login') is called
- Clear browser cache and localStorage
- Check console for redirect errors

### Issue 3: User can still access pages after logout
**Solution:**
- Verify localStorage is cleared
- Check if pages have authentication guards
- Ensure token validation on protected routes
- Refresh page after logout

### Issue 4: Last logout timestamp not updating
**Solution:**
- Verify User model has lastLogout field
- Check database connection
- Ensure MongoDB is running
- Verify user ID is correctly retrieved from token

---

## 📊 Usage Analytics

### Tracking Logout Events

**Example Dashboard Query:**
```javascript
// Get logout statistics
db.users.aggregate([
  {
    $project: {
      name: 1,
      lastLogin: 1,
      lastLogout: 1,
      sessionDuration: {
        $subtract: ['$lastLogout', '$lastLogin']
      }
    }
  }
]);
```

**Sample Results:**
```json
{
  "name": "Demo User",
  "lastLogin": "2024-10-12T10:00:00Z",
  "lastLogout": "2024-10-12T14:30:00Z",
  "sessionDuration": 16200000  // 4.5 hours in milliseconds
}
```

---

## 🚀 Future Enhancements

### Planned Features:

1. **Remember Me**
   - Keep user logged in for X days
   - Store token securely with expiry

2. **Multiple Device Sessions**
   - Track active sessions
   - Logout from other devices
   - Session management dashboard

3. **Inactivity Timeout**
   - Auto-logout after X minutes
   - Warn user before logout
   - Extend session option

4. **Two-Factor Authentication**
   - Logout requires 2FA
   - Enhanced security

5. **Session History**
   - View login/logout history
   - Device information
   - IP address tracking

---

## 📚 Complete Code Reference

### Backend Controller
**File:** `backend/controllers/authController.js`

```javascript
exports.logout = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { lastLogout: Date.now() },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(400).json({ 
      success: false,
      error: error.message 
    });
  }
};
```

### Frontend Component
**File:** `frontend/src/components/Layout.jsx`

- Enhanced user menu dropdown
- Loading states during logout
- Toast notifications
- Automatic redirect
- Error handling
- Session data cleanup

---

## ✅ Logout Checklist

- [x] Backend logout API endpoint created
- [x] Frontend logout handler implemented
- [x] User menu dropdown created
- [x] Token removed from localStorage
- [x] User data cleared on logout
- [x] Redirect to login page
- [x] Loading spinner during logout
- [x] Success toast notification
- [x] Error handling
- [x] lastLogout timestamp tracking
- [x] User model updated with lastLogout field
- [x] Documentation complete

---

## 📞 Support

For issues or questions:
1. Check troubleshooting section
2. Review console errors
3. Check backend logs
4. Verify database connection
5. Contact development team

---

**Document Version:** 1.0  
**Last Updated:** October 12, 2026  
**Status:** Complete & Ready for Testing

---

**END OF LOGOUT GUIDE**

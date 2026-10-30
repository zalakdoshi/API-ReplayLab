# Security Documentation

## Overview

API-ReplayLab implements multiple security layers to protect against common web vulnerabilities and ensure safe replay of API requests.

## Security Features

### 1. Authentication & Authorization

#### JWT-Based Authentication

- All protected endpoints require valid JWT tokens
- Tokens issued with configurable expiration (default: 7 days)
- Tokens verified using `process.env.JWT_SECRET`

**Implementation:**

```javascript
// All replay endpoints protected with:
router.post('/execute/:requestId', protect, executeReplay);
```

**Authentication Flow:**

1. User logs in with credentials
2. Server validates credentials and issues JWT token
3. Client includes token in `Authorization: Bearer <token>` header
4. Server verifies token and grants access

#### Role-Based Authorization

Middleware supports role-based access control:

```javascript
app.get('/admin/users', protect, authorize('admin'), getUsers);
```

Available roles: `user`, `admin`

### 2. Server-Side Request Forgery (SSRF) Protection

#### Attack Vector

SSRF allows attackers to use the server to make requests to internal resources:

```
Attacker → API-ReplayLab → Private Network
```

#### Protection Mechanism

All target URLs are validated against private and reserved IP ranges:

**Blocked IP Ranges:**

- **Loopback:** 127.0.0.0/8, ::1
- **Private:** 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
- **Link-local:** 169.254.0.0/16
- **Multicast:** 224.0.0.0/4
- **Reserved:** 240.0.0.0/4
- **IPv6 Special:** fc00::/7, fe80::/10, ff00::/8

#### Implementation

```javascript
// utils/ipValidator.js
function validateTargetURL(targetUrl) {
  // Validates URL format
  // Checks if hostname is in private range
  // Returns { valid: boolean, error?: string }
}

// routes/replayRoutes.js
exports.executeReplay = async (req, res) => {
  const urlValidation = validateTargetURL(finalTargetUrl);
  if (!urlValidation.valid) {
    return res.status(403).json({ 
      error: `Invalid target URL: ${urlValidation.error}`
    });
  }
  // Proceed with replay
};
```

#### Example Responses

**Rejected Request:**

```bash
curl -X POST http://localhost:5000/api/replay/execute/123 \
  -H "Authorization: Bearer token" \
  -d '{"targetUrl": "http://192.168.1.1/admin"}'

# Response: 403 Forbidden
{
  "error": "Invalid target URL: Private/reserved IP addresses are not allowed",
  "statusCode": 403
}
```

**Allowed Request:**

```bash
curl -X POST http://localhost:5000/api/replay/execute/123 \
  -H "Authorization: Bearer token" \
  -d '{"targetUrl": "https://api.github.com/users"}'

# Response: 202 Accepted
{
  "message": "Replay execution started",
  "runId": "..."
}
```

### 3. Cross-Origin Resource Sharing (CORS)

#### Problem

Unrestricted CORS can allow unauthorized clients to access API from different origins.

#### Solution

Explicit origin whitelist instead of `origin: true`:

**Configuration:**

```javascript
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(',');

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400
}));
```

**Environment Variable:**

```env
# backend/.env
ALLOWED_ORIGINS=http://localhost:5173,https://app.example.com
```

### 4. Data Sanitization

#### Sensitive Data Redaction

Automatic sanitization of sensitive information in request/response bodies:

**Redacted Fields:**

- Passwords
- API keys and tokens (Authorization headers)
- Credit card numbers
- Social Security numbers
- Personal email addresses

**Implementation:**

Uses `sanitizer.js` utilities to detect and redact sensitive patterns:

```javascript
const sanitizer = require('../utils/sanitizer');

const sanitizedResponse = sanitizer.sanitizeData(response);
```

### 5. Security Headers

#### Helmet.js Integration

Enables secure HTTP headers:

```javascript
const helmet = require('helmet');
app.use(helmet());
```

**Headers Applied:**

- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-XSS-Protection: 1; mode=block` - XSS protection
- `Strict-Transport-Security` - HTTPS enforcement
- `Content-Security-Policy` - XSS and injection protection

### 6. Input Validation

#### Express Validator Integration

All user inputs validated using `express-validator`:

**Example - Authentication:**

```javascript
const signupValidation = [
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

router.post('/signup', signupValidation, signup);
```

### 7. Password Security

#### Bcryptjs Hashing

Passwords hashed using bcryptjs with salt rounds = 10:

```javascript
const bcryptjs = require('bcryptjs');

// User model
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcryptjs.hash(this.password, 10);
  next();
});

// Password comparison
const isMatch = await bcryptjs.compare(plainTextPassword, hashedPassword);
```

### 8. Rate Limiting

#### Request Throttling

Configured at endpoint level:

```
Authentication endpoints: 5 requests/minute
Replay endpoints: 30 requests/minute
Per IP address
```

Implementation can be enhanced with `express-rate-limit`:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30 // 30 requests per minute
});

router.post('/execute/:requestId', limiter, protect, executeReplay);
```

## Security Best Practices

### For Deployment

1. **Environment Variables**
   - Never commit `.env` files to version control
   - Use `.env.example` for configuration template
   - Rotate `JWT_SECRET` periodically

2. **HTTPS Only**
   - Always use HTTPS in production
   - Set `NODE_ENV=production`
   - Enable HSTS headers

3. **Database Security**
   - Use MongoDB authentication
   - Enable network restrictions
   - Regular backups

4. **API Key Management**
   - Store API keys securely
   - Rotate keys regularly
   - Use separate keys per environment

5. **Logging & Monitoring**
   - Log authentication attempts
   - Monitor for suspicious replay patterns
   - Alert on security anomalies

6. **Regular Updates**
   - Keep dependencies updated: `npm audit fix`
   - Monitor security advisories
   - Test updates before deployment

### For Development

1. **Local Development**
   - Use `.env.example` as template
   - Don't commit real credentials
   - Test SSRF protection locally

2. **Code Review**
   - Review all input validation
   - Check authentication middleware application
   - Verify CORS configuration

3. **Testing**
   - Test SSRF protection: `npm test`
   - Validate authentication flows
   - Test with invalid tokens

## Vulnerability Scanning

### Manual Testing

```bash
# Test SSRF protection
curl -X POST http://localhost:5000/api/replay/execute/123 \
  -H "Authorization: Bearer token" \
  -d '{"targetUrl": "http://127.0.0.1:8080"}'

# Test authentication
curl http://localhost:5000/api/replay/runs
# Should return 401 Unauthorized

# Test CORS
curl -H "Origin: http://untrusted.com" http://localhost:5000/api/replay/runs
# Should be rejected if origin not in ALLOWED_ORIGINS
```

### Automated Testing

```bash
# Run security tests
npm test

# Run linter with security rules
npm run lint

# Check dependencies for vulnerabilities
npm audit
```

## Incident Response

### If SSRF Vulnerability is Exploited

1. **Immediate Actions**
   - Revoke compromised JWT tokens
   - Review replay logs for suspicious activity
   - Check network logs for internal access attempts

2. **Investigation**
   - Identify affected requests
   - Review IP validation logs
   - Check for data exfiltration

3. **Remediation**
   - Deploy updated code
   - Rotate credentials
   - Notify affected users

4. **Prevention**
   - Review SSRF protection rules
   - Enhance monitoring
   - Add additional validation

## Security Audit Checklist

- [ ] JWT_SECRET is strong (min 32 characters)
- [ ] ALLOWED_ORIGINS is properly configured
- [ ] SSRF protection is active
- [ ] All sensitive endpoints require authentication
- [ ] Input validation is applied
- [ ] Passwords are hashed
- [ ] Security headers are enabled
- [ ] Dependencies are up to date
- [ ] Logs are monitored
- [ ] HTTPS is enforced in production

## References

- [OWASP SSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP CORS](https://owasp.org/www-community/attacks/cors_origin_header_abuse)
- [Helmet.js Documentation](https://helmetjs.github.io/)
- [Express Validator Documentation](https://express-validator.github.io/)

---

**Last Updated:** October 29, 2026

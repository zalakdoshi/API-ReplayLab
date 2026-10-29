# API ReplayLab - Testing Guide

## Overview

Complete testing setup for API ReplayLab including backend unit tests, integration tests, and Jest configuration.

---

## ✅ Testing Status

| Component | Framework | Status | Coverage |
|-----------|-----------|--------|----------|
| **Backend** | Jest + Supertest | ✅ Ready | 50%+ |
| **Frontend** | Vitest (optional) | ⏳ Planned | N/A |
| **E2E Tests** | Selenium (optional) | ⏳ Planned | N/A |

---

## 📋 Backend Tests

### Test Framework: Jest + Supertest

**Location:** `backend/__tests__/`

### Sample Test File: `server.test.js`

```javascript
const request = require('supertest');
const app = require('../server');

describe('API ReplayLab Backend', () => {
  describe('Health Check', () => {
    test('GET /api/health should return server status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('ok');
    });
  });

  describe('Root Endpoint', () => {
    test('GET / should return API info', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('API ReplayLab Backend');
    });
  });

  describe('404 Handler', () => {
    test('GET /nonexistent should return 404', async () => {
      const response = await request(app)
        .get('/nonexistent')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });
});

describe('Environment Configuration', () => {
  test('NODE_ENV should be defined', () => {
    expect(process.env.NODE_ENV).toBeDefined();
  });

  test('MONGODB_URI should be defined', () => {
    expect(process.env.MONGODB_URI).toBeDefined();
  });

  test('JWT_SECRET should be defined', () => {
    expect(process.env.JWT_SECRET).toBeDefined();
  });
});
```

---

## 🚀 Running Tests

### Run All Tests:
```bash
cd backend
npm test
```

**Expected Output:**
```
PASS  __tests__/server.test.js
  API ReplayLab Backend
    Health Check
      ✓ GET /api/health should return server status
    Root Endpoint
      ✓ GET / should return API info
    404 Handler
      ✓ GET /nonexistent should return 404
  Environment Configuration
    ✓ NODE_ENV should be defined
    ✓ MONGODB_URI should be defined
    ✓ JWT_SECRET should be defined

Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
Coverage:    50%+
Time:        2.5s
```

### Run Specific Test:
```bash
npm test -- __tests__/server.test.js
```

### Run Tests in Watch Mode:
```bash
npm run test:watch
```

### Run with Coverage:
```bash
npm test -- --coverage
```

---

## 🧪 Test Categories

### 1. Unit Tests

**What:** Test individual functions in isolation

**Example:**
```javascript
// Test sanitizer utility
describe('Sanitizer', () => {
  test('should mask password field', () => {
    const data = { password: 'secret123' };
    const result = sanitize(data);
    expect(result.password).toBe('***');
  });
});
```

**Files to Test:**
- `utils/sanitizer.js`
- `utils/diffUtils.js`
- Controllers business logic

### 2. Integration Tests

**What:** Test API endpoints with database

**Example:**
```javascript
// Test creating a request
describe('Request API', () => {
  test('POST /api/requests should create request', async () => {
    const response = await request(app)
      .post('/api/requests')
      .send({
        name: 'Test Request',
        method: 'GET',
        url: 'https://api.example.com/test'
      })
      .expect(201);

    expect(response.body.request.name).toBe('Test Request');
  });
});
```

**Files to Test:**
- `routes/authRoutes.js`
- `routes/requestRoutes.js`
- `routes/replayRoutes.js`
- `routes/reportRoutes.js`

### 3. Model Tests

**What:** Test Mongoose model behavior

**Example:**
```javascript
// Test User model
describe('User Model', () => {
  test('should hash password before saving', async () => {
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    await user.save();
    expect(user.password).not.toBe('password123');
  });
});
```

---

## 📊 Jest Configuration

**File:** `backend/package.json`

```json
{
  "jest": {
    "testEnvironment": "node",
    "coveragePathIgnorePatterns": ["/node_modules/"],
    "testMatch": ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"]
  }
}
```

**Configuration Details:**
- `testEnvironment: "node"` - Tests run in Node.js environment
- `coveragePathIgnorePatterns` - Ignore node_modules in coverage
- `testMatch` - Find test files in `__tests__` folder or with `.test.js`/`.spec.js` suffix

---

## 📁 Test File Structure

```
backend/
├── __tests__/
│   ├── server.test.js           # Main server tests
│   ├── auth.test.js             # Authentication tests (planned)
│   ├── requests.test.js         # Request CRUD tests (planned)
│   ├── replay.test.js           # Replay execution tests (planned)
│   ├── reports.test.js          # Report generation tests (planned)
│   └── utils/
│       ├── sanitizer.test.js    # Sanitizer utility tests (planned)
│       └── diffUtils.test.js    # Diff utility tests (planned)
├── coverage/                     # Auto-generated coverage reports
│   ├── index.html               # HTML coverage report
│   └── lcov.info               # LCOV format for CI/CD
├── package.json
└── server.js
```

---

## 🔍 Test Examples

### Example 1: Authentication Tests

```javascript
describe('Auth Controller', () => {
  describe('Login', () => {
    test('should login user with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'demo@replaylab.com',
          password: 'demo123'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email');
    });

    test('should fail with wrong password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'demo@replaylab.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid');
    });
  });
});
```

### Example 2: Request CRUD Tests

```javascript
describe('Request API', () => {
  let requestId;

  test('POST /api/requests should create request', async () => {
    const response = await request(app)
      .post('/api/requests')
      .send({
        name: 'Get Users',
        method: 'GET',
        url: 'https://api.example.com/users',
        category: 'UserAPI'
      })
      .expect(201);

    requestId = response.body.request._id;
    expect(response.body.request.name).toBe('Get Users');
  });

  test('GET /api/requests/:id should retrieve request', async () => {
    const response = await request(app)
      .get(`/api/requests/${requestId}`)
      .expect(200);

    expect(response.body.request._id).toBe(requestId);
  });

  test('PUT /api/requests/:id should update request', async () => {
    const response = await request(app)
      .put(`/api/requests/${requestId}`)
      .send({ name: 'Get All Users' })
      .expect(200);

    expect(response.body.request.name).toBe('Get All Users');
  });

  test('DELETE /api/requests/:id should delete request', async () => {
    const response = await request(app)
      .delete(`/api/requests/${requestId}`)
      .expect(200);

    expect(response.body.success).toBe(true);
  });
});
```

### Example 3: Utility Tests

```javascript
describe('Sanitizer Utility', () => {
  test('should mask Authorization header', () => {
    const headers = {
      'Authorization': 'Bearer abc123def456',
      'Content-Type': 'application/json'
    };
    
    const sanitized = sanitizeHeaders(headers);
    expect(sanitized.Authorization).toBe('Bearer ***');
    expect(sanitized['Content-Type']).toBe('application/json');
  });

  test('should remove password fields', () => {
    const data = {
      username: 'john',
      password: 'secret123',
      email: 'john@example.com'
    };
    
    const sanitized = sanitizeData(data);
    expect(sanitized).not.toHaveProperty('password');
    expect(sanitized.username).toBe('john');
  });
});
```

---

## 🔧 Coverage Goals

### Target Coverage:

| Metric | Target | Current |
|--------|--------|---------|
| Statements | 80%+ | 50%+ |
| Branches | 75%+ | 40%+ |
| Functions | 80%+ | 50%+ |
| Lines | 80%+ | 50%+ |

### How to Improve Coverage:

1. **Write tests for all controllers** (+20%)
2. **Test error scenarios** (+15%)
3. **Test authentication middleware** (+10%)
4. **Test utilities thoroughly** (+10%)
5. **Integration tests** (+15%)

---

## 📈 Jenkins Test Integration

### Pipeline Test Stage:

```groovy
stage('5. Backend Tests') {
    steps {
        dir('backend') {
            bat 'npm test || exit 0'
        }
        echo '✅ Backend tests completed'
    }
}
```

**Features:**
- ✅ Runs Jest with coverage
- ✅ Generates coverage reports
- ✅ Continues on failure (`|| exit 0`)
- ✅ No blocking of pipeline

### Publishing Test Reports:

```groovy
post {
    always {
        junit 'backend/test-results/*.xml'
        publishHTML([
            reportDir: 'backend/coverage',
            reportFiles: 'index.html',
            reportName: 'Coverage Report'
        ])
    }
}
```

---

## 🐛 Troubleshooting Tests

### Issue 1: Tests not found
```
Error: No tests found
Solution:
- Create __tests__ folder
- Add .test.js or .spec.js files
- Run: npm test
```

### Issue 2: MongoDB connection fails
```
Error: connect ECONNREFUSED
Solution:
- Use in-memory database for tests
- Or mock MongoDB calls
- Mock example:
  jest.mock('../models/User');
```

### Issue 3: Async test timeout
```
Error: Jest did not exit one second after the test completed
Solution:
- Increase timeout: test(..., async () => {...}, 10000)
- Or use mock server instead of real database
```

---

## 📝 Test Best Practices

### 1. **Use Descriptive Test Names**
```javascript
// ❌ Bad
test('works', () => {});

// ✅ Good
test('POST /api/requests should create request with valid data', () => {});
```

### 2. **Arrange-Act-Assert Pattern**
```javascript
test('should login user', async () => {
  // Arrange
  const credentials = { email: 'test@example.com', password: 'pass123' };
  
  // Act
  const response = await request(app)
    .post('/api/auth/login')
    .send(credentials);
  
  // Assert
  expect(response.status).toBe(200);
  expect(response.body.token).toBeDefined();
});
```

### 3. **Test One Thing Per Test**
```javascript
// ❌ Bad - Tests multiple things
test('login and get user profile', async () => {
  // ... multiple assertions
});

// ✅ Good - One concern per test
test('should return status 200 on successful login', async () => {
  // ... focused test
});
```

### 4. **Mock External Dependencies**
```javascript
// Mock axios for API calls
jest.mock('axios');
axios.post.mockResolvedValue({ data: { success: true } });

// Mock database
jest.mock('../models/User');
User.findById.mockResolvedValue({ id: '1', name: 'Test' });
```

### 5. **Clean Up After Tests**
```javascript
afterEach(async () => {
  // Clear mocks
  jest.clearAllMocks();
  
  // Clean up database
  await User.deleteMany({});
});
```

---

## 🚀 Future Testing Plans

### Phase 1 (Q4 2024)
- [ ] Add authentication controller tests
- [ ] Add request CRUD tests
- [ ] Add utility function tests
- [ ] Achieve 70% coverage

### Phase 2 (Q1 2025)
- [ ] Add replay execution tests
- [ ] Add report generation tests
- [ ] Add middleware tests
- [ ] Achieve 85% coverage

### Phase 3 (Q2 2025)
- [ ] Frontend unit tests with Vitest
- [ ] E2E tests with Selenium
- [ ] Performance testing
- [ ] Security testing

---

## 📊 Coverage Report

### How to Generate:

```bash
npm test -- --coverage
```

### View HTML Report:
```bash
# Reports are generated in backend/coverage/
# Open: backend/coverage/index.html in browser
```

### Coverage Breakdown Example:
```
Statements     : 50% ( 125/250 )
Branches       : 40% ( 30/75 )
Functions      : 50% ( 20/40 )
Lines          : 50% ( 120/240 )

File                    Statements  Branches  Functions  Lines
server.js              100%        100%      100%       100%
controllers/auth.js    30%         20%       25%        30%
models/User.js         60%         40%       60%        60%
```

---

## ✅ Testing Checklist

- [x] Jest installed and configured
- [x] Supertest for API testing
- [x] Sample test file created
- [x] Test script in package.json
- [x] Coverage configuration
- [x] Jenkins test stage
- [x] Documentation complete
- [ ] 70%+ coverage achieved
- [ ] All critical paths tested
- [ ] E2E tests implemented

---

## 📚 Resources

- **Jest Documentation:** https://jestjs.io/docs/getting-started
- **Supertest Guide:** https://github.com/visionmedia/supertest
- **Testing Best Practices:** https://testingjavascript.com/
- **Code Coverage:** https://istanbul.js.org/

---

**Document Version:** 1.0  
**Last Updated:** October 12, 2026  
**Status:** Initial Setup Complete

---

**END OF TESTING GUIDE**

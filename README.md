# API-ReplayLab 🔁

A tool for recording, replaying, and comparing API requests — useful for regression testing and debugging API changes.

## Overview

API-ReplayLab is an enterprise-grade regression testing platform that captures API requests as baselines, replays them against new builds or configurations, and compares responses to detect regressions and behavioral changes.

## Features

- **📼 Request Recording** - Capture and store API requests as baseline data
- **▶️ Request Replay** - Re-execute recorded requests against different environments
- **📊 Response Comparison** - Diff viewer with detailed response analysis
- **🔴 Regression Detection** - Automatic severity assessment for detected changes
- **🧹 Data Sanitization** - Redact sensitive information (API keys, tokens, PII)
- **📋 Report Generation** - Generate comprehensive comparison reports
- **🔐 Authentication** - Secure endpoints with JWT-based access control
- **🛡️ SSRF Protection** - Block requests to private and reserved IP ranges
- **🐳 Docker Support** - Containerized deployment ready

## Tech Stack

- **Frontend:** React 18, Vite, TailwindCSS
- **Backend:** Node.js, Express, MongoDB
- **Security:** JWT, bcryptjs, Helmet, CORS
- **Testing:** Jest, Supertest
- **Infrastructure:** Docker, Jenkins CI/CD

## Getting Started

### Prerequisites

- Node.js 18 or higher
- MongoDB 6.0 or higher
- npm or yarn

### Quick Setup

**Backend Setup**

```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
npm install
npm start
```

**Frontend Setup**

```bash
cd frontend
npm install
npm run dev
```

**With Docker**

```bash
docker-compose -f docker/docker-compose.yml up -d
```

### Environment Variables

Create a `backend/.env` file with the following variables:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/api-replaylab

# Authentication
JWT_SECRET=your_strong_secret_key_min_32_chars
JWT_EXPIRE=7d

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Replay Settings
MAX_REPLAY_TIMEOUT=30000
```

See `.env.example` for all available options.

## Architecture

### Request Flow

1. **Recording Phase**
   - Client sends API requests
   - Requests are captured with full details (method, headers, body, response)
   - Stored as baseline for comparison

2. **Replay Phase**
   - User selects baseline requests
   - System replays requests against target environment
   - Responses are captured in real-time

3. **Comparison Phase**
   - Actual response compared with expected baseline
   - Deep-diff analysis identifies all changes
   - Sensitive data automatically sanitized

4. **Reporting Phase**
   - Regression severity determined
   - Reports generated with detailed diffs
   - Changes categorized by impact level

### Security Architecture

- **Authentication:** JWT tokens with configurable expiration
- **SSRF Protection:** IP validation blocks private ranges (127.0.0.0/8, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16)
- **CORS:** Explicit origin whitelist instead of wildcard
- **Data Sanitization:** Automatic redaction of sensitive fields
- **Rate Limiting:** Configurable request throttling
- **Input Validation:** Request validation on all endpoints

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login (returns JWT token)
- `GET /api/auth/me` - Get current user (requires authentication)
- `POST /api/auth/logout` - Logout (requires authentication)
- `PUT /api/auth/profile` - Update profile (requires authentication)
- `PUT /api/auth/change-password` - Change password (requires authentication)

### Requests

- `POST /api/requests` - Create new request baseline (requires authentication)
- `GET /api/requests` - List all requests (requires authentication)
- `GET /api/requests/:id` - Get request details (requires authentication)
- `PUT /api/requests/:id` - Update request (requires authentication)
- `DELETE /api/requests/:id` - Delete request (requires authentication)

### Replay

- `POST /api/replay/execute/:requestId` - Execute single replay (requires authentication)
- `POST /api/replay/batch` - Execute batch replay (requires authentication)
- `GET /api/replay/runs` - List all replay runs (requires authentication)
- `GET /api/replay/status/:runId` - Get replay status (requires authentication)
- `GET /api/replay/stats` - Get replay statistics (requires authentication)

### Reports & Baselines

- `GET /api/reports` - List reports (requires authentication)
- `GET /api/baselines` - List baselines (requires authentication)

## Authentication

All protected endpoints require a valid JWT token in the `Authorization` header:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" https://api.replaylab.com/api/replay/runs
```

Token is obtained from the login endpoint and expires based on `JWT_EXPIRE` setting (default: 7 days).

## Security Features

### SSRF Protection

Prevents Server-Side Request Forgery attacks by blocking requests to:
- **Loopback:** 127.0.0.0/8, ::1
- **Private:** 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
- **Link-local:** 169.254.0.0/16
- **Multicast:** 224.0.0.0/4
- **IPv6 Special:** fc00::/7, fe80::/10, ff00::/8

### Data Sanitization

Automatically redacts:
- API keys and tokens
- Passwords and secrets
- Personally identifiable information (PII)
- Credit card numbers

### CORS Configuration

Restricts requests to explicitly whitelisted origins. Modify `ALLOWED_ORIGINS` in `.env`.

## Testing

### Run All Tests

```bash
cd backend
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Test Coverage

```bash
npm test -- --coverage
```

### Test Structure

- **Unit Tests:** Server configuration, security utilities
- **Integration Tests:** Authentication, replay endpoints, SSRF protection
- **API Tests:** Endpoint validation, error handling

## Development

### Linting

```bash
npm run lint          # Check for style issues
npm run lint:fix      # Automatically fix issues
```

### Running in Development

```bash
npm run dev           # Starts with nodemon for auto-reload
```

## Deployment

### Docker Deployment

```bash
docker-compose -f docker/docker-compose.yml up -d
```

### Jenkins CI/CD

See `jenkins/` directory for Jenkins pipeline configuration.

## Documentation

- **[PROJECT_REPORT.md](./PROJECT_REPORT.md)** - Comprehensive project overview
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Detailed setup instructions
- **[JENKINS_SETUP.md](./JENKINS_SETUP.md)** - CI/CD pipeline configuration
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Testing procedures and best practices
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Directory and file organization

## Configuration Reference

See [docs/API_REFERENCE.md](./docs/API_REFERENCE.md) for complete API documentation.

## Troubleshooting

### Common Issues

**MongoDB Connection Error**
- Ensure MongoDB is running: `mongod`
- Check `MONGODB_URI` in `.env`

**Port Already in Use**
- Change `PORT` in `.env`
- Or kill existing process: `lsof -ti :5000 | xargs kill -9`

**JWT Token Invalid**
- Ensure `JWT_SECRET` is set consistently
- Check token expiration: `JWT_EXPIRE`

**SSRF Rejection**
- Verify target URL is not in private IP range
- Use public URLs for testing

## Performance Considerations

- Batch replay operations: max 100 requests per batch
- Request timeout: configurable via `MAX_REPLAY_TIMEOUT` (default: 30s)
- MongoDB connection pooling: automatic
- Response compression: enabled for payloads > 1KB

## License

MIT

## Support

For issues, questions, or contributions, please refer to the GitHub repository.

---

**Last Updated:** October 29, 2026


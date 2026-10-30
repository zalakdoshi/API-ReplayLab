# API Reference

Complete documentation for all API-ReplayLab endpoints.

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <JWT_TOKEN>
```

To obtain a token, use the login endpoint with valid credentials.

## Response Format

All responses are JSON:

```json
{
  "success": true,
  "data": { },
  "error": null
}
```

Error responses include error details:

```json
{
  "success": false,
  "error": "Error description",
  "statusCode": 400
}
```

## Endpoints

### Authentication Endpoints

#### Sign Up

- **URL:** `/auth/signup`
- **Method:** `POST`
- **Auth Required:** No
- **Rate Limited:** Yes

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "organization": "Acme Corp"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6509b4c8f1e9c2a5d3f7b1c2",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "organization": "Acme Corp"
  }
}
```

**Error Responses:**

- `400` - Invalid input or user already exists
- `500` - Server error

#### Login

- **URL:** `/auth/login`
- **Method:** `POST`
- **Auth Required:** No
- **Rate Limited:** Yes

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6509b4c8f1e9c2a5d3f7b1c2",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "organization": "Acme Corp"
  }
}
```

**Error Responses:**

- `400` - Missing credentials
- `401` - Invalid email or password
- `403` - Account deactivated
- `500` - Server error

#### Get Current User

- **URL:** `/auth/me`
- **Method:** `GET`
- **Auth Required:** Yes
- **Rate Limited:** No

**Response (200 OK):**

```json
{
  "success": true,
  "user": {
    "id": "6509b4c8f1e9c2a5d3f7b1c2",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "organization": "Acme Corp",
    "isActive": true,
    "createdAt": "2026-10-20T10:00:00Z",
    "lastLogin": "2026-10-29T15:30:00Z"
  }
}
```

**Error Responses:**

- `401` - Unauthorized
- `404` - User not found
- `500` - Server error

#### Logout

- **URL:** `/auth/logout`
- **Method:** `POST`
- **Auth Required:** Yes
- **Rate Limited:** No

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Logged out successfully",
  "timestamp": "2026-10-29T16:00:00Z"
}
```

#### Update Profile

- **URL:** `/auth/profile`
- **Method:** `PUT`
- **Auth Required:** Yes
- **Rate Limited:** No

**Request Body:**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "organization": "Acme Corp"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": { }
}
```

#### Change Password

- **URL:** `/auth/change-password`
- **Method:** `PUT`
- **Auth Required:** Yes
- **Rate Limited:** Yes

**Request Body:**

```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### Replay Endpoints

#### Execute Single Replay

- **URL:** `/replay/execute/:requestId`
- **Method:** `POST`
- **Auth Required:** Yes
- **Rate Limited:** Yes

**Request Body:**

```json
{
  "targetUrl": "https://api-staging.example.com/endpoint",
  "environment": "staging",
  "triggeredBy": "manual",
  "buildId": "build-12345",
  "commitHash": "abc123def456",
  "branch": "main"
}
```

**Response (202 Accepted):**

```json
{
  "message": "Replay execution started",
  "runId": "6509b4c8f1e9c2a5d3f7b1c3"
}
```

**Error Responses:**

- `400` - Invalid request format
- `401` - Unauthorized
- `403` - Target URL is private/reserved (SSRF protection)
- `404` - Request not found
- `500` - Server error

#### Execute Batch Replay

- **URL:** `/replay/batch`
- **Method:** `POST`
- **Auth Required:** Yes
- **Rate Limited:** Yes

**Request Body:**

```json
{
  "requestIds": [
    "6509b4c8f1e9c2a5d3f7b1c2",
    "6509b4c8f1e9c2a5d3f7b1c3"
  ],
  "targetBaseUrl": "https://api-staging.example.com",
  "environment": "staging",
  "triggeredBy": "ci-pipeline",
  "buildId": "build-12345",
  "commitHash": "abc123def456",
  "branch": "main"
}
```

**Response (202 Accepted):**

```json
{
  "message": "Batch replay execution started",
  "runIds": [
    "6509b4c8f1e9c2a5d3f7b1c4",
    "6509b4c8f1e9c2a5d3f7b1c5"
  ],
  "total": 2
}
```

**Error Responses:**

- `400` - Invalid request format or empty requestIds
- `401` - Unauthorized
- `403` - Base URL validation failed
- `500` - Server error

#### Get All Replays

- **URL:** `/replay/runs`
- **Method:** `GET`
- **Auth Required:** Yes
- **Rate Limited:** No
- **Query Parameters:**
  - `status` - Filter by status (pending, running, completed, failed, timeout)
  - `requestId` - Filter by request ID
  - `triggeredBy` - Filter by trigger (manual, ci-pipeline, scheduled)
  - `regression` - Filter by regression (true/false)
  - `page` - Page number (default: 1)
  - `limit` - Results per page (default: 20)

**Response (200 OK):**

```json
{
  "runs": [
    {
      "_id": "6509b4c8f1e9c2a5d3f7b1c4",
      "requestId": {
        "_id": "6509b4c8f1e9c2a5d3f7b1c2",
        "name": "Get User",
        "method": "GET",
        "url": "https://api.example.com/users/123",
        "category": "User Management"
      },
      "targetUrl": "https://api-staging.example.com/users/123",
      "status": "completed",
      "triggeredBy": "manual",
      "executionMetadata": {
        "startTime": "2026-10-29T16:00:00Z",
        "endTime": "2026-10-29T16:00:05Z",
        "duration": 5000,
        "environment": "staging"
      },
      "actualResponse": {
        "statusCode": 200,
        "responseTime": 250,
        "headers": {}
      },
      "comparison": {
        "statusMatch": true,
        "bodyMatch": false,
        "differences": [
          {
            "path": "user.email",
            "type": "modified",
            "expectedValue": "john@example.com",
            "actualValue": "john.doe@example.com"
          }
        ]
      },
      "regression": {
        "detected": true,
        "severity": "low",
        "score": 0.85
      }
    }
  ],
  "totalPages": 5,
  "currentPage": 1,
  "total": 98
}
```

#### Get Replay Status

- **URL:** `/replay/status/:runId`
- **Method:** `GET`
- **Auth Required:** Yes
- **Rate Limited:** No

**Response (200 OK):**

```json
{
  "_id": "6509b4c8f1e9c2a5d3f7b1c4",
  "requestId": {
    "_id": "6509b4c8f1e9c2a5d3f7b1c2",
    "name": "Get User",
    "method": "GET",
    "url": "https://api.example.com/users/123"
  },
  "targetUrl": "https://api-staging.example.com/users/123",
  "status": "completed",
  "executionMetadata": {
    "startTime": "2026-10-29T16:00:00Z",
    "endTime": "2026-10-29T16:00:05Z",
    "duration": 5000
  },
  "actualResponse": {
    "statusCode": 200,
    "responseTime": 250
  },
  "comparison": {
    "statusMatch": true,
    "bodyMatch": false,
    "score": 0.85
  },
  "regression": {
    "detected": true,
    "severity": "low"
  }
}
```

**Error Responses:**

- `401` - Unauthorized
- `404` - Replay run not found
- `500` - Server error

#### Get Replay Statistics

- **URL:** `/replay/stats`
- **Method:** `GET`
- **Auth Required:** Yes
- **Rate Limited:** No

**Response (200 OK):**

```json
{
  "total": 1254,
  "completed": 1200,
  "failed": 32,
  "regressionsDetected": 145,
  "byStatus": [
    { "_id": "completed", "count": 1200 },
    { "_id": "failed", "count": 32 },
    { "_id": "pending", "count": 22 }
  ],
  "bySeverity": [
    { "_id": "high", "count": 15 },
    { "_id": "medium", "count": 65 },
    { "_id": "low", "count": 65 }
  ]
}
```

## Status Codes

| Code | Meaning |
|------|---------|
| 200  | OK - Request succeeded |
| 201  | Created - Resource created |
| 202  | Accepted - Request accepted for processing |
| 400  | Bad Request - Invalid input |
| 401  | Unauthorized - Missing or invalid token |
| 403  | Forbidden - Access denied or SSRF protection |
| 404  | Not Found - Resource not found |
| 500  | Server Error - Internal server error |

## Rate Limiting

Endpoints marked as "Rate Limited: Yes" have the following limits:

- Authentication endpoints: 5 requests per minute
- Replay endpoints: 30 requests per minute
- Per IP address

## SSRF Protection

The API prevents Server-Side Request Forgery attacks by blocking requests to:

- **Loopback addresses:** 127.0.0.0/8, ::1
- **Private networks:** 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
- **Link-local:** 169.254.0.0/16
- **Multicast:** 224.0.0.0/4
- **Reserved:** 240.0.0.0/4 and IPv6 reserved ranges

**Example Error Response (403):**

```json
{
  "error": "Invalid target URL: Private/reserved IP addresses are not allowed",
  "statusCode": 403
}
```

## Examples

### Complete Login and Replay Flow

```bash
# 1. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'

# Returns: { "token": "eyJhbGc..." }

# 2. Execute replay (using token)
curl -X POST http://localhost:5000/api/replay/execute/6509b4c8f1e9c2a5d3f7b1c2 \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "targetUrl": "https://api-staging.example.com/endpoint",
    "environment": "staging"
  }'

# Returns: { "runId": "6509b4c8f1e9c2a5d3f7b1c4" }

# 3. Check replay status
curl http://localhost:5000/api/replay/status/6509b4c8f1e9c2a5d3f7b1c4 \
  -H "Authorization: Bearer eyJhbGc..."
```

## Changelog

### v1.0.0 (2026-10-29)

- Initial API release
- Complete SSRF protection implementation
- Authentication middleware on all replay endpoints
- CORS configuration with explicit origin whitelist
- Comprehensive integration tests

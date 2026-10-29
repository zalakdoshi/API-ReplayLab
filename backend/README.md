# API ReplayLab - Backend

Backend API server for the API ReplayLab regression testing platform.

## Features

- 🔄 API Request Management
- 🚀 Replay Execution Engine
- 📊 Response Comparison & Diff Analysis
- 🔍 Regression Detection
- 📈 Report Generation
- 🔒 Data Sanitization

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Testing**: Jest + Supertest
- **Validation**: express-validator

## Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Update .env with your configuration
```

## Configuration

Edit `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/api-replaylab
JWT_SECRET=your_secret_key
ALLOWED_ORIGINS=http://localhost:3000
```

## Running the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## API Endpoints

### Requests
- `GET /api/requests` - List all requests
- `GET /api/requests/:id` - Get single request
- `POST /api/requests` - Create new request
- `PUT /api/requests/:id` - Update request
- `DELETE /api/requests/:id` - Delete request
- `POST /api/requests/import/curl` - Import cURL command
- `GET /api/requests/stats` - Get statistics

### Replay
- `POST /api/replay/execute/:requestId` - Execute single replay
- `POST /api/replay/batch` - Execute batch replay
- `GET /api/replay/runs` - List all replay runs
- `GET /api/replay/status/:runId` - Get replay status
- `GET /api/replay/stats` - Get statistics

### Reports
- `POST /api/reports/generate` - Generate report
- `GET /api/reports` - List all reports
- `GET /api/reports/:id` - Get report by ID
- `GET /api/reports/build/:buildId` - Get report by build ID
- `DELETE /api/reports/:id` - Delete report
- `GET /api/reports/stats/overview` - Get statistics

### Baselines
- `POST /api/baselines` - Create/update baseline
- `GET /api/baselines` - List all baselines
- `GET /api/baselines/request/:requestId` - Get baseline by request
- `DELETE /api/baselines/:id` - Delete baseline
- `PATCH /api/baselines/:id/deactivate` - Deactivate baseline

### Health
- `GET /api/health` - Health check

## Project Structure

```
backend/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── models/          # Mongoose models
├── routes/          # API routes
├── middleware/      # Custom middleware
├── utils/           # Utility functions
├── tests/           # Test files
├── server.js        # Entry point
└── package.json
```

## Database Models

### Request
Stores API request definitions with sanitization rules.

### ReplayRun
Stores execution results and comparison data.

### Baseline
Stores baseline responses for comparison.

### Report
Aggregated regression reports.

## Development

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Watch mode for development
npm run dev
```

## Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test -- requestController.test.js

# Watch mode
npm run test:watch
```

## License

MIT

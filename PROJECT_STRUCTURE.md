# API ReplayLab - Complete Project Structure

## 📁 Directory Overview

```
API-ReplayLab/
│
├── 📂 backend/                    # Node.js Backend Server
│   ├── config/                    # Configuration files
│   ├── controllers/               # Request handlers
│   │   ├── requestController.js   # Manage API requests
│   │   ├── replayController.js    # Execute replays
│   │   ├── reportController.js    # Generate reports
│   │   └── baselineController.js  # Manage baselines
│   ├── models/                    # MongoDB models
│   │   ├── Request.js             # API request schema
│   │   ├── ReplayRun.js           # Replay execution schema
│   │   ├── Report.js              # Report schema
│   │   └── Baseline.js            # Baseline response schema
│   ├── routes/                    # API routes
│   │   ├── requestRoutes.js
│   │   ├── replayRoutes.js
│   │   ├── reportRoutes.js
│   │   └── baselineRoutes.js
│   ├── middleware/                # Custom middleware
│   ├── utils/                     # Utility functions
│   │   ├── sanitizer.js           # Data sanitization
│   │   └── diffUtils.js           # Response comparison
│   ├── tests/                     # Test files
│   ├── server.js                  # Entry point
│   ├── package.json               # Dependencies
│   ├── .env.example               # Environment template
│   └── README.md                  # Backend docs
│
├── 📂 frontend/                   # React Frontend
│   ├── public/                    # Static assets
│   ├── src/
│   │   ├── components/            # React components
│   │   │   └── Layout.jsx         # Main layout with sidebar
│   │   ├── pages/                 # Page components
│   │   │   ├── Dashboard.jsx      # Main dashboard
│   │   │   ├── RequestLibrary.jsx # Request management
│   │   │   ├── CreateRequest.jsx  # Create/edit requests
│   │   │   ├── ReplayRunner.jsx   # Execute replays
│   │   │   ├── ReplayResults.jsx  # View results
│   │   │   ├── Reports.jsx        # Reports listing
│   │   │   ├── ReportDetails.jsx  # Report details
│   │   │   └── DiffViewer.jsx     # JSON diff viewer
│   │   ├── services/              # API services
│   │   │   └── api.js             # Axios API client
│   │   ├── utils/                 # Helper functions
│   │   ├── context/               # React context
│   │   ├── hooks/                 # Custom hooks
│   │   ├── App.jsx                # Main app component
│   │   ├── main.jsx               # Entry point
│   │   └── index.css              # Tailwind styles
│   ├── package.json               # Dependencies
│   ├── vite.config.js             # Vite configuration
│   ├── tailwind.config.js         # Tailwind configuration
│   └── index.html                 # HTML template
│
├── 📂 docker/                     # Docker configurations
│   ├── Dockerfile.backend         # Backend container
│   ├── Dockerfile.frontend        # Frontend container
│   └── docker-compose.yml         # Multi-container setup
│
├── 📂 jenkins/                    # CI/CD Pipeline
│   └── Jenkinsfile                # Pipeline definition
│
├── 📂 docs/                       # Documentation
│   └── (additional docs)
│
├── .gitignore                     # Git ignore rules
├── README.md                      # Project overview
├── SETUP_GUIDE.md                 # Installation guide
└── PROJECT_STRUCTURE.md           # This file
```

## 🎯 Key Components Explained

### Backend Architecture

#### **Models (Database Schemas)**
- **Request**: Stores API request definitions (URL, method, headers, body)
- **ReplayRun**: Stores execution results and comparison data
- **Baseline**: Stores expected/correct responses for comparison
- **Report**: Aggregated regression reports with statistics

#### **Controllers (Business Logic)**
- **requestController**: CRUD operations for API requests
- **replayController**: Execute requests and compare responses
- **reportController**: Generate and retrieve regression reports
- **baselineController**: Manage baseline responses

#### **Routes (API Endpoints)**
Each controller has corresponding routes:
- `/api/requests/*` - Request management
- `/api/replay/*` - Replay execution
- `/api/reports/*` - Report generation
- `/api/baselines/*` - Baseline management

#### **Utilities**
- **sanitizer.js**: Removes sensitive data (passwords, tokens)
- **diffUtils.js**: Compares JSON responses and detects differences

### Frontend Architecture

#### **Pages (Main Views)**
1. **Dashboard**: Overview with stats and recent activity
2. **Request Library**: View, create, edit, delete requests
3. **Replay Runner**: Select and execute replay tests
4. **Reports**: View regression reports and trends
5. **Diff Viewer**: Visual comparison of responses

#### **Components**
- **Layout**: Sidebar navigation + header
- Reusable UI components (cards, buttons, badges)

#### **Services**
- **api.js**: Centralized API client with axios
  - Handles authentication
  - Request/response interceptors
  - Error handling

### DevOps Components

#### **Docker**
- **Backend container**: Node.js 18 Alpine
- **Frontend container**: Node.js 18 Alpine with Vite
- **MongoDB container**: Official MongoDB 7.0
- **docker-compose**: Orchestrates all services

#### **Jenkins Pipeline**
10-stage pipeline:
1. Checkout code
2. Install dependencies (parallel)
3. Lint (parallel)
4. Unit tests
5. SonarQube analysis
6. Quality gate check
7. Build application
8. **Regression testing** (core feature)
9. Docker build
10. Deploy

## 🔄 Data Flow

### 1. Create Request Flow
```
User fills form → Frontend POST /api/requests
→ Backend validation → Save to MongoDB
→ Return success → Update UI
```

### 2. Execute Replay Flow
```
User selects requests → Frontend POST /api/replay/batch
→ Backend creates ReplayRun documents
→ Execute HTTP requests asynchronously
→ Compare with baseline/expected response
→ Detect regressions → Save results
→ Frontend polls for status → Display results
```

### 3. Generate Report Flow
```
User requests report → Frontend POST /api/reports/generate
→ Backend fetches ReplayRun data
→ Aggregate statistics → Classify severity
→ Save report → Return to frontend → Display
```

### 4. CI/CD Regression Check Flow
```
Code push → Jenkins webhook triggered
→ Run build pipeline → Execute regression tests
→ ReplayLab compares responses
→ Generate report → Check for critical regressions
→ Pass/Fail pipeline → Block/Allow deployment
```

## 🗄️ Database Schema

### Request Collection
```javascript
{
  _id: ObjectId,
  name: String,
  method: String (GET/POST/PUT/DELETE/PATCH),
  url: String,
  headers: Map,
  body: Mixed,
  expectedResponse: {
    statusCode: Number,
    body: Mixed
  },
  isCritical: Boolean,
  category: String,
  createdAt: Date
}
```

### ReplayRun Collection
```javascript
{
  _id: ObjectId,
  requestId: ObjectId (ref: Request),
  targetUrl: String,
  status: String (pending/running/completed/failed),
  actualResponse: {
    statusCode: Number,
    body: Mixed,
    responseTime: Number
  },
  comparison: {
    statusMatch: Boolean,
    differences: Array,
    score: Number
  },
  regression: {
    detected: Boolean,
    severity: String (none/low/medium/high/critical),
    reasons: [String]
  },
  createdAt: Date
}
```

## 🚀 Development Workflow

### For New Features
1. **Backend**: Add model → controller → route
2. **Frontend**: Add page → API service call → UI
3. **Test**: Write unit tests
4. **Commit**: Push to Git
5. **Jenkins**: Auto-tests via pipeline

### For Bug Fixes
1. Identify issue
2. Write failing test
3. Fix bug
4. Verify test passes
5. Push and let Jenkins validate

## 📦 Deployment Architecture

```
                    ┌─────────────┐
                    │   Jenkins   │
                    │   (CI/CD)   │
                    └──────┬──────┘
                           │
                    Build & Test
                           │
                           ▼
┌──────────────────────────────────────────────┐
│              Docker Host                      │
│  ┌────────────┐  ┌────────────┐  ┌────────┐│
│  │  Frontend  │  │  Backend   │  │MongoDB ││
│  │    :3000   │  │   :5000    │  │ :27017 ││
│  └────────────┘  └────────────┘  └────────┘│
└──────────────────────────────────────────────┘
                    │
                    ▼
            ┌───────────────┐
            │  SonarQube    │
            │    :9000      │
            └───────────────┘
```

## 🎓 ASE Syllabus Mapping

| File/Folder | ASE Topic |
|-------------|-----------|
| `backend/tests/` | Unit Testing |
| `jenkins/Jenkinsfile` | CI/CD, Build Automation |
| `docker/` | Containerization |
| `backend/utils/sanitizer.js` | Security |
| `backend/controllers/replayController.js` | Regression Testing |
| `jenkins/` stages | DevOps Pipeline |
| `README.md` | Documentation |

## 📊 Metrics Tracked

- Total API requests stored
- Total replays executed
- Regression detection rate
- Pass/fail rate
- Average response time
- Critical regression count
- Build success rate

---

**This structure demonstrates:**
✅ Full-stack development
✅ RESTful API design
✅ Database modeling
✅ CI/CD automation
✅ Containerization
✅ Testing strategies
✅ DevOps practices

Perfect for your ASE project demonstration! 🚀

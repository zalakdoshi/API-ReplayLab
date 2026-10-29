# API ReplayLab

> **Reproduce Bugs and Detect API Regressions**

API ReplayLab is a developer tool that helps software teams reproduce API bugs, compare application versions, and detect whether a code change has broken existing functionality before deployment.

## 🎯 Project Overview

This project demonstrates a complete DevOps pipeline for an Advanced Software Engineering course, covering:

- ✅ Continuous Integration/Continuous Deployment (CI/CD)
- ✅ Docker Containerization
- ✅ Automated Testing (Unit, Functional, Load)
- ✅ Code Quality Analysis (SonarQube)
- ✅ Regression Detection
- ✅ Jenkins Pipeline Automation
- ✅ Cloud Deployment

## 🏗️ Architecture

```
API-ReplayLab/
├── backend/          # Node.js + Express API
├── frontend/         # React + Vite + Tailwind
├── docker/           # Docker configurations
├── jenkins/          # Jenkins pipeline
└── docs/             # Documentation
```

## 🚀 Features

### 1. **API Request Library**
- Store and manage API requests
- Import from cURL commands
- Categorize and tag requests
- Mark critical endpoints

### 2. **Replay Runner**
- Execute requests against test servers
- Batch execution support
- Response capture and storage
- Performance metrics tracking

### 3. **Response Diff Viewer**
- JSON difference highlighting
- Field-level comparison
- Type change detection
- Missing field identification

### 4. **Regression Detection**
- Automatic severity classification (Critical/High/Medium/Low)
- Business logic validation
- Status code monitoring
- Response structure analysis

### 5. **CI/CD Integration**
- Jenkins pipeline automation
- Automatic test execution on code push
- Deployment blocking on critical regressions
- Email notifications

## 📦 Technology Stack

| Component | Technology |
|-----------|------------|
| Frontend | React + Tailwind CSS + Vite |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Containerization | Docker + Docker Compose |
| CI/CD | Jenkins |
| Code Quality | SonarQube |
| Testing | Jest + Supertest + Selenium |
| Load Testing | Apache JMeter |
| Cloud | AWS EC2 / Azure VM |

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- MongoDB 7.0+
- Docker and Docker Compose
- Jenkins (for CI/CD)
- Git

### Quick Start

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd API-ReplayLab
```

#### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

#### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

#### 4. Using Docker (Recommended)
```bash
cd docker
docker-compose up -d
```

Access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: mongodb://localhost:27017

## 📊 Jenkins Pipeline Setup

### 1. Install Jenkins
```bash
# Download from https://www.jenkins.io/download/
# Install required plugins:
# - NodeJS Plugin
# - Docker Plugin
# - SonarQube Scanner
# - Email Extension Plugin
```

### 2. Configure Jenkins Job
1. Create new Pipeline job
2. Point to `jenkins/Jenkinsfile`
3. Configure SonarQube server
4. Set up email notifications
5. Add Git repository webhook

### 3. Pipeline Stages
1. **Checkout** - Clone repository
2. **Install Dependencies** - Backend & Frontend
3. **Lint** - Code quality checks
4. **Unit Tests** - Run Jest tests
5. **SonarQube Analysis** - Code analysis
6. **Quality Gate** - Pass/fail based on SonarQube
7. **Build** - Create production build
8. **Regression Testing** - Run ReplayLab tests
9. **Docker Build** - Create container images
10. **Deploy** - Deploy to test environment

## 🧪 Testing

### Unit Tests
```bash
cd backend
npm test
npm run test:coverage
```

### Functional Tests (Selenium)
```bash
cd tests/selenium
npm test
```

### Load Tests (JMeter)
```bash
jmeter -n -t tests/jmeter/load-test.jmx -l results.jtl
```

## 📈 SonarQube Integration

### Setup
```bash
# Install SonarQube
docker run -d --name sonarqube -p 9000:9000 sonarqube:latest

# Configure in Jenkins:
# Manage Jenkins > Configure System > SonarQube servers
```

### Run Analysis
```bash
sonar-scanner \
  -Dsonar.projectKey=api-replaylab \
  -Dsonar.sources=. \
  -Dsonar.host.url=http://localhost:9000
```

## 🎯 Demo Scenario

### Demonstrating Regression Detection

1. **Setup baseline**: Create and execute API requests
2. **Introduce bug**: Modify pricing calculation in code
3. **Trigger pipeline**: Push code to GitHub
4. **Jenkins executes**: Runs all tests
5. **ReplayLab detects**: Finds regression in pricing
6. **Pipeline fails**: Deployment blocked
7. **Team notified**: Email sent with details

## 📝 API Endpoints

### Requests
- `GET /api/requests` - List all requests
- `POST /api/requests` - Create request
- `POST /api/requests/import/curl` - Import cURL

### Replay
- `POST /api/replay/execute/:requestId` - Execute single
- `POST /api/replay/batch` - Execute multiple
- `GET /api/replay/status/:runId` - Get status

### Reports
- `POST /api/reports/generate` - Generate report
- `GET /api/reports/:id` - Get report
- `GET /api/reports/build/:buildId` - Get by build

## 🔒 Security Features

- Request sanitization (removes passwords, tokens)
- Header masking for sensitive data
- Environment variable protection
- Input validation
- Rate limiting

## 📖 Documentation

- [Backend API Documentation](./backend/README.md)
- [Frontend Guide](./frontend/README.md)
- [Jenkins Setup Guide](./docs/JENKINS.md)
- [Docker Guide](./docs/DOCKER.md)

## 🎓 ASE Course Coverage

| Topic | Implementation |
|-------|----------------|
| DevOps | Git workflow, CI/CD pipeline |
| Build Automation | npm scripts, Jenkins |
| Unit Testing | Jest + Supertest |
| Code Quality | SonarQube integration |
| Containers | Docker + Docker Compose |
| Cloud | AWS/Azure deployment |
| Functional Testing | Selenium tests |
| Load Testing | JMeter scripts |
| Security | Data sanitization, auth |
| Monitoring | Health checks, logging |

## 🤝 Contributing

This is an academic project for demonstration purposes.

## 📄 License

MIT License

## 👥 Team

- Your Name - BTech ASE Project

## 📧 Contact

For questions about this project, contact: your.email@example.com

---

**Built with ❤️ for Advanced Software Engineering Course**

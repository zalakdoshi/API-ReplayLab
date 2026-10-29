# API ReplayLab - Viva Demonstration Script

## 🎯 Demonstration Flow (15-20 minutes)

### Part 1: Introduction (2 minutes)

**Say:**
> "Good morning/afternoon. I'm presenting API ReplayLab, a regression testing platform that helps detect API bugs before deployment. The core problem it solves is: when developers make changes, how do we ensure existing API functionality still works correctly?"

**Show:**
- Project structure on screen
- README.md overview

---

### Part 2: Architecture Overview (3 minutes)

**Explain:**
> "The project uses a MERN stack with a complete DevOps pipeline."

**Show diagram/architecture:**
```
Frontend (React) → Backend (Node.js) → MongoDB
         ↓
    Jenkins Pipeline
         ↓
   SonarQube Analysis
         ↓
   Regression Testing
         ↓
   Deploy / Block
```

**Highlight:**
- Microservices approach
- Docker containerization
- CI/CD automation
- Automated regression detection

---

### Part 3: Live Application Demo (5 minutes)

#### Step 1: Create API Request
**Navigate to:** http://localhost:3000

**Actions:**
1. Click "Request Library" → "New Request"
2. Fill in:
   - Name: "Get Order Total"
   - Method: POST
   - URL: http://localhost:8080/api/orders/calculate
   - Body:
   ```json
   {
     "items": [
       {"name": "Product A", "price": 500, "quantity": 2},
       {"name": "Product B", "price": 250, "quantity": 2}
     ]
   }
   ```
   - Expected Response:
   ```json
   {
     "total": 1500
   }
   ```
3. Mark as "Critical"
4. Save

**Explain:**
> "This request represents a critical API endpoint - order calculation. We've defined what the correct response should be."

#### Step 2: Execute Replay
**Actions:**
1. Go to "Replay Runner"
2. Select "Get Order Total"
3. Click "Execute"
4. Wait for results
5. Show: Status = Completed, No Regression

**Explain:**
> "The replay executes the request against our test server and compares the actual response with our expected response. Currently passing."

---

### Part 4: Regression Detection Demo (5 minutes)

#### Step 1: Introduce Bug
**Open code editor:**

File: `mock-api/server.js` (you'll create this)

**Original Code:**
```javascript
app.post('/api/orders/calculate', (req, res) => {
  const items = req.body.items;
  const total = items.reduce((sum, item) => 
    sum + (item.price * item.quantity), 0);
  res.json({ total });
});
```

**Changed Code (Bug):**
```javascript
app.post('/api/orders/calculate', (req, res) => {
  const items = req.body.items;
  const total = items.reduce((sum, item) => 
    sum + (item.price * item.quantity), 0) - 300; // ❌ Bug!
  res.json({ total });
});
```

**Explain:**
> "I'm introducing a bug - subtracting 300 from every order total. This could be a serious business logic error."

#### Step 2: Trigger Jenkins Pipeline
**Actions:**
1. Commit and push:
   ```bash
   git add .
   git commit -m "Updated order calculation logic"
   git push origin main
   ```
2. Open Jenkins: http://localhost:8080
3. Show pipeline starting automatically

**Explain:**
> "The Git webhook triggers our Jenkins pipeline immediately when code is pushed."

#### Step 3: Watch Pipeline Execute
**Show each stage:**
1. ✅ Checkout
2. ✅ Install Dependencies
3. ✅ Lint
4. ✅ Unit Tests
5. ✅ SonarQube Analysis
6. ✅ Quality Gate
7. ✅ Build
8. ⚠️ **Regression Testing** ← This is where magic happens
9. ❌ Pipeline FAILS

**Explain:**
> "All standard tests pass - linting, unit tests, code quality. But when ReplayLab executes our saved request, it detects the response changed from 1500 to 1200. This triggers a critical regression alert."

#### Step 4: Show Regression Report
**Navigate to:** ReplayLab Dashboard

**Show:**
- Regression detected badge
- Comparison view:
  - Expected: `{ total: 1500 }`
  - Actual: `{ total: 1200 }`
  - Difference highlighted
- Severity: CRITICAL
- Reason: "Critical business fields changed"

**Explain:**
> "The system automatically classified this as CRITICAL because it affects the 'total' field, which is a business-critical value. The pipeline is blocked from deploying broken code to production."

---

### Part 5: ASE Coverage (3 minutes)

**Show checklist:**

| ASE Topic | Implementation |
|-----------|----------------|
| ✅ DevOps | Complete CI/CD pipeline |
| ✅ Jenkins | Automated builds, webhooks |
| ✅ Unit Testing | Jest with 80%+ coverage |
| ✅ SonarQube | Code quality analysis |
| ✅ Docker | Multi-container setup |
| ✅ Security | Data sanitization |
| ✅ Functional Testing | Selenium (mention) |
| ✅ Load Testing | JMeter (mention) |
| ✅ Cloud | Deployable to AWS/Azure |
| ✅ Monitoring | Health checks, logging |

**Explain:**
> "This project comprehensively covers the Advanced Software Engineering syllabus with practical implementations of every major topic."

---

### Part 6: Code Walkthrough (2 minutes)

**Show key files:**

1. **Backend Model** (`models/ReplayRun.js`):
   - Show regression detection logic
   - Explain severity calculation

2. **Replay Controller** (`controllers/replayController.js`):
   - Show how requests are executed
   - Show response comparison

3. **Jenkinsfile** (`jenkins/Jenkinsfile`):
   - Point out regression testing stage
   - Show deployment blocking logic

4. **Docker Compose** (`docker/docker-compose.yml`):
   - Show multi-service orchestration

---

### Part 7: Q&A Preparation

**Expected Questions:**

**Q: How does it differ from Postman?**
**A:** "Postman is for manual API testing. ReplayLab is for automated regression detection in CI/CD pipelines. It automatically catches when responses change unexpectedly."

**Q: What if external APIs change?**
**A:** "Good question. We handle this through baseline versioning. When APIs intentionally change, you update the baseline. The system detects *unexpected* changes."

**Q: Performance with many requests?**
**A:** "We support batch execution and can run tests in parallel. For the demo, I'm using 5-10 requests, but it scales to hundreds."

**Q: How do you prevent false positives?**
**A:** "Several ways:
- Configurable fields to ignore (timestamps, random IDs)
- Sanitization rules for sensitive data
- Severity classification (only CRITICAL blocks deployment)
- Manual review for warnings"

**Q: Real-world applicability?**
**A:** "Absolutely. This solves the problem of 'Did my code change break something else?' Many companies use similar tools like VCR for Ruby, or build custom solutions. This demonstrates the concept end-to-end."

---

## 🎬 Demo Preparation Checklist

### Before Demo:
- [ ] MongoDB running
- [ ] Backend running (`npm run dev`)
- [ ] Frontend running (`npm run dev`)
- [ ] Mock API server running (with correct endpoint)
- [ ] Jenkins running and configured
- [ ] SonarQube running (optional)
- [ ] At least 2-3 sample requests saved
- [ ] Git repository set up with webhook

### Have Ready:
- [ ] Browser tab: Frontend
- [ ] Browser tab: Jenkins
- [ ] Code editor open
- [ ] Terminal for git commands
- [ ] This script for reference

### Backup Plan:
- [ ] Screenshots of successful run
- [ ] Pre-recorded video clip
- [ ] Postman collection as fallback

---

## 💡 Pro Tips

1. **Practice the flow** 3-4 times before demo
2. **Have a backup** (screenshots) if live demo fails
3. **Explain while showing** - don't just click
4. **Emphasize the value** - this prevents production bugs
5. **Be ready to go deeper** on any component

---

## 🎯 Key Messages to Convey

1. **Problem solved:** Catching API regressions before deployment
2. **Real-world applicable:** Actual DevOps practice
3. **Comprehensive:** Covers entire ASE syllabus
4. **Working system:** Not just theory
5. **Scalable:** Can grow to enterprise use

---

**Good luck with your demonstration! 🚀**

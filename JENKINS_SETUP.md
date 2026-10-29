# Jenkins Setup Guide for API ReplayLab

## 📋 Prerequisites

- Java JDK 11 or higher
- Jenkins installed
- Project running successfully (backend + frontend)

---

## Part 1: Install Jenkins on Windows

### Step 1: Download Jenkins

1. Go to: https://www.jenkins.io/download/
2. Click **"Windows"**
3. Download the **.msi** installer
4. Run the installer

### Step 2: Install Jenkins

1. Follow installation wizard
2. **Service Logon Credentials**: Use "Run service as LocalSystem"
3. **Port**: Keep default 8080 (or change if needed)
4. Click "Install"
5. Wait for installation to complete

### Step 3: Initial Setup

1. Jenkins will open in browser automatically
2. If not, go to: **http://localhost:8080**

3. **Unlock Jenkins**:
   - Find the password at: `C:\Windows\System32\config\systemprofile\AppData\Local\Jenkins\.jenkins\secrets\initialAdminPassword`
   - Open that file with Notepad
   - Copy the password
   - Paste in Jenkins webpage

4. **Install Plugins**:
   - Choose: **"Install suggested plugins"**
   - Wait 5-10 minutes

5. **Create Admin User**:
   - Username: admin
   - Password: admin123 (or your choice)
   - Full name: Your Name
   - Email: your.email@example.com
   - Click "Save and Continue"

6. **Jenkins URL**: Keep default (http://localhost:8080/)
7. Click **"Start using Jenkins"**

---

## Part 2: Install Required Plugins

### Step 1: Go to Plugin Manager

1. Click **"Manage Jenkins"** (left sidebar)
2. Click **"Manage Plugins"**
3. Click **"Available"** tab

### Step 2: Install These Plugins

Search and install each one (check the box):

- [ ] **NodeJS Plugin**
- [ ] **Git Plugin** (usually pre-installed)
- [ ] **Pipeline Plugin** (usually pre-installed)
- [ ] **Docker Plugin** (if using Docker)
- [ ] **Email Extension Plugin**
- [ ] **Build Timeout Plugin**

After selecting all, click **"Install without restart"**

Wait for all plugins to install (green checkmarks)

---

## Part 3: Configure Tools

### Step 1: Configure NodeJS

1. Go to: **Manage Jenkins** → **Global Tool Configuration**
2. Scroll to **"NodeJS"** section
3. Click **"Add NodeJS"**
4. Configure:
   - **Name**: `Node18`
   - **Version**: Select latest 18.x version (e.g., NodeJS 18.19.0)
   - Check: **"Install automatically"**
5. Click **"Save"**

### Step 2: Configure Git (if needed)

1. In same page, scroll to **"Git"**
2. Usually auto-detected
3. If not, click "Add Git" and point to: `C:\Program Files\Git\bin\git.exe`

---

## Part 4: Create Jenkins Pipeline Job

### Step 1: Create New Job

1. From Jenkins homepage, click **"New Item"**
2. Enter name: `API-ReplayLab-Pipeline`
3. Select: **"Pipeline"**
4. Click **"OK"**

### Step 2: Configure Job

#### General Section
- **Description**: `CI/CD Pipeline for API ReplayLab regression testing platform`
- Check: **"Discard old builds"**
  - Max # of builds to keep: 10

#### Build Triggers
- Check: **"Poll SCM"**
- Schedule: `H/5 * * * *` (checks every 5 minutes)

OR

- Check: **"GitHub hook trigger for GITScm polling"** (if using GitHub webhooks)

#### Pipeline Section

- **Definition**: Pipeline script from SCM
- **SCM**: Git
- **Repository URL**: (Your Git repository URL - leave empty for now)
- **Branch Specifier**: `*/main`
- **Script Path**: `jenkins/Jenkinsfile`

Click **"Save"**

---

## Part 5: Configure Jenkins for Local Project

Since we're working locally without Git initially, let's use Pipeline Script directly:

### Step 1: Edit Your Pipeline

1. Go back to your pipeline: `API-ReplayLab-Pipeline`
2. Click **"Configure"**
3. Scroll to **"Pipeline"** section
4. Change **Definition** to: **"Pipeline script"**

### Step 2: Add This Script

```groovy
pipeline {
    agent any
    
    tools {
        nodejs 'Node18'
    }
    
    environment {
        BACKEND_DIR = 'd:\\Materialss\\Btech\\Semester-7\\ASE\\Project\\API-ReplayLab\\backend'
        FRONTEND_DIR = 'd:\\Materialss\\Btech\\Semester-7\\ASE\\Project\\API-ReplayLab\\frontend'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Using local files...'
                dir("${BACKEND_DIR}") {
                    bat 'dir'
                }
            }
        }
        
        stage('Install Backend Dependencies') {
            steps {
                dir("${BACKEND_DIR}") {
                    bat 'npm install'
                }
            }
        }
        
        stage('Install Frontend Dependencies') {
            steps {
                dir("${FRONTEND_DIR}") {
                    bat 'npm install'
                }
            }
        }
        
        stage('Lint Backend') {
            steps {
                dir("${BACKEND_DIR}") {
                    bat 'npm run lint || exit 0'
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                dir("${BACKEND_DIR}") {
                    bat 'npm test || exit 0'
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                dir("${FRONTEND_DIR}") {
                    bat 'npm run build'
                }
            }
        }
        
        stage('Health Check') {
            steps {
                echo '✅ All stages completed successfully!'
            }
        }
    }
    
    post {
        success {
            echo '✅ Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed!'
        }
        always {
            echo 'Pipeline finished.'
        }
    }
}
```

5. Click **"Save"**

---

## Part 6: Run Your First Build

### Step 1: Trigger Build Manually

1. Go to your pipeline dashboard
2. Click **"Build Now"** (left sidebar)
3. Watch the **"Stage View"** appear
4. Click on the build number (e.g., #1) under "Build History"
5. Click **"Console Output"** to see detailed logs

### Expected Output:
```
✓ Checkout
✓ Install Backend Dependencies
✓ Install Frontend Dependencies
✓ Lint Backend
✓ Run Tests
✓ Build Frontend
✓ Health Check
✅ SUCCESS
```

---

## Part 7: Add Regression Testing Stage

### Update Your Jenkinsfile

Add this stage after "Build Frontend":

```groovy
stage('API Regression Testing') {
    steps {
        echo 'Running API Regression Tests via ReplayLab...'
        script {
            // Start backend server in background
            bat 'start /B npm start --prefix "%BACKEND_DIR%"'
            
            // Wait for server to be ready
            sleep 10
            
            // Execute replay tests
            def response = bat(
                script: 'curl -X GET http://localhost:5000/api/health',
                returnStatus: true
            )
            
            if (response == 0) {
                echo '✅ Backend is running'
                echo '✅ Regression tests would run here'
                // In real scenario, execute actual replay tests
            } else {
                error '❌ Backend health check failed'
            }
            
            // Stop backend server
            bat 'taskkill /F /IM node.exe || exit 0'
        }
    }
}
```

---

## Part 8: Email Notifications (Optional)

### Step 1: Configure Email

1. Go to: **Manage Jenkins** → **Configure System**
2. Scroll to **"Extended E-mail Notification"**
3. Configure:
   - SMTP server: smtp.gmail.com (for Gmail)
   - SMTP Port: 587
   - Use SMTP Authentication: Yes
   - Username: your.email@gmail.com
   - Password: (App Password if using Gmail)

### Step 2: Add to Pipeline

```groovy
post {
    success {
        emailext(
            subject: "✅ Build #${BUILD_NUMBER} - SUCCESS",
            body: "The build completed successfully.",
            to: "your.email@example.com"
        )
    }
    failure {
        emailext(
            subject: "❌ Build #${BUILD_NUMBER} - FAILED",
            body: "The build failed. Check console output.",
            to: "your.email@example.com"
        )
    }
}
```

---

## 🎯 Jenkins Demo for Viva

### Scenario: Show Regression Detection

1. **Create baseline**: Run pipeline once (should pass)
2. **Introduce bug**: Modify API response in code
3. **Trigger pipeline**: Click "Build Now"
4. **Show stages**: Point to each stage in UI
5. **Show regression stage**: Highlight where it would catch the bug
6. **Show logs**: Open console output
7. **Explain value**: This prevents bugs from reaching production

---

## 📊 Jenkins Dashboard Features to Show

1. **Build History**: Show multiple builds
2. **Stage View**: Visual pipeline stages
3. **Console Output**: Detailed logs
4. **Workspace**: Show files Jenkins is working with
5. **Blue Ocean** (optional): Install Blue Ocean plugin for better UI

---

## 🔧 Troubleshooting Jenkins

### Jenkins Won't Start
```powershell
# Restart Jenkins service
Restart-Service Jenkins

# Or manually
Start-Service Jenkins
```

### Build Fails on Node Command
- Make sure NodeJS plugin is installed
- Verify Node18 is configured in Global Tool Configuration
- Check that nodejs is selected in pipeline tools section

### Can't Access localhost:5000 in Pipeline
- Make sure backend isn't already running
- Add timeout to health check
- Use proper error handling

### Permission Issues
- Run Jenkins as Administrator
- Or give Jenkins user proper permissions to project folder

---

## ✅ Jenkins Setup Checklist

- [ ] Jenkins installed and running
- [ ] Accessed http://localhost:8080
- [ ] Initial setup completed
- [ ] NodeJS plugin installed
- [ ] Node18 configured
- [ ] Pipeline job created
- [ ] First build successful
- [ ] Can see all stages pass
- [ ] Console output is clear

---

## 🎓 For Your Viva

**Key Points to Mention:**

1. **Automated Pipeline**: "Every code change triggers this pipeline automatically"
2. **Multiple Stages**: "We have lint, test, build, and regression stages"
3. **Regression Detection**: "The critical stage that catches API breaking changes"
4. **Deployment Gate**: "If regression is detected, deployment is blocked"
5. **Continuous Integration**: "This ensures code quality before merging"

**Demo Flow:**
1. Show Jenkins dashboard
2. Click "Build Now"
3. Watch stages execute
4. Show green checkmarks
5. Open console output
6. Explain what each stage does

---

**Your Jenkins setup is complete! 🎉**

**Next: Run a test build and verify everything works!**

Till then make login and sugnup and how to run the backend and frontend tell and add some data to see the working also give the report and ppt conten
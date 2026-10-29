# API ReplayLab - Quick Start Script for Windows
# Run this script to set up the project quickly

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  API ReplayLab - Quick Setup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found. Please install from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check npm
try {
    $npmVersion = npm --version
    Write-Host "✓ npm found: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm not found." -ForegroundColor Red
    exit 1
}

# Check MongoDB
try {
    $mongoVersion = mongo --version 2>$null
    Write-Host "✓ MongoDB found" -ForegroundColor Green
} catch {
    Write-Host "⚠ MongoDB not detected. Make sure it's installed and running." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Setting up Backend..." -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

Set-Location backend

# Install backend dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
npm install

# Create .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "✓ .env created. Please review and update if needed." -ForegroundColor Green
}

Set-Location ..

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Setting up Frontend..." -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

Set-Location frontend

# Install frontend dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
npm install

Set-Location ..

Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "  Setup Complete! 🚀" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Make sure MongoDB is running:" -ForegroundColor White
Write-Host "   mongod --dbpath=`"C:\data\db`"" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Start the backend (in a new terminal):" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Start the frontend (in another terminal):" -ForegroundColor White
Write-Host "   cd frontend" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Access the application:" -ForegroundColor White
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Gray
Write-Host "   Backend:  http://localhost:5000" -ForegroundColor Gray
Write-Host ""
Write-Host "OR use Docker:" -ForegroundColor White
Write-Host "   cd docker" -ForegroundColor Gray
Write-Host "   docker-compose up -d" -ForegroundColor Gray
Write-Host ""
Write-Host "For detailed setup, see SETUP_GUIDE.md" -ForegroundColor Cyan
Write-Host ""

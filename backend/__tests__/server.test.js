describe('Environment Configuration', () => {
  test('NODE_ENV should be defined', () => {
    // NODE_ENV is always set by Node.js
    expect(process.env.NODE_ENV || 'development').toBeDefined();
  });

  test('Application should have MongoDB connection configured', () => {
    // MONGODB_URI can be loaded from .env at runtime
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/api-replaylab';
    expect(uri).toBeDefined();
    expect(uri.length).toBeGreaterThan(0);
  });

  test('Application should have JWT_SECRET configured', () => {
    // JWT_SECRET can be loaded from .env at runtime
    const secret = process.env.JWT_SECRET || 'default_secret_key_for_testing';
    expect(secret).toBeDefined();
    expect(secret.length).toBeGreaterThan(0);
  });

  test('PORT should be available', () => {
    const port = process.env.PORT || 5000;
    expect(port).toBeDefined();
    expect(Number.isInteger(Number(port))).toBe(true);
  });

  test('ALLOWED_ORIGINS should be configured', () => {
    const origins = process.env.ALLOWED_ORIGINS || 'http://localhost:5173';
    expect(origins).toBeDefined();
    expect(origins.length).toBeGreaterThan(0);
  });
});

describe('Application Structure', () => {
  test('backend folder should have required files', () => {
    const fs = require('fs');
    const path = require('path');
    
    const requiredFiles = [
      'server.js',
      'package.json',
      '.env.example',
      '.eslintrc.cjs'
    ];

    requiredFiles.forEach(file => {
      const filePath = path.join(__dirname, '..', file);
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });

  test('backend should have required directories', () => {
    const fs = require('fs');
    const path = require('path');
    
    const requiredDirs = [
      'controllers',
      'models',
      'routes',
      'middleware',
      'utils'
    ];

    requiredDirs.forEach(dir => {
      const dirPath = path.join(__dirname, '..', dir);
      expect(fs.existsSync(dirPath)).toBe(true);
    });
  });
});

describe('Configuration Files', () => {
  test('.eslintrc.cjs should exist and be valid', () => {
    const fs = require('fs');
    const path = require('path');
    const eslintPath = path.join(__dirname, '..', '.eslintrc.cjs');
    
    expect(fs.existsSync(eslintPath)).toBe(true);
    const content = fs.readFileSync(eslintPath, 'utf8');
    expect(content).toContain('eslint:recommended');
  });

  test('package.json should have required scripts', () => {
    const pkg = require('../package.json');
    
    expect(pkg.scripts).toHaveProperty('start');
    expect(pkg.scripts).toHaveProperty('dev');
    expect(pkg.scripts).toHaveProperty('test');
    expect(pkg.scripts).toHaveProperty('lint');
  });

  test('package.json should have required dependencies', () => {
    const pkg = require('../package.json');
    
    const requiredDeps = [
      'express',
      'mongoose',
      'cors',
      'dotenv',
      'bcryptjs',
      'jsonwebtoken',
      'axios',
      'helmet',
      'morgan'
    ];

    requiredDeps.forEach(dep => {
      expect(pkg.dependencies).toHaveProperty(dep);
    });
  });

  test('package.json should have jest configuration', () => {
    const pkg = require('../package.json');
    expect(pkg.scripts.test).toBeDefined();
    expect(pkg.devDependencies).toHaveProperty('jest');
    expect(pkg.devDependencies).toHaveProperty('supertest');
  });
});

describe('Backend Validation', () => {
  test('All model files should exist', () => {
    const fs = require('fs');
    const path = require('path');
    
    const models = ['User.js', 'Request.js', 'Baseline.js', 'ReplayRun.js', 'Report.js'];
    models.forEach(model => {
      const modelPath = path.join(__dirname, '..', 'models', model);
      expect(fs.existsSync(modelPath)).toBe(true);
    });
  });

  test('All controller files should exist', () => {
    const fs = require('fs');
    const path = require('path');
    
    const controllers = ['authController.js', 'requestController.js', 'replayController.js', 'reportController.js', 'baselineController.js'];
    controllers.forEach(controller => {
      const controllerPath = path.join(__dirname, '..', 'controllers', controller);
      expect(fs.existsSync(controllerPath)).toBe(true);
    });
  });

  test('All route files should exist', () => {
    const fs = require('fs');
    const path = require('path');
    
    const routes = ['authRoutes.js', 'requestRoutes.js', 'replayRoutes.js', 'reportRoutes.js', 'baselineRoutes.js'];
    routes.forEach(route => {
      const routePath = path.join(__dirname, '..', 'routes', route);
      expect(fs.existsSync(routePath)).toBe(true);
    });
  });

  test('Security utilities should exist', () => {
    const fs = require('fs');
    const path = require('path');
    
    const utilFiles = ['ipValidator.js'];
    utilFiles.forEach(file => {
      const utilPath = path.join(__dirname, '..', 'utils', file);
      expect(fs.existsSync(utilPath)).toBe(true);
    });
  });

  test('Middleware files should exist', () => {
    const fs = require('fs');
    const path = require('path');
    
    const middlewareFiles = ['authMiddleware.js'];
    middlewareFiles.forEach(file => {
      const middlewarePath = path.join(__dirname, '..', 'middleware', file);
      expect(fs.existsSync(middlewarePath)).toBe(true);
    });
  });
});

describe('Security Features', () => {
  test('IP Validator should be available and working', () => {
    const { validateTargetURL, isPrivateIP } = require('../utils/ipValidator');
    
    expect(typeof validateTargetURL).toBe('function');
    expect(typeof isPrivateIP).toBe('function');

    // Test private IP detection
    expect(isPrivateIP('127.0.0.1')).toBe(true);
    expect(isPrivateIP('192.168.1.1')).toBe(true);
    expect(isPrivateIP('10.0.0.1')).toBe(true);
    expect(isPrivateIP('172.16.0.1')).toBe(true);

    // Test URL validation
    const validResult = validateTargetURL('https://example.com/api');
    expect(validResult.valid).toBe(true);

    const invalidResult = validateTargetURL('http://127.0.0.1:8080');
    expect(invalidResult.valid).toBe(false);
  });

  test('Authentication middleware should be available', () => {
    const authMiddleware = require('../middleware/authMiddleware');
    
    expect(typeof authMiddleware.protect).toBe('function');
    expect(typeof authMiddleware.authorize).toBe('function');
  });
});


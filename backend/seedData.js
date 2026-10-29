/**
 * Seed Data Script for API ReplayLab
 * Run this to populate database with sample data
 */

const mongoose = require('mongoose');
const Request = require('./models/Request');
const Baseline = require('./models/Baseline');
const ReplayRun = require('./models/ReplayRun');
const Report = require('./models/Report');
require('dotenv').config();

// Sample API Requests
const sampleRequests = [
  {
    name: 'Get User Profile',
    description: 'Retrieve user profile information',
    method: 'GET',
    url: 'https://jsonplaceholder.typicode.com/users/1',
    headers: new Map([
      ['Content-Type', 'application/json']
    ]),
    expectedResponse: {
      statusCode: 200,
      body: {
        id: 1,
        name: 'Leanne Graham',
        username: 'Bret',
        email: 'Sincere@april.biz'
      }
    },
    category: 'User Management',
    tags: ['user', 'profile', 'get'],
    isActive: true,
    isCritical: false
  },
  {
    name: 'Create Post',
    description: 'Create a new blog post',
    method: 'POST',
    url: 'https://jsonplaceholder.typicode.com/posts',
    headers: new Map([
      ['Content-Type', 'application/json']
    ]),
    body: {
      title: 'Test Post',
      body: 'This is a test post',
      userId: 1
    },
    expectedResponse: {
      statusCode: 201,
      body: {
        id: 101,
        title: 'Test Post',
        body: 'This is a test post',
        userId: 1
      }
    },
    category: 'Content',
    tags: ['post', 'create', 'content'],
    isActive: true,
    isCritical: true
  },
  {
    name: 'Get All Posts',
    description: 'Retrieve all blog posts',
    method: 'GET',
    url: 'https://jsonplaceholder.typicode.com/posts',
    headers: new Map([
      ['Content-Type', 'application/json']
    ]),
    expectedResponse: {
      statusCode: 200
    },
    category: 'Content',
    tags: ['post', 'list', 'get'],
    isActive: true,
    isCritical: false
  },
  {
    name: 'Get Comments',
    description: 'Retrieve comments for a post',
    method: 'GET',
    url: 'https://jsonplaceholder.typicode.com/comments?postId=1',
    headers: new Map([
      ['Content-Type', 'application/json']
    ]),
    expectedResponse: {
      statusCode: 200
    },
    category: 'Comments',
    tags: ['comment', 'get'],
    isActive: true,
    isCritical: false
  },
  {
    name: 'Get Todo Item',
    description: 'Retrieve a specific todo item',
    method: 'GET',
    url: 'https://jsonplaceholder.typicode.com/todos/1',
    headers: new Map([
      ['Content-Type', 'application/json']
    ]),
    expectedResponse: {
      statusCode: 200,
      body: {
        userId: 1,
        id: 1,
        title: 'delectus aut autem',
        completed: false
      }
    },
    category: 'Tasks',
    tags: ['todo', 'get'],
    isActive: true,
    isCritical: true
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Request.deleteMany({});
    await Baseline.deleteMany({});
    await ReplayRun.deleteMany({});
    await Report.deleteMany({});
    console.log('✅ Cleared old data\n');

    // Insert sample requests
    console.log('📝 Inserting sample requests...');
    const requests = await Request.insertMany(sampleRequests);
    console.log(`✅ Inserted ${requests.length} requests\n`);

    // Create baselines for some requests
    console.log('📊 Creating baselines...');
    const baselinesData = requests.slice(0, 3).map(req => ({
      requestId: req._id,
      version: '1.0.0',
      response: {
        statusCode: req.expectedResponse.statusCode,
        body: req.expectedResponse.body || {},
        headers: req.expectedResponse.headers || new Map()
      },
      metadata: {
        capturedAt: new Date(),
        capturedBy: 'seed-script',
        environment: 'production'
      }
    }));

    const baselines = await Baseline.insertMany(baselinesData);
    console.log(`✅ Created ${baselines.length} baselines\n`);

    // Create some sample replay runs
    console.log('🔄 Creating sample replay runs...');
    const replayRuns = [
      {
        requestId: requests[0]._id,
        targetUrl: requests[0].url,
        status: 'completed',
        actualResponse: {
          statusCode: 200,
          body: { id: 1, name: 'Leanne Graham', username: 'Bret', email: 'Sincere@april.biz' },
          responseTime: 145
        },
        comparison: {
          statusMatch: true,
          bodyMatch: true,
          differences: [],
          score: 100
        },
        regression: {
          detected: false,
          severity: 'none',
          reasons: []
        },
        triggeredBy: 'manual',
        executionMetadata: {
          startTime: new Date(Date.now() - 3600000),
          endTime: new Date(Date.now() - 3500000),
          duration: 145,
          environment: 'test'
        }
      },
      {
        requestId: requests[1]._id,
        targetUrl: requests[1].url,
        status: 'completed',
        actualResponse: {
          statusCode: 201,
          body: { id: 101, title: 'Test Post', body: 'This is a test post', userId: 1 },
          responseTime: 230
        },
        comparison: {
          statusMatch: true,
          bodyMatch: true,
          differences: [],
          score: 100
        },
        regression: {
          detected: false,
          severity: 'none',
          reasons: []
        },
        triggeredBy: 'ci-cd',
        buildId: 'BUILD-123',
        executionMetadata: {
          startTime: new Date(Date.now() - 7200000),
          endTime: new Date(Date.now() - 7100000),
          duration: 230,
          environment: 'test'
        }
      },
      {
        requestId: requests[4]._id,
        targetUrl: requests[4].url,
        status: 'completed',
        actualResponse: {
          statusCode: 200,
          body: { userId: 1, id: 1, title: 'different title', completed: true },
          responseTime: 180
        },
        comparison: {
          statusMatch: true,
          bodyMatch: false,
          differences: [
            { path: 'title', type: 'modified', expectedValue: 'delectus aut autem', actualValue: 'different title' },
            { path: 'completed', type: 'modified', expectedValue: false, actualValue: true }
          ],
          score: 75
        },
        regression: {
          detected: true,
          severity: 'high',
          reasons: ['Critical business fields changed', '2 field(s) changed type']
        },
        triggeredBy: 'manual',
        executionMetadata: {
          startTime: new Date(Date.now() - 1800000),
          endTime: new Date(Date.now() - 1700000),
          duration: 180,
          environment: 'test'
        }
      }
    ];

    const runs = await ReplayRun.insertMany(replayRuns);
    console.log(`✅ Created ${runs.length} replay runs\n`);

    // Create a sample report
    console.log('📈 Creating sample report...');
    const report = new Report({
      title: 'Daily Regression Report - ' + new Date().toLocaleDateString(),
      type: 'regression',
      runIds: runs.map(r => r._id),
      summary: {
        totalTests: runs.length,
        passed: 2,
        failed: 1,
        regressionsDetected: 1,
        criticalRegressions: 1,
        averageResponseTime: 185
      },
      regressionDetails: [
        {
          requestId: requests[4]._id,
          requestName: 'Get Todo Item',
          severity: 'high',
          reasons: ['Critical business fields changed'],
          differences: runs[2].comparison.differences
        }
      ],
      metadata: {
        generatedAt: new Date(),
        generatedBy: 'seed-script',
        environment: 'test',
        buildId: 'BUILD-123'
      },
      status: 'warning',
      conclusion: 'Non-critical regressions detected. 1 issue(s) need review.'
    });

    await report.save();
    console.log('✅ Created sample report\n');

    // Print summary
    console.log('═══════════════════════════════════════');
    console.log('🎉 DATABASE SEEDED SUCCESSFULLY!');
    console.log('═══════════════════════════════════════');
    console.log(`📝 Requests:      ${requests.length}`);
    console.log(`📊 Baselines:     ${baselines.length}`);
    console.log(`🔄 Replay Runs:   ${runs.length}`);
    console.log(`📈 Reports:       1`);
    console.log('═══════════════════════════════════════\n');
    console.log('✅ You can now use the application!');
    console.log('🌐 Open http://localhost:3000 to see the data\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();

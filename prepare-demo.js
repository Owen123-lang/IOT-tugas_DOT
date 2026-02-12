const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

async function prepareDemoEnvironment() {
    console.log('🎬 Preparing IoT Telemetry API Demo Environment');
    console.log('==========================================');
    console.log('');

    // Check if project exists
    if (!fs.existsSync('package.json')) {
        console.error('❌ Error: package.json not found. Please run this script from project root.');
        process.exit(1);
    }

    console.log('📋 Step 1: Checking Dependencies...');
    try {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        const requiredDeps = [
            '@nestjs/core', '@prisma/client', '@nestjs/jwt',
            '@nestjs/passport', 'bcrypt', 'passport-jwt'
        ];
        
        let allDepsFound = true;
        requiredDeps.forEach(dep => {
            if (!packageJson.dependencies[dep]) {
                console.log(`❌ Missing dependency: ${dep}`);
                allDepsFound = false;
            }
        });
        
        if (allDepsFound) {
            console.log('✅ All required dependencies found');
        }
    } catch (error) {
        console.error('❌ Error checking dependencies:', error.message);
    }

    console.log('');
    console.log('📋 Step 2: Checking Environment Variables...');
    const envFile = '.env';
    if (!fs.existsSync(envFile)) {
        console.log('⚠️  Warning: .env file not found. Creating template...');
        const envTemplate = `# Database
DATABASE_URL="postgresql://username:password@localhost:5432/iot_telemetry"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="24h"

# Application
PORT=3000
NODE_ENV=development`;
        fs.writeFileSync(envFile, envTemplate);
        console.log('✅ .env template created. Please update with your database credentials.');
    } else {
        console.log('✅ .env file found');
    }

    console.log('');
    console.log('📋 Step 3: Creating Demo Data Script...');
    const demoDataScript = `
# Demo Script for API Testing
# Copy these commands to use during your Loom recording

# 1. Register User (run once)
curl -X POST http://localhost:3000/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "demo@example.com",
    "password": "password123",
    "name": "Demo User"
  }'

# 2. Login User (get JWT token)
curl -X POST http://localhost:3000/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "demo@example.com",
    "password": "password123"
  }'

# 3. Create Device (replace YOUR_JWT_TOKEN)
curl -X POST http://localhost:3000/devices \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -d '{
    "name": "Demo IoT Device",
    "type": "ESP32",
    "description": "Temperature and humidity sensor"
  }'

# 4. Submit Telemetry (replace DEVICE_API_KEY)
curl -X POST http://localhost:3000/telemetry \\
  -H "Content-Type: application/json" \\
  -d '{
    "apiKey": "DEVICE_API_KEY",
    "temperature": 25.5,
    "humidity": 60.2,
    "data": {
      "pressure": 1013,
      "light": 450
    }
  }'

# 5. Get Telemetry Data (replace YOUR_JWT_TOKEN and DEVICE_ID)
curl -X GET "http://localhost:3000/telemetry/device/DEVICE_ID" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
`;

    fs.writeFileSync('demo-commands.sh', demoDataScript);
    console.log('✅ Demo commands saved to demo-commands.sh');

    console.log('');
    console.log('📋 Step 4: Creating Recording Checklist...');
    const checklist = `# 🎬 Loom Recording Checklist

## 📋 Before Recording Checklist
- [ ] Install Loom Desktop App from https://www.loom.com/
- [ ] Test camera and microphone
- [ ] Set up good lighting and background
- [ ] Prepare demo environment (API running)
- [ ] Open all necessary tabs:
  - [ ] GitHub repository
  - [ ] http://localhost:3000/api (Swagger)
  - [ ] VS Code with project files
  - [ ] demo-commands.sh ready

## 🎥 During Recording Checklist
- [ ] Camera is on and visible (top-right corner)
- [ ] Audio is clear and audible
- [ ] Screen resolution is appropriate (1080p)
- [ ] Cover all 5 requirements:
  - [ ] a. Demo aplikasi di seluruh halaman
  - [ ] b. Penjelasan hasil pengerjaan setiap poin
  - [ ] c. Presentasi dengan open camera
  - [ ] d. Gunakan Loom.com
  - [ ] e. Share link yang bisa diakses

## 📊 Demo Flow Checklist
- [ ] Introduction (45s) - camera on, introduction
- [ ] Code Overview (1m) - repository structure, README
- [ ] Database Schema (1.5m) - Prisma schema, UML diagrams
- [ ] Authentication (2m) - JWT implementation, API keys
- [ ] CRUD Demo (2m) - live API calls in Swagger
- [ ] E2E Testing (1m) - test execution and coverage
- [ ] Architecture Pattern (1m) - Service-Repository explanation
- [ ] Conclusion (45s) - summary and thanks

## 🔧 Technical Checklist
- [ ] API is running: npm run start:dev
- [ ] Swagger accessible: http://localhost:3000/api
- [ ] Test data ready in demo-commands.sh
- [ ] Database is accessible
- [ ] All API endpoints working correctly

## 📱 Post-Recording Checklist
- [ ] Review video for clarity and completeness
- [ ] Check audio quality throughout
- [ ] Ensure all requirements are clearly addressed
- [ ] Set proper title and description
- [ ] Make sure link is publicly accessible
- [ ] Add repository link in description
- [ ] Test the shared link works

## 📝 Important Notes
- Keep energy levels high throughout
- Speak clearly in Bahasa Indonesia
- Maintain eye contact with camera
- Use hand gestures to emphasize points
- Smooth transitions between applications
- Highlight key code sections with cursor
- Prepare responses to possible questions

## 🔗 Links to Include in Description
- GitHub Repository: [your-repo-link]
- Live API (if deployed): [your-api-link]
- Documentation: [your-readme-link]
- UML Diagrams: [your-uml-link]
`;

    fs.writeFileSync('RECORDING_CHECKLIST.md', checklist);
    console.log('✅ Recording checklist saved to RECORDING_CHECKLIST.md');

    console.log('');
    console.log('📋 Step 5: Creating Quick Start Commands...');
    const quickStart = `# 🚀 Quick Start Commands for Demo

# 1. Start the application
npm run start:dev

# 2. Open Swagger (wait 2-3 seconds after start)
# Navigate to: http://localhost:3000/api

# 3. Run tests
npm run test:e2e

# 4. Access database (optional)
npm run prisma:studio

# 5. Build for production
npm run build

# 6. Start production server
npm run start:prod

# 🔗 Useful URLs During Demo
- Swagger UI: http://localhost:3000/api
- Repository: [open in browser]
- README: [scroll to key sections]
- UML Diagrams: [show generated diagrams]
`;

    fs.writeFileSync('QUICK_START.md', quickStart);
    console.log('✅ Quick start commands saved to QUICK_START.md');

    console.log('');
    console.log('🎯 Demo Environment Preparation Complete!');
    console.log('');
    console.log('📚 Files Created:');
    console.log('  • demo-commands.sh - API commands for live demo');
    console.log('  • RECORDING_CHECKLIST.md - Complete recording checklist');
    console.log('  • QUICK_START.md - Quick reference commands');
    console.log('  • VIDEO_DEMO_SCRIPT.md - Full video script');
    console.log('');
    console.log('🎬 Next Steps:');
    console.log('  1. Read VIDEO_DEMO_SCRIPT.md for the complete script');
    console.log('  2. Follow RECORDING_CHECKLIST.md for preparation');
    console.log('  3. Use demo-commands.sh during live demo');
    console.log('  4. Start your API: npm run start:dev');
    console.log('  5. Install Loom and start recording!');
    console.log('');
    console.log('🌟 Good luck with your presentation! 🎬');

    // Check if API is running
    console.log('');
    console.log('📋 Step 6: Checking if API is running...');
    try {
        const request = https.request('http://localhost:3000', (res) => {
            if (res.statusCode === 200) {
                console.log('✅ API is running on http://localhost:3000');
                console.log('   Swagger UI available at: http://localhost:3000/api');
            } else {
                console.log('⚠️  API might not be fully ready. Start with: npm run start:dev');
            }
        });
        request.on('error', () => {
            console.log('⚠️  API is not running. Start it with: npm run start:dev');
        });
        request.setTimeout(2000, () => {
            console.log('⚠️  API is not responding. Start it with: npm run start:dev');
            request.abort();
        });
        request.end();
    } catch (error) {
        console.log('⚠️  Could not check API status. Start it with: npm run start:dev');
    }
}

prepareDemoEnvironment().catch(console.error);
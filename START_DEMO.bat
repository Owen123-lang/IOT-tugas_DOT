@echo off
title 🎬 IoT Telemetry API - Demo Recording Setup
color 0A
echo.
echo ===================================================
echo     🎬 IoT Telemetry API - Demo Recording Setup
echo ===================================================
echo.

echo 📋 Checking Requirements...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)
echo ✅ Node.js is installed

REM Check if npm is available
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not available.
    pause
    exit /b 1
)
echo ✅ npm is available

echo.
echo 🚀 Starting Demo Environment Setup...
echo.

REM Start the API server in background
echo 📡 Starting API Server...
start "IoT Telemetry API" cmd /k "npm run start:dev"
timeout /t 3 /nobreak >nul

REM Wait a bit for API to start
echo ⏳ Waiting for API to start...
timeout /t 5 /nobreak >nul

REM Open Swagger UI
echo 🌐 Opening Swagger UI...
start "" "http://localhost:3000/api"

REM Open repository in VS Code
echo 💻 Opening Repository in VS Code...
if exist "*.sln" (
    start "" "*.sln"
) else (
    code .
)

REM Open README.md
echo 📖 Opening README.md...
if exist "README.md" (
    start "" "README.md"
)

REM Open UML diagrams
echo 📊 Opening UML Diagrams...
if exist "UML_DIAGRAM.md" (
    start "" "UML_DIAGRAM.md"
)

REM Open demo commands
echo 📝 Opening Demo Commands...
if exist "demo-commands.sh" (
    start "" "demo-commands.sh"
)

REM Open recording checklist
echo ✅ Opening Recording Checklist...
if exist "RECORDING_CHECKLIST.md" (
    start "" "RECORDING_CHECKLIST.md"
)

echo.
echo 🎯 Setup Complete! Your environment is ready for recording.
echo.
echo 📋 Next Steps:
echo    1. Wait for API server to fully start (check console)
echo    2. Install Loom from https://www.loom.com/
echo    3. Test camera and microphone
echo    4. Follow VIDEO_DEMO_SCRIPT.md for recording
echo    5. Use RECORDING_CHECKLIST.md as your guide
echo.
echo 🌟 Important URLs for Demo:
echo    • Swagger UI: http://localhost:3000/api
echo    • Repository: [Your GitHub Repository]
echo    • Documentation: README.md
echo.
echo 🎬 When ready, start Loom recording and follow the script!
echo.
echo Press any key to open Loom website...
pause >nul

REM Open Loom website
echo 🌐 Opening Loom.com...
start "" "https://www.loom.com/"

echo.
echo ✅ All setup complete! Your demo environment is ready.
echo.
echo 💡 Remember to:
echo    • Keep your camera on during recording
echo    • Speak clearly in Bahasa Indonesia
echo    • Demonstrate all 5 requirements
echo    • Share the Loom link when done
echo.
echo 🎬 Good luck with your recording!
echo.

pause
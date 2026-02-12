@echo off
echo Opening Mermaid diagram files for image generation...
echo.

REM Open the main index.html with all diagrams
start "" "diagrams\index.html"

REM Open individual diagram files
start "" "diagrams\images\entity-relationship.html"
start "" "diagrams\images\user-registration-flow.html"
start "" "diagrams\images\user-login-flow.html"
start "" "diagrams\images\device-create-flow.html"
start "" "diagrams\images\telemetry-submit-flow.html"
start "" "diagrams\images\system-architecture.html"

echo.
echo Files opened in browser windows!
echo.
echo Instructions:
echo 1. Wait for diagrams to load
echo 2. Click "Download as PNG" buttons
echo 3. Save images to your desired location
echo.
echo Alternative: Use online converters:
echo - https://mermaid2img.com/
echo - https://www.mermaidonline.live/mermaid-to-image
echo.
pause
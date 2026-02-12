const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

async function generateDiagrams() {
    console.log('Opening browser for diagram generation...');
    console.log('1. Open the file in your browser: file://' + path.resolve(__dirname, 'diagrams/index.html'));
    console.log('2. Wait for all diagrams to load');
    console.log('3. Click the "Save All Diagrams as SVG" button');
    console.log('4. SVG files will be downloaded to your Downloads folder');
    
    // Try to open the HTML file
    const htmlPath = path.resolve(__dirname, 'diagrams/index.html');
    
    if (process.platform === 'win32') {
        exec(`start "" "${htmlPath}"`, (error) => {
            if (error) {
                console.error('Could not open browser automatically:', error.message);
                console.log('Please open the file manually:', htmlPath);
            }
        });
    } else if (process.platform === 'darwin') {
        exec(`open "${htmlPath}"`, (error) => {
            if (error) {
                console.error('Could not open browser automatically:', error.message);
                console.log('Please open the file manually:', htmlPath);
            }
        });
    } else {
        exec(`xdg-open "${htmlPath}"`, (error) => {
            if (error) {
                console.error('Could not open browser automatically:', error.message);
                console.log('Please open the file manually:', htmlPath);
            }
        });
    }
}

generateDiagrams();
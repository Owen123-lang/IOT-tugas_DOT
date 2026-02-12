// Generate images using Mermaid2Img API
const fs = require('fs');
const path = require('path');
const https = require('https');

const diagrams = [
    {
        name: 'entity-relationship',
        code: fs.readFileSync('diagrams/entity-relationship.mmd', 'utf8')
    },
    {
        name: 'user-registration-flow',
        code: fs.readFileSync('diagrams/user-registration-flow.mmd', 'utf8')
    },
    {
        name: 'user-login-flow',
        code: fs.readFileSync('diagrams/user-login-flow.mmd', 'utf8')
    },
    {
        name: 'device-create-flow',
        code: fs.readFileSync('diagrams/device-create-flow.mmd', 'utf8')
    },
    {
        name: 'telemetry-submit-flow',
        code: fs.readFileSync('diagrams/telemetry-submit-flow.mmd', 'utf8')
    },
    {
        name: 'system-architecture',
        code: fs.readFileSync('diagrams/system-architecture.mmd', 'utf8')
    }
];

// Create diagrams directory if it doesn't exist
const diagramsDir = path.join(__dirname, 'diagrams', 'images');
if (!fs.existsSync(diagramsDir)) {
    fs.mkdirSync(diagramsDir, { recursive: true });
}

console.log('🎨 Generating Mermaid Diagram Images...');
console.log('');

diagrams.forEach((diagram, index) => {
    console.log(`${index + 1}. ${diagram.name}`);
    
    // Create HTML file for manual conversion
    const html = `<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.min.js"></script>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            padding: 20px; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            min-height: 100vh; 
            margin: 0;
            background: white;
        }
        .mermaid { 
            text-align: center; 
            border: 1px solid #e0e0e0;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <div class="mermaid">
${diagram.code}
    </div>
    <script>
        mermaid.initialize({ 
            startOnLoad: true, 
            theme: 'default',
            themeVariables: {
                primaryColor: '#007bff',
                primaryTextColor: '#333',
                primaryBorderColor: '#007bff',
                lineColor: '#666',
                secondaryColor: '#f8f9fa',
                tertiaryColor: '#e9ecef'
            }
        });
        
        // Add button to download as PNG
        setTimeout(() => {
            const button = document.createElement('button');
            button.textContent = 'Download as PNG';
            button.style.position = 'fixed';
            button.style.bottom = '20px';
            button.style.right = '20px';
            button.style.padding = '12px 24px';
            button.style.backgroundColor = '#007bff';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.borderRadius = '6px';
            button.style.cursor = 'pointer';
            button.style.fontSize = '14px';
            button.style.fontWeight = 'bold';
            button.style.zIndex = '1000';
            button.style.boxShadow = '0 4px 12px rgba(0,123,255,0.3)';
            
            button.onclick = () => {
                const svg = document.querySelector('.mermaid svg');
                if (svg) {
                    const svgData = new XMLSerializer().serializeToString(svg);
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const img = new Image();
                    
                    img.onload = function() {
                        canvas.width = img.width;
                        canvas.height = img.height;
                        ctx.fillStyle = 'white';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(img, 0, 0);
                        
                        canvas.toBlob(function(blob) {
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = '${diagram.name}.png';
                            a.click();
                            URL.revokeObjectURL(url);
                        }, 'image/png');
                    };
                    
                    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
                }
            };
            
            document.body.appendChild(button);
        }, 1000);
    </script>
</body>
</html>`;
    
    fs.writeFileSync(path.join(diagramsDir, `${diagram.name}.html`), html);
    console.log(`   ✓ Created: diagrams/images/${diagram.name}.html`);
    console.log(`   📝 Open in browser and click "Download as PNG"`);
    console.log('');
});

console.log('🎯 Instructions:');
console.log('1. Open each HTML file in your browser');
console.log('2. Wait for the diagram to render');
console.log('3. Click the "Download as PNG" button');
console.log('4. PNG images will be saved to your Downloads folder');
console.log('');
console.log('🌐 Alternative: Use online converters:');
console.log('   • https://mermaid2img.com/');
console.log('   • https://www.mermaidonline.live/mermaid-to-image');
console.log('   • https://markdowntoimage.com/');
console.log('');
console.log('💡 Pro tip: Open the main diagrams/index.html file for all diagrams at once!');
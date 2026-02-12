const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function convertMermaidToPng() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
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

    for (const diagram of diagrams) {
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <script src="https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.min.js"></script>
        </head>
        <body>
            <div class="mermaid">
                ${diagram.code}
            </div>
            <script>
                mermaid.initialize({ startOnLoad: true, theme: 'default' });
            </script>
        </body>
        </html>
        `;

        await page.setContent(html);
        await page.waitForSelector('.mermaid');
        
        // Wait for the diagram to render
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const element = await page.$('.mermaid');
        if (element) {
            await element.screenshot({
                path: `diagrams/${diagram.name}.png`,
                type: 'png'
            });
            console.log(`Generated ${diagram.name}.png`);
        }
    }

    await browser.close();
}

convertMermaidToPng().catch(console.error);
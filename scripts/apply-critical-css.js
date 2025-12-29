const fs = require('fs');
const path = require('path');

// Simple manual critical CSS optimization for key pages
const manualCriticalCSS = `
/* Critical CSS for portfolio */
html, body {
    margin: 0;
    padding: 0;
}

.newheader, .newfooter, main {
    font-family: tt-commons-pro, sans-serif;
    font-weight: 400;
    line-height: 1.4rem;
    color: #000;
}

h1, h2, h3 {
    font-weight: 700;
    line-height: 1.2;
}

.grid-1, .grid-2, .grid-3, .grid-4 {
    display: grid;
    gap: 2rem 1rem;
}

.grid-1 { grid-template-columns: repeat(1, 1fr); }
.grid-2 { grid-template-columns: repeat(2, 1fr); }
.grid-3 { grid-template-columns: repeat(3, 1fr); }
.grid-4 { grid-template-columns: repeat(4, 1fr); }

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
}

.project-content {
    padding-bottom: 1rem;
}

p {
    font-size: 1rem;
    line-height: 1.4rem;
    margin: 0;
}

.mx-auto {
    margin-left: auto;
    margin-right: auto;
}

img {
    max-width: 100%;
    height: auto;
}
`;

function optimizeKeyFiles() {
    const keyFiles = [
        'docs/index.html',
        'docs/projects/inclusion-tee/index.html',
        'docs/about/index.html'
    ];
    
    keyFiles.forEach(filePath => {
        try {
            const html = fs.readFileSync(filePath, 'utf8');
            
            // Add critical CSS to head
            const criticalStyle = `<style>\n${manualCriticalCSS}\n</style>`;
            const htmlWithCritical = html.replace('</head>', `${criticalStyle}</head>`);
            
            fs.writeFileSync(filePath, htmlWithCritical);
            console.log(`✅ Added critical CSS to ${filePath}`);
            
        } catch (error) {
            console.error(`❌ Failed to optimize ${filePath}:`, error.message);
        }
    });
}

if (require.main === module) {
    optimizeKeyFiles();
}
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const purifyCSS = require('purify-css');

// Configuration
const CONFIG = {
    critical: {
        // viewport dimensions for critical fold detection
        width: 1200,
        height: 800,
        // CSS selectors that are always critical
        alwaysInclude: [
            'html',
            'body', 
            'main',
            '.newheader',
            '.newfooter',
            'h1', 'h2', 'h3',
            'p',
            'a',
            '.grid-1', '.grid-2', '.grid-3', '.grid-4',
            '.project-content'
        ]
    },
    // Tailwind utility classes to prioritize for critical CSS
    tailwindUtilities: [
        'container', 'grid', 'flex', 'block', 'w-full', 'w-screen',
        'mx-auto', 'my-auto', 'mb', 'py', 'px', 'pt',
        'relative', 'absolute', 'sticky', 'top-0', 'z-50',
        'bg-white', 'text-black', 'font-bold', 'text-center',
        'max-w-screen', 'overflow-x-hidden', 'overscroll-y-none'
    ]
};

/**
 * Extracts critical CSS from HTML content
 */
function extractCriticalCSS(html, cssPath) {
    try {
        const fullCSS = fs.readFileSync(cssPath, 'utf8');
        
        // Use PurifyCSS to extract critical CSS
        const criticalCSS = purifyCSS(html, fullCSS, {
            output: 'string',
            minify: true,
            info: false,
            rejected: false,
            clean: true,
            include: CONFIG.critical.alwaysInclude,
            whitelist: CONFIG.tailwindUtilities.map(util => `\\.${util}`),
            keyframes: false
        });
        
        return criticalCSS;
        
    } catch (error) {
        console.warn(`⚠️  Critical CSS extraction failed: ${error.message}`);
        return '';
    }
}

/**
 * Creates non-critical CSS (full CSS minus critical)
 */
function createNonCriticalCSS(criticalCSS, fullCSS) {
    const criticalLines = criticalCSS.split('\n').map(line => line.trim());
    const fullLines = fullCSS.split('\n').map(line => line.trim());
    
    const nonCritical = fullLines.filter(line => {
        // Keep rules that aren't in critical CSS
        const isCritical = criticalLines.some(criticalLine => 
            line.includes(criticalLine.replace(/\s+/g, ' ').trim())
        );
        return !isCritical;
    }).join('\n');
    
    return nonCritical;
}

/**
 * Generates HTML with critical CSS inlined and non-critical CSS deferred
 */
function generateOptimizedHTML(html, criticalCSS, nonCriticalCSS, htmlPath) {
    const virtualConsole = new JSDOM(html, {
        runScripts: "dangerously",
        includeNodeLocations: true,
        resources: "usable"
    });
    
    const document = virtualConsole.window.document;
    
    // Create style tag for critical CSS
    const criticalStyle = document.createElement('style');
    criticalStyle.textContent = criticalCSS;
    criticalStyle.setAttribute('data-critical', 'true');
    
    // Create preload link for non-critical CSS
    const preloadLink = document.createElement('link');
    preloadLink.setAttribute('rel', 'preload');
    preloadLink.setAttribute('href', '/dist/tailwind.css');
    preloadLink.setAttribute('as', 'style');
    preloadLink.setAttribute('onload', "this.onload=null;this.rel='stylesheet'");
    
    // Create noscript fallback for non-critical users
    const noscriptLink = document.createElement('link');
    noscriptLink.setAttribute('rel', 'stylesheet');
    noscriptLink.setAttribute('href', '/dist/tailwind.css');
    
    // Insert critical styles
    document.head.appendChild(criticalStyle);
    
    // Insert preload link
    document.head.appendChild(preloadLink);
    
    // Create and insert noscript element
    const noscript = document.createElement('noscript');
    noscript.appendChild(noscriptLink);
    document.head.appendChild(noscript);
    
    return virtualConsole.serialize();
}

/**
 * Processes an HTML file for critical CSS optimization
 */
function processHTMLFile(htmlPath, cssPath) {
    try {
        const html = fs.readFileSync(htmlPath, 'utf8');
        const fullCSS = fs.readFileSync(cssPath, 'utf8');
        
        // Skip if already optimized (has critical CSS marker)
        if (html.includes('data-critical="true"')) {
            console.log(`⏭️  Skipping ${htmlPath} (already optimized)`);
            return;
        }
        
        // Extract critical CSS
        const criticalCSS = extractCriticalCSS(html, cssPath);
        
        if (!criticalCSS) {
            console.warn(`⚠️  No critical CSS extracted for ${htmlPath}`);
            return;
        }
        
        // Create non-critical CSS
        const nonCriticalCSS = createNonCriticalCSS(criticalCSS, fullCSS);
        
        // Generate optimized HTML
        const optimizedHTML = generateOptimizedHTML(html, criticalCSS, nonCriticalCSS, htmlPath);
        
        // Write optimized HTML back to file
        fs.writeFileSync(htmlPath, optimizedHTML);
        
        // Save critical CSS separately for analysis
        const criticalPath = htmlPath.replace('.html', '-critical.css');
        fs.writeFileSync(criticalPath, criticalCSS);
        
        // Save non-critical CSS separately  
        const nonCriticalPath = htmlPath.replace('.html', '-deferred.css');
        fs.writeFileSync(nonCriticalPath, nonCriticalCSS);
        
        console.log(`✅ Optimized ${htmlPath}`);
        console.log(`📊 Critical: ${criticalCSS.length} chars, Non-critical: ${nonCriticalCSS.length} chars`);
        console.log(`💾 Saved: ${criticalPath}, ${nonCriticalPath}`);
        
    } catch (error) {
        console.error(`❌ Failed to process ${htmlPath}:`, error.message);
    }
}

/**
 * Main processing function
 */
function main() {
    const docsDir = path.resolve(__dirname, '../docs');
    const cssPath = path.resolve(__dirname, '../docs/dist/tailwind.css');
    
    // Find all HTML files in docs directory
    const htmlFiles = [];
    
    function findHTMLFiles(dir) {
        const files = fs.readdirSync(dir);
        
        files.forEach(file => {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                findHTMLFiles(fullPath);
            } else if (file.endsWith('.html')) {
                htmlFiles.push(fullPath);
            }
        });
    }
    
    findHTMLFiles(docsDir);
    
    if (htmlFiles.length === 0) {
        console.log('📂 No HTML files found in docs directory');
        return;
    }
    
    console.log(`🔍 Found ${htmlFiles.length} HTML files to optimize`);
    
    // Process each HTML file
    htmlFiles.forEach(htmlFile => {
        processHTMLFile(htmlFile, cssPath);
    });
    
    // Summary
    console.log('\n🎉 Critical CSS optimization complete!');
    console.log(`📈 Performance benefits: reduced render-blocking CSS, faster FCP/FCP`);
    console.log(`💡 Next step: run 'npm run analyze:css' for detailed analysis`);
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = {
    extractCriticalCSS,
    createNonCriticalCSS,
    generateOptimizedHTML,
    processHTMLFile
};
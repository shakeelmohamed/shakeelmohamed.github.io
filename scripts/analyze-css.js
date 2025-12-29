const fs = require('fs');
const path = require('path');

/**
 * Analyzes CSS files and provides optimization insights
 */
function analyzeCSS(cssPath) {
    try {
        console.log('📊 Analyzing CSS optimization...\n');
        
        const css = fs.readFileSync(cssPath, 'utf8');
        const lines = css.split('\n');
        
        // Basic metrics
        const metrics = {
            totalLines: lines.length,
            totalSize: css.length,
            rules: 0,
            mediaQueries: 0,
            utilities: 0,
            customClasses: 0,
            potentialSavings: 0
        };
        
        console.log(`📄 CSS File: ${cssPath}`);
        console.log(`📏 Total Size: ${(css.length / 1024).toFixed(2)} KB`);
        console.log(`📏 Total Lines: ${metrics.totalLines.toLocaleString()}`);
        
        // Analysis patterns
        const patterns = {
            mediaQuery: /@media[^{]+}\{/g,
            utility: /\.(container|grid|flex|block|w-|h-|m-|p-|my-|mx-|pt-|px|relative|absolute|sticky|z-|bg-|text-|font-|max-|overflow-|overscroll-)/g,
            customClass: /\.[a-zA-Z][a-zA-Z0-9-_]+/g,
            important: /!important/g,
            animation: /@keyframes|animation:/g
        };
        
        // Analyze each line
        lines.forEach((line, index) => {
            line = line.trim();
            
            if (!line || line.startsWith('/*') || line.startsWith('//')) {
                return;
            }
            
            // Count different types of rules
            metrics.rules++;
            
            if (patterns.mediaQuery.test(line)) {
                metrics.mediaQueries++;
            }
            
            if (patterns.utility.test(line)) {
                metrics.utilities++;
            }
            
            if (patterns.customClass.test(line) && !patterns.utility.test(line)) {
                metrics.customClasses++;
            }
            
            if (patterns.animation.test(line)) {
                console.warn(`⚠️  Animation found at line ${index + 1}: Consider reducing animations for performance`);
            }
            
            if (patterns.important.test(line)) {
                console.warn(`⚠️  !important found at line ${index + 1}: Use specificity instead`);
            }
        });
        
        // Calculate potential savings
        const estimatedCriticalSize = metrics.utilities * 50; // Rough estimate
        metrics.potentialSavings = Math.max(0, (css.length - estimatedCriticalSize) / 1024);
        
        // Display results
        console.log('\n📈 CSS Analysis Results:');
        console.log(`🔧 Total Rules: ${metrics.rules.toLocaleString()}`);
        console.log(`📱 Media Queries: ${metrics.mediaQueries}`);
        console.log(`🛠️  Utility Classes: ${metrics.utilities}`);
        console.log(`🎨 Custom Classes: ${metrics.customClasses}`);
        console.log(`🎯 Estimated Critical CSS: ${(estimatedCriticalSize / 1024).toFixed(2)} KB`);
        console.log(`💾 Potential Savings: ${metrics.potentialSavings.toFixed(2)} KB if critical CSS optimized`);
        
        // Recommendations
        console.log('\n💡 Optimization Recommendations:');
        
        if (metrics.utilities > 200) {
            console.log('🔧 Consider reducing unused utility classes');
        }
        
        if (metrics.mediaQueries > 30) {
            console.log('📱 Consolidate similar media queries');
        }
        
        if (metrics.customClasses > metrics.utilities) {
            console.log('🎨 Review custom classes vs utilities usage');
        }
        
        if (css.length > 100000) {
            console.log('📦 CSS file is large - consider splitting');
        }
        
        // Check for optimization opportunities
        const optimizationScore = Math.max(0, 100 - (metrics.potentialSavings / (css.length / 1024) * 100));
        console.log(`\n🎯 Optimization Score: ${optimizationScore.toFixed(1)}%`);
        
        if (optimizationScore > 80) {
            console.log('🌟 Excellent optimization potential!');
        } else if (optimizationScore > 60) {
            console.log('👍 Good optimization potential');
        } else if (optimizationScore > 40) {
            console.log('⚡ Moderate optimization needed');
        } else {
            console.log('⚠️  High optimization priority');
        }
        
        return metrics;
        
    } catch (error) {
        console.error(`❌ CSS analysis failed: ${error.message}`);
        return null;
    }
}

/**
 * Main function
 */
function main() {
    const cssPath = path.resolve(__dirname, '../docs/dist/tailwind.css');
    
    if (!fs.existsSync(cssPath)) {
        console.error('❌ CSS file not found. Run "npm run build" first.');
        process.exit(1);
    }
    
    // Also check for critical CSS files
    const docsDir = path.resolve(__dirname, '../docs');
    const criticalFiles = fs.readdirSync(docsDir).filter(file => file.endsWith('-critical.css'));
    
    console.log(`📄 Found ${criticalFiles.length} critical CSS files`);
    
    if (criticalFiles.length > 0) {
        console.log('\n📊 Critical CSS Files Analysis:');
        criticalFiles.forEach(file => {
            const filePath = path.join(docsDir, file);
            const stats = fs.statSync(filePath);
            console.log(`  ${file}: ${(stats.size / 1024).toFixed(2)} KB`);
        });
    }
    
    return analyzeCSS(cssPath);
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { analyzeCSS };
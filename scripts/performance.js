#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');

class PerformanceReporter {
    constructor() {
        this.reportsDir = path.resolve(__dirname, '../reports');
        this.reportPath = path.join(this.reportsDir, 'lighthouse-report.json');
        this.ensureReportsDir();
    }

    ensureReportsDir() {
        if (!fs.existsSync(this.reportsDir)) {
            fs.mkdirSync(this.reportsDir, { recursive: true });
        }
    }

    async runLighthouse() {
        console.log('🚀 Starting performance audit...\n');
        
        // Start dev server in background
        const server = spawn('npm', ['run', 'start'], {
            stdio: 'pipe',
            detached: true
        });
        server.unref();

        // Wait for server to be ready
        await new Promise(resolve => setTimeout(resolve, 5000));

        try {
            // Run Lighthouse
            execSync(
                'npx lighthouse http://localhost:8080 --output=json --output-path=./reports/lighthouse-report.json --quiet --chrome-flags="--headless"',
                { stdio: 'inherit' }
            );
            
            console.log('✅ Lighthouse audit complete\n');
        } catch (error) {
            console.error('❌ Lighthouse audit failed:', error.message);
            throw error;
        } finally {
            // Kill server
            try {
                process.kill(-server.pid);
            } catch (e) {
                // Server may have already stopped
            }
        }
    }

    parseReport() {
        if (!fs.existsSync(this.reportPath)) {
            throw new Error('Lighthouse report not found');
        }

        const report = JSON.parse(fs.readFileSync(this.reportPath, 'utf8'));
        return report;
    }

    formatScore(score) {
        if (score >= 0.9) return { emoji: '✅', level: 'Excellent' };
        if (score >= 0.7) return { emoji: '🟢', level: 'Good' };
        if (score >= 0.5) return { emoji: '⚠️', level: 'Needs Improvement' };
        return { emoji: '❌', level: 'Poor' };
    }

    formatBytes(bytes) {
        if (bytes < 1024) return bytes + 'B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'KB';
        return (bytes / 1024 / 1024).toFixed(2) + 'MB';
    }

    formatTime(ms) {
        if (ms < 1000) return Math.round(ms) + 'ms';
        return (ms / 1000).toFixed(1) + 's';
    }

    generateImageRecommendations(report) {
        const recommendations = [];
        const networkRequests = report.audits['network-requests'].details.items;
        
        // Find oversized images
        const images = networkRequests.filter(item => 
            item.resourceType === 'Image' && 
            item.mimeType.includes('png') && 
            item.transferSize > 100000 // > 100KB
        );

        // Sort by size (largest first)
        images.sort((a, b) => b.transferSize - a.transferSize);

        images.forEach(img => {
            const size = this.formatBytes(img.transferSize);
            const fileName = path.basename(new URL(img.url).pathname);
            
            // Estimate proper size (assuming 380x200 display size)
            const displaySize = 380 * 200 * 4; // Rough estimate for compressed WebP
            const savingsPercent = Math.round((1 - displaySize / img.transferSize) * 100);
            
            recommendations.push({
                file: fileName,
                currentSize: size,
                recommendedSize: '~' + this.formatBytes(displaySize),
                savings: savingsPercent + '%',
                actions: ['Resize to 380x200px', 'Convert to WebP format']
            });
        });

        return recommendations;
    }

    generateResourceRecommendations(report) {
        const recommendations = [];
        const networkRequests = report.audits['network-requests'].details.items;
        
        // Large CSS files
        const cssFiles = networkRequests.filter(item => 
            item.resourceType === 'Stylesheet' && 
            item.transferSize > 50000 // > 50KB
        );
        
        cssFiles.forEach(css => {
            recommendations.push({
                type: 'CSS Optimization',
                file: path.basename(new URL(css.url).pathname),
                currentSize: this.formatBytes(css.transferSize),
                action: 'Remove unused CSS rules, split critical/non-critical'
            });
        });

        // JavaScript files
        const jsFiles = networkRequests.filter(item => 
            item.resourceType === 'Script' && 
            !item.url.includes('analytics') && 
            item.transferSize > 20000 // > 20KB
        );
        
        jsFiles.forEach(js => {
            recommendations.push({
                type: 'JavaScript Optimization',
                file: path.basename(new URL(js.url).pathname),
                currentSize: this.formatBytes(js.transferSize),
                action: 'Minify, tree-shake, or lazy load'
            });
        });

        return recommendations;
    }

    generateNetworkRecommendations(report) {
        const recommendations = [];
        
        // Missing preconnect
        const preconnectAudit = report.audits['uses-rel-preconnect'];
        if (preconnectAudit.score < 1) {
            preconnectAudit.details.items.forEach(item => {
                recommendations.push({
                    type: 'Network Optimization',
                    action: `Add <link rel="preconnect" href="${item.url}">`,
                    savings: `~${this.formatTime(item.wastedMs)} improvement`
                });
            });
        }

        return recommendations;
    }

    displayReport(report) {
        const categories = report.categories;
        const audits = report.audits;
        const resourceSummary = report.audits['resource-summary'].details.items;

        console.log('🎯 PERFORMANCE AUDIT RESULTS');
        console.log('='.repeat(50));
        
        // Overall score
        const performanceScore = Math.round(categories.performance.score * 100);
        const scoreDisplay = this.formatScore(categories.performance.score);
        console.log(`📊 Overall Score: ${performanceScore}/100 (${scoreDisplay.level}) ${scoreDisplay.emoji}\n`);

        // Core Web Vitals
        console.log('⚡ CORE WEB VITALS');
        const fcpScore = Math.round(audits['first-contentful-paint'].score * 100);
        const lcpScore = Math.round(audits['largest-contentful-paint'].score * 100);
        const clsScore = Math.round(audits['cumulative-layout-shift'].score * 100);
        const tbtScore = Math.round(audits['total-blocking-time'].score * 100);
        
        console.log(`   First Contentful Paint: ${this.formatTime(audits['first-contentful-paint'].numericValue)} (${fcpScore}/100) ${this.formatScore(audits['first-contentful-paint'].score).emoji} ${this.formatScore(audits['first-contentful-paint'].score).level}`);
        console.log(`   Largest Contentful Paint: ${this.formatTime(audits['largest-contentful-paint'].numericValue)} (${lcpScore}/100) ${this.formatScore(audits['largest-contentful-paint'].score).emoji} ${this.formatScore(audits['largest-contentful-paint'].score).level}`);
        console.log(`   Cumulative Layout Shift: ${audits['cumulative-layout-shift'].displayValue} (${clsScore}/100) ${this.formatScore(audits['cumulative-layout-shift'].score).emoji} ${this.formatScore(audits['cumulative-layout-shift'].score).level}`);
        console.log(`   Total Blocking Time: ${this.formatTime(audits['total-blocking-time'].numericValue)} (${tbtScore}/100) ${this.formatScore(audits['total-blocking-time'].score).emoji} ${this.formatScore(audits['total-blocking-time'].score).level}\n`);

        // Resource Usage
        console.log('📦 RESOURCE USAGE');
        const totalItem = resourceSummary.find(item => item.resourceType === 'total');
        const imageItem = resourceSummary.find(item => item.resourceType === 'image');
        const scriptItem = resourceSummary.find(item => item.resourceType === 'script');
        const cssItem = resourceSummary.find(item => item.resourceType === 'stylesheet');
        
        console.log(`   Total Size: ${this.formatBytes(totalItem.transferSize)} (${totalItem.requestCount} requests)`);
        console.log(`   Images: ${this.formatBytes(imageItem.transferSize)} (${imageItem.requestCount} files)`);
        console.log(`   Scripts: ${this.formatBytes(scriptItem.transferSize)} (${scriptItem.requestCount} files)`);
        console.log(`   CSS: ${this.formatBytes(cssItem.transferSize)} (${cssItem.requestCount} files)\n`);

        // Image Recommendations
        const imageRecs = this.generateImageRecommendations(report);
        if (imageRecs.length > 0) {
            console.log('🖼️ IMAGE OPTIMIZATIONS (CRITICAL)');
            imageRecs.slice(0, 5).forEach((rec, i) => {
                console.log(`   ${i + 1}. ${rec.file}`);
                console.log(`      Current: ${rec.currentSize} → Recommended: ${rec.recommendedSize} (${rec.savings} savings)`);
                console.log(`      Actions: ${rec.actions.join(', ')}`);
            });
            console.log('');
        }

        // Resource Recommendations
        const resourceRecs = this.generateResourceRecommendations(report);
        if (resourceRecs.length > 0) {
            console.log('📄 RESOURCE OPTIMIZATIONS');
            resourceRecs.slice(0, 3).forEach((rec, i) => {
                console.log(`   ${i + 1}. ${rec.type}: ${rec.file}`);
                console.log(`      Current: ${rec.currentSize}`);
                console.log(`      Action: ${rec.action}`);
            });
            console.log('');
        }

        // Network Recommendations
        const networkRecs = this.generateNetworkRecommendations(report);
        if (networkRecs.length > 0) {
            console.log('🌐 NETWORK OPTIMIZATIONS');
            networkRecs.slice(0, 3).forEach((rec, i) => {
                console.log(`   ${i + 1}. ${rec.action}`);
                if (rec.savings) {
                    console.log(`      Impact: ${rec.savings}`);
                }
            });
            console.log('');
        }

        // Top Level Recommendations
        console.log('💡 TOP RECOMMENDATIONS');
        const allRecs = [];
        
        if (lcpScore < 50) allRecs.push('⚠️ Fix Largest Contentful Paint (critical impact)');
        if (fcpScore < 70) allRecs.push('⚠️ Optimize First Contentful Paint');
        if (imageRecs.length > 0) allRecs.push('⚠️ Optimize images (largest bandwidth savings)');
        if (networkRecs.length > 0) allRecs.push('⚠️ Add resource hints for faster connections');
        
        allRecs.push('📈 Enable text compression (Brotli/gzip)');
        allRecs.push('🎨 Consider inline critical CSS');

        allRecs.slice(0, 5).forEach((rec, i) => {
            console.log(`   ${i + 1}. ${rec}`);
        });

        console.log('='.repeat(50));
        console.log(`💾 Full report saved: ${path.relative(process.cwd(), this.reportPath)}`);
        console.log('');
    }

    async run() {
        try {
            await this.runLighthouse();
            const report = this.parseReport();
            this.displayReport(report);
        } catch (error) {
            console.error('❌ Performance audit failed:', error.message);
            process.exit(1);
        }
    }
}

// Run if called directly
if (require.main === module) {
    const reporter = new PerformanceReporter();
    reporter.run();
}

module.exports = PerformanceReporter;
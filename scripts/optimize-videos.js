#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
    srcDir: path.resolve(__dirname, '../src'),
    docsDir: path.resolve(__dirname, '../docs'),
    formats: {
        // GIF → WebM (with transparency support)
        gif: { ext: 'webm', codec: 'libvpx-vp9', crf: 30 },
        // MP4 → optimized MP4
        mp4: { ext: 'mp4', codec: 'libx264', crf: 23 }
    },
    cacheFile: path.resolve(__dirname, '.video-cache.json')
};

/**
 * Recursively find all video files in src directory
 */
function findVideoFiles(dir) {
    const files = [];
    
    function scanDir(currentDir) {
        const items = fs.readdirSync(currentDir);
        
        items.forEach(item => {
            const fullPath = path.join(currentDir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                scanDir(fullPath);
            } else {
                const ext = path.extname(item).toLowerCase().slice(1);
                if (['gif', 'mp4'].includes(ext)) {
                    files.push({
                        src: fullPath,
                        relativePath: path.relative(CONFIG.srcDir, fullPath),
                        ext: ext,
                        mtime: stat.mtime.getTime()
                    });
                }
            }
        });
    }
    
    scanDir(dir);
    return files;
}

/**
 * Load cache to track converted files
 */
function loadCache() {
    try {
        return JSON.parse(fs.readFileSync(CONFIG.cacheFile, 'utf8'));
    } catch {
        return {};
    }
}

/**
 * Save cache after successful conversion
 */
function saveCache(cache) {
    fs.writeFileSync(CONFIG.cacheFile, JSON.stringify(cache, null, 2));
}

/**
 * Convert video file using ffmpeg
 */
function convertVideo(fileInfo) {
    const format = CONFIG.formats[fileInfo.ext];
    if (!format) {
        console.warn(`⚠️  Unsupported format: ${fileInfo.ext}`);
        return null;
    }
    
    // Generate output path
    const srcPath = fileInfo.src;
    const relativePath = fileInfo.relativePath;
    const outputRelative = relativePath.replace(`.${fileInfo.ext}`, `.${format.ext}`);
    const outputPath = path.join(CONFIG.docsDir, outputRelative);
    
    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    console.log(`🎬 Converting ${relativePath} → ${outputRelative}`);
    
    // Build ffmpeg command
    const args = [
        '-i', srcPath,
        '-pix_fmt', fileInfo.ext === 'gif' ? 'yuva420p' : 'yuv420p',
        '-movflags', 'faststart',
        '-movflags', 'faststart',
    ];
    
    // Add codec-specific settings
    if (format.codec) {
        args.push('-c:v', format.codec);
    }
    
    if (format.crf) {
        args.push('-crf', format.crf.toString());
    }
    
    // For GIFs to WebM, no audio
    if (fileInfo.ext === 'gif') {
        args.push('-b:v', '0');
        args.push('-c:a', '0');
    } else {
        args.push('-preset', 'veryfast');
        args.push('-b:a', '0');
    }
    
    args.push(outputPath);
    
    try {
        execSync(`ffmpeg ${args.map(arg => `"${arg}"`).join(' ')}`, {
            stdio: 'inherit',
            timeout: 300000 // 5 minute timeout
        });
        
        const stats = fs.statSync(outputPath);
        const originalStats = fs.statSync(srcPath);
        
        const savings = ((originalStats.size - stats.size) / originalStats.size * 100).toFixed(1);
        console.log(`✅ ${relativePath}: ${(stats.size / 1024 / 1024).toFixed(2)}MB (saved ${savings}%)`);
        
        return {
            outputPath,
            outputRelative,
            originalSize: originalStats.size,
            compressedSize: stats.size,
            savings: parseFloat(savings)
        };
        
    } catch (error) {
        console.error(`❌ Failed to convert ${relativePath}:`, error.message);
        return null;
    }
}

/**
 * Update HTML files to use optimized video paths
 */
function updateHTMLReferences(fileInfo, conversionResult) {
    if (!conversionResult) return;
    
    const srcPattern = fileInfo.relativePath.replace(/\\/g, '/');
    const dstPattern = conversionResult.outputRelative.replace(/\\/g, '/');
    
    // Find HTML files that reference this video
    const htmlDir = path.dirname(fileInfo.src);
    if (!fs.existsSync(htmlDir)) return;
    
    const htmlFiles = fs.readdirSync(htmlDir).filter(f => f.endsWith('.html'));
    
    htmlFiles.forEach(htmlFile => {
        const htmlPath = path.join(htmlDir, htmlFile);
        try {
            let html = fs.readFileSync(htmlPath, 'utf8');
            
            // Replace all references to original file with optimized version
            const updatedHTML = html.replace(
                new RegExp(srcPattern.replace(/[.*+?^${}]/g, '\\$&'), 'g'), 
                dstPattern
            );
            
            if (html !== updatedHTML) {
                fs.writeFileSync(htmlPath, updatedHTML);
                console.log(`📝 Updated ${htmlFile} → ${dstPattern}`);
            }
        } catch (error) {
            console.warn(`⚠️  Could not update ${htmlFile}:`, error.message);
        }
    });
}

/**
 * Main optimization function
 */
function optimizeVideos() {
    console.log('🎬 Starting video optimization...\n');
    
    // Find all video files
    const videoFiles = findVideoFiles(CONFIG.srcDir);
    const cache = loadCache();
    
    if (videoFiles.length === 0) {
        console.log('📂 No video files found');
        return;
    }
    
    console.log(`🔍 Found ${videoFiles.length} video files`);
    
    let totalSavings = 0;
    let convertedCount = 0;
    const newCache = {};
    
    videoFiles.forEach(fileInfo => {
        const cacheKey = fileInfo.relativePath;
        const lastModified = fileInfo.mtime;
        const cached = cache[cacheKey];
        
        // Skip if already converted and file hasn't changed
        if (cached && cached.lastModified === lastModified) {
            console.log(`⏭️  Skipping ${fileInfo.relativePath} (already optimized)`);
            newCache[cacheKey] = cached;
            return;
        }
        
        // Convert the video
        const result = convertVideo(fileInfo);
        if (result) {
            updateHTMLReferences(fileInfo, result);
            totalSavings += result.savings;
            convertedCount++;
            
            // Update cache
            newCache[cacheKey] = {
                ...result,
                lastModified,
                optimizedAt: Date.now()
            };
        }
    });
    
    // Save updated cache
    saveCache(newCache);
    
    // Summary
    console.log('\n🎉 Video optimization complete!');
    console.log(`📈 Converted: ${convertedCount}/${videoFiles.length} files`);
    console.log(`💾 Total savings: ${totalSavings.toFixed(1)}%`);
    console.log(`🗄  Cache saved to: ${CONFIG.cacheFile}`);
    
    if (convertedCount === 0) {
        console.log('ℹ️  All videos already optimized. Run again after modifying source files.');
    }
}

// Run if called directly
if (require.main === module) {
    optimizeVideos();
}

module.exports = { optimizeVideos };
const fs = require('fs');
const path = require('path');
const gitDateExtractor = require('git-date-extractor');

const CACHE_PATH = path.join(__dirname, '..', '.cache', 'git-dates.json');
const POSTS_DIR = path.join(__dirname, '..', 'src', 'posts');

function generateCache() {
    console.log('Generating git-dates cache...');

    const posts = fs.readdirSync(POSTS_DIR).filter(f => {
        return fs.statSync(path.join(POSTS_DIR, f)).isDirectory();
    });
    const files = posts.map(p => './src/posts/' + p + '/index.md');

    gitDateExtractor.getStamps({
        outputToFile: false,
        projectRootPath: path.join(__dirname, '..'),
        files: files
    }).then(dates => {
        const cache = {};
        for (const [filePath, stamp] of Object.entries(dates)) {
            const normalizedPath = filePath.startsWith('./') ? filePath.substring(2) : filePath;
            cache[normalizedPath] = {
                modified: new Date(stamp.modified).toISOString(),
                created: new Date(stamp.created).toISOString()
            };
        }

        fs.mkdirSync(path.dirname(CACHE_PATH), { recursive: true });
        fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
        console.log(`Cached git dates for ${posts.length} posts`);
    }).catch(err => {
        console.error('Error generating git dates cache:', err);
        process.exit(1);
    });
}

if (require.main === module) {
    generateCache();
}

module.exports = { generateCache, CACHE_PATH };

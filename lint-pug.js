const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all .pug files
const pugFiles = glob.sync('src/**/*.pug', { ignore: 'node_modules/**' });

if (pugFiles.length === 0) {
    console.log('No Pug files found');
    process.exit(0);
}

// Read all files and extract content
const fileContents = new Map();
pugFiles.forEach(file => {
    fileContents.set(file, fs.readFileSync(file, 'utf-8'));
});

// Find all mixin definitions: mixin name(...)
const mixins = new Map(); // name -> { file, line }

fileContents.forEach((content, file) => {
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
        const match = line.match(/^\s*mixin\s+(\w+)/);
        if (match) {
            const mixinName = match[1];
            if (!mixins.has(mixinName)) {
                mixins.set(mixinName, []);
            }
            mixins.get(mixinName).push({ file, line: idx + 1 });
        }
    });
});

// Check usage of each mixin
const unusedMixins = [];
const duplicateMixins = [];

function groupByFile(entries) {
    const grouped = new Map();

    entries.forEach(({ name, locations }) => {
        locations.forEach(({ file, line }) => {
            if (!grouped.has(file)) {
                grouped.set(file, []);
            }

            grouped.get(file).push({ name, line });
        });
    });

    return grouped;
}

function printGroupedBreakdown(grouped) {
    const files = Array.from(grouped.keys()).sort();
    files.forEach(file => {
        console.log(file);
        const mixinsInFile = grouped.get(file);
        mixinsInFile
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name) || a.line - b.line)
            .forEach(item => console.log(`\t${item.name} - Line ${item.line}`));
    });
}

mixins.forEach((locations, mixinName) => {
    if (locations.length > 1) {
        duplicateMixins.push({ name: mixinName, locations });
    }

    // Search for usage: +mixinName(
    const usagePattern = new RegExp(`\\+${mixinName}\\s*[\\(\\s]`, 'g');
    let isUsed = false;

    for (const [file, content] of fileContents) {
        const lines = content.split('\n');
        let usageCount = 0;
        lines.forEach((line, idx) => {
            // Skip the definition line
            if (line.match(new RegExp(`^\\s*mixin\\s+${mixinName}`))) {
                return;
            }
            if (line.match(usagePattern)) {
                usageCount++;
            }
        });

        if (usageCount > 0) {
            isUsed = true;
            break;
        }
    }

    if (!isUsed) {
        unusedMixins.push({ name: mixinName, locations });
    }
});

// Output results
console.log(`\n📊 Pug Mixin Analysis\n`);
console.log(`Total mixins found: ${mixins.size}`);

if (unusedMixins.length > 0) {
    console.log(`\n❌ Unused mixins (${unusedMixins.length}):`);
    printGroupedBreakdown(groupByFile(unusedMixins));
}

if (duplicateMixins.length > 0) {
    console.log(`\n⚠️  Duplicate mixin definitions (${duplicateMixins.length}):`);
    printGroupedBreakdown(groupByFile(duplicateMixins));
}

if (unusedMixins.length === 0 && duplicateMixins.length === 0) {
    console.log(`\n✅ All mixins are used and no duplicates found!`);
}

process.exit(unusedMixins.length > 0 ? 1 : 0);

const Image = require("@11ty/eleventy-img");
const path = require("path");
const fs = require("fs");

// List of critical images to optimize manually
const criticalImages = [
    {
        input: "src/projects/inclusion-tee/inclusion-tee-mockup.png",
        outputDir: "docs/assets/img/",
        widths: [800, 1200, 1600],
        formats: ["webp", "jpeg"]
    },
    {
        input: "src/img/kendrick-lamar-super-bowl.gif", 
        outputDir: "docs/assets/img/",
        widths: [600, 900],
        formats: ["webp", "jpeg"]
    }
];

async function optimizeImages() {
    console.log("🖼️  Optimizing critical images...");
    
    for (const image of criticalImages) {
        try {
            const inputPath = path.resolve(image.input);
            
            if (!fs.existsSync(inputPath)) {
                console.warn(`❌ Image not found: ${inputPath}`);
                continue;
            }
            
            console.log(`📸 Processing: ${image.input}`);
            
            const metadata = await Image(inputPath, {
                widths: image.widths,
                formats: image.formats,
                outputDir: image.outputDir,
                urlPath: "/assets/img/"
            });
            
            console.log(`✅ Generated ${metadata.jpeg.length + metadata.webp.length} optimized versions`);
            
        } catch (error) {
            console.error(`❌ Failed to optimize ${image.input}:`, error.message);
        }
    }
}

optimizeImages();
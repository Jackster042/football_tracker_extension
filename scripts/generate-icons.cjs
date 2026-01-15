/**
 * Simple Icon Generator for Football Tracker Extension
 *
 * This script creates simple placeholder icons for development.
 * For production, replace with professionally designed icons.
 *
 * Usage: node scripts/generate-icons.cjs
 *
 * Note: This creates simple colored squares as placeholders.
 * You'll need to install 'canvas' package: npm install canvas --save-dev
 */

const fs = require("fs");
const path = require("path");

// Check if canvas is available
let createCanvas;
try {
  createCanvas = require("canvas").createCanvas;
} catch (e) {
  console.log("Canvas package not found. Creating simple PNG placeholders...");
  createCanvas = null;
}

const sizes = [16, 48, 128];
const iconsDir = path.join(__dirname, "..", "public", "icons");

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

if (createCanvas) {
  // Generate icons with canvas
  sizes.forEach((size) => {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext("2d");

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, "#00d68f");
    gradient.addColorStop(1, "#0095ff");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    // Simple football pattern
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size * 0.35, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#1a1a1a";
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size * 0.25, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size * 0.15, 0, Math.PI * 2);
    ctx.fill();

    const buffer = canvas.toBuffer("image/png");
    const filePath = path.join(iconsDir, `icon${size}.png`);
    fs.writeFileSync(filePath, buffer);
    console.log(`Created ${filePath}`);
  });
} else {
  // Create minimal valid PNG files (1x1 green pixel, scaled)
  // This is a minimal valid PNG header + data for a green pixel
  const minimalPng = Buffer.from([
    0x89,
    0x50,
    0x4e,
    0x47,
    0x0d,
    0x0a,
    0x1a,
    0x0a, // PNG signature
    0x00,
    0x00,
    0x00,
    0x0d, // IHDR length
    0x49,
    0x48,
    0x44,
    0x52, // IHDR
    0x00,
    0x00,
    0x00,
    0x01, // width: 1
    0x00,
    0x00,
    0x00,
    0x01, // height: 1
    0x08,
    0x02, // bit depth: 8, color type: RGB
    0x00,
    0x00,
    0x00, // compression, filter, interlace
    0x90,
    0x77,
    0x53,
    0xde, // IHDR CRC
    0x00,
    0x00,
    0x00,
    0x0c, // IDAT length
    0x49,
    0x44,
    0x41,
    0x54, // IDAT
    0x08,
    0xd7,
    0x63,
    0x00,
    0xd6,
    0x8e,
    0x00,
    0x02, // compressed green pixel
    0x00,
    0x02,
    0x00,
    0x01, //
    0xe2,
    0x21,
    0xbc,
    0x33, // IDAT CRC
    0x00,
    0x00,
    0x00,
    0x00, // IEND length
    0x49,
    0x45,
    0x4e,
    0x44, // IEND
    0xae,
    0x42,
    0x60,
    0x82, // IEND CRC
  ]);

  sizes.forEach((size) => {
    const filePath = path.join(iconsDir, `icon${size}.png`);
    fs.writeFileSync(filePath, minimalPng);
    console.log(`Created placeholder ${filePath} (replace with proper icon)`);
  });
}

console.log("\nDone! Icons created in public/icons/");
console.log(
  "For production, replace these with professionally designed icons."
);

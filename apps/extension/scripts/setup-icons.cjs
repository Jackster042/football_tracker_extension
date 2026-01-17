#!/usr/bin/env node
/**
 * Setup script to create placeholder icons for the Football Tracker extension.
 *
 * Creates minimal valid PNG files that can be loaded by Chrome.
 * Replace these with proper icons for production use.
 *
 * Usage: node scripts/setup-icons.cjs
 */

const fs = require("fs");
const path = require("path");

// Minimal valid 1x1 green PNG (works as a placeholder)
// This is a properly encoded PNG with a green (#00d68f) pixel
const createMinimalPng = () => {
  // PNG file structure for 1x1 RGB image
  const signature = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
  ]);

  // IHDR chunk
  const ihdrData = Buffer.from([
    0x00,
    0x00,
    0x00,
    0x01, // width: 1
    0x00,
    0x00,
    0x00,
    0x01, // height: 1
    0x08, // bit depth: 8
    0x02, // color type: RGB
    0x00, // compression method
    0x00, // filter method
    0x00, // interlace method
  ]);

  const ihdrCrc = crc32(Buffer.concat([Buffer.from("IHDR"), ihdrData]));
  const ihdr = Buffer.concat([
    Buffer.from([0x00, 0x00, 0x00, 0x0d]), // length
    Buffer.from("IHDR"),
    ihdrData,
    int32ToBuffer(ihdrCrc),
  ]);

  // IDAT chunk (compressed pixel data)
  // Filter byte (0) + RGB values for green (#00d68f)
  const rawData = Buffer.from([0x00, 0x00, 0xd6, 0x8f]);
  const compressedData = deflateSync(rawData);

  const idatCrc = crc32(Buffer.concat([Buffer.from("IDAT"), compressedData]));
  const idat = Buffer.concat([
    int32ToBuffer(compressedData.length),
    Buffer.from("IDAT"),
    compressedData,
    int32ToBuffer(idatCrc),
  ]);

  // IEND chunk
  const iendCrc = crc32(Buffer.from("IEND"));
  const iend = Buffer.concat([
    Buffer.from([0x00, 0x00, 0x00, 0x00]),
    Buffer.from("IEND"),
    int32ToBuffer(iendCrc),
  ]);

  return Buffer.concat([signature, ihdr, idat, iend]);
};

// Simple CRC32 implementation
function crc32(data) {
  let crc = 0xffffffff;
  const table = [];

  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c;
  }

  for (let i = 0; i < data.length; i++) {
    crc = table[(crc ^ data[i]) & 0xff] ^ (crc >>> 8);
  }

  return (crc ^ 0xffffffff) >>> 0;
}

function int32ToBuffer(value) {
  const buffer = Buffer.alloc(4);
  buffer.writeUInt32BE(value);
  return buffer;
}

// Minimal deflate implementation for raw data
function deflateSync(data) {
  const zlib = require("zlib");
  return zlib.deflateSync(data, { level: 9 });
}

// Main execution
const iconsDir = path.join(__dirname, "..", "public", "icons");

// Ensure directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Create placeholder icons
const sizes = [16, 48, 128];
const png = createMinimalPng();

sizes.forEach((size) => {
  const filePath = path.join(iconsDir, `icon${size}.png`);
  fs.writeFileSync(filePath, png);
  console.log(`✓ Created ${filePath}`);
});

console.log("\n✅ Icons created successfully!");
console.log("   Note: These are minimal placeholders. Replace with proper");
console.log("   icons for production use.");

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [
  // PWA manifest icons
  { size: 192, name: 'icon-192.png' },
  { size: 512, name: 'icon-512.png' },
  { size: 384, name: 'icon-384.png' },
  { size: 256, name: 'icon-256.png' },

  // Apple touch icons
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 152, name: 'apple-touch-icon-152.png' },
  { size: 144, name: 'apple-touch-icon-144.png' },
  { size: 120, name: 'apple-touch-icon-120.png' },
  { size: 114, name: 'apple-touch-icon-114.png' },
  { size: 76, name: 'apple-touch-icon-76.png' },
  { size: 72, name: 'apple-touch-icon-72.png' },
  { size: 60, name: 'apple-touch-icon-60.png' },
  { size: 57, name: 'apple-touch-icon-57.png' },

  // Favicon sizes
  { size: 32, name: 'favicon-32.png' },
  { size: 16, name: 'favicon-16.png' },
];

const inputSvg = path.join(__dirname, '..', 'public', 'logo.svg');
const outputDir = path.join(__dirname, '..', 'public');

async function generateIcons() {
  console.log('🎨 Generating app icons...');

  for (const { size, name } of sizes) {
    try {
      await sharp(inputSvg)
        .resize(size, size)
        .png()
        .toFile(path.join(outputDir, name));

      console.log(`✅ Generated ${name} (${size}x${size})`);
    } catch (error) {
      console.error(`❌ Failed to generate ${name}:`, error.message);
    }
  }

  // Create a maskable icon (with padding)
  try {
    await sharp(inputSvg)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 102, g: 126, b: 234, alpha: 1 } // Using main gradient color
      })
      .png()
      .toFile(path.join(outputDir, 'icon-maskable-512.png'));

    console.log('✅ Generated maskable icon');
  } catch (error) {
    console.error('❌ Failed to generate maskable icon:', error.message);
  }

  console.log('🎉 Icon generation complete!');
}

generateIcons();
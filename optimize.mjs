import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const artifactsDir = 'C:\\Users\\GMK\\.gemini\\antigravity-ide\\brain\\645e7709-9ee5-42d8-b2bd-dd545cd6a76f';
const outputDir = 'C:\\Users\\GMK\\Documents\\AgenciaIA\\produtos\\zelare\\public\\images\\hero';

async function processImages() {
  const files = fs.readdirSync(artifactsDir).filter(f => f.endsWith('.png') && f.startsWith('hero_care_'));
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(artifactsDir, file);
    
    const desktopName = `hero_new_${i + 1}_desktop.webp`;
    const mobileName = `hero_new_${i + 1}_mobile.webp`;
    
    console.log(`Processing ${file}...`);
    
    // Desktop: 16:9 ratio (e.g., 1920x1080)
    await sharp(filePath)
      .resize({ width: 1920, height: 1080, fit: 'cover', position: 'center' })
      .webp({ quality: 85 })
      .toFile(path.join(outputDir, desktopName));
      
    // Mobile: 9:16 ratio (e.g., 1080x1920)
    await sharp(filePath)
      .resize({ width: 1080, height: 1920, fit: 'cover', position: 'center' })
      .webp({ quality: 85 })
      .toFile(path.join(outputDir, mobileName));
      
    console.log(`Created ${desktopName} and ${mobileName}`);
  }
}

processImages().catch(console.error);

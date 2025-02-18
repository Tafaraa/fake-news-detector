// This is a Node.js script to generate extension icons
// You'll need to run this once to create the icon files

import fs from 'fs';
import { createCanvas } from 'canvas';

const sizes = [16, 48, 128];

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#3b82f6';
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
  ctx.fill();

  // Newspaper icon
  ctx.strokeStyle = 'white';
  ctx.lineWidth = size * 0.1;
  ctx.beginPath();
  
  // Simplified newspaper shape
  const margin = size * 0.2;
  ctx.rect(margin, margin, size - margin*2, size - margin*2);
  
  // Lines representing text
  const lineY = size * 0.4;
  const lineSpacing = size * 0.2;
  for (let i = 0; i < 2; i++) {
    ctx.moveTo(margin*1.5, lineY + i*lineSpacing);
    ctx.lineTo(size - margin*1.5, lineY + i*lineSpacing);
  }
  
  ctx.stroke();

  return canvas.toBuffer();
}

// Generate icons for each size
sizes.forEach(size => {
  const iconBuffer = generateIcon(size);
  fs.writeFileSync(`icons/icon${size}.png`, iconBuffer);
});
#!/usr/bin/env node

// Test script to preview different figlet fonts
const figlet = require('figlet');

const testText = process.argv[2] || 'ID8';
const testFont = process.argv[3] || undefined;

console.log('Available figlet fonts:');
console.log('='.repeat(50));

if (testFont) {
  console.log(`\nTesting font: ${testFont}`);
  console.log('-'.repeat(30));
  try {
    console.log(figlet.textSync(testText, { font: testFont }));
  } catch (error) {
    console.log(`Error with font ${testFont}:`, error.message);
  }
} else {
  const fonts = [
    'Big',
    'Small',
    'Standard',
    'Slant',
    'Speed',
    'Doom',
    'Ghost',
    'Ogre',
  ];

  fonts.forEach((font) => {
    console.log(`\nFont: ${font}`);
    console.log('-'.repeat(30));
    try {
      console.log(figlet.textSync(testText, { font }));
    } catch (error) {
      console.log(`Error with font ${font}:`, error.message);
    }
    console.log();
  });
}

console.log('\nUsage:');
console.log(`node test-figlet.js "${testText}" [font-name]`);
console.log('\nAll available fonts:');
console.log(figlet.fontsSync().join(', '));

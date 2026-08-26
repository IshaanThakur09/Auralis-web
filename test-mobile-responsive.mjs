import fs from 'fs';
import path from 'path';

console.log('=== Running Mobile-First Automated Tests ===\n');

const files = [
  'index.html',
  'privacy/index.html',
  'terms/index.html',
  'src/styles/main.css',
  'src/styles/legal.css'
];

let errors = 0;

// Test 1: Check for Get App button in header
const indexHtml = fs.readFileSync('index.html', 'utf8');
if (indexHtml.includes('<a href="#download" class="btn btn-primary btn-sm">Get App</a>')) {
  console.error('❌ FAIL: "Get App" button still found in header!');
  errors++;
} else {
  console.log('✅ PASS: "Get App" button successfully removed from header.');
}

// Test 2: Check for 10,000+ listeners in index.html
if (indexHtml.includes('10,000+') || indexHtml.includes('10000')) {
  console.error('❌ FAIL: 10,000+ listeners still found in index.html!');
  errors++;
} else {
  console.log('✅ PASS: 10,000+ listeners claim completely removed.');
}

// Test 2b: Check that QR code is removed
if (indexHtml.includes('qr-container') || indexHtml.includes('Scan to Sideload')) {
  console.error('❌ FAIL: QR code component still found in index.html!');
  errors++;
} else {
  console.log('✅ PASS: QR code component completely removed.');
}

// Test 2c: Check that SHA256 box is removed
if (indexHtml.includes('checksum-box') || indexHtml.includes('SHA256:')) {
  console.error('❌ FAIL: SHA256 box still found in index.html!');
  errors++;
} else {
  console.log('✅ PASS: SHA256 checksum box completely removed.');
}

// Test 3: Check for horizontal overflow locks in main.css
const mainCss = fs.readFileSync('src/styles/main.css', 'utf8');

const checks = [
  { desc: 'html overflow-x: hidden', pass: mainCss.includes('overflow-x: hidden') },
  { desc: 'body max-width: 100vw', pass: mainCss.includes('max-width: 100vw') },
  { desc: 'container box-sizing: border-box', pass: mainCss.includes('box-sizing: border-box') },
  { desc: 'header-actions compact layout', pass: mainCss.includes('.header-actions') },
  { desc: 'mobile-first responsive media queries', pass: mainCss.includes('@media (max-width: 768px)') && mainCss.includes('@media (max-width: 380px)') },
  { desc: 'exact olive green accent #d2e780 defined', pass: mainCss.includes('#d2e780') },
  { desc: 'no violet neon glows (#a855f7 / #c084fc)', pass: !mainCss.includes('#a855f7') && !mainCss.includes('#c084fc') }
];

checks.forEach(c => {
  if (c.pass) {
    console.log(`✅ PASS: ${c.desc}`);
  } else {
    console.error(`❌ FAIL: ${c.desc}`);
    errors++;
  }
});

// Test 4: Check for fixed wide containers without max-width
const fixedWidthRegex = /(?:width|min-width):\s*([4-9]\d{2,}|[1-9]\d{3,})px/g;
let match;
let fixedWidthWarnings = 0;
while ((match = fixedWidthRegex.exec(mainCss)) !== null) {
  // Allow container max-width or specific non-overflowing elements
  const context = mainCss.substring(Math.max(0, match.index - 50), match.index + 50);
  if (!context.includes('max-width') && !context.includes('ambient-orb') && !context.includes('@media (min-width')) {
    console.warn(`⚠️ Warning: Potential fixed wide width found: ${match[0]} in context: ${context.trim()}`);
    fixedWidthWarnings++;
  }
}

if (fixedWidthWarnings === 0) {
  console.log('✅ PASS: No dangerous fixed widths causing mobile overflow.');
}

console.log(`\n=== Automated Test Summary: ${errors === 0 ? 'ALL TESTS PASSED ✅' : `${errors} ERRORS ❌`} ===\n`);
if (errors > 0) process.exit(1);

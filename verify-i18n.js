import fs from 'fs';
import path from 'path';

const SRC_DIR = './src';
const ALLOWED_STRINGS = new Set([
  'en', 'ar', 'fr', 'it', 'es', 'de', 'pt', 'ru', 'hi', 'zh',
  'utf-8', 'viewport', 'width=device-width', 'initial-scale=1',
  'stylesheet', 'https://fonts.googleapis.com', 'https://fonts.gstatic.com',
  'serif', 'sans-serif', 'monospace', 'solid', 'none', 'hidden',
  'relative', 'absolute', 'fixed', 'inline', 'block', 'transparent',
  'outline', 'cursor-grab', 'cursor-grabbing', 'pointer-events-none',
  'opacity', 'scale', 'rotate', 'translate', 'skew', 'origin-center',
  'sine', 'triangle', 'sawtooth', 'square', 'sine-wave',
  'top', 'bottom', 'left', 'right', 'center', 'middle', 'middle-left',
  'x', 'y', 'z', 'width', 'height', 'rx', 'ry', 'cx', 'cy', 'r',
  'svg', 'path', 'circle', 'rect', 'ellipse', 'line', 'g', 'defs',
  'linearGradient', 'radialGradient', 'stop', 'clipPath', 'mask',
  'scale-90', 'lg:flex-row', 'flex-col', 'sm:scale-100', 'direction',
  'text-anchor', 'font-mono', 'font-sans', 'font-serif', 'font-bold',
  'uppercase', 'lowercase', 'capitalize', 'text-center', 'text-left',
  'text-right', 'tracking-widest', 'tracking-wider', 'tracking-normal',
  'lh-normal', 'bg-zinc-950', 'bg-white', 'text-white', 'text-zinc-400'
]);

function isAllowed(str) {
  const s = str.trim().toLowerCase();
  if (ALLOWED_STRINGS.has(s)) return true;
  if (/^[0-9%\s.,:;\/()°C+-–_#]+$/.test(str)) return true; // only numbers/units/punctuations
  if (/^[a-z_0-9]+$/.test(str) && s !== 'curd') return true; // likely keys / internal identifiers
  // Allow Tailwind class strings or standard inline coordinates
  if (s.startsWith('m ') || s.startsWith('m0') || s.startsWith('c ') || s.startsWith('a ')) return true;
  return false;
}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const violations = [];

  // Remove multi-line comments and single-line comments for easier scanning
  let parsedContent = content;
  parsedContent = parsedContent.replace(/\/\*[\s\S]*?\*\//g, ''); // block comments
  parsedContent = parsedContent.replace(/\/\/.*$/gm, '');        // line comments

  // 1. Scan JSX elements text nodes: matches >Text<
  const jsxTextRegex = />\s*([A-Za-z][A-Za-z\s.,:;!?()°%+-]{2,})\s*</g;
  let match;
  while ((match = jsxTextRegex.exec(parsedContent)) !== null) {
    const rawText = match[1].trim();
    if (!isAllowed(rawText)) {
      // Find line number
      const index = match.index;
      const lineNumber = content.substring(0, index).split('\n').length;
      violations.push({
        line: lineNumber,
        type: 'JSX Hardcoded Text Node',
        text: rawText
      });
    }
  }

  // 2. Scan string attributes like text="...", title="...", label="...", placeholder="..."
  const attrRegex = /\s(text|title|label|placeholder|tooltip)="([A-Za-z\s.,:;!?()]{2,})"/g;
  while ((match = attrRegex.exec(parsedContent)) !== null) {
    const attrName = match[1];
    const attrValue = match[2].trim();
    if (!isAllowed(attrValue)) {
      const index = match.index;
      const lineNumber = content.substring(0, index).split('\n').length;
      violations.push({
        line: lineNumber,
        type: `Attribute [${attrName}] Hardcoded String`,
        text: attrValue
      });
    }
  }

  return violations;
}

function getTSXFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getTSXFiles(fullPath));
    } else if (file.endsWith('.tsx') && !file.includes('verify-i18n') && file !== 'LanguageSelector.tsx') {
      results.push(fullPath);
    }
  });
  return results;
}

const files = getTSXFiles(SRC_DIR);
let totalViolations = 0;

console.log('-------------------------------------------');
console.log('🤖 i18n Auditing System: Scanning for Hardcoded Lit...');
console.log('-------------------------------------------');

files.forEach((file) => {
  const violations = scanFile(file);
  if (violations.length > 0) {
    console.error(`\n❌ Found i18n violations in: ${file}`);
    violations.forEach((v) => {
      console.error(`   [Line ${v.line}] - Type: ${v.type} => Found: "${v.text}"`);
    });
    totalViolations += violations.length;
  }
});

console.log('\n-------------------------------------------');
if (totalViolations > 0) {
  console.error(`🚨 FAILED: Found ${totalViolations} hardcoded string violations!`);
  console.error('👉 Please move all strings to the translation dictionaries in LabTranslations.ts.');
  console.log('-------------------------------------------');
  process.exit(1);
} else {
  console.log('✅ SUCCESS: 100% of analyzed files passed! No hardcoded UI text detected.');
  console.log('-------------------------------------------');
  process.exit(0);
}

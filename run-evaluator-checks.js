import fs from 'fs';

const code = fs.readFileSync('./src/components/LabTranslations.ts', 'utf-8');

// We find the otherLangs block.
const otherLangsMatch = code.match(/const otherLangs:[\s\S]*?const extraTranslations/);
const extraTranslationsMatch = code.match(/const extraTranslations:[\s\S]*?\/\/ Merge extra translations/);

if (otherLangsMatch && extraTranslationsMatch) {
  const otherLangsStr = otherLangsMatch[0].replace('const extraTranslations', '');
  const extraTranslationsStr = extraTranslationsMatch[0].replace('// Merge extra translations', '');

  // Let's create an executable TS file
  const testCode = `
    import { labTranslations } from './src/components/LabTranslations';
    ${otherLangsStr}
    ${extraTranslationsStr}
    
    console.log('--- Inside Evaluator ---');
    console.log('otherLangs languages:', Object.keys(otherLangs));
    console.log('extraTranslations languages:', Object.keys(extraTranslations));
    
    // Test merging:
    const mergedFr = { ...otherLangs.fr, ...extraTranslations.fr };
    console.log('otherLangs.fr key count:', Object.keys(otherLangs.fr).length);
    console.log('extraTranslations.fr key count:', Object.keys(extraTranslations.fr || {}).length);
    console.log('Merged fr key count:', Object.keys(mergedFr).length);
    
    console.log('Is extraTranslations.fr defined?', extraTranslations.fr !== undefined);
  `;
  
  fs.writeFileSync('test-run.ts', testCode);
} else {
  console.log('Could not find objects in code.');
}

import fs from 'fs';

const code = fs.readFileSync('./src/components/LabTranslations.ts', 'utf-8');

// We have the code. Let's extract otherLangs and extraTranslations objects and evaluate them!
// Let's find index of "const otherLangs"
const otherLangsIndex = code.indexOf('const otherLangs:');
const extraTranslationsIndex = code.indexOf('const extraTranslations:');
const mergeIndex = code.indexOf('// Merge extra translations');

console.log('otherLangsIndex:', otherLangsIndex);
console.log('extraTranslationsIndex:', extraTranslationsIndex);
console.log('mergeIndex:', mergeIndex);

// Let's create a code snippet to run
const otherLangsCode = code.substring(otherLangsIndex, extraTranslationsIndex);
const extraTranslationsCode = code.substring(extraTranslationsIndex, mergeIndex);

// Evaluate them safely
const sandbox = {
  otherLangs: null,
  extraTranslations: null
};

// We can wrap them in a function to execute and return the values
const evaluatorSource = `
${otherLangsCode}
${extraTranslationsCode}
globalThis.otherLangs = otherLangs;
globalThis.extraTranslations = extraTranslations;
`;

// Let's save and run this evaluator as diagnostic
fs.writeFileSync('/evaluator.js', evaluatorSource);

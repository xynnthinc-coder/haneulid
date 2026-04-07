const fs = require('fs');
const filePath = 'd:\\Project Program\\haneulid\\app\\admin\\page.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// The write_to_file tool incorrectly received escaped backticks and dollar signs from earlier generation.
// This repairs them.
content = content.replace(/\\`/g, '`');
content = content.replace(/\\\$/g, '$');

// Replaces all indigo classes with pink classes to maintain app theme consistency.
content = content.replace(/indigo-50/g, 'pink-50');
content = content.replace(/indigo-100/g, 'pink-100');
content = content.replace(/indigo-200/g, 'pink-200');
content = content.replace(/indigo-300/g, 'pink-300');
content = content.replace(/indigo-400/g, 'pink-400');
content = content.replace(/indigo-500/g, 'pink-500');
content = content.replace(/indigo-600/g, 'pink-600');
content = content.replace(/indigo-700/g, 'pink-700');
content = content.replace(/indigo-800/g, 'pink-800');

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Fixed syntax and theme in page.tsx');

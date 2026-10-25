const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'node_modules', 'next-auth', 'core', 'lib', 'oauth', 'callback.js');

if (!fs.existsSync(filePath)) {
  console.log('next-auth callback.js not found, skipping patch');
  process.exit(0);
}

let content = fs.readFileSync(filePath, 'utf8');

const target = `...((_provider$token = provider.token) === null || _provider$token === void 0 ? void 0 : _provider$token.params)\n    };`;
const replacement = `...((_provider$token = provider.token) === null || _provider$token === void 0 ? void 0 : _provider$token.params)\n    };\n    // Remove iss param to avoid issuer check errors (e.g. Discord)\n    delete params.iss;`;

if (content.includes('delete params.iss')) {
  console.log('Patch already applied');
  process.exit(0);
}

if (!content.includes(target)) {
  console.log('Target not found, skipping patch');
  process.exit(0);
}

content = content.replace(target, replacement);
fs.writeFileSync(filePath, content);
console.log('Patch applied successfully');

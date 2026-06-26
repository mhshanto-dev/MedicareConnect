const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const dir = 'c:/assignment-10/frontend/src/app';

if (fs.existsSync(dir)) {
  walkDir(dir, (filePath) => {
    if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;
      
      const newContent = content.replace(/from\s+['"](\.\.\/)+([^'"]+)['"]/g, (match, dots, rest) => {
        // Only replace if it points to known top-level src folders
        if (rest.startsWith('components') || rest.startsWith('lib') || rest.startsWith('store')) {
          modified = true;
          return `from '@/${rest}'`;
        }
        return match; // leave alone if it's something else
      });

      if (modified) {
        fs.writeFileSync(filePath, newContent);
      }
    }
  });
}

console.log('Migrated relative imports to absolute aliases');

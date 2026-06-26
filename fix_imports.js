const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const dirs = [
  'c:/assignment-10/frontend/src/app/dashboard/patient',
  'c:/assignment-10/frontend/src/app/dashboard/doctor',
  'c:/assignment-10/frontend/src/app/dashboard/admin'
];

dirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    walkDir(dir, (filePath) => {
      if (filePath.endsWith('page.jsx') || filePath.endsWith('layout.jsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        // We only want to update imports that were previously correct for depth 2.
        // A depth 2 import like '../../lib/axios' in a depth 3 file is now wrong.
        // But layout.jsx files are at depth 3, so their imports should be '../../../'.
        // Let's just fix the specific ones we know:
        // For page.jsx at depth 4 (e.g., patient/appointments/page.jsx):
        // Old imports were '../../../lib/axios' -> now need to be '../../../../lib/axios'
        // Old imports were '../../components' -> now need to be '../../../components'
        
        const isDepth4 = filePath.split(/\\|\//).length >= 8; // heuristics
        
        if (filePath.endsWith('page.jsx') && !content.includes('under construction')) {
            // Replace depth 3 to depth 4
            content = content.replace(/from\s+['"]\.\.\/\.\.\/\.\.\/([^'"]+)['"]/g, "from '../../../../$1'");
            content = content.replace(/from\s+['"]\.\.\/\.\.\/([^'"]+)['"]/g, "from '../../../$1'");
            fs.writeFileSync(filePath, content);
        }
      }
    });
  }
});

console.log('Fixed imports');

const fs = require('fs');
const path = require('path');

// Directories to exclude from build
const excludeDirs = [
  'app/(dashboard)/appliances',
  'app/(dashboard)/calendar',
  'app/(dashboard)/inspections',
  'app/(dashboard)/maintenance',
  'app/(dashboard)/notifications',
  'app/(dashboard)/rent',
  'app/(dashboard)/settings/team',
  'app/test-auth',
  'app/test-db',
  'app/login-test',
  'app/signup-test',
  'app/api/google-calendar',
  'app/api/inspections',
  'app/api/run-edge-function',
  'app/api/test-db'
];

// Function to temporarily rename directories
function renameDirectories() {
  console.log('Temporarily renaming directories for build...');
  
  excludeDirs.forEach(dir => {
    const fullPath = path.join(process.cwd(), dir);
    if (fs.existsSync(fullPath)) {
      fs.renameSync(fullPath, `${fullPath}_TEMP_EXCLUDED`);
      console.log(`Renamed: ${dir} to ${dir}_TEMP_EXCLUDED`);
    } else {
      console.log(`Directory not found: ${dir}`);
    }
  });
  
  console.log('Directories renamed successfully!');
}

// Execute the renaming
renameDirectories();

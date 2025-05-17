const fs = require('fs');
const path = require('path');

// Directories that were excluded from build
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

// Function to restore renamed directories
function restoreDirectories() {
  console.log('Restoring temporarily renamed directories...');
  
  excludeDirs.forEach(dir => {
    const tempPath = path.join(process.cwd(), `${dir}_TEMP_EXCLUDED`);
    if (fs.existsSync(tempPath)) {
      fs.renameSync(tempPath, path.join(process.cwd(), dir));
      console.log(`Restored: ${dir}_TEMP_EXCLUDED to ${dir}`);
    } else {
      console.log(`Temporary directory not found: ${dir}_TEMP_EXCLUDED`);
    }
  });
  
  console.log('Directories restored successfully!');
}

// Execute the restoration
restoreDirectories();

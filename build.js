const { execSync } = require('child_process');
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

// Main build process
try {
  // Step 1: Rename directories
  renameDirectories();
  
  // Step 2: Run Next.js build
  console.log('Running Next.js build...');
  execSync('next build', { stdio: 'inherit' });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
} finally {
  // Step 3: Restore directories
  restoreDirectories();
}

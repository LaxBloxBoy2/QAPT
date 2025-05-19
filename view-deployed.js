const { exec } = require('child_process');

// The URL of your deployed application
const deployedUrl = 'https://qapt-evelnvvme-anwars-projects-98548d87.vercel.app';

console.log(`Opening ${deployedUrl} in your default browser...`);

// Open the URL in the default browser using the start command on Windows
exec(`start ${deployedUrl}`, (error) => {
  if (error) {
    console.error(`Error opening browser: ${error}`);
    return;
  }
  console.log('Done! Browser should be opening.');
});

console.log('You can close this window with Ctrl+C');

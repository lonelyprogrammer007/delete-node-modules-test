const fs = require('fs');
const path = require('path');

// Function to find all node_modules directories and print them
function findAndPrintNodeModules(baseDir) {
    fs.readdir(baseDir, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.error(`Error reading directory: ${baseDir}`, err);
            return;
        }
        files.forEach((file) => {
            if (file.isDirectory()) {
                const dirPath = path.join(baseDir, file.name);
                if (file.name === 'node_modules') {
                    console.log(`Found node_modules: ${dirPath}`);
                } else {
                    findAndPrintNodeModules(dirPath); // Recurse into subdirectories
                }
            }
        });
    });
}

// Check if a directory path was provided
if (!process.argv[2]) {
    console.error('Please provide a directory path.');
    process.exit(1);
}

// Start searching from the provided directory
const startDirectory = process.argv[2];
findAndPrintNodeModules(startDirectory);

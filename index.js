const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Function to delete a directory recursively
function deleteFolderRecursive(directoryPath) {
    if (fs.existsSync(directoryPath)) {
        fs.readdirSync(directoryPath).forEach((file) => {
            const curPath = path.join(directoryPath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                // Recurse
                deleteFolderRecursive(curPath);
            } else {
                // Delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(directoryPath);
    }
}

// Function to find all node_modules directories
function findNodeModules(baseDir) {
    fs.readdir(baseDir, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.error(`Error reading directory: ${baseDir}`, err);
            return;
        }
        files.forEach((file) => {
            if (file.isDirectory()) {
                const dirPath = path.join(baseDir, file.name);
                if (file.name === 'node_modules') {
                    console.log(`Deleting: ${dirPath}`);
                    deleteFolderRecursive(dirPath);
                } else {
                    findNodeModules(dirPath); // Recurse into subdirectories
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
findNodeModules(startDirectory);

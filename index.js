const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const Table = require('cli-table3');
const figlet = require('figlet');

// Create a new table with headers
const table = new Table({
    head: [chalk.green('Node Modules Path')],
    colWidths: [100] // Adjust column width to your preference
});

// Function to find all node_modules directories and print them
function findAndPrintNodeModules(baseDir) {
    fs.readdir(baseDir, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.error(chalk.red(`Error reading directory: ${baseDir}`), err);
            return;
        }
        files.forEach((file) => {
            if (file.isDirectory()) {
                const dirPath = path.join(baseDir, file.name);
                if (file.name === 'node_modules') {
                    table.push([chalk.blue(dirPath)]);
                } else {
                    findAndPrintNodeModules(dirPath); // Recurse into subdirectories
                }
            }
        });
    });
}

// Add a fancy title
console.log(chalk.yellow(figlet.textSync('Node Modules Finder')));

// Check if a directory path was provided
if (!process.argv[2]) {
    console.error(chalk.red('Please provide a directory path.'));
    process.exit(1);
}

// Start searching from the provided directory
const startDirectory = process.argv[2];
findAndPrintNodeModules(startDirectory);

// When the process is about to exit, print the table
process.on('exit', () => {
    console.log(table.toString());
});

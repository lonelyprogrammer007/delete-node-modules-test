const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const Table = require('cli-table3');
const figlet = require('figlet');

// Setup a table to display results
const table = new Table({
    head: ['Directory Path', 'Status'],
    colWidths: [50, 20],
    style: {
        head: ['green'],
        compact: true
    }
});

// Function to delete a directory recursively
function deleteFolderRecursive(directoryPath) {
    if (fs.existsSync(directoryPath)) {
        fs.readdirSync(directoryPath).forEach((file) => {
            const curPath = path.join(directoryPath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                try {
                    fs.unlinkSync(curPath);
                    console.log(chalk.green(`Deleted file: ${curPath}`));
                } catch (err) {
                    console.log(chalk.red(`Failed to delete file: ${curPath}`));
                    table.push([curPath, chalk.red('Failed')]);
                }
            }
        });
        try {
            fs.rmdirSync(directoryPath);
            console.log(chalk.green(`Deleted directory: ${directoryPath}`));
            table.push([directoryPath, chalk.green('Deleted')]);
        } catch (err) {
            console.log(chalk.red(`Failed to delete directory: ${directoryPath}`));
            table.push([directoryPath, chalk.red('Failed')]);
        }
    }
}

console.log(chalk.yellow(figlet.textSync('Delete Node Modules')));

// Check if a directory path was provided
if (!process.argv[2]) {
    console.error(chalk.red('Please provide a directory path.'));
    process.exit(1);
}

// Start searching and deleting from the provided directory
const startDirectory = process.argv[2];
deleteFolderRecursive(startDirectory);

// When the process is about to exit, print the results table
process.on('exit', () => {
    console.log('\n\nDeletion Summary:');
    console.log(table.toString());
});

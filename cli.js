#!/usr/bin/env node
import fs from "fs";
import path from "path";
import readline from "readline";

// Create a readline interface for user input
// This allows us to prompt the user for input in a terminal environment
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


/**
 * Cleans a file path by removing surrounding quotes and resolving it to an absolute path.
 *
 * @param {string} inputPath - The input file path to be cleaned.
 * @return {string} The cleaned and resolved file path.
 */
function cleanPath(inputPath) {
  // Remove surrounding quotes
  let cleanedPath = inputPath.trim().replace(/^["']|["']$/g, '');
  
  // Check if it's an absolute path
  if (path.isAbsolute(cleanedPath)) {
    return cleanedPath;
  } else {
    return path.resolve(process.cwd(), cleanedPath);
  }
}


/**
 * Validates a file path.
 * @param {string} filePath - The file path to validate.
 * @returns {Object} An object containing the validation result and an error message (if any).
 * @property {boolean} valid - Indicates whether the file path is valid.
 * @property {string} error - The error message (if any).
 */
function validateFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return { valid: false, error: `❌ File not found: ${filePath}` };
    }
    
    const stats = fs.statSync(filePath);
    if (!stats.isFile()) {
      return { valid: false, error: `❌ Path is not a file: ${filePath}` };
    }
    
    return { valid: true };
  } catch (error) {
    return { valid: false, error: `❌ Error accessing file: ${error.message}` };
  }
}

/**
 * Validates a directory path.
 * @param {string} dirPath - The directory path to validate.
 * @returns {Object} An object containing the validation result and an error message (if any).
 * @property {boolean} valid - Indicates whether the directory path is valid.
 * @property {string} error - The error message (if any).
 */
function validateDirectory(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      // Try to create the directory
      console.log(`Creating directory: ${dirPath}`);
      fs.mkdirSync(dirPath, { recursive: true });
      return { valid: true };
    }
    
    const stats = fs.statSync(dirPath);
    if (!stats.isDirectory()) {
      return { valid: false, error: `❌ Path is not a directory: ${dirPath}` };
    }
    
    // Check if directory is writable
    fs.accessSync(dirPath, fs.constants.W_OK);
    return { valid: true };
  } catch (error) {
    return { valid: false, error: `❌ Cannot write to directory: ${error.message}` };
  }
}


/**
 * The main function that executes the program based on the command line arguments.
 * If no arguments are provided, it prompts the user for a file path.
 * If a single argument is provided, it validates the file path and prompts the user for an output directory.
 * If two arguments are provided, it validates both the file path and output directory and processes the structure.
 *
 * @returns {Promise<void>} A promise that resolves when the program execution is complete.
 * @throws {Error} If an unexpected error occurs during execution.
 */
async function main() {
  try {
    if (process.argv.length < 3) {
      await promptForFilePath();
    } else if (process.argv.length === 3) {
      const filePath = cleanPath(process.argv[2]);
      const fileValidation = validateFile(filePath);
      
      if (!fileValidation.valid) {
        console.error(fileValidation.error);
        process.exit(1);
      }
      
      await promptForOutputDir(filePath);
    } else {
      const filePath = cleanPath(process.argv[2]);
      const outputBase = cleanPath(process.argv[3]);
      
      const fileValidation = validateFile(filePath);
      if (!fileValidation.valid) {
        console.error(fileValidation.error);
        process.exit(1);
      }
      
      const dirValidation = validateDirectory(outputBase);
      if (!dirValidation.valid) {
        console.error(dirValidation.error);
        process.exit(1);
      }
      
      await processStructure(filePath, outputBase);
    }
  } catch (error) {
    console.error("❌ Unexpected error:", error.message);
    process.exit(1);
  }
}

function promptForFilePath() {
  return new Promise((resolve) => {
    rl.question("Enter path along with extension where you have your tree structure: ", async (inputFilePath) => {
      const filePath = cleanPath(inputFilePath);
      const fileValidation = validateFile(filePath);
      
      if (!fileValidation.valid) {
        console.error(fileValidation.error);
        rl.close();
        process.exit(1);
      }
      
      await promptForOutputDir(filePath);
      resolve();
    });
  });
}

function promptForOutputDir(filePath) {
  return new Promise((resolve) => {
    rl.question("Enter path where you want to create or press enter to create here: ", async (inputOutputDir) => {
      const outputBase = inputOutputDir.trim() 
        ? cleanPath(inputOutputDir) 
        : process.cwd();
      
      const dirValidation = validateDirectory(outputBase);
      if (!dirValidation.valid) {
        console.error(dirValidation.error);
        rl.close();
        process.exit(1);
      }
      
      await processStructure(filePath, outputBase);
      rl.close();
      resolve();
    });
  });
}

async function processStructure(filePath, outputBase) {
  try {
    const content = fs.readFileSync(filePath, "utf-8").trim();
    
    if (!content) {
      console.error("❌ File is empty:", filePath);
      process.exit(1);
    }
    
    if (filePath.endsWith(".json") || content.startsWith("{")) {
      try {
        const jsonData = JSON.parse(content);
        createFromJson(jsonData, outputBase);
      } catch (error) {
        console.error("❌ Invalid JSON format:", error.message);
        process.exit(1);
      }
    } else {
      createFromText(content.split("\n"), outputBase);
    }
    
    console.log("✅ Structure created successfully at:", outputBase);
  } catch (error) {
    console.error("❌ Error processing structure:", error.message);
    process.exit(1);
  }
}

function createFromJson(structure, basePath) {
  for (const name in structure) {
    try {
      const fullPath = path.join(basePath, name);
      if (typeof structure[name] === "string") {
        fs.mkdirSync(path.dirname(fullPath), { recursive: true });
        fs.writeFileSync(fullPath, structure[name]);
      } else {
        fs.mkdirSync(fullPath, { recursive: true });
        createFromJson(structure[name], fullPath);
      }
    } catch (error) {
      console.error(`❌ Error creating ${name}:`, error.message);
      process.exit(1);
    }
  }
}

function createFromText(lines, basePath) {
  try {
    // Remove empty lines
    lines = lines.filter(line => line.trim());
    
    if (lines.length === 0) {
      console.error("❌ No valid content found in the structure file");
      process.exit(1);
    }
    
    let stack = [{ depth: -1, dir: basePath }];
    
    // Check if first line is a root folder
    const firstLine = lines[0].trim();
    if (firstLine.endsWith("/")) {
      const rootFolderName = firstLine.replace(/[├└│─ ]/g, "").replace(/\/$/, "");
      const rootPath = path.join(basePath, rootFolderName);
      fs.mkdirSync(rootPath, { recursive: true });
      stack = [{ depth: -1, dir: rootPath }];
      lines = lines.slice(1); // remove root from processing
    }
    
    lines.forEach((line, index) => {
      if (!line.trim()) return;
      
      try {
        // Remove tree drawing characters
        const cleanedLine = line.replace(/[├└│]/g, "");
        const depth = cleanedLine.search(/\S/);
        const name = cleanedLine.trim().replace(/─ /, "");
        
        if (!name) {
          console.warn(`⚠️ Warning: Empty name at line ${index + 1}, skipping`);
          return;
        }
        
        const isDir = name.endsWith("/");
        
        while (stack.length && stack[stack.length - 1].depth >= depth) {
          stack.pop();
        }
        
        if (stack.length === 0) {
          console.error(`❌ Invalid structure at line ${index + 1}: No parent directory`);
          process.exit(1);
        }
        
        const parentDir = stack[stack.length - 1].dir;
        const targetPath = path.join(parentDir, name.replace(/\/$/, ""));
        
        if (isDir) {
          fs.mkdirSync(targetPath, { recursive: true });
          stack.push({ depth, dir: targetPath });
        } else {
          fs.mkdirSync(path.dirname(targetPath), { recursive: true });
          fs.writeFileSync(targetPath, "");
        }
      } catch (error) {
        console.error(`❌ Error processing line ${index + 1}: "${line}":`, error.message);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error("❌ Error creating text structure:", error.message);
    process.exit(1);
  }
}

// Start the application
main();

// Close the readline interface on Ctrl+C
// May be needed if some operations are still pending, not resolved
process.on("SIGINT", () => {
  console.log("\nExiting...");
  rl.close(); // Close the readline interface
  process.exit(0); // Exit the process
})
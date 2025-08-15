#!/usr/bin/env node
import fs from "fs";
import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

if (process.argv.length < 3) {
  console.error("Usage: create-structure <path-to-structure-file> [output-dir]");
  process.exit(1);
}

const filePath = path.resolve(process.cwd(), process.argv[2]);
const outputBase = process.argv[3]
  ? path.resolve(process.cwd(), process.argv[3])
  : process.cwd();

if (!fs.existsSync(filePath)) {
  console.error("❌ File not found:", filePath);
  process.exit(1);
}

const content = fs.readFileSync(filePath, "utf-8").trim();

if (filePath.endsWith(".json") || content.startsWith("{")) {
  createFromJson(JSON.parse(content), outputBase);
} else {
  createFromText(content.split("\n"), outputBase);
}

console.log("✅ Structure created successfully!");

// ---------- Functions ----------

function createFromJson(structure, basePath) {
  for (const name in structure) {
    const fullPath = path.join(basePath, name);
    if (typeof structure[name] === "string") {
      fs.writeFileSync(fullPath, structure[name]);
    } else {
      fs.mkdirSync(fullPath, { recursive: true });
      createFromJson(structure[name], fullPath);
    }
  }
}

function createFromText(lines, basePath) {
  // Remove empty lines at the start
  lines = lines.filter(line => line.trim());

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

  lines.forEach(line => {
    if (!line.trim()) return;

    // Remove tree drawing characters
    const cleanedLine = line.replace(/[├└│]/g, "");
    const depth = cleanedLine.search(/\S/);
    const name = cleanedLine.trim().replace(/─ /, "");
    const isDir = name.endsWith("/");

    while (stack.length && stack[stack.length - 1].depth >= depth) {
      stack.pop();
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
  });
}


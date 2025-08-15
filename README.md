# create-structure

<!-- [![npm version](https://badge.fury.io/js/create-structure.svg)](https://badge.fury.io/js/create-structure)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) -->
<!-- [![Node.js Version](https://img.shields.io/node/v/create-structure.svg)](https://nodejs.org/en/download/) -->

> 🚀 A powerful CLI tool to instantly create directory structures from text files or JSON templates

Quickly scaffold project directories, organize file structures, and set up development environments with a simple command. Perfect for developers, project managers, and anyone who needs to create consistent directory layouts.

## ✨ Features

- 📁 **Multiple Input Formats**: Support for both tree-style text files and JSON structure definitions
- 🎯 **Interactive Mode**: Smart prompts when arguments are missing
- 🛡️ **Robust Error Handling**: Comprehensive validation and user-friendly error messages
- 🌍 **Cross-Platform**: Works on Windows(tested), macOS(test needed), and Linux(test needed)
- ⚡ **Fast & Lightweight**: Zero dependencies, pure Node.js
- 🔄 **Flexible Paths**: Support for both absolute and relative paths
- 📝 **Batch Operations**: Create complex nested structures in seconds

## 📦 Installation

### Global Installation (Recommended)
```bash
npm install -g create-structure
```

### Local Installation
```bash
npm install create-structure
```

### Using npx (No Installation Required)
```bash
npx create-structure
```

## 🚀 Quick Start
```bash
# Interactive mode - get prompted for inputs
create-structure

# Specify structure file only (default output directory is current directory)
# Tree-style text file
create-structure ./project-structure.txt 
# or
# JSON style structure
create-structure ./project-structure.json

# Specify both structure file and output directory - output directory will be created if it doesn't exist and no prompts will be shown
create-structure ./structure.json ./my-new-project
```
## 🚀 Usage
```bash
create-structure [structure_file] [output_directory]
```
# Parameters:

- `structure_file`: The path to the structure file. It can be a tree-style text file or a JSON file.
- `output_directory`: The directory where the structure will be created. If not provided, the current directory will be used.

## 📝 Structure File Formats
1. Tree-Style Text Format
Create a .txt file with your directory structure using tree notation:

```
my-project/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── Layout.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   └── About.jsx
│   ├── utils/
│   │   ├── helpers.js
│   │   └── constants.js
│   └── App.jsx
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── assets/
│       ├── images/
│       └── styles/
├── tests/
│   ├── components/
│   └── utils/
├── docs/
│   ├── README.md
│   └── API.md
├── .gitignore
├── package.json
└── README.md
```
# Supported Tree Characters:
- `├──` for branches
- `└──` for last items
- `│` for vertical lines
- Folders must end with `/`
- Files without `/` are treated as files

My suggestion you can use the [tree.nathanfriend.com](https://tree.nathanfriend.com) to draw your structure.

2. JSON Format
Create a .json file with your directory structure using JSON notation:

```json
{
  "my-project": {
    "src": {
      "components": {
        "Header.jsx": "",
        "Footer.jsx": "",
        "Layout.jsx": ""
      },
      "pages": {
        "Home.jsx": "",
        "About.jsx": ""
      },
      "utils": {
        "helpers.js": "// Utility functions",
        "constants.js": "// App constants"
      },
      "App.jsx": ""
    },
    "public": {
      "index.html": "<!DOCTYPE html>...",
      "favicon.ico": "",
      "assets": {
        "images": {},
        "styles": {}
      }
    },
    "tests": {
      "components": {},
      "utils": {}
    },
    "docs": {
      "README.md": "# Documentation",
      "API.md": "# API Reference"
    },
    ".gitignore": "node_modules/\n.env\ndist/",
    "package.json": "",
    "README.md": "# My Project"
  }
}
```
# JSON Structure Rules:
- Objects represent directories
- String values represent file content
- Empty strings create empty files
- Nested objects create nested directories

### Upcoming Features

- many preset templates for boilerplate projects
- support for YAML and other structure formats

## Contributing or Pull Requests

I welcome contributions! Please follow the [Contributing Guidelines](https://github.com/sayantanCode/cli-project-structure-builder/blob/main/.github/CONTRIBUTING.md) to contribute to this project.

## 📝 License

This project is released under the [MIT License](https://opensource.org/licenses/MIT).

## 📝 Issues

Found a bug or have a feature request?  
Please [open an issue](https://github.com/sayantanCode/cli-project-structure-builder/issues) using one of our templates.


## 📝 Changelog

See the [Changelog](https://github.com/sayantanCode/cli-project-structure-builder/blob/main/CHANGELOG.md) for a detailed history of changes and releases.

## 📝 Credits
- [Sayantan Chakraborty](https://github.com/sayantanCode)

## Made with ❤️ by 🙋‍‍ Sayantan Chakraborty
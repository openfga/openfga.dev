import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SIDEBARS_FILE = path.join(__dirname, '../docs/sidebars.js');
const OUTPUT_FILE = path.join(__dirname, '../static/llms.txt');
const BASE_URL = 'https://openfga.dev/docs';

/**
 * Reads and parses the sidebars.js file
 * @returns {Promise<Object>}
 */
async function loadSidebars() {
    const sidebarContent = await fs.readFile(SIDEBARS_FILE, 'utf8');
    
    // Extract the sidebars object by evaluating the JavaScript content
    // This is safe since we control the sidebars.js file content
    const sandbox = { module: { exports: {} } };
    
    // Create a function that executes the sidebars.js content in a controlled context
    const func = new Function('module', 'exports', sidebarContent);
    func(sandbox.module, sandbox.module.exports);
    
    return sandbox.module.exports;
}

/**
 * Converts a doc ID to a URL path
 * @param {string} id - Document ID like 'content/intro'
 * @returns {string} - URL path like '/fga'
 */
function docIdToUrl(id) {
    if (id === 'content/intro') {
        return '/fga';
    }
    return '/' + id.replace('content/', '');
}

/**
 * Processes sidebar items recursively and generates markdown content
 * @param {Array} items - Sidebar items
 * @param {number} depth - Current nesting depth
 * @returns {string} - Markdown content
 */
function processItems(items, depth = 0) {
    let content = '';
    const indent = '  '.repeat(depth);
    
    for (const item of items) {
        if (item.type === 'doc') {
            const url = `${BASE_URL}${docIdToUrl(item.id)}`;
            content += `${indent}- [${item.label}](${url})`;
            if (item.description) {
                content += ` - ${item.description}`;
            }
            content += '\n';
        } else if (item.type === 'category') {
            content += `${indent}#### ${item.label}\n`;
            if (item.link && item.link.type === 'doc') {
                const url = `${BASE_URL}${docIdToUrl(item.link.id)}`;
                content += `${indent}- [Overview](${url}) - ${item.label} overview\n`;
            }
            if (item.items && item.items.length > 0) {
                content += processItems(item.items, depth + 1);
            }
            content += '\n';
        }
    }
    
    return content;
}

/**
 * Generates the complete llms.txt content
 * @param {Object} sidebars - Parsed sidebars configuration
 * @returns {string} - Complete llms.txt content
 */
function generateLlmsTxtContent(sidebars) {
    const header = `# OpenFGA Documentation

## Project Overview

OpenFGA (Fine-Grained Authorization) is an open source authorization system based on Google's Zanzibar. It's a Cloud Native Computing Foundation (CNCF) project that provides scalable, fine-grained authorization for applications using Relationship-Based Access Control (ReBAC).

## Key Information

- **Website**: https://openfga.dev
- **Main Repository**: https://github.com/openfga/openfga
- **Documentation Repository**: https://github.com/openfga/openfga.dev
- **License**: Apache-2.0
- **Technology Stack**: Go, Docusaurus, React, TypeScript, JavaScript
- **Purpose**: Documentation website for OpenFGA authorization system

## Core Concepts

OpenFGA implements authorization through:

1. **Authorization Models** - Define relationships between users and resources
2. **Relationship Tuples** - Store actual relationships (user:relation:object)
3. **Configuration Language** - DSL for defining authorization models
4. **Stores** - Isolated authorization environments
5. **Conditional Tuples** - Attribute-based access control capabilities

## Complete Documentation Structure

`;

    let content = header;
    
    if (sidebars.docs) {
        content += processItems(sidebars.docs);
    }

    const footer = `
## Supported Features

- Multiple database backends (PostgreSQL, MySQL, SQLite)
- HTTP and gRPC APIs
- SDKs for multiple languages (JavaScript, Go, .NET, Java, Python)
- Command Line Interface (CLI)
- Visual Studio Code extension
- Kubernetes deployment via Helm charts
- OpenTelemetry integration
- GitHub Actions for testing and deployment

## Key Use Cases

OpenFGA is suitable for implementing:
- Role-Based Access Control (RBAC)
- Attribute-Based Access Control (ABAC)
- Resource-level permissions
- Multi-tenant authorization
- Complex organizational hierarchies
- Fine-grained API access control

## Community

OpenFGA welcomes community contributions and is part of the CNCF ecosystem. The project provides comprehensive documentation for developers looking to implement fine-grained authorization in their applications.
`;

    return content + footer;
}

/**
 * Main function to generate the llms.txt file
 */
async function generateLlmsTxt() {
    try {
        console.log('Loading sidebars configuration...');
        const sidebars = await loadSidebars();
        
        console.log('Generating llms.txt content...');
        const content = generateLlmsTxtContent(sidebars);
        
        console.log('Writing llms.txt file...');
        await fs.writeFile(OUTPUT_FILE, content, 'utf8');
        
        console.log(`📄 File contains ${content.split('\n').length} lines`);
        
    } catch (error) {
        console.error('❌ Error generating llms.txt:', error.message);
        process.exit(1);
    }
}

// Run the script
generateLlmsTxt();

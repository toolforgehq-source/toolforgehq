#!/usr/bin/env node

/**
 * Simplified Template Addition Script
 * 
 * This script is designed to be called programmatically by Devin
 * to add new templates to the ToolForgeHQ catalog.
 * 
 * Usage:
 *   node tools/add-templates.js '{"templates": [...]}'
 */

const fs = require('fs');
const path = require('path');

const TEMPLATES_JSON_PATH = path.join(__dirname, '../src/data/templates.json');
const PUBLIC_TEMPLATES_DIR = path.join(__dirname, '../public/templates');

function loadTemplatesData() {
  const content = fs.readFileSync(TEMPLATES_JSON_PATH, 'utf-8');
  return JSON.parse(content);
}

function saveTemplatesData(data) {
  fs.writeFileSync(TEMPLATES_JSON_PATH, JSON.stringify(data, null, 2) + '\n');
}

function createTemplateFile(template) {
  const ext = template.fileExtension || 'txt';
  const filename = `${template.id}.${ext}`;
  const filepath = path.join(PUBLIC_TEMPLATES_DIR, filename);
  
  if (!fs.existsSync(PUBLIC_TEMPLATES_DIR)) {
    fs.mkdirSync(PUBLIC_TEMPLATES_DIR, { recursive: true });
  }
  
  const content = template.fileContent || `# ${template.name}\n\n${template.fullDescription}\n`;
  fs.writeFileSync(filepath, content);
  
  return `/templates/${filename}`;
}

function addTemplates(templates) {
  const data = loadTemplatesData();
  const existingIds = new Set(data.templates.map(t => t.id));
  
  for (const template of templates) {
    if (existingIds.has(template.id)) {
      console.log(`Skipping "${template.id}" - already exists`);
      continue;
    }
    
    const downloadUrl = createTemplateFile(template);
    
    const entry = {
      id: template.id,
      name: template.name,
      shortDescription: template.shortDescription,
      fullDescription: template.fullDescription,
      category: template.category,
      priceCents: template.priceCents,
      comingSoon: template.comingSoon || false,
      image: template.image || `/images/${template.id}.jpg`,
      downloadUrl: downloadUrl,
      whatsIncluded: template.whatsIncluded,
      whoItsFor: template.whoItsFor,
      faqs: template.faqs,
      tags: template.tags || [],
      createdAt: new Date().toISOString(),
      featured: template.featured || false,
    };
    
    data.templates.push(entry);
    existingIds.add(template.id);
    console.log(`Added: ${template.name} ($${(template.priceCents / 100).toFixed(2)})`);
  }
  
  saveTemplatesData(data);
  console.log(`\nTotal templates: ${data.templates.length}`);
}

// CLI entry point
const input = process.argv[2];

if (!input) {
  console.error('Usage: node tools/add-templates.js \'{"templates": [...]}\'');
  process.exit(1);
}

try {
  const parsed = JSON.parse(input);
  const templates = parsed.templates || [parsed];
  addTemplates(templates);
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}

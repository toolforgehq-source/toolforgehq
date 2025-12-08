#!/usr/bin/env npx ts-node

/**
 * Template Generation and Registration Script
 * 
 * This script automates the process of:
 * 1. Creating a new template file in public/templates/
 * 2. Adding the template entry to src/data/templates.json
 * 3. Running build checks
 * 4. Committing and pushing changes to the repository
 * 
 * Usage:
 *   npx ts-node tools/generate_and_register_template.ts --config template-config.json
 *   
 * Or programmatically:
 *   import { registerTemplate } from './generate_and_register_template';
 *   await registerTemplate(templateConfig);
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// Paths
const TEMPLATES_JSON_PATH = path.join(__dirname, '../src/data/templates.json');
const PUBLIC_TEMPLATES_DIR = path.join(__dirname, '../public/templates');

// Template interface matching the frontend schema
interface TemplateConfig {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  priceCents: number;
  comingSoon?: boolean;
  image?: string;
  whatsIncluded: string[];
  whoItsFor: string[];
  faqs: { question: string; answer: string }[];
  tags?: string[];
  featured?: boolean;
  // The actual content to put in the template file
  fileContent?: string;
  fileExtension?: string; // default: 'zip'
}

interface TemplatesData {
  categories: Array<{
    id: string;
    name: string;
    icon: string;
    description: string;
  }>;
  templates: Array<any>;
}

/**
 * Generate a URL-friendly slug from a string
 */
function generateSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Load the current templates.json data
 */
function loadTemplatesData(): TemplatesData {
  const content = fs.readFileSync(TEMPLATES_JSON_PATH, 'utf-8');
  return JSON.parse(content);
}

/**
 * Save templates data back to templates.json
 */
function saveTemplatesData(data: TemplatesData): void {
  fs.writeFileSync(TEMPLATES_JSON_PATH, JSON.stringify(data, null, 2) + '\n');
}

/**
 * Check if a template with the given ID already exists
 */
function templateExists(id: string): boolean {
  const data = loadTemplatesData();
  return data.templates.some(t => t.id === id);
}

/**
 * Create the template file in public/templates/
 */
function createTemplateFile(config: TemplateConfig): string {
  const ext = config.fileExtension || 'zip';
  const filename = `${config.id}.${ext}`;
  const filepath = path.join(PUBLIC_TEMPLATES_DIR, filename);
  
  // Ensure directory exists
  if (!fs.existsSync(PUBLIC_TEMPLATES_DIR)) {
    fs.mkdirSync(PUBLIC_TEMPLATES_DIR, { recursive: true });
  }
  
  // Write the file content (or a placeholder if no content provided)
  const content = config.fileContent || `# ${config.name}\n\nThis is a placeholder template file.\n`;
  fs.writeFileSync(filepath, content);
  
  return `/templates/${filename}`;
}

/**
 * Register a new template in templates.json
 */
export async function registerTemplate(config: TemplateConfig): Promise<void> {
  console.log(`\n📦 Registering template: ${config.name}`);
  
  // Validate required fields
  if (!config.id || !config.name || !config.category || !config.priceCents) {
    throw new Error('Missing required fields: id, name, category, priceCents');
  }
  
  // Check if template already exists
  if (templateExists(config.id)) {
    throw new Error(`Template with ID "${config.id}" already exists`);
  }
  
  // Create the template file
  console.log('📁 Creating template file...');
  const downloadUrl = createTemplateFile(config);
  
  // Load current data
  const data = loadTemplatesData();
  
  // Create the template entry
  const templateEntry = {
    id: config.id,
    name: config.name,
    shortDescription: config.shortDescription,
    fullDescription: config.fullDescription,
    category: config.category,
    priceCents: config.priceCents,
    comingSoon: config.comingSoon || false,
    image: config.image || `/images/${config.id}.jpg`,
    downloadUrl: downloadUrl,
    whatsIncluded: config.whatsIncluded,
    whoItsFor: config.whoItsFor,
    faqs: config.faqs,
    tags: config.tags || [],
    createdAt: new Date().toISOString(),
    featured: config.featured || false,
  };
  
  // Add to templates array
  data.templates.push(templateEntry);
  
  // Save back to file
  console.log('💾 Updating templates.json...');
  saveTemplatesData(data);
  
  console.log(`✅ Template "${config.name}" registered successfully!`);
  console.log(`   ID: ${config.id}`);
  console.log(`   Download URL: ${downloadUrl}`);
  console.log(`   Price: $${(config.priceCents / 100).toFixed(2)}`);
}

/**
 * Register multiple templates at once
 */
export async function registerTemplates(configs: TemplateConfig[]): Promise<void> {
  console.log(`\n🚀 Registering ${configs.length} templates...\n`);
  
  for (const config of configs) {
    await registerTemplate(config);
  }
  
  console.log(`\n✅ All ${configs.length} templates registered successfully!`);
}

/**
 * Run build checks to ensure everything compiles
 */
export function runBuildChecks(): boolean {
  console.log('\n🔍 Running build checks...');
  
  try {
    // Run TypeScript type check
    console.log('  - TypeScript check...');
    execSync('npx tsc --noEmit', { cwd: path.join(__dirname, '..'), stdio: 'pipe' });
    
    // Run build
    console.log('  - Build check...');
    execSync('npm run build', { cwd: path.join(__dirname, '..'), stdio: 'pipe' });
    
    console.log('✅ Build checks passed!');
    return true;
  } catch (error: any) {
    console.error('❌ Build checks failed:', error.message);
    return false;
  }
}

/**
 * Commit and push changes to the repository
 */
export function commitAndPush(message: string): boolean {
  console.log('\n📤 Committing and pushing changes...');
  
  try {
    const cwd = path.join(__dirname, '..');
    
    // Add all changes
    execSync('git add -A', { cwd, stdio: 'pipe' });
    
    // Check if there are changes to commit
    const status = execSync('git status --porcelain', { cwd, encoding: 'utf-8' });
    if (!status.trim()) {
      console.log('ℹ️  No changes to commit');
      return true;
    }
    
    // Commit
    execSync(`git commit -m "${message}"`, { cwd, stdio: 'pipe' });
    
    // Push
    execSync('git push', { cwd, stdio: 'pipe' });
    
    console.log('✅ Changes committed and pushed!');
    return true;
  } catch (error: any) {
    console.error('❌ Git operation failed:', error.message);
    return false;
  }
}

/**
 * Full automation: register templates, run checks, commit and push
 */
export async function automateTemplateRegistration(
  configs: TemplateConfig[],
  commitMessage?: string
): Promise<boolean> {
  try {
    // Register all templates
    await registerTemplates(configs);
    
    // Run build checks
    const buildPassed = runBuildChecks();
    if (!buildPassed) {
      console.error('❌ Build checks failed. Aborting commit.');
      return false;
    }
    
    // Commit and push
    const message = commitMessage || `Add ${configs.length} new template(s)`;
    const pushSuccess = commitAndPush(message);
    
    if (pushSuccess) {
      console.log('\n🎉 Automation complete! Templates will be live after deployment.');
    }
    
    return pushSuccess;
  } catch (error: any) {
    console.error('❌ Automation failed:', error.message);
    return false;
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Template Generation and Registration Script

Usage:
  npx ts-node tools/generate_and_register_template.ts --config <config-file.json>
  npx ts-node tools/generate_and_register_template.ts --interactive

Options:
  --config <file>   Path to JSON config file with template(s) to register
  --interactive     Interactive mode (prompts for template details)
  --no-push         Skip git commit and push
  --help, -h        Show this help message

Config file format:
{
  "templates": [
    {
      "id": "template-id",
      "name": "Template Name",
      "shortDescription": "Brief description",
      "fullDescription": "Full description...",
      "category": "content",
      "priceCents": 2900,
      "whatsIncluded": ["Item 1", "Item 2"],
      "whoItsFor": ["Audience 1", "Audience 2"],
      "faqs": [{ "question": "Q?", "answer": "A." }],
      "tags": ["tag1", "tag2"],
      "featured": false
    }
  ]
}
    `);
    process.exit(0);
  }
  
  const configIndex = args.indexOf('--config');
  if (configIndex !== -1 && args[configIndex + 1]) {
    const configPath = args[configIndex + 1];
    const skipPush = args.includes('--no-push');
    
    try {
      const configContent = fs.readFileSync(configPath, 'utf-8');
      const config = JSON.parse(configContent);
      const templates = config.templates || [config];
      
      (async () => {
        await registerTemplates(templates);
        
        const buildPassed = runBuildChecks();
        if (!buildPassed) {
          process.exit(1);
        }
        
        if (!skipPush) {
          const success = commitAndPush(`Add ${templates.length} new template(s)`);
          process.exit(success ? 0 : 1);
        }
      })();
    } catch (error: any) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  } else {
    console.log('Please provide a config file with --config <file.json>');
    console.log('Run with --help for more information.');
    process.exit(1);
  }
}

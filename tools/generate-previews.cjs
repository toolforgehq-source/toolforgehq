/**
 * AI Preview Image Generator for ToolForgeHQ
 * 
 * This script generates high-quality preview images for templates using OpenAI's DALL-E 3 API.
 * 
 * Usage:
 *   OPENAI_API_KEY=sk-xxx node tools/generate-previews.cjs
 * 
 * Options:
 *   --force    Regenerate all images, even if they already exist
 *   --dry-run  Show what would be generated without making API calls
 *   --limit=N  Only generate N images (useful for testing)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const TEMPLATES_JSON_PATH = path.join(__dirname, '..', 'src', 'data', 'templates.json');
const PREVIEWS_DIR = path.join(__dirname, '..', 'public', 'previews');
const IMAGE_SIZE = '1024x1024'; // DALL-E 3 supports 1024x1024, 1792x1024, or 1024x1792
const IMAGE_QUALITY = 'hd'; // 'standard' or 'hd'
const IMAGE_STYLE = 'vivid'; // 'vivid' or 'natural'

// Parse command line arguments
const args = process.argv.slice(2);
const forceRegenerate = args.includes('--force');
const dryRun = args.includes('--dry-run');
const limitArg = args.find(a => a.startsWith('--limit='));
const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : Infinity;

// Category to visual concept mapping
const categoryVisualConcepts = {
  'social-media': {
    basePrompt: 'modern smartphone displaying social media app interface with engagement metrics, likes, comments, and share icons',
    subcategories: {
      'instagram-posts': 'Instagram app grid layout with colorful posts, heart icons, and engagement numbers',
      'tiktok-scripts': 'TikTok-style vertical video interface with play button, music notes, and trending indicators',
      'reels-scripts': 'Instagram Reels interface with video player, audio waveform, and creative effects overlay',
      'carousel-templates': 'Instagram carousel post with swipe indicators, multiple slides preview, and save icons',
      'facebook-posts': 'Facebook post interface with reactions, comments section, and share button',
      'youtube-shorts': 'YouTube Shorts vertical video player with subscribe button and view counter'
    },
    colors: 'vibrant blue and purple gradient background',
    style: 'energetic, modern, social media aesthetic'
  },
  'business-marketing': {
    basePrompt: 'professional business documents and marketing materials on a clean modern desk',
    subcategories: {
      'business-plans': 'professional business plan document with charts, graphs, and executive summary sections',
      'branding-kits': 'brand identity board with color palettes, typography samples, and logo variations',
      'email-sequences': 'email marketing interface showing automated sequence flow with open rates',
      'sales-funnels': 'sales funnel diagram with conversion stages and analytics dashboard',
      'lead-magnets': 'digital lead magnet mockup with download button and email capture form',
      'ads-templates': 'advertising dashboard with ad creatives, targeting options, and performance metrics'
    },
    colors: 'emerald green and teal gradient background',
    style: 'professional, corporate, trustworthy'
  },
  'real-estate': {
    basePrompt: 'modern real estate marketing materials with property visuals',
    subcategories: {
      'realtor-social': 'real estate social media post with property photo, price tag, and agent branding',
      'listing-descriptions': 'property listing card with home exterior, key features, and virtual tour button',
      'buyer-guides': 'home buying guide document with checklist, timeline, and property search tips',
      'seller-guides': 'home selling guide with staging tips, pricing strategy, and market analysis',
      'realtor-emails': 'real estate email template with property showcase and call-to-action buttons'
    },
    colors: 'warm gold and amber gradient background',
    style: 'luxurious, trustworthy, professional real estate'
  },
  'ecommerce': {
    basePrompt: 'e-commerce platform interface with product displays and shopping elements',
    subcategories: {
      'product-descriptions': 'product detail page with high-quality product image, description, and add to cart button',
      'shopify-banners': 'Shopify store homepage with hero banner, featured products, and promotional badges',
      'upsell-flows': 'checkout upsell interface with product recommendations and bundle offers',
      'influencer-outreach': 'influencer collaboration dashboard with outreach templates and partnership metrics'
    },
    colors: 'rich purple and violet gradient background',
    style: 'modern e-commerce, conversion-focused, premium'
  },
  'productivity': {
    basePrompt: 'productivity tools and planning interfaces on a minimalist workspace',
    subcategories: {
      'planners': 'digital planner interface with monthly view, goals section, and habit tracker',
      'calendars': 'weekly calendar layout with time blocks, appointments, and color-coded categories',
      'habit-trackers': 'habit tracking dashboard with streak counters, progress charts, and daily checkboxes',
      'content-planners': 'content calendar with post scheduling, platform icons, and content pipeline',
      'budget-trackers': 'budget tracking spreadsheet with expense categories, savings goals, and charts'
    },
    colors: 'teal and cyan gradient background',
    style: 'clean, organized, minimalist productivity'
  },
  'professional-docs': {
    basePrompt: 'professional documents displayed on a modern laptop or tablet',
    subcategories: {
      'resumes': 'modern resume template with clean typography, skills section, and professional photo placeholder',
      'cover-letters': 'professional cover letter on premium paper with elegant formatting',
      'pitch-decks': 'presentation slides on laptop screen showing business pitch with charts and visuals',
      'contracts': 'legal contract document with signature lines and professional formatting'
    },
    colors: 'sophisticated gray and silver gradient background',
    style: 'professional, elegant, corporate'
  },
  'ai-powered': {
    basePrompt: 'futuristic AI interface with neural network visualizations',
    subcategories: {
      'ai-prompts': 'AI chat interface with prompt suggestions, response preview, and optimization tips',
      'ai-workflows': 'automation workflow diagram with AI nodes, triggers, and action connections',
      'ai-outreach': 'AI-powered outreach dashboard with personalization engine and response analytics',
      'ai-content-engines': 'AI content generation interface with multiple output formats and quality controls'
    },
    colors: 'deep indigo and electric blue gradient background with subtle glow effects',
    style: 'futuristic, high-tech, AI-powered, glowing accents'
  }
};

// Brand style guidelines for all images
const brandStyleGuide = `
Ultra high-resolution product thumbnail for a premium SaaS template marketplace called ToolForgeHQ.
Style: Modern, clean, professional SaaS aesthetic.
Lighting: Soft, premium lighting with subtle shadows.
Colors: Blue and purple gradient accents matching the ToolForgeHQ brand.
Quality: Photorealistic, high-end marketing quality.
Important: NO large text or titles in the image. NO watermarks. NO logos. Small UI labels and icons are acceptable.
The image should look like it belongs on a top-tier template marketplace like Creative Market or Gumroad.
`;

/**
 * Generate a detailed prompt for DALL-E based on template metadata
 */
function generatePrompt(template, categoryConfig) {
  const subcategoryPrompt = categoryConfig.subcategories[template.subcategory] || categoryConfig.basePrompt;
  
  const prompt = `${brandStyleGuide}

Template: "${template.name}"
Category: ${template.category}

Visual concept: ${subcategoryPrompt}
Background: ${categoryConfig.colors}
Overall style: ${categoryConfig.style}

The image should represent a digital template product for ${template.shortDescription.toLowerCase()}
Show the template concept visually without any large text overlays.
Make it look premium, professional, and worth purchasing.`;

  return prompt.trim();
}

/**
 * Call OpenAI DALL-E 3 API to generate an image
 */
async function generateImage(prompt, apiKey) {
  return new Promise((resolve, reject) => {
    const requestBody = JSON.stringify({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: IMAGE_SIZE,
      quality: IMAGE_QUALITY,
      style: IMAGE_STYLE,
      response_format: 'url'
    });

    const options = {
      hostname: 'api.openai.com',
      port: 443,
      path: '/v1/images/generations',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(requestBody)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.error) {
            reject(new Error(response.error.message));
          } else if (response.data && response.data[0]) {
            resolve(response.data[0].url);
          } else {
            reject(new Error('Unexpected API response format'));
          }
        } catch (e) {
          reject(new Error(`Failed to parse API response: ${e.message}`));
        }
      });
    });

    req.on('error', reject);
    req.write(requestBody);
    req.end();
  });
}

/**
 * Download an image from a URL and save it locally
 */
async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Follow redirect
        https.get(response.headers.location, (redirectResponse) => {
          redirectResponse.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve();
          });
        }).on('error', reject);
      } else {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      }
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // Delete partial file
      reject(err);
    });
  });
}

/**
 * Check if a preview image already exists for a template
 */
function previewExists(templateId) {
  const pngPath = path.join(PREVIEWS_DIR, `${templateId}.png`);
  const jpgPath = path.join(PREVIEWS_DIR, `${templateId}.jpg`);
  return fs.existsSync(pngPath) || fs.existsSync(jpgPath);
}

/**
 * Main function to generate all missing preview images
 */
async function main() {
  console.log('='.repeat(60));
  console.log('ToolForgeHQ AI Preview Image Generator');
  console.log('='.repeat(60));
  console.log('');

  // Check for API key
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey && !dryRun) {
    console.error('ERROR: OPENAI_API_KEY environment variable is required.');
    console.error('');
    console.error('Set it by running:');
    console.error('  export OPENAI_API_KEY=sk-your-key-here');
    console.error('');
    console.error('Or run with --dry-run to see what would be generated.');
    process.exit(1);
  }

  // Ensure previews directory exists
  if (!fs.existsSync(PREVIEWS_DIR)) {
    fs.mkdirSync(PREVIEWS_DIR, { recursive: true });
  }

  // Load templates
  console.log('Loading templates from:', TEMPLATES_JSON_PATH);
  const templatesData = JSON.parse(fs.readFileSync(TEMPLATES_JSON_PATH, 'utf8'));
  const templates = templatesData.templates;
  console.log(`Found ${templates.length} templates.`);
  console.log('');

  // Filter templates that need preview generation
  let templatesToProcess = templates.filter(t => {
    if (forceRegenerate) return true;
    return !previewExists(t.id);
  });

  if (limit < Infinity) {
    templatesToProcess = templatesToProcess.slice(0, limit);
  }

  console.log(`Templates to process: ${templatesToProcess.length}`);
  if (forceRegenerate) console.log('(--force flag: regenerating all)');
  if (dryRun) console.log('(--dry-run flag: no API calls will be made)');
  if (limit < Infinity) console.log(`(--limit=${limit}: processing only ${limit} templates)`);
  console.log('');

  if (templatesToProcess.length === 0) {
    console.log('All templates already have preview images. Nothing to do.');
    console.log('Use --force to regenerate all images.');
    return;
  }

  // Process each template
  let successCount = 0;
  let errorCount = 0;
  const updatedTemplates = [...templates];

  for (let i = 0; i < templatesToProcess.length; i++) {
    const template = templatesToProcess[i];
    const progress = `[${i + 1}/${templatesToProcess.length}]`;
    
    console.log(`${progress} Processing: ${template.name}`);
    console.log(`    Category: ${template.category} / ${template.subcategory}`);

    // Get category config
    const categoryConfig = categoryVisualConcepts[template.category];
    if (!categoryConfig) {
      console.log(`    WARNING: No visual config for category "${template.category}". Skipping.`);
      errorCount++;
      continue;
    }

    // Generate prompt
    const prompt = generatePrompt(template, categoryConfig);
    
    if (dryRun) {
      console.log('    Prompt preview (first 200 chars):');
      console.log(`    "${prompt.substring(0, 200)}..."`);
      console.log('    [DRY RUN - Skipping API call]');
      console.log('');
      continue;
    }

    try {
      // Generate image via API
      console.log('    Generating image via DALL-E 3...');
      const imageUrl = await generateImage(prompt, apiKey);
      
      // Download and save image
      const imagePath = path.join(PREVIEWS_DIR, `${template.id}.png`);
      console.log('    Downloading image...');
      await downloadImage(imageUrl, imagePath);
      
      // Update template in array
      const templateIndex = updatedTemplates.findIndex(t => t.id === template.id);
      if (templateIndex !== -1) {
        updatedTemplates[templateIndex].previewUrl = `/previews/${template.id}.png`;
        updatedTemplates[templateIndex].previewImage = `/previews/${template.id}.png`;
        updatedTemplates[templateIndex].image = `/previews/${template.id}.png`;
      }
      
      console.log(`    SUCCESS: Saved to ${imagePath}`);
      successCount++;
      
      // Rate limiting - wait 1 second between requests to avoid hitting API limits
      if (i < templatesToProcess.length - 1) {
        console.log('    Waiting 1s before next request...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.log(`    ERROR: ${error.message}`);
      errorCount++;
    }
    
    console.log('');
  }

  // Save updated templates.json
  if (!dryRun && successCount > 0) {
    console.log('Saving updated templates.json...');
    templatesData.templates = updatedTemplates;
    fs.writeFileSync(TEMPLATES_JSON_PATH, JSON.stringify(templatesData, null, 2));
    console.log('Done!');
  }

  // Summary
  console.log('');
  console.log('='.repeat(60));
  console.log('Summary');
  console.log('='.repeat(60));
  console.log(`Total processed: ${templatesToProcess.length}`);
  console.log(`Successful: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
  if (dryRun) {
    console.log('');
    console.log('This was a dry run. No images were generated.');
    console.log('Remove --dry-run to generate images.');
  }
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

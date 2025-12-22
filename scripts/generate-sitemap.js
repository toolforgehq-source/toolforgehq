import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://toolforgehq.com';

// Read templates and bundles data
const templatesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/data/templates.json'), 'utf-8')
);
const bundlesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/data/bundles.json'), 'utf-8')
);

const templates = templatesData.templates;
const bundles = bundlesData.bundles;

// Static pages
const staticPages = [
  { url: '/', priority: '1.0', changefreq: 'weekly' },
  { url: '/templates', priority: '0.9', changefreq: 'weekly' },
  { url: '/bundles', priority: '0.9', changefreq: 'weekly' },
  { url: '/how-it-works', priority: '0.7', changefreq: 'monthly' },
  { url: '/about', priority: '0.5', changefreq: 'monthly' },
  { url: '/contact', priority: '0.5', changefreq: 'monthly' },
  { url: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { url: '/terms', priority: '0.3', changefreq: 'yearly' },
];

// Generate sitemap XML
function generateSitemap() {
  const today = new Date().toISOString().split('T')[0];
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  // Add static pages
  for (const page of staticPages) {
    xml += `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  }

  // Add template pages
  for (const template of templates) {
    if (!template.comingSoon) {
      xml += `  <url>
    <loc>${SITE_URL}/templates/${template.id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    }
  }

  // Add bundle pages
  for (const bundle of bundles) {
    xml += `  <url>
    <loc>${SITE_URL}/bundles/${bundle.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
  }

  xml += `</urlset>`;

  // Write sitemap to public folder
  fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), xml);
  console.log(`Sitemap generated with ${staticPages.length + templates.filter(t => !t.comingSoon).length + bundles.length} URLs`);
}

generateSitemap();

const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { createCanvas } = require('canvas');
const archiver = require('archiver');

// Paths
const TEMPLATES_JSON = path.join(__dirname, '../src/data/templates.json');
const TEMPLATES_DIR = path.join(__dirname, '../public/templates');
const PREVIEWS_DIR = path.join(__dirname, '../public/previews');

// Category colors
const CATEGORY_COLORS = {
  'social-media': '#3B82F6',
  'business-marketing': '#10B981',
  'real-estate': '#F59E0B',
  'ecommerce': '#8B5CF6',
  'productivity': '#14B8A6',
  'professional-docs': '#6B7280',
  'ai-powered': '#6366F1'
};

// Generate preview image
function generatePreviewImage(templateId, title, categoryColor) {
  const canvas = createCanvas(1000, 1000);
  const ctx = canvas.getContext('2d');

  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, 1000, 1000);
  gradient.addColorStop(0, categoryColor);
  gradient.addColorStop(1, adjustBrightness(categoryColor, -20));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1000, 1000);

  // Add subtle pattern
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 20; j++) {
      if ((i + j) % 2 === 0) {
        ctx.fillRect(i * 50, j * 50, 50, 50);
      }
    }
  }

  // Title background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(0, 350, 1000, 300);

  // Title text
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Word wrap title
  const words = title.split(' ');
  const lines = [];
  let currentLine = words[0];
  
  ctx.font = 'bold 60px Arial';
  for (let i = 1; i < words.length; i++) {
    const testLine = currentLine + ' ' + words[i];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > 900) {
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine);

  // Draw lines
  const lineHeight = 70;
  const startY = 500 - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, i) => {
    ctx.fillText(line, 500, startY + i * lineHeight);
  });

  // Premium badge
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(50, 50, 200, 60);
  ctx.fillStyle = categoryColor;
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('PREMIUM', 70, 85);

  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(PREVIEWS_DIR, `${templateId}.png`), buffer);
  console.log(`✓ Generated preview: ${templateId}.png`);
}

// Helper to adjust color brightness
function adjustBrightness(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255))
    .toString(16).slice(1);
}

// Generate PDF for social media templates
function generateSocialMediaPDF(templateId, title, content) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'LETTER', margin: 50 });
    const stream = fs.createWriteStream(path.join(TEMPLATES_DIR, `${templateId}.pdf`));
    
    doc.pipe(stream);

    // Title page
    doc.fontSize(32).font('Helvetica-Bold').text(title, { align: 'center' });
    doc.moveDown(2);
    doc.fontSize(14).font('Helvetica').text(content.intro, { align: 'left' });
    doc.moveDown(2);

    // Content sections
    content.sections.forEach((section, idx) => {
      if (idx > 0) doc.addPage();
      
      doc.fontSize(20).font('Helvetica-Bold').text(section.title);
      doc.moveDown(1);
      
      section.items.forEach((item, itemIdx) => {
        doc.fontSize(14).font('Helvetica-Bold').text(`${itemIdx + 1}. ${item.title}`);
        doc.fontSize(11).font('Helvetica').text(item.content, { indent: 20 });
        doc.moveDown(0.5);
        
        if (item.hook) {
          doc.fontSize(10).font('Helvetica-Oblique').text(`Hook: ${item.hook}`, { indent: 20 });
        }
        if (item.cta) {
          doc.fontSize(10).font('Helvetica-Oblique').text(`CTA: ${item.cta}`, { indent: 20 });
        }
        doc.moveDown(1);
      });
    });

    // Tips page
    if (content.tips) {
      doc.addPage();
      doc.fontSize(20).font('Helvetica-Bold').text('Pro Tips');
      doc.moveDown(1);
      content.tips.forEach(tip => {
        doc.fontSize(11).font('Helvetica').text(`• ${tip}`);
        doc.moveDown(0.5);
      });
    }

    doc.end();
    stream.on('finish', () => {
      console.log(`✓ Generated PDF: ${templateId}.pdf`);
      resolve();
    });
    stream.on('error', reject);
  });
}

// Generate PDF for business templates
function generateBusinessPDF(templateId, title, content) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'LETTER', margin: 50 });
    const stream = fs.createWriteStream(path.join(TEMPLATES_DIR, `${templateId}.pdf`));
    
    doc.pipe(stream);

    // Cover page
    doc.fontSize(36).font('Helvetica-Bold').text(title, { align: 'center' });
    doc.moveDown(3);
    doc.fontSize(14).font('Helvetica').text(content.subtitle, { align: 'center' });
    
    // Content pages
    content.sections.forEach((section) => {
      doc.addPage();
      doc.fontSize(22).font('Helvetica-Bold').text(section.title);
      doc.moveDown(1);
      
      if (section.description) {
        doc.fontSize(11).font('Helvetica').text(section.description);
        doc.moveDown(1);
      }
      
      section.content.forEach(item => {
        if (item.heading) {
          doc.fontSize(14).font('Helvetica-Bold').text(item.heading);
          doc.moveDown(0.5);
        }
        doc.fontSize(11).font('Helvetica').text(item.text, { indent: item.heading ? 20 : 0 });
        doc.moveDown(0.5);
      });
    });

    doc.end();
    stream.on('finish', () => {
      console.log(`✓ Generated PDF: ${templateId}.pdf`);
      resolve();
    });
    stream.on('error', reject);
  });
}

// Generate ZIP for template packs
function generateZIP(templateId, files) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(path.join(TEMPLATES_DIR, `${templateId}.zip`));
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      console.log(`✓ Generated ZIP: ${templateId}.zip (${archive.pointer()} bytes)`);
      resolve();
    });

    archive.on('error', reject);
    archive.pipe(output);

    files.forEach(file => {
      archive.append(file.content, { name: file.name });
    });

    archive.finalize();
  });
}

// Template content generators
const TEMPLATE_SPECS = [
  // SOCIAL MEDIA - Instagram Posts (5 templates)
  {
    id: 'instagram-posts-fitness',
    name: 'Instagram Posts Pack - Fitness & Wellness',
    category: 'social-media',
    subcategory: 'instagram-posts',
    priceCents: 2900,
    shortDescription: '20 high-engagement Instagram posts for fitness coaches and wellness brands.',
    fullDescription: 'Transform your fitness Instagram with 20 professionally crafted posts covering workout tips, nutrition advice, motivation, and client transformations. Each post includes caption, hashtags, and engagement prompts.',
    tags: ['instagram', 'fitness', 'wellness', 'social-media'],
    featured: true,
    type: 'pdf',
    content: {
      intro: 'This pack includes 20 ready-to-post Instagram captions designed specifically for fitness coaches, personal trainers, and wellness brands. Each post is crafted to drive engagement, build community, and showcase your expertise.',
      sections: [
        {
          title: 'Workout Tips & Form Guides',
          items: [
            {
              title: 'Perfect Squat Form',
              content: 'Master the squat with these 5 key form cues that will transform your leg day. Swipe to see common mistakes and how to fix them.',
              hook: '🚨 Stop squatting wrong!',
              cta: 'Save this for your next leg day 💪'
            },
            {
              title: 'Upper Body Burnout',
              content: 'Try this 15-minute upper body circuit that requires zero equipment. Perfect for busy days when you can\'t make it to the gym.',
              hook: 'No gym? No problem.',
              cta: 'Drop a 💪 if you\'re trying this today!'
            },
            {
              title: 'Core Stability Secrets',
              content: 'Your core is more than just abs. Here are 3 exercises that build true core strength and stability for everyday movement.',
              hook: 'Abs are made in the gym, revealed in the kitchen... but built with these exercises.',
              cta: 'Which one are you adding to your routine?'
            },
            {
              title: 'Mobility Monday',
              content: 'Start your week right with this 10-minute mobility flow. Your joints will thank you, and your workouts will feel better.',
              hook: 'Feeling stiff? This will change everything.',
              cta: 'Comment FLOW for the full video tutorial'
            }
          ]
        },
        {
          title: 'Nutrition & Wellness',
          items: [
            {
              title: 'Protein Myths Debunked',
              content: 'Let\'s talk about protein. You don\'t need to eat chicken and rice 6 times a day. Here are 5 protein myths that need to die.',
              hook: 'Unpopular opinion: You\'re overthinking protein.',
              cta: 'Which myth surprised you most? 👇'
            },
            {
              title: 'Pre-Workout Fuel',
              content: 'What you eat before training matters. Here\'s my go-to pre-workout meal that gives me energy without feeling heavy.',
              hook: 'Stop training on an empty stomach.',
              cta: 'What\'s your favorite pre-workout meal?'
            },
            {
              title: 'Hydration Hacks',
              content: 'You\'re probably not drinking enough water. Here are 5 simple ways to increase your daily water intake without thinking about it.',
              hook: 'Dehydrated = Underperforming',
              cta: 'Save this and drink more water today 💧'
            },
            {
              title: 'Recovery Nutrition',
              content: 'The post-workout window is real, but not how you think. Here\'s what actually matters for recovery nutrition.',
              hook: 'You don\'t need a protein shake immediately after training.',
              cta: 'Questions? Drop them below 👇'
            }
          ]
        },
        {
          title: 'Motivation & Mindset',
          items: [
            {
              title: 'Progress Over Perfection',
              content: 'You don\'t need to be perfect. You just need to be consistent. Here\'s why showing up matters more than having the perfect workout.',
              hook: 'Consistency > Intensity',
              cta: 'Tag someone who needs to hear this'
            },
            {
              title: 'Overcoming Plateaus',
              content: 'Hit a plateau? Here are 5 strategies to break through when progress stalls. Sometimes you need to change the approach, not work harder.',
              hook: 'Stuck? Try this.',
              cta: 'Which strategy will you try first?'
            },
            {
              title: 'Rest Day Mindset',
              content: 'Rest days aren\'t lazy days. They\'re when your body actually gets stronger. Here\'s how to embrace rest without guilt.',
              hook: 'Rest is productive.',
              cta: 'How do you spend your rest days?'
            },
            {
              title: 'Starting Your Journey',
              content: 'New to fitness? Start here. These 3 principles will carry you further than any trendy workout program.',
              hook: 'Beginners: Read this first.',
              cta: 'Save this for later 📌'
            }
          ]
        },
        {
          title: 'Client Success Stories',
          items: [
            {
              title: 'Transformation Tuesday',
              content: 'Meet [Client Name] who lost 30 pounds in 6 months. But the real transformation? Her confidence and energy levels. Swipe to see her journey.',
              hook: 'This is what dedication looks like.',
              cta: 'Drop a 🔥 to celebrate her progress!'
            },
            {
              title: 'Strength Gains',
              content: '[Client Name] couldn\'t do a single push-up 3 months ago. Yesterday she did 20. This is why we celebrate non-scale victories.',
              hook: 'The scale doesn\'t tell the whole story.',
              cta: 'What\'s your biggest non-scale victory?'
            },
            {
              title: 'Lifestyle Change',
              content: 'This client didn\'t just lose weight. She gained a lifestyle she loves. Here\'s what made the difference in her journey.',
              hook: 'It\'s not about the diet. It\'s about the lifestyle.',
              cta: 'Ready to start your journey? Link in bio.'
            },
            {
              title: 'Consistency Wins',
              content: '6 months of showing up. No perfection, just consistency. Here\'s what happened when [Client Name] committed to the process.',
              hook: 'Small steps. Big results.',
              cta: 'Who\'s ready to commit? 🙋‍♀️'
            }
          ]
        },
        {
          title: 'Community & Engagement',
          items: [
            {
              title: 'Question Time',
              content: 'Drop your fitness questions below and I\'ll answer them in my stories today. Nothing is off limits!',
              hook: 'Ask me anything about fitness.',
              cta: 'Comment your questions 👇'
            },
            {
              title: 'This or That',
              content: 'Morning workouts or evening workouts? Comment your preference and why. Let\'s settle this debate once and for all.',
              hook: 'The great debate:',
              cta: 'Vote in the comments! 🗳️'
            },
            {
              title: 'Weekend Challenge',
              content: 'This weekend\'s challenge: 100 squats, 50 push-ups, 1-minute plank. Break it up however you want. Who\'s in?',
              hook: 'Weekend Warrior Challenge',
              cta: 'Comment DONE when you finish!'
            },
            {
              title: 'Favorite Exercise',
              content: 'What\'s one exercise you absolutely love? And one you absolutely hate? I\'ll go first in the comments.',
              hook: 'Let\'s talk exercises.',
              cta: 'Drop your answers below 👇'
            }
          ]
        }
      ],
      tips: [
        'Post consistently at the same times when your audience is most active',
        'Use 20-30 relevant hashtags mixing popular and niche tags',
        'Respond to comments within the first hour to boost engagement',
        'Save high-performing posts and repurpose them with fresh angles',
        'Use Stories to drive traffic to your feed posts',
        'Include clear calls-to-action in every caption',
        'Mix educational, motivational, and personal content',
        'Use carousel posts for higher engagement rates'
      ]
    }
  }
];

// Main generation function
async function generateTemplate(spec) {
  console.log(`\nGenerating: ${spec.name}`);
  
  // Generate preview image
  const categoryColor = CATEGORY_COLORS[spec.category];
  generatePreviewImage(spec.id, spec.name, categoryColor);
  
  // Generate content file
  if (spec.type === 'pdf') {
    if (spec.category === 'social-media') {
      await generateSocialMediaPDF(spec.id, spec.name, spec.content);
    } else if (spec.category === 'business-marketing') {
      await generateBusinessPDF(spec.id, spec.name, spec.content);
    }
  } else if (spec.type === 'zip') {
    await generateZIP(spec.id, spec.files);
  }
  
  // Return template metadata
  return {
    id: spec.id,
    name: spec.name,
    shortDescription: spec.shortDescription,
    fullDescription: spec.fullDescription,
    category: spec.category,
    subcategory: spec.subcategory,
    priceCents: spec.priceCents,
    comingSoon: false,
    image: `/previews/${spec.id}.png`,
    previewImage: `/previews/${spec.id}.png`,
    downloadUrl: `/templates/${spec.id}.${spec.type === 'zip' ? 'zip' : 'pdf'}`,
    whatsIncluded: spec.whatsIncluded || [
      'Full template file',
      'Usage instructions',
      'Customization guide',
      'Pro tips and best practices'
    ],
    whoItsFor: spec.whoItsFor || [
      'Content creators',
      'Business owners',
      'Marketing professionals',
      'Entrepreneurs'
    ],
    faqs: spec.faqs || [
      {
        question: 'What format is this template?',
        answer: `This template is delivered as a ${spec.type === 'zip' ? 'ZIP file containing multiple files' : 'PDF document'}.`
      },
      {
        question: 'Can I customize this template?',
        answer: 'Yes! All templates are fully customizable to match your brand and needs.'
      },
      {
        question: 'Do I get updates?',
        answer: 'Yes, you get lifetime access and all future updates for free.'
      }
    ],
    tags: spec.tags,
    createdAt: new Date().toISOString(),
    featured: spec.featured || false
  };
}

// Main execution
async function main() {
  console.log('🚀 Starting template generation...\n');
  
  // Load existing templates.json
  const templatesData = JSON.parse(fs.readFileSync(TEMPLATES_JSON, 'utf8'));
  
  // Generate all templates
  const newTemplates = [];
  for (const spec of TEMPLATE_SPECS) {
    const template = await generateTemplate(spec);
    newTemplates.push(template);
  }
  
  // Update templates.json
  templatesData.templates = [...templatesData.templates, ...newTemplates];
  fs.writeFileSync(TEMPLATES_JSON, JSON.stringify(templatesData, null, 2));
  
  console.log(`\n✅ Generated ${newTemplates.length} templates successfully!`);
  console.log(`📦 Total templates in catalog: ${templatesData.templates.length}`);
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { generateTemplate, TEMPLATE_SPECS };

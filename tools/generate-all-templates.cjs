const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { createCanvas } = require('canvas');
const { ALL_TEMPLATES } = require('./template-specs.cjs');

// Paths
const TEMPLATES_JSON = path.join(__dirname, '../src/data/templates.json');
const TEMPLATES_DIR = path.join(__dirname, '../public/templates');
const PREVIEWS_DIR = path.join(__dirname, '../public/previews');

// Ensure directories exist
if (!fs.existsSync(TEMPLATES_DIR)) fs.mkdirSync(TEMPLATES_DIR, { recursive: true });
if (!fs.existsSync(PREVIEWS_DIR)) fs.mkdirSync(PREVIEWS_DIR, { recursive: true });

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

// Category names for display
const CATEGORY_NAMES = {
  'social-media': 'Social Media',
  'business-marketing': 'Business & Marketing',
  'real-estate': 'Real Estate',
  'ecommerce': 'E-Commerce',
  'productivity': 'Productivity',
  'professional-docs': 'Professional Documents',
  'ai-powered': 'AI-Powered'
};

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

// Generate preview image
function generatePreviewImage(templateId, title, category) {
  const canvas = createCanvas(1000, 1000);
  const ctx = canvas.getContext('2d');
  const categoryColor = CATEGORY_COLORS[category] || '#4F46E5';

  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, 1000, 1000);
  gradient.addColorStop(0, categoryColor);
  gradient.addColorStop(1, adjustBrightness(categoryColor, -30));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1000, 1000);

  // Add subtle pattern
  ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 20; j++) {
      if ((i + j) % 2 === 0) {
        ctx.fillRect(i * 50, j * 50, 50, 50);
      }
    }
  }

  // Decorative elements
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(100, 100, 80, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(900, 900, 120, 0, Math.PI * 2);
  ctx.stroke();

  // Title background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fillRect(0, 350, 1000, 300);

  // Category label
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.font = 'bold 24px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(CATEGORY_NAMES[category] || category.toUpperCase(), 500, 400);

  // Title text with word wrap
  const words = title.split(' ');
  const lines = [];
  let currentLine = words[0];
  
  ctx.font = 'bold 52px Arial, sans-serif';
  for (let i = 1; i < words.length; i++) {
    const testLine = currentLine + ' ' + words[i];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > 850) {
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine);

  // Draw title lines
  ctx.fillStyle = '#FFFFFF';
  const lineHeight = 60;
  const startY = 500 - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, i) => {
    ctx.fillText(line, 500, startY + i * lineHeight);
  });

  // Premium badge
  ctx.fillStyle = '#FFFFFF';
  roundRect(ctx, 40, 40, 180, 50, 8);
  ctx.fill();
  ctx.fillStyle = categoryColor;
  ctx.font = 'bold 22px Arial, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('PREMIUM', 65, 72);

  // ToolForgeHQ watermark
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = '18px Arial, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('ToolForgeHQ', 960, 970);

  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(PREVIEWS_DIR, `${templateId}.png`), buffer);
}

// Helper for rounded rectangles
function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// Content generators for different template types
const CONTENT_GENERATORS = {
  'social-media': generateSocialMediaContent,
  'business-marketing': generateBusinessContent,
  'ai-powered': generateAIContent,
  'real-estate': generateRealEstateContent,
  'ecommerce': generateEcommerceContent,
  'productivity': generateProductivityContent,
  'professional-docs': generateProfessionalContent
};

function generateSocialMediaContent(spec) {
  const sections = [];
  
  if (spec.subcategory === 'instagram-posts') {
    sections.push({
      title: 'Instagram Post Templates',
      content: generateInstagramPosts(spec)
    });
  } else if (spec.subcategory === 'tiktok-scripts') {
    sections.push({
      title: 'TikTok Video Scripts',
      content: generateTikTokScripts(spec)
    });
  } else if (spec.subcategory === 'reels-scripts') {
    sections.push({
      title: 'Instagram Reels Scripts',
      content: generateReelsScripts(spec)
    });
  } else if (spec.subcategory === 'carousel-templates') {
    sections.push({
      title: 'Carousel Post Templates',
      content: generateCarouselTemplates(spec)
    });
  } else if (spec.subcategory === 'youtube-shorts') {
    sections.push({
      title: 'YouTube Shorts Scripts',
      content: generateYouTubeShortsScripts(spec)
    });
  }
  
  return sections;
}

function generateInstagramPosts(spec) {
  const posts = [];
  const topics = getTopicsForNiche(spec.id);
  
  for (let i = 0; i < 20; i++) {
    posts.push({
      number: i + 1,
      title: `Post ${i + 1}: ${topics[i % topics.length]}`,
      hook: generateHook(topics[i % topics.length]),
      caption: generateCaption(topics[i % topics.length], spec.id),
      hashtags: generateHashtags(spec.id),
      cta: generateCTA()
    });
  }
  return posts;
}

function generateTikTokScripts(spec) {
  const scripts = [];
  const topics = getTopicsForNiche(spec.id);
  
  for (let i = 0; i < 15; i++) {
    scripts.push({
      number: i + 1,
      title: `Script ${i + 1}: ${topics[i % topics.length]}`,
      hook: `[0-3 seconds] ${generateVideoHook(topics[i % topics.length])}`,
      body: generateScriptBody(topics[i % topics.length]),
      cta: `[Final 3 seconds] ${generateVideoCTA()}`,
      duration: '15-60 seconds',
      audioSuggestion: 'Trending audio or original sound'
    });
  }
  return scripts;
}

function generateReelsScripts(spec) {
  const scripts = [];
  const topics = getTopicsForNiche(spec.id);
  
  for (let i = 0; i < 15; i++) {
    scripts.push({
      number: i + 1,
      title: `Reel ${i + 1}: ${topics[i % topics.length]}`,
      hook: generateVideoHook(topics[i % topics.length]),
      content: generateReelContent(topics[i % topics.length]),
      cta: generateVideoCTA(),
      captionIdea: generateCaption(topics[i % topics.length], spec.id)
    });
  }
  return scripts;
}

function generateCarouselTemplates(spec) {
  const carousels = [];
  const topics = getTopicsForNiche(spec.id);
  
  for (let i = 0; i < 10; i++) {
    const slides = [];
    for (let j = 0; j < 8; j++) {
      slides.push({
        slideNumber: j + 1,
        content: generateSlideContent(j, topics[i % topics.length])
      });
    }
    carousels.push({
      number: i + 1,
      title: `Carousel ${i + 1}: ${topics[i % topics.length]}`,
      slides: slides,
      caption: generateCaption(topics[i % topics.length], spec.id)
    });
  }
  return carousels;
}

function generateYouTubeShortsScripts(spec) {
  const scripts = [];
  const topics = getTopicsForNiche(spec.id);
  
  for (let i = 0; i < 15; i++) {
    scripts.push({
      number: i + 1,
      title: `Short ${i + 1}: ${topics[i % topics.length]}`,
      hook: generateVideoHook(topics[i % topics.length]),
      content: generateShortContent(topics[i % topics.length]),
      cta: generateVideoCTA(),
      titleSuggestion: `${topics[i % topics.length]} #shorts`
    });
  }
  return scripts;
}

function generateBusinessContent(spec) {
  const sections = [];
  
  if (spec.subcategory === 'business-plans') {
    sections.push(...generateBusinessPlanSections(spec));
  } else if (spec.subcategory === 'branding-kits') {
    sections.push(...generateBrandingKitSections(spec));
  } else if (spec.subcategory === 'email-sequences') {
    sections.push(...generateEmailSequenceSections(spec));
  } else if (spec.subcategory === 'sales-funnels') {
    sections.push(...generateSalesFunnelSections(spec));
  }
  
  return sections;
}

function generateBusinessPlanSections(spec) {
  return [
    {
      title: 'Executive Summary',
      content: 'Your executive summary should capture the essence of your business in 1-2 pages. Include your mission statement, business concept, target market, competitive advantage, financial highlights, and funding requirements. This section is often written last but appears first.'
    },
    {
      title: 'Company Description',
      content: 'Describe your business structure, history, location, and the problem you solve. Explain your unique value proposition and what sets you apart from competitors. Include your vision for the future and key milestones achieved.'
    },
    {
      title: 'Market Analysis',
      content: 'Present your research on industry trends, target market demographics, market size, and growth potential. Include competitor analysis with strengths and weaknesses. Identify market gaps and opportunities your business will address.'
    },
    {
      title: 'Products & Services',
      content: 'Detail your offerings, pricing strategy, and product lifecycle. Explain the benefits to customers and any intellectual property. Include future product development plans and how you will stay competitive.'
    },
    {
      title: 'Marketing Strategy',
      content: 'Outline your marketing channels, customer acquisition strategy, and brand positioning. Include your sales process, partnerships, and customer retention plans. Detail your marketing budget and expected ROI.'
    },
    {
      title: 'Operations Plan',
      content: 'Describe your business operations, supply chain, facilities, and technology requirements. Include quality control measures, key suppliers, and operational milestones. Detail any regulatory requirements.'
    },
    {
      title: 'Management Team',
      content: 'Introduce key team members with their backgrounds and roles. Highlight relevant experience and expertise. Include advisors, board members, and hiring plans for key positions.'
    },
    {
      title: 'Financial Projections',
      content: 'Present 3-5 year financial forecasts including revenue projections, expense budgets, cash flow statements, and break-even analysis. Include assumptions and key financial metrics investors care about.'
    }
  ];
}

function generateBrandingKitSections(spec) {
  return [
    {
      title: 'Brand Foundation',
      content: 'Define your brand mission, vision, and core values. Articulate your brand promise and what you stand for. This foundation guides all branding decisions.'
    },
    {
      title: 'Brand Voice & Tone',
      content: 'Establish how your brand communicates. Define your voice attributes (professional, friendly, authoritative, playful). Provide examples of do\'s and don\'ts for written communication.'
    },
    {
      title: 'Visual Identity',
      content: 'Document your logo usage guidelines, color palette with hex codes, typography selections, and imagery style. Include spacing rules and minimum sizes for logo reproduction.'
    },
    {
      title: 'Messaging Framework',
      content: 'Create your tagline, elevator pitch, and key messages for different audiences. Include proof points and differentiators that support your positioning.'
    },
    {
      title: 'Application Guidelines',
      content: 'Show how to apply your brand across different touchpoints: website, social media, email, print materials, and presentations. Include templates and examples.'
    }
  ];
}

function generateEmailSequenceSections(spec) {
  const emails = [];
  const count = spec.name.includes('20') ? 20 : spec.name.includes('15') ? 15 : 12;
  
  for (let i = 0; i < count; i++) {
    emails.push({
      title: `Email ${i + 1}`,
      subject: generateEmailSubject(i, spec.id),
      preview: generateEmailPreview(i),
      body: generateEmailBody(i, spec.id),
      cta: generateEmailCTA(i)
    });
  }
  
  return [{
    title: 'Email Sequence',
    emails: emails
  }];
}

function generateSalesFunnelSections(spec) {
  return [
    {
      title: 'Funnel Overview',
      content: 'This funnel framework guides prospects from awareness to purchase. Each stage is designed to build trust, demonstrate value, and move leads closer to conversion.'
    },
    {
      title: 'Stage 1: Awareness',
      content: 'Attract your ideal audience through content marketing, paid ads, and social media. Focus on addressing pain points and establishing expertise. Key metrics: reach, impressions, click-through rate.'
    },
    {
      title: 'Stage 2: Interest',
      content: 'Capture leads with a compelling lead magnet. Deliver immediate value and begin the nurture sequence. Key metrics: opt-in rate, lead quality score.'
    },
    {
      title: 'Stage 3: Consideration',
      content: 'Nurture leads with valuable content, case studies, and social proof. Address objections and build desire for your solution. Key metrics: email engagement, content consumption.'
    },
    {
      title: 'Stage 4: Intent',
      content: 'Present your offer with a compelling sales page or webinar. Use urgency and scarcity appropriately. Key metrics: sales page views, webinar attendance.'
    },
    {
      title: 'Stage 5: Purchase',
      content: 'Optimize your checkout process for conversions. Include order bumps and upsells. Key metrics: conversion rate, average order value.'
    },
    {
      title: 'Stage 6: Retention',
      content: 'Deliver exceptional customer experience. Implement post-purchase sequences and loyalty programs. Key metrics: customer satisfaction, repeat purchase rate.'
    }
  ];
}

function generateAIContent(spec) {
  const sections = [];
  
  if (spec.subcategory === 'ai-prompts') {
    sections.push(...generateAIPromptSections(spec));
  } else if (spec.subcategory === 'ai-workflows') {
    sections.push(...generateAIWorkflowSections(spec));
  } else if (spec.subcategory === 'ai-outreach') {
    sections.push(...generateAIOutreachSections(spec));
  }
  
  return sections;
}

function generateAIPromptSections(spec) {
  const prompts = [];
  const categories = getPromptCategories(spec.id);
  
  categories.forEach((category, catIndex) => {
    const categoryPrompts = [];
    for (let i = 0; i < 15; i++) {
      categoryPrompts.push({
        number: catIndex * 15 + i + 1,
        title: `${category} Prompt ${i + 1}`,
        prompt: generateAIPrompt(category, i),
        customization: 'Replace [brackets] with your specific details',
        example: generatePromptExample(category)
      });
    }
    prompts.push({
      category: category,
      prompts: categoryPrompts
    });
  });
  
  return prompts;
}

function generateAIWorkflowSections(spec) {
  return [
    {
      title: 'Workflow Overview',
      content: 'This AI-powered workflow system automates repetitive tasks while maintaining quality and personalization. Follow each step in sequence for best results.'
    },
    {
      title: 'Step 1: Input Gathering',
      content: 'Collect the necessary inputs for your workflow. Use the provided templates to ensure consistency. AI prompts help you gather comprehensive information.'
    },
    {
      title: 'Step 2: AI Processing',
      content: 'Feed your inputs through the AI prompts provided. Review and refine outputs. Use the quality checklist to ensure standards are met.'
    },
    {
      title: 'Step 3: Human Review',
      content: 'Apply human judgment to AI outputs. Make necessary edits and personalizations. Ensure brand voice and accuracy.'
    },
    {
      title: 'Step 4: Automation Triggers',
      content: 'Set up automation rules to streamline repetitive steps. Use the provided Zapier/Make templates or API integrations.'
    },
    {
      title: 'Step 5: Quality Assurance',
      content: 'Run final checks using the QA checklist. Verify accuracy, tone, and completeness before delivery or publication.'
    }
  ];
}

function generateAIOutreachSections(spec) {
  const templates = [];
  
  for (let i = 0; i < 15; i++) {
    templates.push({
      number: i + 1,
      title: `Outreach Template ${i + 1}`,
      subject: generateOutreachSubject(i, spec.id),
      body: generateOutreachBody(i, spec.id),
      personalization: 'Use AI to research prospect and customize [brackets]',
      followUp: generateFollowUpSequence(i)
    });
  }
  
  return [{
    title: 'Outreach Templates',
    templates: templates
  }];
}

function generateRealEstateContent(spec) {
  const sections = [];
  
  if (spec.subcategory === 'realtor-social') {
    sections.push(...generateRealtorSocialSections(spec));
  } else if (spec.subcategory === 'listing-descriptions') {
    sections.push(...generateListingDescriptionSections(spec));
  } else if (spec.subcategory === 'buyer-guides' || spec.subcategory === 'seller-guides') {
    sections.push(...generateRealEstateGuideSections(spec));
  }
  
  return sections;
}

function generateRealtorSocialSections(spec) {
  const posts = [];
  
  for (let i = 0; i < 20; i++) {
    posts.push({
      number: i + 1,
      type: getRealtorPostType(i),
      caption: generateRealtorCaption(i, spec.id),
      hashtags: generateRealtorHashtags(spec.id),
      visualIdea: generateVisualIdea(i)
    });
  }
  
  return [{
    title: 'Social Media Posts',
    posts: posts
  }];
}

function generateListingDescriptionSections(spec) {
  const descriptions = [];
  
  for (let i = 0; i < 15; i++) {
    descriptions.push({
      number: i + 1,
      type: getPropertyType(i, spec.id),
      headline: generateListingHeadline(i, spec.id),
      description: generateListingDescription(i, spec.id),
      features: generateFeatureHighlights(i),
      cta: 'Schedule your private showing today!'
    });
  }
  
  return [{
    title: 'Listing Description Templates',
    descriptions: descriptions
  }];
}

function generateRealEstateGuideSections(spec) {
  const isBuyer = spec.subcategory === 'buyer-guides';
  
  return [
    {
      title: isBuyer ? 'Getting Started' : 'Preparing to Sell',
      content: isBuyer 
        ? 'Begin your home buying journey by understanding your needs, budget, and timeline. This guide walks you through every step of the process.'
        : 'Selling your home is a significant decision. This guide helps you prepare, price, and market your property for the best possible outcome.'
    },
    {
      title: isBuyer ? 'Financing Your Home' : 'Pricing Your Home',
      content: isBuyer
        ? 'Understand mortgage options, get pre-approved, and know what you can afford. We break down the financing process step by step.'
        : 'Pricing correctly is crucial. Learn how to analyze comparable sales, understand market conditions, and set a competitive price.'
    },
    {
      title: isBuyer ? 'The Search Process' : 'Preparing for Sale',
      content: isBuyer
        ? 'Learn how to search effectively, evaluate properties, and identify the right home for your needs. We cover what to look for and red flags to avoid.'
        : 'Maximize your home\'s appeal with staging tips, repairs to consider, and presentation strategies that attract buyers.'
    },
    {
      title: isBuyer ? 'Making an Offer' : 'Marketing Your Home',
      content: isBuyer
        ? 'Craft a competitive offer, understand contingencies, and navigate negotiations. We guide you through the offer process.'
        : 'Effective marketing reaches qualified buyers. Learn about photography, online listings, open houses, and promotional strategies.'
    },
    {
      title: isBuyer ? 'Under Contract' : 'Showings & Offers',
      content: isBuyer
        ? 'Navigate inspections, appraisals, and the closing process. Know what to expect and how to handle common issues.'
        : 'Handle showings professionally and evaluate offers strategically. We cover negotiation tactics and what to look for in offers.'
    },
    {
      title: 'Closing Day',
      content: 'Understand what happens at closing, what documents you\'ll sign, and how to prepare. We make closing day smooth and stress-free.'
    }
  ];
}

function generateEcommerceContent(spec) {
  const sections = [];
  
  if (spec.subcategory === 'product-descriptions') {
    sections.push(...generateProductDescriptionSections(spec));
  } else if (spec.subcategory === 'shopify-banners' || spec.subcategory === 'upsell-flows') {
    sections.push(...generateEcommerceFlowSections(spec));
  } else if (spec.subcategory === 'influencer-outreach') {
    sections.push(...generateInfluencerOutreachSections(spec));
  }
  
  return sections;
}

function generateProductDescriptionSections(spec) {
  const descriptions = [];
  
  for (let i = 0; i < 20; i++) {
    descriptions.push({
      number: i + 1,
      productType: getProductType(i, spec.id),
      headline: generateProductHeadline(i, spec.id),
      description: generateProductDescription(i, spec.id),
      features: generateProductFeatures(i),
      benefits: generateProductBenefits(i)
    });
  }
  
  return [{
    title: 'Product Description Templates',
    descriptions: descriptions
  }];
}

function generateEcommerceFlowSections(spec) {
  return [
    {
      title: 'Email Flow Overview',
      content: 'These automated email flows work together to maximize customer lifetime value. Implement them in your email platform for hands-off revenue generation.'
    },
    {
      title: 'Welcome Flow',
      content: generateWelcomeFlowEmails()
    },
    {
      title: 'Abandoned Cart Flow',
      content: generateAbandonedCartEmails()
    },
    {
      title: 'Post-Purchase Flow',
      content: generatePostPurchaseEmails()
    },
    {
      title: 'Win-Back Flow',
      content: generateWinBackEmails()
    }
  ];
}

function generateInfluencerOutreachSections(spec) {
  const templates = [];
  
  for (let i = 0; i < 15; i++) {
    templates.push({
      number: i + 1,
      type: getInfluencerOutreachType(i),
      subject: generateInfluencerSubject(i),
      body: generateInfluencerBody(i),
      followUp: generateInfluencerFollowUp(i)
    });
  }
  
  return [{
    title: 'Influencer Outreach Templates',
    templates: templates
  }];
}

function generateProductivityContent(spec) {
  const sections = [];
  
  if (spec.subcategory === 'planners') {
    sections.push(...generatePlannerSections(spec));
  } else if (spec.subcategory === 'habit-trackers' || spec.subcategory === 'budget-trackers' || spec.subcategory === 'content-planners') {
    sections.push(...generateTrackerSections(spec));
  }
  
  return sections;
}

function generatePlannerSections(spec) {
  return [
    {
      title: 'Vision & Goals',
      content: 'Start with the big picture. Define your vision, set meaningful goals, and create a roadmap for achievement. Use the provided worksheets to clarify your direction.'
    },
    {
      title: 'Quarterly Planning',
      content: 'Break down annual goals into quarterly objectives. Set 3-5 key results for each quarter. Review and adjust as needed.'
    },
    {
      title: 'Monthly Focus',
      content: 'Each month, identify your top priorities. Plan key projects and milestones. Schedule important tasks and deadlines.'
    },
    {
      title: 'Weekly Planning',
      content: 'Weekly planning sessions keep you on track. Review the past week, plan the upcoming week, and ensure alignment with larger goals.'
    },
    {
      title: 'Daily Execution',
      content: 'Daily pages help you prioritize tasks, track time, and maintain focus. Use the provided templates for maximum productivity.'
    },
    {
      title: 'Review & Reflection',
      content: 'Regular reviews drive improvement. Use the reflection prompts to assess progress, celebrate wins, and identify areas for growth.'
    }
  ];
}

function generateTrackerSections(spec) {
  return [
    {
      title: 'Getting Started',
      content: 'This tracker helps you build consistency and measure progress. Start by identifying what you want to track and why it matters.'
    },
    {
      title: 'Setting Up Your Tracker',
      content: 'Customize the tracker for your specific needs. Define your metrics, set your targets, and establish your tracking rhythm.'
    },
    {
      title: 'Daily Tracking',
      content: 'Consistent daily tracking builds awareness and accountability. Use the provided templates to make tracking quick and easy.'
    },
    {
      title: 'Weekly Review',
      content: 'Weekly reviews help you spot patterns and make adjustments. Analyze your data and plan improvements.'
    },
    {
      title: 'Monthly Analysis',
      content: 'Monthly analysis reveals trends and progress. Use the provided frameworks to assess your results and set new targets.'
    }
  ];
}

function generateProfessionalContent(spec) {
  const sections = [];
  
  if (spec.subcategory === 'resumes') {
    sections.push(...generateResumeSections(spec));
  } else if (spec.subcategory === 'pitch-decks') {
    sections.push(...generatePitchDeckSections(spec));
  }
  
  return sections;
}

function generateResumeSections(spec) {
  return [
    {
      title: 'Resume Template',
      content: 'This ATS-optimized resume template helps you present your experience effectively. Follow the structure and customize with your information.'
    },
    {
      title: 'Contact Information',
      content: 'Include your name, phone, email, LinkedIn URL, and location (city, state). Keep it professional and easy to read.'
    },
    {
      title: 'Professional Summary',
      content: '2-3 sentences highlighting your experience, key skills, and what you bring to the role. Tailor this for each application.'
    },
    {
      title: 'Experience Section',
      content: 'List positions in reverse chronological order. Use action verbs and quantify achievements. Focus on results and impact.'
    },
    {
      title: 'Skills Section',
      content: 'Include relevant technical and soft skills. Match keywords from job descriptions. Organize by category if needed.'
    },
    {
      title: 'Education & Certifications',
      content: 'List degrees, certifications, and relevant training. Include graduation dates and honors if recent.'
    }
  ];
}

function generatePitchDeckSections(spec) {
  return [
    {
      title: 'Slide 1: Title',
      content: 'Company name, tagline, and your name/title. Keep it clean and memorable.'
    },
    {
      title: 'Slide 2: Problem',
      content: 'Clearly articulate the problem you solve. Make it relatable and urgent. Use data to quantify the pain.'
    },
    {
      title: 'Slide 3: Solution',
      content: 'Present your solution clearly. Show how it addresses the problem. Keep it simple and compelling.'
    },
    {
      title: 'Slide 4: Market Opportunity',
      content: 'Define your TAM, SAM, and SOM. Show market size and growth potential. Identify your beachhead market.'
    },
    {
      title: 'Slide 5: Product',
      content: 'Demo or screenshots of your product. Highlight key features and benefits. Show the user experience.'
    },
    {
      title: 'Slide 6: Business Model',
      content: 'How you make money. Pricing strategy and unit economics. Path to profitability.'
    },
    {
      title: 'Slide 7: Traction',
      content: 'Key metrics and milestones. Customer logos and testimonials. Growth trajectory.'
    },
    {
      title: 'Slide 8: Competition',
      content: 'Competitive landscape analysis. Your differentiation and moat. Why you win.'
    },
    {
      title: 'Slide 9: Team',
      content: 'Key team members and backgrounds. Relevant experience and expertise. Advisors if notable.'
    },
    {
      title: 'Slide 10: Financials',
      content: 'Revenue projections and key assumptions. Use of funds. Path to key milestones.'
    },
    {
      title: 'Slide 11: The Ask',
      content: 'How much you\'re raising. What you\'ll accomplish with the funds. Timeline and next steps.'
    },
    {
      title: 'Slide 12: Contact',
      content: 'Thank you and contact information. Clear next steps for interested investors.'
    }
  ];
}

// Helper functions for content generation
function getTopicsForNiche(id) {
  const topicSets = {
    'fitness': ['Workout Tips', 'Nutrition Advice', 'Motivation Monday', 'Form Check', 'Recovery Tips', 'Meal Prep', 'Progress Photos', 'Client Wins', 'Myth Busting', 'Quick Workouts', 'Supplement Guide', 'Sleep Tips', 'Hydration', 'Stretching', 'Mindset', 'Goal Setting', 'Accountability', 'Community', 'Challenges', 'Success Stories'],
    'coaching': ['Mindset Shifts', 'Success Habits', 'Client Wins', 'Behind the Scenes', 'Tips & Tricks', 'Motivation', 'Goal Setting', 'Accountability', 'Personal Story', 'Industry Insights', 'Book Recommendations', 'Tool Reviews', 'Q&A', 'Myth Busting', 'Case Studies', 'Testimonials', 'Free Value', 'Challenges', 'Community', 'Announcements'],
    'business': ['Productivity Hacks', 'Money Mindset', 'Entrepreneurship Tips', 'Side Hustle Ideas', 'Marketing Strategies', 'Sales Tips', 'Leadership', 'Team Building', 'Time Management', 'Goal Setting', 'Success Stories', 'Failures & Lessons', 'Industry Trends', 'Tool Reviews', 'Book Summaries', 'Networking', 'Personal Branding', 'Content Strategy', 'Growth Hacks', 'Automation'],
    'default': ['Educational Content', 'Behind the Scenes', 'Tips & Tricks', 'Success Stories', 'Q&A', 'Industry News', 'Tool Reviews', 'Personal Story', 'Motivation', 'Community Spotlight', 'Challenges', 'Tutorials', 'Myth Busting', 'Case Studies', 'Announcements', 'Collaborations', 'User Generated', 'Trends', 'Predictions', 'Celebrations']
  };
  
  for (const [key, topics] of Object.entries(topicSets)) {
    if (id.includes(key)) return topics;
  }
  return topicSets.default;
}

function generateHook(topic) {
  const hooks = [
    `Stop scrolling - this ${topic.toLowerCase()} tip will change everything`,
    `The truth about ${topic.toLowerCase()} nobody talks about`,
    `3 ${topic.toLowerCase()} mistakes you\'re probably making`,
    `Why your ${topic.toLowerCase()} isn\'t working (and how to fix it)`,
    `The ${topic.toLowerCase()} secret top performers know`
  ];
  return hooks[Math.floor(Math.random() * hooks.length)];
}

function generateCaption(topic, id) {
  return `Here's what I've learned about ${topic.toLowerCase()} after years of experience...\n\nThe key insight most people miss is that consistency matters more than perfection. Start where you are, use what you have, and do what you can.\n\nWhat's your biggest challenge with ${topic.toLowerCase()}? Drop a comment below and let's discuss!`;
}

function generateHashtags(id) {
  const base = ['#contentcreator', '#digitalmarketing', '#entrepreneur', '#smallbusiness', '#growthmindset'];
  return base.join(' ');
}

function generateCTA() {
  const ctas = [
    'Save this for later!',
    'Share with someone who needs this',
    'Drop a comment below',
    'Follow for more tips',
    'Link in bio for more'
  ];
  return ctas[Math.floor(Math.random() * ctas.length)];
}

function generateVideoHook(topic) {
  return `Wait - you need to know this about ${topic.toLowerCase()}...`;
}

function generateScriptBody(topic) {
  return `[Main content - 15-45 seconds]\n\nHere's the thing about ${topic.toLowerCase()} that most people get wrong...\n\n[Point 1]: The first mistake is...\n[Point 2]: Instead, you should...\n[Point 3]: The result is...`;
}

function generateVideoCTA() {
  return 'Follow for more tips like this!';
}

function generateReelContent(topic) {
  return `[Visual: Eye-catching opening]\n\n[Text overlay]: "${topic}"\n\n[Content]: Share your key insight in 15-30 seconds\n\n[Transition]: Quick cut to results or proof\n\n[End]: Call to action`;
}

function generateSlideContent(slideNum, topic) {
  const slideTypes = [
    'Hook slide - grab attention',
    'Problem statement',
    'Key insight #1',
    'Key insight #2',
    'Key insight #3',
    'Example or proof',
    'Summary',
    'Call to action'
  ];
  return slideTypes[slideNum] || 'Additional content';
}

function generateShortContent(topic) {
  return `[0-3s] Hook: Attention-grabbing statement about ${topic}\n\n[3-45s] Content: Deliver your main points quickly\n\n[45-60s] CTA: Tell viewers what to do next`;
}

function getPromptCategories(id) {
  if (id.includes('content')) return ['Blog Posts', 'Social Media', 'Email', 'Video Scripts', 'Ads'];
  if (id.includes('business')) return ['Strategy', 'Analysis', 'Planning', 'Operations', 'Growth'];
  if (id.includes('copywriting')) return ['Headlines', 'Sales Pages', 'Emails', 'Ads', 'Landing Pages'];
  if (id.includes('coding')) return ['Code Generation', 'Debugging', 'Documentation', 'Testing', 'Optimization'];
  return ['General', 'Research', 'Writing', 'Analysis', 'Creative'];
}

function generateAIPrompt(category, index) {
  return `Act as an expert in ${category.toLowerCase()}. I need help with [specific task]. \n\nContext: [Provide relevant background]\n\nRequirements:\n- [Requirement 1]\n- [Requirement 2]\n- [Requirement 3]\n\nPlease provide [specific output format].`;
}

function generatePromptExample(category) {
  return `Example output for ${category} prompt...`;
}

function generateEmailSubject(index, id) {
  const subjects = [
    'Welcome to the family!',
    'Here\'s what you need to know...',
    'Quick question for you',
    'Don\'t miss this...',
    'Your exclusive access inside',
    'The secret to success',
    'I made a mistake...',
    'This changed everything',
    'Final reminder',
    'Thank you!'
  ];
  return subjects[index % subjects.length];
}

function generateEmailPreview(index) {
  return 'Preview text that entices opens...';
}

function generateEmailBody(index, id) {
  return `Hi [First Name],\n\n[Opening that connects with the reader]\n\n[Main content delivering value]\n\n[Transition to call-to-action]\n\n[Sign off]\n[Your Name]`;
}

function generateEmailCTA(index) {
  return 'Click here to [action]';
}

function generateOutreachSubject(index, id) {
  return `Quick question about [their company/content]`;
}

function generateOutreachBody(index, id) {
  return `Hi [Name],\n\n[Personalized opening based on research]\n\n[Value proposition]\n\n[Specific ask]\n\n[Sign off]`;
}

function generateFollowUpSequence(index) {
  return 'Follow up in 3 days if no response. Reference original email and add new value.';
}

function getRealtorPostType(index) {
  const types = ['Market Update', 'Just Listed', 'Just Sold', 'Buyer Tips', 'Seller Tips', 'Neighborhood Spotlight', 'Client Testimonial', 'Behind the Scenes', 'Home Maintenance', 'Investment Tips'];
  return types[index % types.length];
}

function generateRealtorCaption(index, id) {
  return `[Real estate focused caption with local market insights, tips, or property highlights. Customize for your market and audience.]`;
}

function generateRealtorHashtags(id) {
  return '#realestate #realtor #homesforsale #dreamhome #househunting';
}

function generateVisualIdea(index) {
  return 'Property photo, market graph, or lifestyle image';
}

function getPropertyType(index, id) {
  if (id.includes('luxury')) return 'Luxury Estate';
  if (id.includes('condo')) return 'Urban Condo';
  if (id.includes('investment')) return 'Investment Property';
  if (id.includes('land')) return 'Development Land';
  return 'Residential Home';
}

function generateListingHeadline(index, id) {
  return `Stunning [Property Type] in [Desirable Location]`;
}

function generateListingDescription(index, id) {
  return `Welcome to this exceptional [property type] offering [key features]. Located in [neighborhood], this home features [highlight 1], [highlight 2], and [highlight 3]. The [room] boasts [feature], while the [area] provides [benefit]. Don't miss this opportunity to own in [location].`;
}

function generateFeatureHighlights(index) {
  return ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4', 'Feature 5'];
}

function getProductType(index, id) {
  if (id.includes('fashion')) return 'Clothing Item';
  if (id.includes('beauty')) return 'Beauty Product';
  if (id.includes('tech')) return 'Tech Gadget';
  if (id.includes('home')) return 'Home Decor';
  if (id.includes('food')) return 'Gourmet Item';
  return 'Product';
}

function generateProductHeadline(index, id) {
  return `[Product Name] - [Key Benefit]`;
}

function generateProductDescription(index, id) {
  return `Discover the [product] that [main benefit]. Crafted with [quality detail], this [product type] delivers [benefit 1], [benefit 2], and [benefit 3]. Perfect for [ideal customer], it features [key feature] that sets it apart.`;
}

function generateProductFeatures(index) {
  return ['Premium materials', 'Expert craftsmanship', 'Versatile design', 'Easy care', 'Satisfaction guaranteed'];
}

function generateProductBenefits(index) {
  return ['Save time', 'Look great', 'Feel confident', 'Get compliments', 'Love the quality'];
}

function generateWelcomeFlowEmails() {
  return [
    { email: 1, subject: 'Welcome! Here\'s your discount...', timing: 'Immediate' },
    { email: 2, subject: 'Our story (and why we started)', timing: 'Day 1' },
    { email: 3, subject: 'Bestsellers you\'ll love', timing: 'Day 3' },
    { email: 4, subject: 'Don\'t forget your discount!', timing: 'Day 5' }
  ];
}

function generateAbandonedCartEmails() {
  return [
    { email: 1, subject: 'Did you forget something?', timing: '1 hour' },
    { email: 2, subject: 'Your cart is waiting...', timing: '24 hours' },
    { email: 3, subject: 'Last chance + free shipping', timing: '72 hours' }
  ];
}

function generatePostPurchaseEmails() {
  return [
    { email: 1, subject: 'Thank you for your order!', timing: 'Immediate' },
    { email: 2, subject: 'Your order has shipped!', timing: 'On shipment' },
    { email: 3, subject: 'How are you enjoying your purchase?', timing: '7 days' },
    { email: 4, subject: 'Leave a review, get a reward', timing: '14 days' }
  ];
}

function generateWinBackEmails() {
  return [
    { email: 1, subject: 'We miss you!', timing: '30 days inactive' },
    { email: 2, subject: 'Here\'s what\'s new...', timing: '45 days' },
    { email: 3, subject: 'Special offer just for you', timing: '60 days' }
  ];
}

function getInfluencerOutreachType(index) {
  const types = ['Initial Outreach', 'Product Gifting', 'Paid Collaboration', 'Affiliate Partnership', 'Brand Ambassador'];
  return types[index % types.length];
}

function generateInfluencerSubject(index) {
  return `Collaboration opportunity with [Brand Name]`;
}

function generateInfluencerBody(index) {
  return `Hi [Influencer Name],\n\n[Personalized compliment about their content]\n\n[Brief brand introduction]\n\n[Collaboration proposal]\n\n[Next steps]\n\nBest,\n[Your Name]`;
}

function generateInfluencerFollowUp(index) {
  return 'Follow up in 5-7 days with additional value or updated offer.';
}

// Generate PDF for a template
function generatePDF(templateId, title, category, sections) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ 
      size: 'LETTER', 
      margin: 50,
      info: {
        Title: title,
        Author: 'ToolForgeHQ',
        Subject: `Premium ${CATEGORY_NAMES[category]} Template`
      }
    });
    
    const stream = fs.createWriteStream(path.join(TEMPLATES_DIR, `${templateId}.pdf`));
    doc.pipe(stream);

    // Cover page
    const categoryColor = CATEGORY_COLORS[category] || '#4F46E5';
    
    doc.rect(0, 0, 612, 150).fill(categoryColor);
    doc.fillColor('#FFFFFF').fontSize(12).text('TOOLFORGEHQ PREMIUM TEMPLATE', 50, 50);
    doc.fontSize(28).font('Helvetica-Bold').text(title, 50, 80, { width: 512 });
    
    doc.fillColor('#333333').moveDown(4);
    doc.fontSize(12).font('Helvetica').text(`Category: ${CATEGORY_NAMES[category]}`, 50);
    doc.moveDown(0.5);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 50);
    doc.moveDown(2);
    
    doc.fontSize(11).text('This premium template is designed to help you achieve your goals faster. Follow the structure provided and customize for your specific needs.', 50, doc.y, { width: 512 });
    
    // Content pages
    if (Array.isArray(sections)) {
      sections.forEach((section, idx) => {
        if (idx > 0 || doc.y > 600) doc.addPage();
        
        doc.fillColor(categoryColor).fontSize(18).font('Helvetica-Bold').text(section.title || section.category || `Section ${idx + 1}`, 50);
        doc.moveDown(0.5);
        
        doc.fillColor('#333333').fontSize(11).font('Helvetica');
        
        if (typeof section.content === 'string') {
          doc.text(section.content, 50, doc.y, { width: 512 });
        } else if (Array.isArray(section.content)) {
          section.content.forEach((item, itemIdx) => {
            if (doc.y > 680) doc.addPage();
            
            if (item.number) {
              doc.font('Helvetica-Bold').text(`${item.number}. ${item.title || item.type || ''}`, 50);
              doc.font('Helvetica');
            }
            
            if (item.hook) doc.text(`Hook: ${item.hook}`, 70, doc.y, { width: 492 });
            if (item.caption) doc.text(`Caption: ${item.caption}`, 70, doc.y, { width: 492 });
            if (item.body) doc.text(`Body: ${item.body}`, 70, doc.y, { width: 492 });
            if (item.cta) doc.text(`CTA: ${item.cta}`, 70, doc.y, { width: 492 });
            if (item.subject) doc.text(`Subject: ${item.subject}`, 70, doc.y, { width: 492 });
            if (item.description) doc.text(item.description, 70, doc.y, { width: 492 });
            if (item.headline) doc.text(`Headline: ${item.headline}`, 70, doc.y, { width: 492 });
            
            doc.moveDown(1);
          });
        } else if (section.posts) {
          section.posts.forEach(post => {
            if (doc.y > 680) doc.addPage();
            doc.font('Helvetica-Bold').text(`${post.number}. ${post.type}`, 50);
            doc.font('Helvetica').text(post.caption, 70, doc.y, { width: 492 });
            doc.moveDown(1);
          });
        } else if (section.descriptions) {
          section.descriptions.forEach(desc => {
            if (doc.y > 680) doc.addPage();
            doc.font('Helvetica-Bold').text(`${desc.number}. ${desc.type}`, 50);
            doc.font('Helvetica').text(desc.description, 70, doc.y, { width: 492 });
            doc.moveDown(1);
          });
        } else if (section.templates) {
          section.templates.forEach(template => {
            if (doc.y > 680) doc.addPage();
            doc.font('Helvetica-Bold').text(`${template.number}. ${template.title || template.type}`, 50);
            if (template.subject) doc.font('Helvetica').text(`Subject: ${template.subject}`, 70);
            if (template.body) doc.text(`Body: ${template.body}`, 70, doc.y, { width: 492 });
            doc.moveDown(1);
          });
        } else if (section.emails) {
          section.emails.forEach(email => {
            if (doc.y > 680) doc.addPage();
            doc.font('Helvetica-Bold').text(email.title, 50);
            doc.font('Helvetica').text(`Subject: ${email.subject}`, 70);
            doc.text(`Body: ${email.body}`, 70, doc.y, { width: 492 });
            doc.moveDown(1);
          });
        } else if (section.prompts) {
          section.prompts.forEach(prompt => {
            if (doc.y > 680) doc.addPage();
            doc.font('Helvetica-Bold').text(`${prompt.number}. ${prompt.title}`, 50);
            doc.font('Helvetica').text(prompt.prompt, 70, doc.y, { width: 492 });
            doc.moveDown(1);
          });
        }
        
        doc.moveDown(1);
      });
    }

    // Footer on last page
    doc.addPage();
    doc.fillColor(categoryColor).fontSize(18).font('Helvetica-Bold').text('Thank You!', 50);
    doc.moveDown(1);
    doc.fillColor('#333333').fontSize(11).font('Helvetica');
    doc.text('Thank you for purchasing this premium template from ToolForgeHQ.', 50);
    doc.moveDown(0.5);
    doc.text('For support, visit toolforgehq.com or email support@toolforgehq.com', 50);
    doc.moveDown(2);
    doc.text('© ToolForgeHQ. All rights reserved.', 50);

    doc.end();
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}

// Main generation function
async function generateTemplate(spec) {
  console.log(`  Generating: ${spec.name}`);
  
  // Generate preview image
  generatePreviewImage(spec.id, spec.name, spec.category);
  
  // Generate content based on category
  const contentGenerator = CONTENT_GENERATORS[spec.category];
  const sections = contentGenerator ? contentGenerator(spec) : [];
  
  // Generate PDF
  await generatePDF(spec.id, spec.name, spec.category, sections);
  
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
    downloadUrl: `/templates/${spec.id}.pdf`,
    whatsIncluded: spec.whatsIncluded,
    whoItsFor: spec.whoItsFor,
    faqs: [
      {
        question: 'What format is this template?',
        answer: 'This template is delivered as a professionally formatted PDF document.'
      },
      {
        question: 'Can I customize this template?',
        answer: 'Yes! All templates are designed to be customized for your specific needs and brand.'
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
  console.log('🚀 Starting template generation...');
  console.log(`📦 Generating ${ALL_TEMPLATES.length} templates\n`);
  
  // Load existing templates.json
  const templatesData = JSON.parse(fs.readFileSync(TEMPLATES_JSON, 'utf8'));
  
  // Clear existing templates (keep categories and subcategories)
  templatesData.templates = [];
  
  // Generate all templates
  let count = 0;
  for (const spec of ALL_TEMPLATES) {
    try {
      const template = await generateTemplate(spec);
      templatesData.templates.push(template);
      count++;
      
      if (count % 10 === 0) {
        console.log(`\n✅ Progress: ${count}/${ALL_TEMPLATES.length} templates generated\n`);
      }
    } catch (error) {
      console.error(`❌ Error generating ${spec.id}:`, error.message);
    }
  }
  
  // Save updated templates.json
  fs.writeFileSync(TEMPLATES_JSON, JSON.stringify(templatesData, null, 2));
  
  console.log(`\n🎉 Generation complete!`);
  console.log(`📦 Total templates: ${templatesData.templates.length}`);
  console.log(`📁 PDFs saved to: ${TEMPLATES_DIR}`);
  console.log(`🖼️  Previews saved to: ${PREVIEWS_DIR}`);
  
  // Summary by category
  console.log('\n📊 Templates by category:');
  const categoryCounts = {};
  templatesData.templates.forEach(t => {
    categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
  });
  Object.entries(categoryCounts).forEach(([cat, count]) => {
    console.log(`   ${CATEGORY_NAMES[cat] || cat}: ${count}`);
  });
}

// Run
main().catch(console.error);

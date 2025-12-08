const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const HERO_DIR = path.join(PUBLIC_DIR, 'hero');
const LOGO_DIR = path.join(PUBLIC_DIR, 'logo');
const ICONS_DIR = path.join(PUBLIC_DIR, 'icons');
const PREVIEWS_DIR = path.join(PUBLIC_DIR, 'previews');

// Ensure directories exist
[HERO_DIR, LOGO_DIR, ICONS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Color palette
const COLORS = {
  primary: '#6366F1',
  primaryDark: '#4F46E5',
  secondary: '#10B981',
  accent: '#F59E0B',
  dark: '#1F2937',
  light: '#F9FAFB',
  white: '#FFFFFF',
  gray: '#9CA3AF',
  lightGray: '#E5E7EB',
};

// Category colors
const CATEGORY_COLORS = {
  'social-media': { primary: '#3B82F6', secondary: '#60A5FA', accent: '#DBEAFE' },
  'business-marketing': { primary: '#10B981', secondary: '#34D399', accent: '#D1FAE5' },
  'real-estate': { primary: '#F59E0B', secondary: '#FBBF24', accent: '#FEF3C7' },
  'ecommerce': { primary: '#8B5CF6', secondary: '#A78BFA', accent: '#EDE9FE' },
  'productivity': { primary: '#14B8A6', secondary: '#2DD4BF', accent: '#CCFBF1' },
  'professional-docs': { primary: '#6B7280', secondary: '#9CA3AF', accent: '#F3F4F6' },
  'ai-powered': { primary: '#6366F1', secondary: '#818CF8', accent: '#E0E7FF' },
};

// Helper function to draw rounded rectangle
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

// Generate Hero Dashboard Image
function generateHeroDashboard() {
  const width = 800;
  const height = 600;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#EEF2FF');
  gradient.addColorStop(1, '#E0E7FF');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Main dashboard card
  ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 10;
  
  roundRect(ctx, 40, 40, width - 80, height - 80, 20);
  ctx.fillStyle = COLORS.white;
  ctx.fill();
  
  ctx.shadowBlur = 0;

  // Header bar
  roundRect(ctx, 40, 40, width - 80, 60, 20);
  ctx.fillStyle = COLORS.primary;
  ctx.fill();
  
  // Fix bottom corners of header
  ctx.fillRect(40, 80, width - 80, 20);

  // Header dots (window controls)
  ctx.fillStyle = '#EF4444';
  ctx.beginPath();
  ctx.arc(70, 70, 6, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = '#F59E0B';
  ctx.beginPath();
  ctx.arc(95, 70, 6, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = '#10B981';
  ctx.beginPath();
  ctx.arc(120, 70, 6, 0, Math.PI * 2);
  ctx.fill();

  // Header text
  ctx.fillStyle = COLORS.white;
  ctx.font = 'bold 18px Arial';
  ctx.fillText('ToolForgeHQ Dashboard', 150, 76);

  // Sidebar
  ctx.fillStyle = '#F8FAFC';
  ctx.fillRect(40, 100, 180, height - 140);

  // Sidebar menu items
  const menuItems = ['Templates', 'Categories', 'Analytics', 'Downloads', 'Settings'];
  menuItems.forEach((item, i) => {
    const y = 140 + i * 45;
    if (i === 0) {
      roundRect(ctx, 55, y - 12, 150, 35, 8);
      ctx.fillStyle = COLORS.primary + '20';
      ctx.fill();
      ctx.fillStyle = COLORS.primary;
    } else {
      ctx.fillStyle = COLORS.gray;
    }
    ctx.font = '14px Arial';
    ctx.fillText(item, 75, y + 5);
  });

  // Main content area - Template grid
  const cardWidth = 150;
  const cardHeight = 120;
  const startX = 250;
  const startY = 130;
  const gap = 20;

  // Section title
  ctx.fillStyle = COLORS.dark;
  ctx.font = 'bold 20px Arial';
  ctx.fillText('Popular Templates', startX, startY);

  // Template cards
  const cardColors = [
    { bg: '#DBEAFE', accent: '#3B82F6' },
    { bg: '#D1FAE5', accent: '#10B981' },
    { bg: '#FEF3C7', accent: '#F59E0B' },
    { bg: '#EDE9FE', accent: '#8B5CF6' },
    { bg: '#CCFBF1', accent: '#14B8A6' },
    { bg: '#E0E7FF', accent: '#6366F1' },
  ];

  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 3; col++) {
      const x = startX + col * (cardWidth + gap);
      const y = startY + 30 + row * (cardHeight + gap);
      const colorIndex = row * 3 + col;
      
      // Card shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 4;
      
      roundRect(ctx, x, y, cardWidth, cardHeight, 12);
      ctx.fillStyle = cardColors[colorIndex].bg;
      ctx.fill();
      
      ctx.shadowBlur = 0;
      
      // Card accent bar
      roundRect(ctx, x, y, cardWidth, 8, 12);
      ctx.fillStyle = cardColors[colorIndex].accent;
      ctx.fill();
      ctx.fillRect(x, y + 4, cardWidth, 4);
      
      // Card icon placeholder
      ctx.fillStyle = cardColors[colorIndex].accent + '40';
      roundRect(ctx, x + 15, y + 25, 40, 40, 8);
      ctx.fill();
      
      // Card lines (text placeholder)
      ctx.fillStyle = cardColors[colorIndex].accent + '60';
      roundRect(ctx, x + 65, y + 30, 70, 8, 4);
      ctx.fill();
      roundRect(ctx, x + 65, y + 45, 50, 6, 3);
      ctx.fill();
      
      // Price tag
      ctx.fillStyle = cardColors[colorIndex].accent;
      ctx.font = 'bold 12px Arial';
      ctx.fillText('$29', x + 15, y + cardHeight - 15);
    }
  }

  // Stats section
  const statsY = startY + 30 + 2 * (cardHeight + gap) + 30;
  ctx.fillStyle = COLORS.dark;
  ctx.font = 'bold 16px Arial';
  ctx.fillText('Quick Stats', startX, statsY);

  // Stat cards
  const stats = [
    { label: 'Templates', value: '100+', color: '#3B82F6' },
    { label: 'Downloads', value: '2.5K', color: '#10B981' },
    { label: 'Categories', value: '7', color: '#F59E0B' },
  ];

  stats.forEach((stat, i) => {
    const x = startX + i * 120;
    const y = statsY + 15;
    
    roundRect(ctx, x, y, 100, 60, 8);
    ctx.fillStyle = stat.color + '15';
    ctx.fill();
    
    ctx.fillStyle = stat.color;
    ctx.font = 'bold 24px Arial';
    ctx.fillText(stat.value, x + 15, y + 35);
    
    ctx.fillStyle = COLORS.gray;
    ctx.font = '11px Arial';
    ctx.fillText(stat.label, x + 15, y + 50);
  });

  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(HERO_DIR, 'hero-dashboard.png'), buffer);
  console.log('Generated: hero-dashboard.png');
}

// Generate Logo
function generateLogo() {
  // Full logo with text
  const width = 300;
  const height = 60;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Transparent background
  ctx.clearRect(0, 0, width, height);

  // Icon - TF monogram in a rounded square
  const iconSize = 44;
  const iconX = 8;
  const iconY = 8;
  
  // Icon background
  roundRect(ctx, iconX, iconY, iconSize, iconSize, 10);
  const iconGradient = ctx.createLinearGradient(iconX, iconY, iconX + iconSize, iconY + iconSize);
  iconGradient.addColorStop(0, COLORS.primary);
  iconGradient.addColorStop(1, COLORS.primaryDark);
  ctx.fillStyle = iconGradient;
  ctx.fill();

  // TF letters
  ctx.fillStyle = COLORS.white;
  ctx.font = 'bold 22px Arial';
  ctx.fillText('TF', iconX + 10, iconY + 31);

  // Text
  ctx.fillStyle = COLORS.dark;
  ctx.font = 'bold 26px Arial';
  ctx.fillText('ToolForgeHQ', 65, 40);

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(LOGO_DIR, 'logo-light.png'), buffer);
  console.log('Generated: logo-light.png');

  // Icon only (for favicon)
  const iconCanvas = createCanvas(64, 64);
  const iconCtx = iconCanvas.getContext('2d');
  
  roundRect(iconCtx, 4, 4, 56, 56, 12);
  const faviconGradient = iconCtx.createLinearGradient(0, 0, 64, 64);
  faviconGradient.addColorStop(0, COLORS.primary);
  faviconGradient.addColorStop(1, COLORS.primaryDark);
  iconCtx.fillStyle = faviconGradient;
  iconCtx.fill();

  iconCtx.fillStyle = COLORS.white;
  iconCtx.font = 'bold 28px Arial';
  iconCtx.fillText('TF', 14, 42);

  const iconBuffer = iconCanvas.toBuffer('image/png');
  fs.writeFileSync(path.join(LOGO_DIR, 'logo-icon.png'), iconBuffer);
  console.log('Generated: logo-icon.png');

  // Also save as favicon
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.png'), iconBuffer);
  console.log('Generated: favicon.png');
}

// Generate Category Icons
function generateCategoryIcons() {
  const categories = [
    { id: 'social-media', icon: 'share' },
    { id: 'business-marketing', icon: 'chart' },
    { id: 'real-estate', icon: 'home' },
    { id: 'ecommerce', icon: 'cart' },
    { id: 'productivity', icon: 'calendar' },
    { id: 'professional-docs', icon: 'doc' },
    { id: 'ai-powered', icon: 'ai' },
  ];

  categories.forEach(cat => {
    const size = 120;
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    const colors = CATEGORY_COLORS[cat.id];

    // Background circle
    ctx.beginPath();
    ctx.arc(size/2, size/2, size/2 - 4, 0, Math.PI * 2);
    ctx.fillStyle = colors.accent;
    ctx.fill();

    // Inner circle
    ctx.beginPath();
    ctx.arc(size/2, size/2, size/3, 0, Math.PI * 2);
    ctx.fillStyle = colors.primary;
    ctx.fill();

    // Icon symbol
    ctx.fillStyle = COLORS.white;
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const symbols = {
      share: '@',
      chart: '%',
      home: '^',
      cart: '$',
      calendar: '#',
      doc: '=',
      ai: '*',
    };
    ctx.fillText(symbols[cat.icon], size/2, size/2);

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(ICONS_DIR, `${cat.id}-icon.png`), buffer);
    console.log(`Generated: ${cat.id}-icon.png`);
  });
}

// Generate enhanced preview images for each subcategory
function generateEnhancedPreviews() {
  const subcategoryStyles = {
    // Social Media
    'instagram-posts': { title: 'Instagram Posts', icon: 'IG', style: 'phone' },
    'tiktok-scripts': { title: 'TikTok Scripts', icon: 'TT', style: 'phone' },
    'reels-scripts': { title: 'Reels Scripts', icon: 'RL', style: 'phone' },
    'carousel-templates': { title: 'Carousel', icon: 'CR', style: 'cards' },
    'youtube-shorts': { title: 'YouTube Shorts', icon: 'YT', style: 'phone' },
    
    // Business & Marketing
    'business-plans': { title: 'Business Plan', icon: 'BP', style: 'document' },
    'branding-kits': { title: 'Branding Kit', icon: 'BK', style: 'grid' },
    'email-sequences': { title: 'Email Sequence', icon: 'EM', style: 'list' },
    'sales-funnels': { title: 'Sales Funnel', icon: 'SF', style: 'funnel' },
    
    // AI-Powered
    'ai-prompts': { title: 'AI Prompts', icon: 'AI', style: 'chat' },
    'ai-workflows': { title: 'AI Workflow', icon: 'WF', style: 'nodes' },
    'ai-outreach': { title: 'AI Outreach', icon: 'AO', style: 'chat' },
    
    // Real Estate
    'realtor-social': { title: 'Realtor Social', icon: 'RS', style: 'phone' },
    'listing-descriptions': { title: 'Listings', icon: 'LD', style: 'document' },
    'buyer-seller-guides': { title: 'Buyer Guide', icon: 'BG', style: 'document' },
    
    // E-Commerce
    'product-descriptions': { title: 'Products', icon: 'PD', style: 'grid' },
    'shopify-templates': { title: 'Shopify', icon: 'SH', style: 'shop' },
    
    // Productivity
    'planners': { title: 'Planner', icon: 'PL', style: 'calendar' },
    'trackers': { title: 'Tracker', icon: 'TR', style: 'chart' },
    
    // Professional Docs
    'resumes': { title: 'Resume', icon: 'CV', style: 'document' },
    'pitch-decks': { title: 'Pitch Deck', icon: 'PD', style: 'slides' },
  };

  // Map template IDs to their subcategory style
  const templateMappings = {
    // Social Media - Instagram Posts
    'instagram-posts-fitness': 'instagram-posts',
    'instagram-posts-coaching': 'instagram-posts',
    'instagram-posts-ecommerce': 'instagram-posts',
    'instagram-posts-restaurant': 'instagram-posts',
    'instagram-posts-beauty': 'instagram-posts',
    
    // Social Media - TikTok
    'tiktok-scripts-business': 'tiktok-scripts',
    'tiktok-scripts-education': 'tiktok-scripts',
    'tiktok-scripts-lifestyle': 'tiktok-scripts',
    'tiktok-scripts-comedy': 'tiktok-scripts',
    'tiktok-scripts-health': 'tiktok-scripts',
    
    // Social Media - Reels
    'reels-scripts-marketing': 'reels-scripts',
    'reels-scripts-real-estate': 'reels-scripts',
    'reels-scripts-food': 'reels-scripts',
    'reels-scripts-fashion': 'reels-scripts',
    'reels-scripts-travel': 'reels-scripts',
    
    // Social Media - Carousels
    'carousel-educational': 'carousel-templates',
    'carousel-storytelling': 'carousel-templates',
    'carousel-tips-tricks': 'carousel-templates',
    'carousel-product': 'carousel-templates',
    'carousel-personal-brand': 'carousel-templates',
    
    // Social Media - YouTube Shorts
    'youtube-shorts-tech': 'youtube-shorts',
    'youtube-shorts-finance': 'youtube-shorts',
    'youtube-shorts-diy': 'youtube-shorts',
    'youtube-shorts-gaming': 'youtube-shorts',
    'youtube-shorts-motivation': 'youtube-shorts',
    
    // Business - Business Plans
    'business-plan-startup': 'business-plans',
    'business-plan-ecommerce': 'business-plans',
    'business-plan-service': 'business-plans',
    'business-plan-restaurant': 'business-plans',
    'business-plan-coaching': 'business-plans',
    
    // Business - Branding Kits
    'branding-kit-startup': 'branding-kits',
    'branding-kit-personal': 'branding-kits',
    'branding-kit-ecommerce': 'branding-kits',
    'branding-kit-wellness': 'branding-kits',
    'branding-kit-luxury': 'branding-kits',
    
    // Business - Email Sequences
    'email-sequence-welcome': 'email-sequences',
    'email-sequence-launch': 'email-sequences',
    'email-sequence-nurture': 'email-sequences',
    'email-sequence-abandoned-cart': 'email-sequences',
    'email-sequence-webinar': 'email-sequences',
    
    // Business - Sales Funnels
    'sales-funnel-webinar': 'sales-funnels',
    'sales-funnel-tripwire': 'sales-funnels',
    'sales-funnel-challenge': 'sales-funnels',
    'sales-funnel-vsl': 'sales-funnels',
    'sales-funnel-lead-magnet': 'sales-funnels',
    
    // AI - Prompts
    'ai-prompts-content': 'ai-prompts',
    'ai-prompts-business': 'ai-prompts',
    'ai-prompts-copywriting': 'ai-prompts',
    'ai-prompts-coding': 'ai-prompts',
    'ai-prompts-research': 'ai-prompts',
    
    // AI - Workflows
    'ai-workflow-content': 'ai-workflows',
    'ai-workflow-sales': 'ai-workflows',
    'ai-workflow-customer-service': 'ai-workflows',
    'ai-workflow-hiring': 'ai-workflows',
    'ai-workflow-research': 'ai-workflows',
    
    // AI - Outreach
    'ai-outreach-cold-email': 'ai-outreach',
    'ai-outreach-linkedin': 'ai-outreach',
    'ai-outreach-influencer': 'ai-outreach',
    'ai-outreach-pr': 'ai-outreach',
    'ai-outreach-partnership': 'ai-outreach',
    
    // Real Estate - Social
    'realtor-social-luxury': 'realtor-social',
    'realtor-social-first-time': 'realtor-social',
    'realtor-social-investment': 'realtor-social',
    'realtor-social-local': 'realtor-social',
    'realtor-social-seller': 'realtor-social',
    
    // Real Estate - Listings
    'listing-descriptions-luxury': 'listing-descriptions',
    'listing-descriptions-starter': 'listing-descriptions',
    'listing-descriptions-condo': 'listing-descriptions',
    'listing-descriptions-investment': 'listing-descriptions',
    'listing-descriptions-land': 'listing-descriptions',
    
    // Real Estate - Guides
    'guide-first-time-buyer': 'buyer-seller-guides',
    'guide-home-seller': 'buyer-seller-guides',
    'guide-investment-buyer': 'buyer-seller-guides',
    'guide-relocation': 'buyer-seller-guides',
    'guide-downsizing': 'buyer-seller-guides',
    
    // E-Commerce - Products
    'product-descriptions-fashion': 'product-descriptions',
    'product-descriptions-beauty': 'product-descriptions',
    'product-descriptions-tech': 'product-descriptions',
    'product-descriptions-home': 'product-descriptions',
    'product-descriptions-food': 'product-descriptions',
    
    // E-Commerce - Shopify
    'shopify-email-flows': 'shopify-templates',
    'shopify-homepage-sections': 'shopify-templates',
    'ecommerce-upsell-templates': 'shopify-templates',
    'ecommerce-sms-templates': 'shopify-templates',
    'influencer-outreach-ecommerce': 'shopify-templates',
    
    // Productivity - Planners
    'planner-annual-goals': 'planners',
    'planner-business-quarterly': 'planners',
    'planner-content-creator': 'planners',
    'planner-project-manager': 'planners',
    'planner-wellness-lifestyle': 'planners',
    
    // Productivity - Trackers
    'tracker-habit-90day': 'trackers',
    'tracker-budget-monthly': 'trackers',
    'tracker-content-analytics': 'trackers',
    'tracker-fitness-workout': 'trackers',
    'tracker-reading-learning': 'trackers',
    
    // Professional - Resumes
    'resume-modern-professional': 'resumes',
    'resume-executive': 'resumes',
    'resume-creative': 'resumes',
    
    // Professional - Pitch Decks
    'pitch-deck-startup': 'pitch-decks',
    'pitch-deck-sales': 'pitch-decks',
  };

  // Get category from template ID
  function getCategoryFromId(templateId) {
    if (templateId.includes('instagram') || templateId.includes('tiktok') || 
        templateId.includes('reels') || templateId.includes('carousel') || 
        templateId.includes('youtube')) return 'social-media';
    if (templateId.includes('business-plan') || templateId.includes('branding') || 
        templateId.includes('email-sequence') || templateId.includes('sales-funnel')) return 'business-marketing';
    if (templateId.includes('ai-')) return 'ai-powered';
    if (templateId.includes('realtor') || templateId.includes('listing') || 
        templateId.includes('guide-')) return 'real-estate';
    if (templateId.includes('product-descriptions') || templateId.includes('shopify') || 
        templateId.includes('ecommerce') || templateId.includes('influencer')) return 'ecommerce';
    if (templateId.includes('planner') || templateId.includes('tracker')) return 'productivity';
    if (templateId.includes('resume') || templateId.includes('pitch-deck')) return 'professional-docs';
    return 'social-media';
  }

  // Generate preview for a specific style
  function generateStyledPreview(templateId, subcategory, category, niche) {
    const size = 1000;
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    const colors = CATEGORY_COLORS[category];
    const style = subcategoryStyles[subcategory];

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, colors.primary);
    gradient.addColorStop(0.5, colors.secondary);
    gradient.addColorStop(1, colors.primary);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    // Add subtle pattern overlay
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = 50 + Math.random() * 100;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw style-specific mockup
    if (style && style.style === 'phone') {
      // Phone mockup
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      roundRect(ctx, 350, 150, 300, 550, 30);
      ctx.fill();
      
      // Screen
      ctx.fillStyle = colors.accent;
      roundRect(ctx, 365, 200, 270, 450, 5);
      ctx.fill();
      
      // Content lines
      ctx.fillStyle = colors.primary + '40';
      for (let i = 0; i < 6; i++) {
        roundRect(ctx, 385, 230 + i * 70, 230, 50, 8);
        ctx.fill();
      }
      
      // Notch
      ctx.fillStyle = '#1F2937';
      roundRect(ctx, 440, 160, 120, 25, 12);
      ctx.fill();
    } else if (style && style.style === 'document') {
      // Document mockup
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      roundRect(ctx, 250, 100, 500, 650, 10);
      ctx.fill();
      
      // Header
      ctx.fillStyle = colors.primary;
      ctx.fillRect(250, 100, 500, 80);
      
      // Content lines
      ctx.fillStyle = colors.primary + '30';
      for (let i = 0; i < 12; i++) {
        const width = 200 + Math.random() * 250;
        roundRect(ctx, 290, 220 + i * 45, width, 20, 4);
        ctx.fill();
      }
    } else if (style && style.style === 'chat') {
      // Chat/AI interface mockup
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      roundRect(ctx, 200, 100, 600, 700, 20);
      ctx.fill();
      
      // Chat bubbles
      const bubbles = [
        { x: 240, y: 150, w: 300, h: 60, align: 'left' },
        { x: 460, y: 240, w: 280, h: 80, align: 'right' },
        { x: 240, y: 350, w: 350, h: 70, align: 'left' },
        { x: 400, y: 450, w: 340, h: 90, align: 'right' },
        { x: 240, y: 570, w: 280, h: 60, align: 'left' },
      ];
      
      bubbles.forEach(b => {
        ctx.fillStyle = b.align === 'left' ? colors.accent : colors.primary + '20';
        roundRect(ctx, b.x, b.y, b.w, b.h, 15);
        ctx.fill();
      });
    } else if (style && style.style === 'nodes') {
      // Workflow nodes mockup
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      roundRect(ctx, 150, 150, 700, 600, 20);
      ctx.fill();
      
      // Nodes
      const nodes = [
        { x: 250, y: 250, label: 'Input' },
        { x: 500, y: 250, label: 'Process' },
        { x: 750, y: 250, label: 'Output' },
        { x: 375, y: 450, label: 'AI' },
        { x: 625, y: 450, label: 'Review' },
      ];
      
      // Connections
      ctx.strokeStyle = colors.primary + '40';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(310, 280);
      ctx.lineTo(440, 280);
      ctx.moveTo(560, 280);
      ctx.lineTo(690, 280);
      ctx.moveTo(280, 310);
      ctx.lineTo(375, 420);
      ctx.moveTo(530, 310);
      ctx.lineTo(625, 420);
      ctx.stroke();
      
      nodes.forEach(n => {
        ctx.fillStyle = colors.primary;
        roundRect(ctx, n.x - 60, n.y - 30, 120, 60, 10);
        ctx.fill();
      });
    } else if (style && style.style === 'grid') {
      // Grid layout mockup
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      roundRect(ctx, 150, 100, 700, 700, 20);
      ctx.fill();
      
      // Grid items
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          ctx.fillStyle = colors.accent;
          roundRect(ctx, 190 + col * 220, 150 + row * 220, 180, 180, 15);
          ctx.fill();
          
          ctx.fillStyle = colors.primary + '40';
          roundRect(ctx, 210 + col * 220, 170 + row * 220, 140, 100, 8);
          ctx.fill();
        }
      }
    } else if (style && style.style === 'calendar') {
      // Calendar mockup
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      roundRect(ctx, 200, 100, 600, 700, 20);
      ctx.fill();
      
      // Header
      ctx.fillStyle = colors.primary;
      roundRect(ctx, 200, 100, 600, 80, 20);
      ctx.fill();
      ctx.fillRect(200, 160, 600, 20);
      
      // Calendar grid
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 7; col++) {
          ctx.fillStyle = (row + col) % 3 === 0 ? colors.accent : '#F3F4F6';
          roundRect(ctx, 220 + col * 80, 200 + row * 100, 70, 80, 8);
          ctx.fill();
        }
      }
    } else if (style && style.style === 'slides') {
      // Presentation slides mockup
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      roundRect(ctx, 150, 150, 700, 450, 15);
      ctx.fill();
      
      // Slide content
      ctx.fillStyle = colors.primary;
      ctx.fillRect(150, 150, 700, 60);
      
      ctx.fillStyle = colors.primary + '20';
      roundRect(ctx, 200, 250, 250, 150, 10);
      ctx.fill();
      
      ctx.fillStyle = colors.primary + '30';
      for (let i = 0; i < 5; i++) {
        roundRect(ctx, 500, 250 + i * 35, 300, 20, 4);
        ctx.fill();
      }
      
      // Slide thumbnails
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = i === 0 ? colors.primary + '30' : '#E5E7EB';
        roundRect(ctx, 150 + i * 180, 650, 160, 100, 8);
        ctx.fill();
      }
    } else {
      // Default card layout
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      roundRect(ctx, 200, 150, 600, 600, 20);
      ctx.fill();
      
      ctx.fillStyle = colors.accent;
      roundRect(ctx, 250, 200, 500, 250, 15);
      ctx.fill();
      
      ctx.fillStyle = colors.primary + '30';
      for (let i = 0; i < 5; i++) {
        roundRect(ctx, 250, 500 + i * 45, 300 + Math.random() * 150, 25, 6);
        ctx.fill();
      }
    }

    // Premium badge
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    roundRect(ctx, 50, 50, 140, 40, 20);
    ctx.fill();
    ctx.fillStyle = colors.primary;
    ctx.font = 'bold 16px Arial';
    ctx.fillText('PREMIUM', 75, 77);

    // Category label
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    roundRect(ctx, 50, 850, 300, 50, 10);
    ctx.fill();
    ctx.fillStyle = colors.primary;
    ctx.font = '18px Arial';
    const categoryLabel = category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    ctx.fillText(categoryLabel, 70, 882);

    // Template title
    ctx.fillStyle = COLORS.white;
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    
    // Get display title from niche
    const displayTitle = niche || style?.title || 'Template';
    
    // Word wrap title
    const words = displayTitle.split(' ');
    let lines = [];
    let currentLine = '';
    
    words.forEach(word => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (ctx.measureText(testLine).width > 700) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    lines.push(currentLine);
    
    lines.forEach((line, i) => {
      ctx.fillText(line, size / 2, 940 + i * 45);
    });

    // ToolForgeHQ watermark
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '14px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('ToolForgeHQ', size - 50, size - 30);

    return canvas.toBuffer('image/png');
  }

  // Generate previews for all templates
  Object.entries(templateMappings).forEach(([templateId, subcategory]) => {
    const category = getCategoryFromId(templateId);
    
    // Extract niche from template ID
    const parts = templateId.split('-');
    const niche = parts.slice(2).join(' ').replace(/\b\w/g, l => l.toUpperCase()) || 
                  subcategoryStyles[subcategory]?.title || 'Template';
    
    const buffer = generateStyledPreview(templateId, subcategory, category, niche);
    fs.writeFileSync(path.join(PREVIEWS_DIR, `${templateId}.png`), buffer);
    console.log(`Generated preview: ${templateId}.png`);
  });
}

// Main execution
async function main() {
  console.log('Generating visual assets...\n');
  
  console.log('1. Generating hero dashboard image...');
  generateHeroDashboard();
  
  console.log('\n2. Generating logo files...');
  generateLogo();
  
  console.log('\n3. Generating category icons...');
  generateCategoryIcons();
  
  console.log('\n4. Generating enhanced preview images...');
  generateEnhancedPreviews();
  
  console.log('\nAll visual assets generated successfully!');
}

main().catch(console.error);

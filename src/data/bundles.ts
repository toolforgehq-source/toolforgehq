import { categories, getTemplateById } from './templates';

export interface Bundle {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  categoryId: string;
  templateIds: string[];
  priceCents: number;
  savingsPercent: number;
  badgeText?: string;
  previewImage: string;
  isFeatured?: boolean;
}

// Category preview image mapping
const categoryPreviewImages: Record<string, string> = {
  'social-media': '/previews/social-media.png',
  'business-marketing': '/previews/business-marketing.png',
  'ai-powered': '/previews/ai-powered.png',
  'real-estate': '/previews/real-estate.png',
  'ecommerce': '/previews/ecommerce.png',
  'productivity': '/previews/productivity.png',
  'professional-docs': '/previews/professional-docs.png',
};

export const bundles: Bundle[] = [
  {
    id: 'social-media-starter-pack',
    slug: 'social-media-starter-pack',
    name: 'Social Media Starter Pack',
    shortName: 'Social Starter',
    description: 'Everything you need to dominate social media. This bundle includes our best-selling Instagram, TikTok, Reels, Carousel, and YouTube Shorts templates - perfect for creators who want to build a consistent, engaging presence across all major platforms.',
    categoryId: 'social-media',
    templateIds: [
      'instagram-posts-fitness',      // $29 - featured
      'tiktok-scripts-business',      // $34 - featured
      'reels-scripts-marketing',      // $29 - featured
      'carousel-educational',         // $34 - featured
      'youtube-shorts-tech',          // $34 - featured
      'instagram-posts-coaching',     // $29
    ],
    // Total: $189, Bundle price: $119 (37% off)
    priceCents: 11900,
    savingsPercent: 37,
    badgeText: 'Save 37%',
    previewImage: categoryPreviewImages['social-media'],
    isFeatured: true,
  },
  {
    id: 'business-growth-bundle',
    slug: 'business-growth-bundle',
    name: 'Business Growth Bundle',
    shortName: 'Business Growth',
    description: 'Scale your business with this comprehensive bundle. Includes a startup business plan, branding kit, welcome email sequence, and webinar sales funnel - everything you need to launch, brand, and grow your business systematically.',
    categoryId: 'business-marketing',
    templateIds: [
      'business-plan-startup',        // $49 - featured
      'branding-kit-startup',         // $39 - featured
      'email-sequence-welcome',       // $39 - featured
      'sales-funnel-webinar',         // $49 - featured
      'email-sequence-launch',        // $44
    ],
    // Total: $220, Bundle price: $139 (37% off)
    priceCents: 13900,
    savingsPercent: 37,
    badgeText: 'Save 37%',
    previewImage: categoryPreviewImages['business-marketing'],
    isFeatured: true,
  },
  {
    id: 'ai-outreach-system-bundle',
    slug: 'ai-outreach-system-bundle',
    name: 'AI Outreach System Bundle',
    shortName: 'AI Outreach',
    description: 'Supercharge your outreach with AI. This bundle combines our most powerful AI-powered outreach systems including cold email, LinkedIn, influencer outreach, and the comprehensive content creation prompt library.',
    categoryId: 'ai-powered',
    templateIds: [
      'ai-prompts-content',           // $49 - featured
      'ai-workflow-content',          // $59 - featured
      'ai-outreach-cold-email',       // $49 - featured
      'ai-outreach-linkedin',         // $49
      'ai-outreach-influencer',       // $49
    ],
    // Total: $255, Bundle price: $159 (38% off)
    priceCents: 15900,
    savingsPercent: 38,
    badgeText: 'Save 38%',
    previewImage: categoryPreviewImages['ai-powered'],
    isFeatured: true,
  },
  {
    id: 'real-estate-power-pack',
    slug: 'real-estate-power-pack',
    name: 'Real Estate Power Pack',
    shortName: 'Real Estate Pro',
    description: 'Dominate your local real estate market with this comprehensive pack. Includes luxury social media content, premium listing descriptions, buyer guides, and seller guides - everything a top-producing agent needs.',
    categoryId: 'real-estate',
    templateIds: [
      'realtor-social-luxury',        // $39 - featured
      'listing-descriptions-luxury',  // $29 - featured
      'guide-first-time-buyer',       // $34 - featured
      'guide-home-seller',            // $34
      'realtor-social-first-time',    // $34
    ],
    // Total: $170, Bundle price: $109 (36% off)
    priceCents: 10900,
    savingsPercent: 36,
    badgeText: 'Save 36%',
    previewImage: categoryPreviewImages['real-estate'],
    isFeatured: true,
  },
  {
    id: 'ecommerce-launch-kit',
    slug: 'ecommerce-launch-kit',
    name: 'E-Commerce Launch Kit',
    shortName: 'E-Com Launch',
    description: 'Launch and scale your online store with confidence. This kit includes Shopify email flows, product descriptions, upsell templates, and influencer outreach tools - everything you need to drive sales and grow your e-commerce business.',
    categoryId: 'ecommerce',
    templateIds: [
      'shopify-email-flows',          // $49 - featured
      'product-descriptions-fashion', // $29 - featured
      'influencer-outreach-ecommerce',// $39
      'ecommerce-upsell-templates',   // $34
      'shopify-homepage-sections',    // $34
    ],
    // Total: $185, Bundle price: $119 (36% off)
    priceCents: 11900,
    savingsPercent: 36,
    badgeText: 'Save 36%',
    previewImage: categoryPreviewImages['ecommerce'],
    isFeatured: true,
  },
  {
    id: 'productivity-os-bundle',
    slug: 'productivity-os-bundle',
    name: 'Productivity OS Bundle',
    shortName: 'Productivity OS',
    description: 'Build your personal productivity operating system. This bundle includes annual goal planning, quarterly business planning, habit tracking, content planning, and budget tracking - a complete system for achieving your goals.',
    categoryId: 'productivity',
    templateIds: [
      'planner-annual-goals',         // $34 - featured
      'tracker-habit-90day',          // $24 - featured
      'planner-business-quarterly',   // $29
      'planner-content-creator',      // $29
      'tracker-budget-monthly',       // $24
    ],
    // Total: $140, Bundle price: $89 (36% off)
    priceCents: 8900,
    savingsPercent: 36,
    badgeText: 'Save 36%',
    previewImage: categoryPreviewImages['productivity'],
    isFeatured: true,
  },
  {
    id: 'professional-career-pack',
    slug: 'professional-career-pack',
    name: 'Professional Career Pack',
    shortName: 'Career Pack',
    description: 'Advance your career with professional documents that stand out. This pack includes modern and executive resume templates, creative resume options, and pitch deck templates for startups and sales presentations.',
    categoryId: 'professional-docs',
    templateIds: [
      'pitch-deck-startup',           // $49 - featured
      'resume-modern-professional',   // $24 - featured
      'pitch-deck-sales',             // $39
      'resume-executive',             // $29
      'resume-creative',              // $24
    ],
    // Total: $165, Bundle price: $99 (40% off)
    priceCents: 9900,
    savingsPercent: 40,
    badgeText: 'Save 40%',
    previewImage: categoryPreviewImages['professional-docs'],
    isFeatured: true,
  },
];

// Helper functions
export const getBundleById = (id: string): Bundle | undefined => {
  return bundles.find(b => b.id === id);
};

export const getBundleBySlug = (slug: string): Bundle | undefined => {
  return bundles.find(b => b.slug === slug);
};

export const getBundlesByCategory = (categoryId: string): Bundle[] => {
  return bundles.filter(b => b.categoryId === categoryId);
};

export const getFeaturedBundles = (): Bundle[] => {
  return bundles.filter(b => b.isFeatured);
};

export const getBundleTemplates = (bundle: Bundle) => {
  return bundle.templateIds
    .map(id => getTemplateById(id))
    .filter((t): t is NonNullable<typeof t> => t !== undefined);
};

export const calculateBundleOriginalPrice = (bundle: Bundle): number => {
  const bundleTemplates = getBundleTemplates(bundle);
  return bundleTemplates.reduce((sum, t) => sum + (t.priceCents || 0), 0);
};

export const getCategoryForBundle = (bundle: Bundle) => {
  return categories.find(c => c.id === bundle.categoryId);
};

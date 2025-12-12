import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import templatesData from '../src/data/templates.json';
import bundlesData from '../src/data/bundles.json';

function getSiteUrl(): string {
  return process.env.SITE_URL || (process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'https://toolforgehq.com');
}

interface Template {
  id: string;
  name: string;
  shortDescription: string;
  priceCents: number;
  comingSoon?: boolean;
}

interface Bundle {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  templateIds: string[];
  slug: string;
}

function getTemplateById(templateId: string): Template | undefined {
  return (templatesData as { templates: Template[] }).templates.find(t => t.id === templateId);
}

function getBundleById(bundleId: string): Bundle | undefined {
  return (bundlesData as { bundles: Bundle[] }).bundles.find(b => b.id === bundleId);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ detail: 'Method not allowed' });
  }

  // Check for Stripe key before initializing
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    return res.status(500).json({ detail: 'Stripe is not configured. Please set STRIPE_SECRET_KEY.' });
  }

  // Initialize Stripe inside handler to avoid module-level crash
  const stripe = new Stripe(stripeSecretKey);
  
  // Get site URL for redirects
  const siteUrl = getSiteUrl();

  const { templateId, bundleId, itemType } = req.body;

  try {
    let session;

    if (itemType === 'bundle' && bundleId) {
      // Handle bundle checkout
      const bundle = getBundleById(bundleId);
      
      if (!bundle) {
        return res.status(400).json({ detail: `Bundle not found: ${bundleId}` });
      }

      session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: bundle.name,
                description: bundle.description,
              },
              unit_amount: bundle.priceCents,
            },
            quantity: 1,
          },
        ],
        metadata: {
          bundleId: bundle.id,
          itemType: 'bundle',
          templateIds: JSON.stringify(bundle.templateIds),
        },
                success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${siteUrl}/bundles/${bundle.slug}?canceled=1`,
      });
    } else if (templateId) {
      // Handle single template checkout
      const template = getTemplateById(templateId);
      
      if (!template) {
        return res.status(400).json({ detail: `Template not found: ${templateId}` });
      }

      if (template.comingSoon) {
        return res.status(400).json({ detail: 'This template is not yet available for purchase.' });
      }

      if (!template.priceCents) {
        return res.status(400).json({ detail: 'This template does not have a price set.' });
      }

      session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: template.name,
                description: template.shortDescription,
              },
              unit_amount: template.priceCents,
            },
            quantity: 1,
          },
        ],
        metadata: {
          templateId: template.id,
          itemType: 'template',
        },
                success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${siteUrl}/templates/${template.id}?canceled=1`,
      });
    } else {
      return res.status(400).json({ detail: 'Either templateId or bundleId is required.' });
    }

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    return res.status(500).json({ detail: `Stripe error: ${error instanceof Error ? error.message : 'Unknown error'}` });
  }
}

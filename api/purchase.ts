import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import templatesData from '../src/data/templates.json';
import bundlesData from '../src/data/bundles.json';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

interface Template {
  id: string;
  name: string;
  downloadUrl?: string;
}

interface Bundle {
  id: string;
  name: string;
  templateIds: string[];
}

interface DownloadItem {
  templateId: string;
  templateName: string;
  downloadUrl: string;
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ detail: 'Method not allowed' });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ detail: 'Stripe is not configured. Please set STRIPE_SECRET_KEY.' });
  }

  const sessionId = req.query.session_id as string;

  if (!sessionId) {
    return res.status(400).json({ detail: 'session_id is required.' });
  }

  try {
    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer_details'],
    });

    // Check if payment was successful
    if (session.payment_status !== 'paid') {
      return res.status(400).json({ detail: 'Payment not completed.' });
    }

    const metadata = session.metadata || {};
    const itemType = metadata.itemType || 'template';
    const customerEmail = session.customer_details?.email || '';
    const purchasedAt = new Date(session.created * 1000).toISOString();

    if (itemType === 'bundle') {
      // Handle bundle purchase
      const bundleId = metadata.bundleId;
      const bundle = getBundleById(bundleId);

      if (!bundle) {
        return res.status(404).json({ detail: 'Bundle not found.' });
      }

      // Get download URLs for all templates in the bundle
      let templateIds: string[] = [];
      try {
        templateIds = JSON.parse(metadata.templateIds || '[]');
      } catch {
        templateIds = bundle.templateIds;
      }

      const downloadUrls: DownloadItem[] = templateIds
        .map(id => {
          const template = getTemplateById(id);
          if (template) {
            return {
              templateId: template.id,
              templateName: template.name,
              downloadUrl: template.downloadUrl || `/templates/${template.id}.pdf`,
            };
          }
          return null;
        })
        .filter((item): item is DownloadItem => item !== null);

      return res.status(200).json({
        itemType: 'bundle',
        bundleId: bundle.id,
        templateName: bundle.name,
        email: customerEmail,
        downloadUrl: '', // Not used for bundles
        downloadUrls,
        purchasedAt,
      });
    } else {
      // Handle single template purchase
      const templateId = metadata.templateId;
      const template = getTemplateById(templateId);

      if (!template) {
        return res.status(404).json({ detail: 'Template not found.' });
      }

      return res.status(200).json({
        itemType: 'template',
        templateId: template.id,
        templateName: template.name,
        email: customerEmail,
        downloadUrl: template.downloadUrl || `/templates/${template.id}.pdf`,
        purchasedAt,
      });
    }
  } catch (error) {
    console.error('Stripe error:', error);
    
    // Handle specific Stripe errors
    if (error instanceof Stripe.errors.StripeError) {
      if (error.code === 'resource_missing') {
        return res.status(404).json({ detail: 'Purchase not found. The session may have expired.' });
      }
    }
    
    return res.status(500).json({ detail: `Error retrieving purchase: ${error instanceof Error ? error.message : 'Unknown error'}` });
  }
}

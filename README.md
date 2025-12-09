# ToolForgeHQ - AI-Ready Templates Website

A marketing and product catalog website for ToolForgeHQ, built with React, TypeScript, Vite, and Tailwind CSS.

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` folder, ready to deploy to Vercel or any static hosting.

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Header.tsx       # Site header with navigation
│   ├── Footer.tsx       # Site footer
│   ├── EmailCapture.tsx # Email signup form component
│   └── TemplateCard.tsx # Product card for catalog
├── pages/               # Page components
│   ├── Home.tsx         # Landing page
│   ├── Templates.tsx    # Product catalog
│   ├── TemplateDetail.tsx # Individual product page
│   ├── HowItWorks.tsx   # How it works page
│   ├── About.tsx        # About page
│   ├── Contact.tsx      # Contact form page
│   ├── Privacy.tsx      # Privacy policy
│   └── Terms.tsx        # Terms of service
├── data/
│   └── templates.ts     # Template/product data
├── components/ui/       # shadcn/ui components
├── App.tsx              # Main app with routing
└── main.tsx             # Entry point
```

## Adding/Editing Templates

All template data is stored in `src/data/templates.json`. This is the single source of truth used by both the frontend and backend. To add a new template:

1. Open `src/data/templates.json`
2. Add a new object to the `templates` array:

```json
{
  "id": "your-template-id",
  "name": "Template Name",
  "shortDescription": "Brief description for catalog cards",
  "fullDescription": "Full description for detail page",
  "category": "content",
  "priceCents": 2900,
  "comingSoon": false,
  "image": "/images/template.jpg",
  "downloadUrl": "https://drive.google.com/your-download-link",
  "whatsIncluded": ["Item 1", "Item 2"],
  "whoItsFor": ["Audience 1", "Audience 2"],
  "faqs": [
    { "question": "Question?", "answer": "Answer." }
  ]
}
```

**Important fields:**
- `id`: URL-friendly unique identifier (used in URLs and Stripe metadata)
- `priceCents`: Price in cents (e.g., 2900 = $29.00)
- `downloadUrl`: The URL buyers will receive after purchase (Google Drive, S3, etc.)
- `comingSoon`: Set to `true` for unreleased templates (shows waitlist instead of buy button)

### Available Categories

Categories are defined in the same file. Current categories:
- `content` - Content calendars, blog templates
- `funnels` - Landing pages, sales funnels
- `social` - Social media post packs
- `email` - Email sequences, newsletters
- `notion` - Notion dashboards, databases
- `ai-tools` - AI prompt libraries

To add a new category, add to the `categories` array:

```typescript
{ 
  id: 'category-id', 
  name: 'Category Name', 
  icon: 'IconName',  // Lucide icon name
  description: 'Category description' 
}
```

## Customization

### Styling

The site uses Tailwind CSS. Main color scheme uses Indigo (`indigo-600`, `indigo-50`, etc.). To change the primary color, search and replace `indigo` with your preferred Tailwind color.

### Email Capture

Email forms currently POST to `/api/subscribe` and `/api/contact`. To connect to a real email service:

1. Update the fetch URLs in `src/components/EmailCapture.tsx` and `src/pages/Contact.tsx`
2. Or set up API routes if using a framework like Next.js

## Stripe Payment Integration

The site includes full Stripe payment integration with dynamic checkout sessions. No manual Stripe product creation is required - templates are created dynamically from the `templates.json` file.

### Environment Variables

**Backend (toolforgehq-backend/.env):**
```bash
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
SITE_URL=https://your-frontend-url.com
```

**Frontend (.env):**
```bash
VITE_API_URL=https://your-backend-url.com
```

### Setting Up Stripe

1. **Get your API keys:**
   - Go to https://dashboard.stripe.com/apikeys
   - Copy your Secret key (starts with `sk_test_` for test mode or `sk_live_` for production)
   - Set it as `STRIPE_SECRET_KEY` in your backend `.env` file

2. **Configure the webhook:**
   - Go to https://dashboard.stripe.com/webhooks
   - Click "Add endpoint"
   - Enter your webhook URL: `https://your-backend-url.com/api/stripe-webhook`
   - Select events to listen to: `checkout.session.completed`
   - Copy the Signing secret (starts with `whsec_`)
   - Set it as `STRIPE_WEBHOOK_SECRET` in your backend `.env` file

3. **Test the integration:**
   - Use Stripe test mode first (test keys start with `sk_test_`)
   - Use test card number: `4242 4242 4242 4242` with any future expiry and any CVC
   - After successful test, switch to live keys for production

### How Payments Work

1. User clicks "Buy Now" on a template
2. Frontend calls `/api/checkout` with the template ID
3. Backend creates a Stripe Checkout Session with dynamic `price_data` (no pre-created products needed)
4. User is redirected to Stripe Checkout
5. After payment, Stripe sends a webhook to `/api/stripe-webhook`
6. Backend stores the purchase and user is redirected to `/success` page with download link

### Purchase Storage

Purchases are stored in `toolforgehq-backend/app/purchases.json`. Each purchase includes:
- Session ID
- Template ID and name
- Customer email
- Download URL
- Purchase timestamp
- Amount paid

## AI Preview Image Generator

The site includes an automated system for generating high-quality preview images using OpenAI's DALL-E 3 API.

### Setup

1. **Get an OpenAI API key:**
   - Go to https://platform.openai.com/api-keys
   - Create a new API key
   - Ensure you have access to the DALL-E 3 model

2. **Set the environment variable:**
   ```bash
   export OPENAI_API_KEY=sk-your-api-key-here
   ```

### Generate Missing Preview Images

Run the script to generate preview images for all templates that don't have one:

```bash
# Generate missing previews (requires OPENAI_API_KEY)
node tools/generate-previews.cjs

# Dry run - see what would be generated without making API calls
node tools/generate-previews.cjs --dry-run

# Force regenerate all images (even existing ones)
node tools/generate-previews.cjs --force

# Limit to N images (useful for testing)
node tools/generate-previews.cjs --limit=5
```

### How It Works

1. The script reads `src/data/templates.json`
2. For each template without a preview image:
   - Generates a detailed prompt based on category and template name
   - Calls OpenAI's DALL-E 3 API to generate a high-quality image
   - Saves the image to `public/previews/<templateId>.png`
   - Updates `templates.json` with the `previewUrl` field
3. Images are generated with ToolForgeHQ brand styling:
   - Modern SaaS aesthetic
   - Blue/purple gradient backgrounds
   - No large text overlays
   - Premium, professional quality

### Category Visual Styles

Each category has a unique visual concept:

| Category | Visual Style |
|----------|-------------|
| Social Media | Phone mockups, social feeds, engagement icons |
| Business & Marketing | Documents, charts, brand boards, email UIs |
| Real Estate | Modern homes, floor plans, property cards |
| E-Commerce | Store interfaces, product grids, cart icons |
| Productivity | Calendars, planners, checklists, dashboards |
| Professional Docs | Resumes, slides, documents on desks |
| AI-Powered | Neural networks, glowing nodes, futuristic UI |

### Cost Considerations

- DALL-E 3 HD images cost approximately $0.08 per image
- Generating all 100 templates would cost approximately $8
- The script is idempotent - it only generates missing images

## Template Automation System

The site includes a full automation system for adding new templates without manual work.

### Architecture

- **Single source of truth:** `src/data/templates.json` contains all template metadata
- **Template files:** `public/templates/` contains downloadable template files
- **Automation scripts:** `tools/` contains scripts for programmatic template management

### Adding Templates Programmatically

Use the automation script to add new templates:

```bash
node tools/add-templates.cjs '{"templates": [{
  "id": "my-new-template",
  "name": "My New Template",
  "shortDescription": "Brief description",
  "fullDescription": "Full description...",
  "category": "content",
  "priceCents": 2900,
  "whatsIncluded": ["Item 1", "Item 2"],
  "whoItsFor": ["Audience 1", "Audience 2"],
  "faqs": [{"question": "Q?", "answer": "A."}],
  "tags": ["tag1", "tag2"],
  "featured": false
}]}'
```

### Template Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | URL-friendly unique identifier |
| name | string | Yes | Display name |
| shortDescription | string | Yes | Brief description for catalog cards |
| fullDescription | string | Yes | Full description for detail page |
| category | string | Yes | Category ID (content, funnels, social, email, notion, ai-tools) |
| priceCents | number | Yes | Price in cents (2900 = $29.00) |
| whatsIncluded | string[] | Yes | List of included items |
| whoItsFor | string[] | Yes | Target audience list |
| faqs | array | Yes | FAQ items with question/answer |
| tags | string[] | No | Searchable tags |
| featured | boolean | No | Show in featured section |
| comingSoon | boolean | No | Show waitlist instead of buy button |
| image | string | No | Image path (defaults to /images/{id}.jpg) |

### Automated Deployment

The site uses GitHub Actions for automated deployment:

1. Push changes to the `main` branch
2. GitHub Actions runs build checks
3. If successful, the site is automatically deployed

To set up automated deployment:

1. Push the repository to GitHub
2. Connect to Vercel/Netlify and enable auto-deploy on push
3. Set environment variables in your hosting platform

### Bulk Template Creation

To add multiple templates at once, create a JSON config file:

```json
{
  "templates": [
    { "id": "template-1", "name": "Template 1", ... },
    { "id": "template-2", "name": "Template 2", ... }
  ]
}
```

Then run:
```bash
node tools/add-templates.cjs "$(cat my-templates.json)"
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Vercel will auto-detect Vite and deploy
4. Set environment variable: `VITE_API_URL` to your backend URL

### Manual Deployment

1. Run `npm run build`
2. Upload the `dist` folder to any static hosting (Netlify, AWS S3, etc.)

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- shadcn/ui components
- Lucide React icons

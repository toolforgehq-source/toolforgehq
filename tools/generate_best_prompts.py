#!/usr/bin/env python3
"""
Generate best-in-class AI execution prompts for all templates.
Each prompt includes:
1. Diagnostic questions (asked before generating)
2. Template-structure-aware output format
3. Worked examples with sample inputs and outputs
4. Platform-specific constraints
5. Quality checklist and self-critique
6. Quickstart guide
"""

import json
import os

# Load templates
with open('src/data/templates.json', 'r') as f:
    data = json.load(f)
    templates = data['templates']

# Expert roles by category
expert_roles = {
    'social-media': 'world-class social media strategist who has grown 50+ accounts to 100K+ followers and generated $10M+ in revenue for clients through organic content',
    'business-marketing': 'elite business consultant and marketing strategist with an MBA from Harvard who has helped 500+ businesses raise funding, launch products, and scale to 7-8 figures',
    'real-estate': 'top 1% real estate agent and marketing specialist who has sold $500M+ in properties and built a personal brand with 200K+ followers',
    'ecommerce': 'e-commerce growth expert who has scaled 20+ Shopify stores to 7 figures and optimized conversion rates for brands like Gymshark and Fashion Nova',
    'productivity': 'productivity systems designer and executive coach who has worked with Fortune 500 CEOs and helped 10,000+ professionals optimize their workflows',
    'professional-docs': 'executive career coach and resume writer who has helped candidates land positions at Google, Goldman Sachs, McKinsey, and other top firms with $200K+ salaries',
    'ai-powered': 'AI implementation specialist and prompt engineer who has built AI workflows for 100+ businesses, reducing manual work by 80% on average'
}

# Platform constraints
platform_constraints = {
    'instagram': {
        'caption_limit': '2,200 characters (but first 125 shown in feed)',
        'hashtags': 'Max 30, but 5-10 targeted hashtags perform best',
        'best_times': 'Weekdays 11am-1pm, 7-9pm local time',
        'rules': 'No clickbait, no engagement bait ("comment YES"), no misleading claims'
    },
    'tiktok': {
        'video_length': '15-60 seconds optimal, up to 10 minutes allowed',
        'caption_limit': '2,200 characters',
        'hashtags': '3-5 relevant hashtags, mix trending + niche',
        'rules': 'Hook in first 1-2 seconds, no copyrighted music for business, vertical format only'
    },
    'linkedin': {
        'post_limit': '3,000 characters',
        'best_times': 'Tuesday-Thursday 8-10am, 12pm',
        'rules': 'Professional tone, no hard selling, value-first approach'
    },
    'youtube': {
        'title_limit': '100 characters (60 visible)',
        'description_limit': '5,000 characters',
        'tags': '500 characters total',
        'rules': 'Thumbnail must be compelling, first 30 seconds critical for retention'
    }
}

def get_template_structure(template):
    """Get the specific structure/sections for each template type."""
    template_id = template['id']
    whats_included = template.get('whatsIncluded', [])
    
    # Instagram Posts
    if 'instagram-posts' in template_id:
        return {
            'sections': ['Hook/Opening Line', 'Body Content', 'Call-to-Action', 'Hashtags'],
            'output_format': '''
| Post # | Hook (first line) | Body (2-3 sentences) | CTA | Hashtags (5-10) |
|--------|-------------------|----------------------|-----|-----------------|
| 1      | [Attention-grabbing opener] | [Value/story/insight] | [Specific action] | [Relevant tags] |
''',
            'constraints': [
                'Each hook must be under 125 characters (visible in feed)',
                'Body must provide genuine value, not just tease',
                'CTA must be specific and actionable (not just "link in bio")',
                'Mix hashtag sizes: 2 large (1M+), 3 medium (100K-1M), 3 small (<100K)'
            ]
        }
    
    # TikTok Scripts
    elif 'tiktok-scripts' in template_id:
        return {
            'sections': ['Hook (0-2 sec)', 'Setup (2-5 sec)', 'Content (5-45 sec)', 'Payoff/CTA (last 5 sec)'],
            'output_format': '''
## Script #[NUMBER]: [TITLE]

**HOOK (0-2 seconds):**
[Visual]: [What viewer sees]
[Audio]: "[Exact words to say]"

**SETUP (2-5 seconds):**
[Visual]: [What viewer sees]
[Audio]: "[Exact words to say]"

**CONTENT (5-45 seconds):**
[Visual]: [What viewer sees]
[Audio]: "[Exact words to say]"

**PAYOFF (last 5 seconds):**
[Visual]: [What viewer sees]
[Audio]: "[Exact words to say]"

**Suggested Sound:** [Trending sound or original audio recommendation]
**Hashtags:** [3-5 relevant hashtags]
**Best Time to Post:** [Specific recommendation]
''',
            'constraints': [
                'Hook must create curiosity or pattern interrupt in under 2 seconds',
                'Total script should be speakable in 30-60 seconds',
                'Include specific visual directions, not just dialogue',
                'Payoff must deliver on the hook promise (no bait-and-switch)'
            ]
        }
    
    # Reels Scripts
    elif 'reels-scripts' in template_id:
        return {
            'sections': ['Hook (0-3 sec)', 'Content (3-25 sec)', 'CTA (last 5 sec)'],
            'output_format': '''
## Reel #[NUMBER]: [TITLE]

**HOOK (0-3 seconds):**
[On-screen text]: "[Text overlay]"
[Visual]: [What viewer sees]
[Audio]: "[Voiceover or dialogue]"

**CONTENT (3-25 seconds):**
[On-screen text]: "[Key points as text]"
[Visual]: [B-roll or demonstration]
[Audio]: "[Voiceover]"

**CTA (last 5 seconds):**
[On-screen text]: "[Action prompt]"
[Audio]: "[Verbal CTA]"

**Music/Audio:** [Specific recommendation]
**Caption:** [Ready-to-paste caption with hashtags]
''',
            'constraints': [
                'Hook must stop the scroll - use text overlay + surprising visual',
                'Keep total length 15-30 seconds for best completion rate',
                'Text overlays must be readable in 2-3 seconds each',
                'End with clear, single CTA (follow, save, comment, or link)'
            ]
        }
    
    # YouTube Shorts
    elif 'youtube-shorts' in template_id:
        return {
            'sections': ['Hook (0-3 sec)', 'Value (3-50 sec)', 'Subscribe CTA (last 5 sec)'],
            'output_format': '''
## Short #[NUMBER]: [TITLE]

**TITLE:** [Under 60 characters, includes keyword]

**HOOK (0-3 seconds):**
[Visual]: [What viewer sees]
[Script]: "[Exact words]"

**VALUE SECTION (3-50 seconds):**
[Visual]: [What viewer sees]
[Script]: "[Exact words - broken into beats]"

**CTA (last 5 seconds):**
[Visual]: [What viewer sees]
[Script]: "[Subscribe prompt]"

**Description:** [SEO-optimized, 2-3 sentences]
**Tags:** [5-10 relevant tags]
''',
            'constraints': [
                'Must be vertical (9:16 aspect ratio)',
                'Under 60 seconds total',
                'Title must include searchable keyword',
                'No copyrighted music (use YouTube Audio Library)'
            ]
        }
    
    # Carousel Posts
    elif 'carousel' in template_id:
        return {
            'sections': ['Cover Slide', 'Content Slides (5-8)', 'CTA Slide'],
            'output_format': '''
## Carousel: [TITLE]

**SLIDE 1 (Cover):**
Headline: [Bold, curiosity-driving statement]
Subhead: [Promise or context]
Visual: [Image/graphic recommendation]

**SLIDE 2-[N] (Content):**
| Slide | Headline | Body Text | Visual Element |
|-------|----------|-----------|----------------|
| 2     | [Point 1] | [1-2 sentences] | [Icon/image] |
| 3     | [Point 2] | [1-2 sentences] | [Icon/image] |
...

**FINAL SLIDE (CTA):**
Headline: [Action prompt]
Body: [What they get/why act now]
CTA Button Text: [Specific action]

**Caption:** [Ready-to-paste, includes story + hashtags]
''',
            'constraints': [
                'Cover slide must be scroll-stopping (no text walls)',
                'Each slide should have ONE main point',
                'Use consistent visual style across all slides',
                'Final slide CTA must be specific (not just "follow for more")'
            ]
        }
    
    # Social Content Calendar
    elif 'social-30-day-calendar' in template_id or 'social-calendar' in template_id:
        return {
            'sections': ['Daily Content Plan', 'Content Pillars', 'Posting Schedule'],
            'output_format': '''
## 30-DAY CONTENT CALENDAR

**CONTENT PILLARS:**
1. [Pillar 1]: [Description] - Post [X] times/week
2. [Pillar 2]: [Description] - Post [X] times/week
3. [Pillar 3]: [Description] - Post [X] times/week
4. [Pillar 4]: [Description] - Post [X] times/week

**WEEKLY SCHEDULE:**
| Day | Content Type | Pillar | Format | Topic |
|-----|--------------|--------|--------|-------|
| Mon | Educational | 1 | Carousel | [Specific topic] |
| Tue | Behind-scenes | 3 | Reel | [Specific topic] |
...

**FULL 30-DAY PLAN:**
| Day | Date | Platform | Format | Hook | Topic | CTA | Hashtags |
|-----|------|----------|--------|------|-------|-----|----------|
| 1   | [Date] | IG | Carousel | [Hook] | [Topic] | [CTA] | [Tags] |
| 2   | [Date] | TikTok | Video | [Hook] | [Topic] | [CTA] | [Tags] |
...
''',
            'constraints': [
                'Balance content pillars (not all promotional)',
                'Include variety of formats (static, carousel, video, stories)',
                'Each post must have specific hook and CTA, not placeholders',
                'Account for platform-specific best posting times'
            ]
        }
    
    # Hooks Bank
    elif 'social-hooks-bank' in template_id or 'hooks' in template_id:
        return {
            'sections': ['Curiosity Hooks', 'Controversy Hooks', 'Story Hooks', 'List Hooks', 'Question Hooks'],
            'output_format': '''
## HOOKS BANK BY CATEGORY

### CURIOSITY HOOKS (create information gap)
| # | Hook | Best For | Example Post Topic |
|---|------|----------|-------------------|
| 1 | [Hook text] | [Format: Reel/Carousel/Post] | [Specific topic] |

### CONTROVERSY HOOKS (challenge assumptions)
| # | Hook | Best For | Example Post Topic |
|---|------|----------|-------------------|

### STORY HOOKS (personal narrative)
| # | Hook | Best For | Example Post Topic |
|---|------|----------|-------------------|

### LIST HOOKS (promise specific number)
| # | Hook | Best For | Example Post Topic |
|---|------|----------|-------------------|

### QUESTION HOOKS (engage directly)
| # | Hook | Best For | Example Post Topic |
|---|------|----------|-------------------|
''',
            'constraints': [
                'Each hook must be under 125 characters',
                'Hooks must be specific to the niche, not generic',
                'Include hooks for different content goals (grow, sell, engage)',
                'Avoid clickbait that doesn\'t deliver'
            ]
        }
    
    # Caption Swipe File
    elif 'caption' in template_id or 'swipe' in template_id:
        return {
            'sections': ['Story Captions', 'Educational Captions', 'Promotional Captions', 'Engagement Captions'],
            'output_format': '''
## CAPTION SWIPE FILE

### STORY CAPTIONS (personal, relatable)
**Caption #1:**
```
[First line - hook]

[Body - 2-3 short paragraphs]

[CTA]

[Hashtags]
```
Character count: [X]/2200

### EDUCATIONAL CAPTIONS (teach something)
...

### PROMOTIONAL CAPTIONS (sell without being salesy)
...

### ENGAGEMENT CAPTIONS (drive comments)
...
''',
            'constraints': [
                'First line must hook (under 125 chars visible)',
                'Use line breaks for readability',
                'Include specific CTA for each caption type',
                'Hashtags at end, separated by periods or line breaks'
            ]
        }
    
    # Business Plan
    elif 'business-plan' in template_id:
        return {
            'sections': ['Executive Summary', 'Company Description', 'Market Analysis', 'Organization', 'Products/Services', 'Marketing Strategy', 'Financial Projections', 'Funding Request'],
            'output_format': '''
## BUSINESS PLAN: [COMPANY NAME]

### 1. EXECUTIVE SUMMARY
**Business Concept:** [2-3 sentences]
**Mission Statement:** [1 sentence]
**Products/Services:** [Brief list]
**Target Market:** [Specific demographic]
**Financial Highlights:** [Key projections]
**Funding Request:** [Amount and use]

### 2. COMPANY DESCRIPTION
**Legal Structure:** [LLC/Corp/etc]
**Location:** [City, State]
**History:** [Brief background]
**Vision:** [Where you're headed]

### 3. MARKET ANALYSIS
**Industry Overview:** [Size, growth rate, trends]
**Target Market:**
- Demographics: [Age, income, location]
- Psychographics: [Values, behaviors, pain points]
- Market Size: [TAM, SAM, SOM with numbers]

**Competitive Analysis:**
| Competitor | Strengths | Weaknesses | Our Advantage |
|------------|-----------|------------|---------------|

### 4. PRODUCTS/SERVICES
[Detailed description with pricing]

### 5. MARKETING & SALES STRATEGY
**Positioning:** [How you're different]
**Channels:** [Where you'll reach customers]
**Customer Acquisition Cost:** [Estimated CAC]
**Sales Process:** [How you close deals]

### 6. FINANCIAL PROJECTIONS
**Year 1-3 Revenue:**
| Year | Revenue | Expenses | Net Profit | Margin |
|------|---------|----------|------------|--------|

**Break-even Analysis:** [When you'll be profitable]
**Key Assumptions:** [What these numbers depend on]

### 7. FUNDING REQUEST (if applicable)
**Amount:** [$X]
**Use of Funds:**
| Category | Amount | % of Total |
|----------|--------|------------|

**Exit Strategy:** [How investors get returns]
''',
            'constraints': [
                'All financial projections must include assumptions',
                'Market size must use TAM/SAM/SOM framework with sources',
                'Competitive analysis must be honest about weaknesses',
                'Executive summary must be compelling in under 1 page'
            ]
        }
    
    # Branding Kit
    elif 'branding-kit' in template_id:
        return {
            'sections': ['Brand Strategy', 'Visual Identity', 'Voice & Messaging', 'Brand Guidelines'],
            'output_format': '''
## BRAND KIT: [BRAND NAME]

### BRAND STRATEGY
**Brand Purpose:** [Why you exist beyond profit]
**Brand Vision:** [Where you're taking the industry]
**Brand Mission:** [How you serve customers daily]
**Brand Values:** [3-5 core values with descriptions]
**Brand Personality:** [5 adjectives that describe your brand]
**Target Audience:** [Detailed persona]

### VISUAL IDENTITY
**Logo Usage:**
- Primary logo: [Description]
- Secondary logo: [Description]
- Minimum size: [X pixels]
- Clear space: [X around logo]

**Color Palette:**
| Color | Hex | RGB | Use Case |
|-------|-----|-----|----------|
| Primary | #XXXXXX | X,X,X | [When to use] |
| Secondary | #XXXXXX | X,X,X | [When to use] |
| Accent | #XXXXXX | X,X,X | [When to use] |

**Typography:**
- Headlines: [Font name, weight, size]
- Body: [Font name, weight, size]
- Accent: [Font name, weight, size]

### VOICE & MESSAGING
**Brand Voice:** [Detailed description]
**Tone Variations:**
| Context | Tone | Example |
|---------|------|---------|
| Social media | [Tone] | "[Example]" |
| Customer service | [Tone] | "[Example]" |
| Sales | [Tone] | "[Example]" |

**Key Messages:**
1. [Primary message]
2. [Secondary message]
3. [Tertiary message]

**Tagline Options:**
1. "[Option 1]"
2. "[Option 2]"
3. "[Option 3]"
''',
            'constraints': [
                'Colors must have sufficient contrast for accessibility',
                'Voice must be consistent but adaptable to context',
                'All elements must work together cohesively',
                'Include do\'s and don\'ts for brand usage'
            ]
        }
    
    # Email Sequences
    elif 'email-sequence' in template_id:
        return {
            'sections': ['Email 1', 'Email 2', 'Email 3', 'Email 4', 'Email 5'],
            'output_format': '''
## EMAIL SEQUENCE: [SEQUENCE NAME]

### EMAIL 1: [PURPOSE]
**Send:** [Trigger/timing]
**Subject Line:** [Under 50 chars] | **Preview:** [Under 90 chars]

**Body:**
```
[Greeting]

[Opening hook - 1-2 sentences]

[Value/story - 2-3 paragraphs]

[CTA - clear and specific]

[Sign-off]
[Name]

P.S. [Reinforce CTA or add urgency]
```

**CTA Button:** [Button text]
**Goal:** [What success looks like]

---

### EMAIL 2: [PURPOSE]
[Same format...]
''',
            'constraints': [
                'Subject lines under 50 characters for mobile',
                'One clear CTA per email (not multiple competing actions)',
                'P.S. line should reinforce main CTA',
                'Each email must provide standalone value'
            ]
        }
    
    # Sales Funnel
    elif 'sales-funnel' in template_id:
        return {
            'sections': ['Landing Page', 'Thank You Page', 'Email Sequence', 'Sales Page', 'Checkout'],
            'output_format': '''
## SALES FUNNEL: [FUNNEL NAME]

### LANDING PAGE
**Headline:** [Benefit-driven, under 10 words]
**Subheadline:** [Expand on promise]
**Hero Section:**
- Image/Video: [Description]
- CTA Button: [Text]
- Social Proof: [Type]

**Body Sections:**
1. Problem Agitation: [Pain points]
2. Solution Introduction: [Your offer]
3. Benefits (not features): [3-5 bullets]
4. Social Proof: [Testimonials/logos]
5. FAQ: [3-5 objection handlers]
6. Final CTA: [Urgency + button]

### THANK YOU PAGE
**Headline:** [Confirmation + next step]
**Content:** [What to expect]
**Upsell/Downsell:** [Optional offer]

### EMAIL SEQUENCE
[5-7 emails with timing and purpose]

### SALES PAGE (if applicable)
[Long-form copy structure]
''',
            'constraints': [
                'One goal per page (don\'t distract with multiple CTAs)',
                'Above-the-fold must communicate core value',
                'Social proof must be specific and believable',
                'Remove all friction from checkout process'
            ]
        }
    
    # Real Estate - Listing Descriptions
    elif 'listing-descriptions' in template_id:
        return {
            'sections': ['Headline', 'Opening Hook', 'Property Features', 'Lifestyle Benefits', 'Call to Action'],
            'output_format': '''
## LISTING DESCRIPTION: [PROPERTY ADDRESS]

**MLS HEADLINE (80 chars max):**
[Attention-grabbing headline]

**OPENING HOOK (2-3 sentences):**
[Emotional appeal + key differentiator]

**PROPERTY HIGHLIGHTS:**
| Feature | Benefit | Emotional Appeal |
|---------|---------|------------------|
| [Feature] | [What it means for buyer] | [How it feels] |

**FULL DESCRIPTION:**
```
[Opening hook]

[Room-by-room or feature-by-feature walkthrough]

[Lifestyle paragraph - who this home is perfect for]

[Location benefits - neighborhood, schools, commute]

[Call to action with urgency]
```

**SOCIAL MEDIA VERSION (Instagram):**
[Shortened version with emojis and hashtags]

**SOCIAL MEDIA VERSION (Facebook):**
[Community-focused version]
''',
            'constraints': [
                'Lead with lifestyle benefits, not just features',
                'Avoid cliches: "stunning", "must-see", "won\'t last"',
                'Include specific details (not "spacious" but "2,400 sq ft")',
                'Comply with Fair Housing - no discriminatory language'
            ]
        }
    
    # Real Estate - Social Content
    elif 'realtor-social' in template_id:
        return {
            'sections': ['Market Updates', 'Listing Posts', 'Educational Content', 'Personal Brand', 'Engagement Posts'],
            'output_format': '''
## REALTOR SOCIAL CONTENT

### MARKET UPDATE POSTS
**Post #1:**
Hook: [Attention-grabbing stat or trend]
Body: [2-3 sentences explaining what it means for buyers/sellers]
CTA: [Specific action]
Hashtags: [Local + real estate tags]

### LISTING POSTS
**Just Listed Template:**
[Format for new listings]

**Open House Template:**
[Format for open house promotion]

**Just Sold Template:**
[Format for celebrating sales]

### EDUCATIONAL CONTENT
**Buyer Tips:**
[5 post ideas with hooks]

**Seller Tips:**
[5 post ideas with hooks]

### PERSONAL BRAND
**Behind-the-Scenes:**
[5 post ideas]

**Client Stories:**
[Testimonial format]
''',
            'constraints': [
                'All market data must be current and sourced',
                'Comply with local real estate advertising regulations',
                'Include local hashtags for discoverability',
                'Balance promotional content with value-add content'
            ]
        }
    
    # Product Descriptions
    elif 'product-descriptions' in template_id:
        return {
            'sections': ['Title', 'Bullet Points', 'Description', 'SEO Elements'],
            'output_format': '''
## PRODUCT DESCRIPTION: [PRODUCT NAME]

**TITLE (SEO-Optimized):**
[Primary keyword] - [Benefit] | [Brand Name]

**BULLET POINTS (5):**
- [Benefit 1]: [Feature that delivers it]
- [Benefit 2]: [Feature that delivers it]
- [Benefit 3]: [Feature that delivers it]
- [Benefit 4]: [Feature that delivers it]
- [Benefit 5]: [Feature that delivers it]

**SHORT DESCRIPTION (150 chars):**
[For product cards/previews]

**FULL DESCRIPTION:**
```
[Opening hook - problem or desire]

[Solution introduction - your product]

[Key benefits with sensory language]

[Social proof or credibility]

[Specifications/details]

[CTA with urgency]
```

**SEO ELEMENTS:**
- Meta Title: [Under 60 chars]
- Meta Description: [Under 160 chars]
- Keywords: [Primary, secondary, long-tail]
''',
            'constraints': [
                'Lead with benefits, not features',
                'Use sensory language (how it looks, feels, works)',
                'Include specific details (dimensions, materials, etc.)',
                'Optimize for search without keyword stuffing'
            ]
        }
    
    # Planners/Trackers
    elif 'planner' in template_id or 'tracker' in template_id:
        return {
            'sections': ['Overview', 'Daily/Weekly Sections', 'Goal Setting', 'Review Sections'],
            'output_format': '''
## [PLANNER/TRACKER NAME] CUSTOMIZATION

**OVERVIEW SECTION:**
- Title: [Personalized title]
- Time Period: [Dates covered]
- Primary Goals: [3-5 main objectives]

**DAILY/WEEKLY SECTIONS:**
| Section | Purpose | Prompts/Fields |
|---------|---------|----------------|
| [Section] | [Why it's included] | [What to fill in] |

**GOAL SETTING:**
- Long-term Vision: [Template]
- Quarterly Goals: [Template]
- Weekly Priorities: [Template]
- Daily Tasks: [Template]

**REVIEW SECTIONS:**
- Weekly Review: [Questions to answer]
- Monthly Review: [Questions to answer]
- Quarterly Review: [Questions to answer]

**CUSTOMIZATION SUGGESTIONS:**
[Specific recommendations based on user's goals]
''',
            'constraints': [
                'Keep daily sections achievable (not overwhelming)',
                'Include both planning AND reflection components',
                'Make it specific to user\'s actual goals and schedule',
                'Build in flexibility for real life'
            ]
        }
    
    # Resume/Professional Docs
    elif 'resume' in template_id:
        return {
            'sections': ['Header', 'Summary', 'Experience', 'Skills', 'Education'],
            'output_format': '''
## RESUME: [NAME]

**HEADER:**
[Name] | [Title]
[Email] | [Phone] | [LinkedIn] | [Portfolio]
[City, State]

**PROFESSIONAL SUMMARY (3-4 lines):**
[Role] with [X years] experience in [industry/function]. [Key achievement with metric]. [Unique value proposition]. [What you're looking for].

**EXPERIENCE:**

**[Job Title]** | [Company Name] | [City, State]
[Start Date] - [End Date]

- [Achievement verb] [what you did] [metric/result]
- [Achievement verb] [what you did] [metric/result]
- [Achievement verb] [what you did] [metric/result]

**SKILLS:**
| Category | Skills |
|----------|--------|
| Technical | [Skill 1, Skill 2, Skill 3] |
| Tools | [Tool 1, Tool 2, Tool 3] |
| Soft Skills | [Skill 1, Skill 2, Skill 3] |

**EDUCATION:**
[Degree] in [Major] | [University] | [Year]
[Relevant coursework, honors, GPA if >3.5]
''',
            'constraints': [
                'Every bullet must have a metric or specific outcome',
                'Use strong action verbs (led, built, increased, not "responsible for")',
                'Tailor to specific job description keywords',
                'Keep to 1 page for <10 years experience, 2 pages max'
            ]
        }
    
    # Pitch Deck
    elif 'pitch-deck' in template_id:
        return {
            'sections': ['Title', 'Problem', 'Solution', 'Market', 'Business Model', 'Traction', 'Team', 'Ask'],
            'output_format': '''
## PITCH DECK: [COMPANY NAME]

**SLIDE 1: TITLE**
- Company Name + Logo
- Tagline: [One sentence that explains what you do]
- Presenter Name & Title

**SLIDE 2: PROBLEM**
- Headline: [The problem in one sentence]
- 3 bullet points showing pain/cost of problem
- Optional: Customer quote

**SLIDE 3: SOLUTION**
- Headline: [Your solution in one sentence]
- Product screenshot/demo
- 3 key benefits

**SLIDE 4: MARKET OPPORTUNITY**
- TAM: $[X]B - [How calculated]
- SAM: $[X]M - [Your addressable market]
- SOM: $[X]M - [Realistic 3-year target]

**SLIDE 5: BUSINESS MODEL**
- How you make money
- Pricing tiers
- Unit economics (CAC, LTV, margins)

**SLIDE 6: TRACTION**
- Key metrics (revenue, users, growth rate)
- Logos of customers/partners
- Growth chart

**SLIDE 7: TEAM**
- Founders with relevant experience
- Key hires
- Advisors (if notable)

**SLIDE 8: THE ASK**
- Amount raising: $[X]
- Use of funds breakdown
- Milestones this will achieve
- Contact info
''',
            'constraints': [
                'One idea per slide (no text walls)',
                'Every claim must have supporting data',
                'Market size must be bottoms-up, not just top-down',
                'Traction must be honest (don\'t inflate metrics)'
            ]
        }
    
    # AI Prompts/Workflows
    elif 'ai-prompts' in template_id or 'ai-workflow' in template_id or 'ai-outreach' in template_id:
        return {
            'sections': ['System Prompt', 'User Input Template', 'Output Format', 'Refinement Options'],
            'output_format': '''
## AI PROMPT: [USE CASE]

**SYSTEM PROMPT:**
```
You are [specific expert role with credentials].

Your task is to [specific outcome].

Rules:
- [Constraint 1]
- [Constraint 2]
- [Constraint 3]

Output format:
[Exact structure required]
```

**USER INPUT TEMPLATE:**
```
[Variable 1]: [Description]
[Variable 2]: [Description]
[Variable 3]: [Description]
```

**EXAMPLE INPUT:**
```
[Filled example]
```

**EXAMPLE OUTPUT:**
```
[What the AI should produce]
```

**REFINEMENT PROMPTS:**
- To adjust tone: "[Prompt]"
- To add detail: "[Prompt]"
- To shorten: "[Prompt]"
''',
            'constraints': [
                'System prompt must be specific enough to constrain output',
                'Include at least one worked example',
                'Output format must be copy-paste ready',
                'Include common refinement scenarios'
            ]
        }
    
    # E-commerce templates
    elif 'ecommerce' in template_id or 'shopify' in template_id:
        return {
            'sections': ['Headlines', 'Body Copy', 'CTAs', 'Email/SMS Content'],
            'output_format': '''
## E-COMMERCE COPY: [STORE/PRODUCT]

**HOMEPAGE HEADLINES:**
| Section | Headline | Subheadline |
|---------|----------|-------------|
| Hero | [Benefit-driven] | [Supporting detail] |
| Features | [What you offer] | [Why it matters] |
| Social Proof | [Trust builder] | [Specific claim] |

**PRODUCT PAGE COPY:**
[See product description format]

**EMAIL TEMPLATES:**
| Email Type | Subject Line | Preview Text | Key Message |
|------------|--------------|--------------|-------------|
| Welcome | [Subject] | [Preview] | [Message] |
| Abandoned Cart | [Subject] | [Preview] | [Message] |
| Post-Purchase | [Subject] | [Preview] | [Message] |

**SMS TEMPLATES:**
| Type | Message (160 chars) |
|------|---------------------|
| [Type] | [Message] |
''',
            'constraints': [
                'All copy must focus on customer benefits',
                'Include urgency without being pushy',
                'SMS must be under 160 characters',
                'Comply with email/SMS marketing regulations'
            ]
        }
    
    # Default structure for any other template
    else:
        return {
            'sections': ['Overview', 'Main Content', 'Supporting Elements'],
            'output_format': '''
## [TEMPLATE NAME] OUTPUT

**SECTION 1: [NAME]**
[Content]

**SECTION 2: [NAME]**
[Content]

**SECTION 3: [NAME]**
[Content]
''',
            'constraints': [
                'Content must be specific to user\'s business/situation',
                'All outputs should be ready to use (not placeholders)',
                'Include actionable next steps'
            ]
        }

def get_worked_example(template):
    """Generate a worked example with sample inputs and outputs."""
    template_id = template['id']
    category = template['category']
    
    # Social Media examples
    if 'instagram-posts-fitness' in template_id:
        return {
            'sample_inputs': {
                'Business Name': 'FitLife Studio',
                'Niche': 'Boutique fitness studio specializing in HIIT and strength training',
                'Target Audience': 'Women 25-45 who want to get stronger but feel intimidated by traditional gyms',
                'Brand Voice': 'Encouraging, empowering, no-nonsense',
                'Products/Services': 'Group classes, personal training, 6-week transformation programs'
            },
            'sample_output': '''
**POST #1: Transformation Story**

Hook: "She almost quit after day 3. Here's what changed everything."

Body: Sarah walked into our studio convinced she "wasn't a gym person." Three months later, she's deadlifting her bodyweight and signed up for her first 5K.

The difference? She stopped trying to be perfect and started showing up consistently. That's it. No magic supplement. No extreme diet. Just 3 classes a week and trusting the process.

Your transformation starts the same way hers did - with one class.

CTA: Drop a [emoji] if you're ready to prove yourself wrong. Link in bio to book your free trial class.

Hashtags: #FitLifeStudio #WomenWhoLift #StrengthTraining #FitnessTransformation #HIITWorkout #BoutiqueFitness #GymMotivation #StrongerEveryDay #FitnessJourney #ChicagoFitness
'''
        }
    
    elif 'tiktok-scripts-business' in template_id:
        return {
            'sample_inputs': {
                'Business Name': 'Digital Agency Pro',
                'Niche': 'Social media marketing agency for local businesses',
                'Target Audience': 'Small business owners who know they need social media but don\'t have time',
                'Brand Voice': 'Direct, slightly provocative, results-focused',
                'Products/Services': 'Social media management packages starting at $997/month'
            },
            'sample_output': '''
**SCRIPT #1: "The $0 Marketing Strategy That Outperforms Paid Ads"**

HOOK (0-2 seconds):
[Visual]: Close-up of face, slightly confused expression
[Audio]: "Why are you paying for ads when THIS is free?"

SETUP (2-5 seconds):
[Visual]: Cut to screen recording of Google Business Profile
[Audio]: "Your Google Business Profile is the most underrated marketing tool for local businesses."

CONTENT (5-45 seconds):
[Visual]: Screen recording showing each step
[Audio]: "Here's what to do: First, claim your profile if you haven't. Second, add photos every single week - businesses with photos get 42% more direction requests. Third, post updates like you would on social media. Fourth, respond to every review within 24 hours. I've seen businesses double their leads doing just this."

PAYOFF (last 5 seconds):
[Visual]: Back to face, direct eye contact
[Audio]: "Save this and actually do it. Follow for more strategies that don't cost you a dime."

**Suggested Sound:** Original audio or trending business sound
**Hashtags:** #SmallBusinessTips #MarketingStrategy #GoogleMyBusiness #LocalBusiness #FreeMaketing
**Best Time to Post:** Tuesday or Wednesday, 11am-1pm
'''
        }
    
    elif 'business-plan-startup' in template_id:
        return {
            'sample_inputs': {
                'Business Name': 'MealPrepPro',
                'Business Type': 'Meal prep delivery service for busy professionals',
                'Location': 'Austin, Texas',
                'Stage': 'Pre-launch, seeking seed funding',
                'Funding Goal': '$250,000 for kitchen buildout, initial inventory, and 6 months operating expenses',
                'Target Market': 'Dual-income households, 28-45, $100K+ HHI, health-conscious but time-poor',
                'Revenue Model': 'Weekly subscription: $149/week for 10 meals'
            },
            'sample_output': '''
**EXECUTIVE SUMMARY**

MealPrepPro is a premium meal prep delivery service targeting busy professionals in Austin, Texas who want to eat healthy but lack time to cook. We deliver 10 chef-prepared, macro-balanced meals weekly for $149, saving customers 5+ hours per week while helping them hit their nutrition goals.

The Austin meal kit and prepared food market is $89M annually, growing 12% YoY. Our differentiation: locally-sourced ingredients, customizable macros for fitness goals, and same-day preparation (never frozen).

We're seeking $250,000 in seed funding to build out our commercial kitchen, hire our initial team, and acquire our first 500 subscribers. With a CAC of $45 and LTV of $1,788 (12-month average retention), we project profitability by month 18.

**MARKET ANALYSIS**

TAM: $89M (Austin prepared food delivery market)
SAM: $23M (Health-focused meal delivery, our positioning)
SOM: $2.3M (10% market share, Year 3 target = 297 active subscribers)

**Competitive Analysis:**
| Competitor | Price | Weakness | Our Advantage |
|------------|-------|----------|---------------|
| Factor | $11/meal | Generic, ships frozen | Fresh, local, customizable |
| Snap Kitchen | $10/meal | Limited customization | Macro-specific options |
| Local caterers | Varies | Inconsistent quality | Professional kitchen, trained chefs |
'''
        }
    
    elif 'email-sequence-welcome' in template_id:
        return {
            'sample_inputs': {
                'Business Name': 'CourseCreator Academy',
                'Product': 'Online course teaching people how to create and sell online courses',
                'Lead Magnet': 'Free guide: "Your First $10K Course: The 30-Day Launch Plan"',
                'Target Audience': 'Coaches, consultants, and experts who want to package their knowledge into courses',
                'Brand Voice': 'Friendly expert, been-there-done-that, no fluff'
            },
            'sample_output': '''
**EMAIL 1: Immediate (Lead Magnet Delivery)**

Subject: Your $10K Course Plan is inside [+ a quick question]
Preview: Here's exactly how to launch in 30 days...

Body:
Hey [First Name],

Your guide is ready: [DOWNLOAD LINK]

Before you dive in, I have one question:

What's the #1 thing stopping you from launching your course right now?

- "I don't know what to teach"
- "I'm not sure anyone would buy"
- "The tech stuff overwhelms me"
- "I don't have time"

Just hit reply and let me know. I read every response and it helps me send you the most relevant tips.

Talk soon,
[Name]

P.S. The guide covers days 1-30, but email 2 (coming tomorrow) shares the "Day 0" task that most people skip - and it's the reason 90% of courses fail before launch.

---

**EMAIL 2: Day 1 (The Day 0 Task)**

Subject: The "Day 0" task most course creators skip
Preview: This takes 20 minutes but saves you months of wasted effort...

[Continue sequence...]
'''
        }
    
    # Social 30-Day Calendar (flagship)
    elif 'social-30-day-calendar' in template_id:
        return {
            'sample_inputs': {
                'Business Name': 'Bloom Skincare',
                'Niche': 'Clean beauty brand selling natural skincare products',
                'Target Audience': 'Women 25-40 who care about ingredients and sustainability',
                'Brand Voice': 'Warm, educational, empowering',
                'Primary Goal': 'Drive sales while building community',
                'Products': 'Vitamin C serum ($48), Hydrating moisturizer ($38), Cleansing oil ($32)'
            },
            'sample_output': '''
## 30-DAY CONTENT CALENDAR: BLOOM SKINCARE

**CONTENT PILLARS:**
1. Education (40%): Ingredient spotlights, skincare myths, routine tips - 3x/week
2. Social Proof (25%): Customer results, reviews, UGC reposts - 2x/week
3. Behind-the-Scenes (20%): Founder story, sourcing, team - 1x/week
4. Promotional (15%): Product features, sales, bundles - 1x/week

**WEEK 1:**
| Day | Platform | Format | Hook | Topic | CTA |
|-----|----------|--------|------|-------|-----|
| 1 | IG | Carousel | "Your moisturizer is probably doing nothing. Here\'s why." | Why hydration ≠ moisturization | Save this for your next skincare shop |
| 2 | TikTok | Video | "POV: You finally read your skincare ingredients" | Ingredient red flags to avoid | Follow for more clean beauty tips |
| 3 | IG | Reel | "My 3-step morning routine (under 5 min)" | Founder\'s actual routine using products | Link in bio for the full routine |
| 4 | IG | Story | "Which skin concern should I address next?" | Poll: Acne vs Aging vs Dullness | Vote now |
| 5 | IG | Static | Customer before/after (with permission) | 30-day Vitamin C results | DM "GLOW" for 15% off |
| 6 | TikTok | Video | "The $48 product that replaced my $200 routine" | Vitamin C serum deep dive | Link in bio |
| 7 | IG | Carousel | "5 skincare mistakes I made in my 20s" | Founder story + lessons learned | Which mistake have you made? Comment below |

**FULL 30-DAY PLAN:**
[Days 8-30 continue with same level of detail, rotating through pillars]
'''
        }
    
    # Social Hooks Bank (flagship)
    elif 'social-hooks-bank' in template_id:
        return {
            'sample_inputs': {
                'Business Name': 'Coach Sarah',
                'Niche': 'Business coach for female entrepreneurs',
                'Target Audience': 'Women starting online businesses, feeling overwhelmed',
                'Brand Voice': 'Direct, supportive, no-BS',
                'Content Goals': 'Build authority and drive discovery calls'
            },
            'sample_output': '''
## HOOKS BANK: COACH SARAH

### CURIOSITY HOOKS
| # | Hook | Best For | Example Topic |
|---|------|----------|---------------|
| 1 | "The strategy that took me from $0 to $10K months (it\'s not what you think)" | Reel | Revenue milestone story |
| 2 | "I fired my biggest client last week. Here\'s why." | Carousel | Boundary setting |
| 3 | "Stop doing this if you want clients to actually pay you" | TikTok | Pricing mistakes |
| 4 | "The email that books 80% of my discovery calls" | Carousel | Sales templates |
| 5 | "Why your ideal client isn\'t buying (and what to do instead)" | Reel | Messaging fixes |

### CONTROVERSY HOOKS
| # | Hook | Best For | Example Topic |
|---|------|----------|---------------|
| 1 | "Unpopular opinion: You don\'t need a niche to make money" | Static post | Niche debate |
| 2 | "I\'m going to say what other coaches won\'t" | Reel | Industry truth bombs |
| 3 | "The \'passive income\' lie no one talks about" | Carousel | Realistic expectations |

### STORY HOOKS
| # | Hook | Best For | Example Topic |
|---|------|----------|---------------|
| 1 | "A year ago I was crying in my car after quitting my job" | Reel | Origin story |
| 2 | "My client just sent me this message and I\'m not okay" | Static | Client win |
| 3 | "The moment I knew I had to change everything" | Carousel | Pivot story |

### LIST HOOKS
| # | Hook | Best For | Example Topic |
|---|------|----------|---------------|
| 1 | "5 things I\'d do differently if I started my business today" | Carousel | Lessons learned |
| 2 | "3 signs you\'re ready to raise your prices" | Reel | Pricing confidence |
| 3 | "7 questions to ask before hiring a coach" | Carousel | Buyer education |
'''
        }
    
    # Caption Swipe File
    elif 'social-caption-swipe-file' in template_id or 'caption-swipe' in template_id:
        return {
            'sample_inputs': {
                'Business Name': 'The Balanced Plate',
                'Niche': 'Anti-diet nutritionist helping women heal their relationship with food',
                'Target Audience': 'Women 28-45 tired of yo-yo dieting, want food freedom',
                'Brand Voice': 'Compassionate, evidence-based, gently challenging',
                'Products': '1:1 coaching ($2,500), Group program ($997), Free workshop'
            },
            'sample_output': '''
## CAPTION SWIPE FILE: THE BALANCED PLATE

### STORY CAPTION #1 (Personal/Relatable)
```
I used to weigh my chicken breast to the gram.

I\'d panic if a restaurant didn\'t have nutrition info online. I\'d "save" calories all day so I could eat at a party. I thought I was being "healthy."

But here\'s what I know now: That wasn\'t health. That was an eating disorder wearing a fitness tracker.

Recovery didn\'t happen overnight. It started with one terrifying decision: eating lunch without calculating it first.

If you\'re exhausted from the mental math of eating, I want you to know: There\'s another way. And you deserve to find it.

Drop a heart if this resonates. You\'re not alone.

#intuitiveeating #foodfreedom #antidiet #edrecovery #haes #dietculturedropout
```
Character count: 687/2200

### EDUCATIONAL CAPTION #1
```
"But if I stop tracking, I\'ll gain weight."

I hear this every single week. Here\'s what the research actually shows:

95% of diets fail within 5 years. Not because you lack willpower - because restriction triggers biological responses that INCREASE hunger and DECREASE metabolism.

Your body isn\'t broken. It\'s doing exactly what it\'s designed to do: protect you from famine.

The path forward isn\'t more restriction. It\'s learning to trust your body again.

Save this for the next time diet culture tries to convince you otherwise.

#intuitiveeating #antidietdietitian #weightstigma #haes #foodfreedom
```
Character count: 612/2200
'''
        }
    
    # Branding Kit
    elif 'branding-kit-startup' in template_id:
        return {
            'sample_inputs': {
                'Business Name': 'Nimble',
                'Industry': 'Project management software for creative agencies',
                'Target Audience': 'Creative directors and agency owners, 30-50, managing teams of 5-50',
                'Brand Personality': 'Smart, approachable, efficient, slightly playful',
                'Competitors': 'Monday.com, Asana, Basecamp'
            },
            'sample_output': '''
## BRAND KIT: NIMBLE

### BRAND STRATEGY
**Brand Purpose:** To give creative teams their time back so they can do what they love - create.
**Brand Vision:** A world where project management disappears into the background of great work.
**Brand Mission:** We build tools that think like creatives, so agencies can spend less time managing and more time making.

**Brand Values:**
1. Clarity over complexity - If it takes a tutorial, we\'ve failed
2. Creative-first - Built by agency people, for agency people
3. Time is sacred - Every feature must save more time than it takes to learn
4. Delightfully efficient - Serious about results, not about ourselves

**Brand Personality:** The smart friend who always has a better way to do things but never makes you feel dumb for not knowing it.

### VISUAL IDENTITY
**Color Palette:**
| Color | Hex | Use Case |
|-------|-----|----------|
| Nimble Navy | #1E3A5F | Primary brand, headers, CTAs |
| Creative Coral | #FF6B6B | Accents, highlights, notifications |
| Clean White | #FFFFFF | Backgrounds, breathing room |
| Soft Gray | #F5F5F5 | Secondary backgrounds |

**Typography:**
- Headlines: Inter Bold, 32-48px
- Body: Inter Regular, 16px
- UI Elements: Inter Medium, 14px

### VOICE & MESSAGING
**Tagline Options:**
1. "Project management that gets out of your way"
2. "Less managing. More making."
3. "Built for creatives. By creatives."

**Tone by Context:**
| Context | Tone | Example |
|---------|------|---------|
| Marketing | Confident, benefit-focused | "Stop managing projects. Start finishing them." |
| Product UI | Helpful, concise | "Nice! Project created. What\'s next?" |
| Support | Warm, solution-oriented | "Let\'s get this sorted. Here\'s what I\'d try..." |
'''
        }
    
    # Real Estate Listing Descriptions
    elif 'listing-descriptions-luxury' in template_id:
        return {
            'sample_inputs': {
                'Property Address': '1847 Oceanview Drive, Malibu, CA',
                'Property Type': 'Luxury oceanfront estate',
                'Bedrooms/Baths': '5 bed, 6 bath',
                'Square Footage': '6,200 sq ft',
                'Key Features': 'Private beach access, infinity pool, chef\'s kitchen, wine cellar',
                'Price': '$12,500,000',
                'Target Buyer': 'Tech executives, entertainment industry, international buyers'
            },
            'sample_output': '''
## LISTING: 1847 OCEANVIEW DRIVE, MALIBU

**MLS HEADLINE (80 chars):**
Oceanfront Malibu Estate | Private Beach | Infinity Pool | $12.5M

**OPENING HOOK:**
Wake up to the sound of waves breaking on YOUR private beach. This isn\'t just a home - it\'s a lifestyle reserved for those who\'ve earned the extraordinary.

**FULL DESCRIPTION:**
```
Perched on a bluff overlooking 100 feet of private Malibu coastline, this architectural masterpiece delivers the California dream in its purest form.

Step through the custom pivot door into 6,200 square feet of indoor-outdoor living designed for both grand entertaining and quiet mornings watching dolphins play in the surf below.

The chef\'s kitchen - equipped with Wolf, Sub-Zero, and a 500-bottle temperature-controlled wine room - opens to a great room where 20-foot ceilings and floor-to-ceiling glass blur the line between home and horizon.

Five bedroom suites, each with ocean views. A primary retreat with private terrace, spa bath, and direct pool access. An infinity edge that appears to pour directly into the Pacific.

Private beach access via a gated path. Gated motor court with 4-car garage. Smart home integration throughout.

This is Malibu living at its finest. Private showings for qualified buyers.
```

**INSTAGRAM VERSION:**
```
POV: Your morning commute is 47 steps to your private beach 🌊

5 bed | 6 bath | 6,200 SF | Private beach | Infinity pool

This Malibu oceanfront estate just hit the market at $12.5M.

DM "MALIBU" for the full property video.

#MalibuRealEstate #LuxuryHomes #OceanfrontLiving #CaliforniaLuxury #MillionDollarListing
```
'''
        }
    
    # Resume
    elif 'resume-modern-professional' in template_id or 'resume-executive' in template_id:
        return {
            'sample_inputs': {
                'Name': 'Jordan Chen',
                'Target Role': 'Senior Product Manager at a Series B+ startup',
                'Current Role': 'Product Manager at mid-size SaaS company',
                'Years Experience': '6 years',
                'Top Achievement': 'Led product that grew from $2M to $8M ARR in 18 months',
                'Key Skills': 'Product strategy, user research, cross-functional leadership, data analysis'
            },
            'sample_output': '''
## RESUME: JORDAN CHEN

**HEADER:**
JORDAN CHEN
Senior Product Manager
jordan.chen@email.com | (555) 123-4567 | linkedin.com/in/jordanchen | San Francisco, CA

**PROFESSIONAL SUMMARY:**
Product Manager with 6 years of experience scaling B2B SaaS products from early traction to market leadership. Led product strategy that grew ARR from $2M to $8M in 18 months. Known for translating complex user needs into elegant solutions and aligning cross-functional teams around ambitious roadmaps.

**EXPERIENCE:**

**Product Manager** | TechFlow (Series B SaaS) | San Francisco, CA
Jan 2021 - Present

- Owned product roadmap for core platform serving 2,000+ enterprise customers, driving 4x ARR growth ($2M → $8M) in 18 months
- Led discovery and launch of AI-powered feature that increased user activation by 34% and reduced churn by 22%
- Built and managed team of 2 associate PMs; established product processes adopted company-wide
- Partnered with Sales to close $1.2M enterprise deal by scoping custom integration in 6-week sprint

**Associate Product Manager** | DataSync | San Francisco, CA
Jun 2018 - Dec 2020

- Shipped 12 features across web and mobile platforms, including redesigned onboarding that improved Day-7 retention by 28%
- Conducted 100+ user interviews; synthesized insights into persona framework used across Product and Marketing
- Reduced support tickets by 40% by identifying and prioritizing top 5 UX friction points

**SKILLS:**
| Category | Skills |
|----------|--------|
| Product | Roadmapping, PRDs, User Research, A/B Testing, Pricing Strategy |
| Tools | Amplitude, Mixpanel, Figma, Jira, SQL, Looker |
| Leadership | Cross-functional alignment, Stakeholder management, Mentorship |

**EDUCATION:**
B.S. Computer Science | UC Berkeley | 2018
'''
        }
    
    # Default example for other templates
    else:
        niche = template.get('name', 'your business')
        category = template.get('category', 'business')
        
        # Generate category-specific default examples
        if category == 'social-media':
            return {
                'sample_inputs': {
                    'Business Name': 'Example Creative Studio',
                    'Niche': 'Branding and design agency for startups',
                    'Target Audience': 'Startup founders who need professional branding but have limited budgets',
                    'Brand Voice': 'Creative, approachable, expert',
                    'Goals': 'Generate leads for branding packages'
                },
                'sample_output': f'''
**EXAMPLE OUTPUT FOR {niche.upper()}**

This template would generate content specifically tailored to your creative studio, including:
- Platform-specific content optimized for your target audience of startup founders
- Hooks and captions that speak to budget-conscious entrepreneurs
- CTAs driving toward your branding package offerings
- Hashtag strategies for the startup/design community

The AI will ask you diagnostic questions first, then produce ready-to-use content in the exact format shown in the OUTPUT FORMAT section above.
'''
            }
        elif category == 'business-marketing':
            return {
                'sample_inputs': {
                    'Business Name': 'GrowthPath Consulting',
                    'Industry': 'Business consulting for e-commerce brands',
                    'Target Market': 'E-commerce brands doing $500K-$5M annually',
                    'Services': 'Growth strategy, conversion optimization, retention systems',
                    'Goals': 'Attract qualified leads, establish thought leadership'
                },
                'sample_output': f'''
**EXAMPLE OUTPUT FOR {niche.upper()}**

This template would generate professional business content including:
- Strategic frameworks tailored to e-commerce consulting
- Data-driven insights and industry benchmarks
- Compelling case study formats
- Lead generation assets

The AI will customize everything based on your specific consulting focus and target client profile.
'''
            }
        else:
            return {
                'sample_inputs': {
                    'Business Name': '[Your Business Name]',
                    'Niche': f'Your specific focus within {niche}',
                    'Target Audience': 'Your ideal customer profile',
                    'Goals': 'Your primary objectives'
                },
                'sample_output': f'''
**EXAMPLE OUTPUT FOR {niche.upper()}**

After answering the diagnostic questions, the AI will generate:
- Fully customized content specific to YOUR business
- Ready-to-use outputs in the exact format shown above
- Professional quality that matches your brand voice
- Actionable deliverables you can implement immediately

The key is providing detailed answers to the diagnostic questions - the more specific you are, the better your outputs will be.
'''
            }

def get_diagnostic_questions(template):
    """Generate diagnostic questions the AI should ask before generating content."""
    template_id = template['id']
    category = template['category']
    
    base_questions = [
        "What's your business name and what do you sell/offer?",
        "Who is your ideal customer? (Be specific: age, situation, pain points)",
        "What makes you different from competitors?",
    ]
    
    if 'social' in template_id or 'instagram' in template_id or 'tiktok' in template_id or 'reels' in template_id or 'youtube' in template_id:
        return base_questions + [
            "What's your current follower count and engagement rate?",
            "What content has performed best for you so far?",
            "What's your primary goal: grow audience, drive sales, or build authority?",
            "What's your brand voice? (casual, professional, witty, inspirational, bold)"
        ]
    
    elif 'business-plan' in template_id:
        return base_questions + [
            "What stage is your business? (idea, pre-revenue, generating revenue)",
            "Are you seeking funding? If so, how much and from whom?",
            "What's your revenue model? How do you make money?",
            "Who are your top 3 competitors and how are you different?"
        ]
    
    elif 'email' in template_id:
        return base_questions + [
            "What action do you want readers to take after this sequence?",
            "What's the entry point? (lead magnet, purchase, webinar signup)",
            "What objections or concerns does your audience typically have?",
            "What's your average customer lifetime value?"
        ]
    
    elif 'real-estate' in template_id or 'realtor' in template_id or 'listing' in template_id:
        return [
            "What type of properties do you specialize in? (luxury, first-time buyers, investment)",
            "What's your target geographic area?",
            "What makes you different from other agents in your market?",
            "Are you focusing on buyers, sellers, or both?",
            "What's your personal brand angle? (local expert, luxury specialist, investor-friendly)"
        ]
    
    elif 'ecommerce' in template_id or 'product' in template_id or 'shopify' in template_id:
        return base_questions + [
            "What's your average order value?",
            "What's your best-selling product and why do customers love it?",
            "What objections do customers have before buying?",
            "Do you have any social proof (reviews, testimonials, press)?"
        ]
    
    elif 'resume' in template_id or 'professional' in template_id:
        return [
            "What specific role/title are you targeting?",
            "What's your most impressive achievement with measurable results?",
            "What industry are you in and what's your experience level?",
            "What keywords from the job description should we include?",
            "What's your unique value proposition vs other candidates?"
        ]
    
    elif 'branding' in template_id:
        return base_questions + [
            "What 3-5 words describe how you want customers to feel about your brand?",
            "Who are 2-3 brands (in any industry) whose vibe you admire?",
            "What's the one thing you want people to remember about your brand?",
            "What's your brand's origin story or founder story?"
        ]
    
    else:
        return base_questions + [
            "What's the primary goal you're trying to achieve with this template?",
            "What have you tried before that didn't work?",
            "What does success look like for you?"
        ]

def generate_best_prompt(template):
    """Generate a best-in-class AI execution prompt for a template."""
    template_id = template['id']
    template_name = template['name']
    category = template['category']
    whats_included = template.get('whatsIncluded', [])
    
    # Get expert role
    expert_role = expert_roles.get(category, expert_roles['business-marketing'])
    
    # Get template structure
    structure = get_template_structure(template)
    
    # Get diagnostic questions
    questions = get_diagnostic_questions(template)
    
    # Get worked example
    example = get_worked_example(template)
    
    # Build the prompt
    prompt = f'''# AI EXECUTION PROMPT: {template_name}

## QUICK START (Do This First)
1. Copy this entire prompt into ChatGPT, Claude, or Gemini
2. Answer the diagnostic questions when asked
3. Review the example output to see what you'll get
4. Request refinements until it's perfect

---

## THE PROMPT

You are a {expert_role}.

I purchased the "{template_name}" template and need you to help me customize it for my specific business. Before generating any content, you MUST ask me the following diagnostic questions and wait for my answers:

### DIAGNOSTIC QUESTIONS (Ask These First)
'''
    
    for i, q in enumerate(questions, 1):
        prompt += f'{i}. {q}\n'
    
    prompt += f'''
Once I provide my answers, generate content that follows the EXACT output format below.

### OUTPUT FORMAT
{structure['output_format']}

### CONSTRAINTS (You Must Follow These)
'''
    
    for constraint in structure['constraints']:
        prompt += f'- {constraint}\n'
    
    prompt += f'''
### QUALITY CHECKLIST (Self-Review Before Delivering)
Before providing your output, verify:
- [ ] Every piece of content is specific to MY business (no generic placeholders)
- [ ] All hooks/headlines would make ME stop scrolling
- [ ] CTAs are specific and actionable (not "click here" or "learn more")
- [ ] Content matches my stated brand voice
- [ ] No cliches or filler phrases
- [ ] Ready to copy-paste and use immediately

If any item fails, revise before delivering.

---

## WORKED EXAMPLE

To show you exactly what to expect, here's an example:

### Sample Inputs:
'''
    
    for key, value in example['sample_inputs'].items():
        prompt += f'- **{key}:** {value}\n'
    
    prompt += f'''
### Sample Output:
{example['sample_output']}

---

## REFINEMENT OPTIONS

After I receive the initial output, I may ask you to:
- "Make it more [casual/professional/bold/friendly]"
- "Shorter versions for [platform]"
- "More focus on [specific product/service/offer]"
- "Create 5 variations of [specific element]"
- "Optimize for [specific goal: engagement/sales/authority]"

---

## START NOW

Please begin by asking me the diagnostic questions above. Do not generate any content until I've answered them.
'''
    
    return prompt

def generate_quickstart_guide(template):
    """Generate a quickstart guide for each template."""
    template_name = template['name']
    template_id = template['id']
    whats_included = template.get('whatsIncluded', [])
    
    guide = f'''# QUICKSTART GUIDE: {template_name}

## What You Just Got
'''
    
    for item in whats_included[:5]:
        guide += f'- {item}\n'
    
    guide += f'''
## Your 10-Minute Quick Win

1. **Open the AI prompt file** ({template_id}-prompt.txt)
2. **Copy the entire prompt** into ChatGPT, Claude, or Gemini
3. **Answer the diagnostic questions** the AI asks you
4. **Review the output** and request one refinement
5. **Copy your first piece of content** and use it today

That's it. You should have usable content in under 10 minutes.

## Your 60-Minute Deep Dive

1. **Review the full template PDF** to understand all sections
2. **Run the AI prompt** and generate content for ALL sections
3. **Customize the outputs** with your specific details, stories, and examples
4. **Create a content bank** by saving all outputs in one document
5. **Schedule your first week** of content using the outputs

## What Success Looks Like

After using this template + AI prompt correctly, you should have:
- Ready-to-use content (not placeholders or ideas)
- Content that sounds like YOU (not generic AI)
- A system you can repeat whenever you need more content

## Common Mistakes to Avoid

1. **Skipping the diagnostic questions** - The AI needs your specific inputs to create specific outputs
2. **Accepting the first output** - Always request at least one refinement
3. **Not customizing** - Add your own stories, examples, and personality
4. **Trying to do everything at once** - Start with one section, master it, then expand

## Need Help?

If the AI output doesn't match your expectations:
1. Be more specific in your diagnostic answers
2. Provide examples of content you like
3. Ask for "5 variations" and pick the best elements from each

---

Now go create something great. Your first piece of content is 10 minutes away.
'''
    
    return guide

# Generate prompts for all templates
all_prompts = {}
os.makedirs('public/prompts', exist_ok=True)
os.makedirs('public/quickstart', exist_ok=True)

for template in templates:
    template_id = template['id']
    
    # Generate best-in-class prompt
    prompt = generate_best_prompt(template)
    all_prompts[template_id] = {
        'templateId': template_id,
        'templateName': template['name'],
        'category': template['category'],
        'prompt': prompt
    }
    
    # Save individual prompt file
    with open(f'public/prompts/{template_id}-prompt.txt', 'w') as f:
        f.write(prompt)
    
    # Generate and save quickstart guide
    quickstart = generate_quickstart_guide(template)
    with open(f'public/quickstart/{template_id}-quickstart.txt', 'w') as f:
        f.write(quickstart)
    
    print(f'Generated: {template_id}')

# Save all prompts to JSON
with open('src/data/ai-prompts.json', 'w') as f:
    json.dump(all_prompts, f, indent=2)

print(f'\nGenerated {len(templates)} best-in-class prompts and quickstart guides!')
print(f'Prompts saved to: public/prompts/')
print(f'Quickstart guides saved to: public/quickstart/')
print(f'JSON saved to: src/data/ai-prompts.json')

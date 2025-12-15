import { Link } from 'react-router-dom';
import { FileText, Share2, Sparkles, ArrowRight, Search, Download, Zap, Users, Briefcase, Lightbulb, Home as HomeIcon, ShoppingCart, Calendar, Shield, Award, Package } from 'lucide-react';
import EmailCapture from '../components/EmailCapture';
import { categories, templates, getCategoryById } from '../data/templates';
import { bundles, getCategoryForBundle } from '../data/bundles';

const iconMap: Record<string, React.ReactNode> = {
  FileText: <FileText className="w-6 h-6" />,
  Share2: <Share2 className="w-6 h-6" />,
  Sparkles: <Sparkles className="w-6 h-6" />,
  Briefcase: <Briefcase className="w-6 h-6" />,
  Home: <HomeIcon className="w-6 h-6" />,
  ShoppingCart: <ShoppingCart className="w-6 h-6" />,
  Calendar: <Calendar className="w-6 h-6" />,
};

// Get featured templates
const featuredTemplates = templates.filter(t => t.featured && !t.comingSoon).slice(0, 6);

// Get featured bundles - Social Media Starter Pack first, then 2 others
const socialMediaBundle = bundles.find(b => b.id === 'social-media-starter-pack');
const otherBundles = bundles.filter(b => b.id !== 'social-media-starter-pack').slice(0, 2);
const featuredBundles = socialMediaBundle ? [socialMediaBundle, ...otherBundles] : bundles.slice(0, 3);

const steps = [
  {
    icon: <Search className="w-8 h-8 text-indigo-600" />,
    title: 'Choose Your System',
    description: 'Browse our library of AI Execution Systems. Each one combines a professional template with a proprietary AI prompt and step-by-step instructions.',
  },
  {
    icon: <Download className="w-8 h-8 text-indigo-600" />,
    title: 'Download & Prepare',
    description: 'Get instant access to your template, AI execution prompt, and guided instructions. Gather your inputs based on the included guide.',
  },
  {
    icon: <Zap className="w-8 h-8 text-indigo-600" />,
    title: 'Execute with AI',
    description: 'Paste the execution prompt into ChatGPT, Claude, or Gemini. Provide your inputs, and receive structured output ready to use.',
  },
];

const audiences = [
  {
    icon: <Users className="w-8 h-8 text-indigo-600" />,
    title: 'Content Creators',
    description: 'YouTubers, podcasters, and bloggers who need to produce consistent content without burning out.',
  },
  {
    icon: <Lightbulb className="w-8 h-8 text-indigo-600" />,
    title: 'Coaches & Consultants',
    description: 'Experts who want to scale their impact with courses, funnels, and AI-powered marketing systems.',
  },
  {
    icon: <Briefcase className="w-8 h-8 text-indigo-600" />,
    title: 'Small Business Owners',
    description: 'Entrepreneurs who need professional marketing without hiring an agency.',
  },
];

const testimonials = [
  {
    quote: "These templates saved me hours every week. The AI prompts make customization so easy.",
    author: "Sarah M.",
    role: "Content Creator",
  },
  {
    quote: "Finally, templates that actually work with AI tools. Game changer for my coaching business.",
    author: "Michael R.",
    role: "Business Coach",
  },
  {
    quote: "I launched my email sequence in one afternoon. Would have taken me weeks before.",
    author: "Jessica L.",
    role: "Course Creator",
  },
];

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text and CTA */}
            <div className="text-center lg:text-left">
              {/* Logo above headline */}
              <div className="flex items-center gap-3 justify-center lg:justify-start mb-6">
                <img 
                  src="/logo/toolforgehq-logo.png" 
                  alt="ToolForgeHQ" 
                  className="h-14 w-auto"
                />
              </div>
              <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                100+ AI Execution Systems
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold text-gray-900 tracking-tight">
                AI Execution Systems for Creators, Coaches, and Small Businesses
              </h1>
              <p className="mt-6 text-lg md:text-xl text-gray-600">
                Professional templates paired with proprietary AI prompts and step-by-step instructions. You provide the inputs, AI generates the output, you get results.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/templates"
                  className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:bg-indigo-500 transition-all hover:shadow-xl"
                >
                  Browse Templates
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <a
                  href="#email-capture"
                  className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Join Early Access List
                </a>
              </div>
              {/* Trust indicators */}
              <div className="mt-10 flex flex-wrap items-center gap-6 justify-center lg:justify-start text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-blue-500" />
                  <span>Instant Download</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-500" />
                  <span>Premium Quality</span>
                </div>
              </div>
            </div>
            
            {/* Right side - Hero Image */}
            <div className="relative lg:pl-8">
              <div className="relative">
                <img
                  src="/hero/hero-main.jpg"
                  alt="ToolForgeHQ - AI-Ready Templates"
                  className="w-full h-auto rounded-2xl shadow-2xl object-cover"
                />
                {/* Floating badge */}
                <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 hidden sm:block">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Zap className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">2,500+</p>
                      <p className="text-xs text-gray-500">Downloads</p>
                    </div>
                  </div>
                </div>
                {/* Floating badge 2 */}
                <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4 hidden sm:block">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <FileText className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">100+</p>
                      <p className="text-xs text-gray-500">Templates</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </section>

      {/* Featured Bundles Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Package className="w-4 h-4" />
              Save up to 40%
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Bundles</h2>
            <p className="mt-4 text-lg text-gray-600">Get the best value with our curated template bundles</p>
          </div>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBundles.map((bundle) => {
              const category = getCategoryForBundle(bundle);
              return (
                <Link
                  key={bundle.id}
                  to={`/bundles/${bundle.slug}`}
                  className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="aspect-square relative overflow-hidden bg-gray-100">
                    <img
                      src={bundle.previewImage}
                      alt={bundle.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <img 
                        src="/logo/logo-badge.png" 
                        alt="ToolForgeHQ" 
                        className="w-8 h-8 rounded-lg shadow-md"
                      />
                    </div>
                    <div className="absolute top-3 right-3 bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      Bundle
                    </div>
                    <div className="absolute bottom-3 right-3 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      Save {bundle.savingsPercent}%
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-indigo-50 text-indigo-700">
                        {category?.name || bundle.categoryId}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        {bundle.templateIds.length} templates
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {bundle.name}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">{bundle.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-gray-900">
                          ${(bundle.priceCents / 100).toFixed(0)}
                        </span>
                        <span className="ml-2 text-sm text-green-600 font-medium">
                          Save {bundle.savingsPercent}%
                        </span>
                      </div>
                      <span className="text-sm text-indigo-600 font-medium group-hover:underline">View Bundle</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <Link
              to="/bundles"
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-green-500 transition-colors"
            >
              View All Bundles
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Templates Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Templates</h2>
            <p className="mt-4 text-lg text-gray-600">Our most popular premium templates</p>
          </div>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTemplates.map((template) => {
              const category = getCategoryById(template.category);
              const previewImage = template.previewImage || template.previewUrl || category?.categoryPreview;
              return (
              <Link
                key={template.id}
                to={`/templates/${template.id}`}
                className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-square relative overflow-hidden bg-gray-100">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt={template.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
                      <span className="text-4xl font-bold text-indigo-600">TF</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    Featured
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {template.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">{template.shortDescription}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      ${template.priceCents ? (template.priceCents / 100).toFixed(0) : '0'}
                    </span>
                    <span className="text-sm text-indigo-600 font-medium group-hover:underline">View Details</span>
                  </div>
                </div>
              </Link>
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <Link
              to="/templates"
              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
            >
              View All 100+ Templates
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* What Makes This Different Section */}
      <section className="py-20 bg-gradient-to-b from-indigo-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What Makes ToolForgeHQ Different</h2>
            <p className="mt-4 text-lg text-gray-600">We don't sell templates. We sell AI Execution Systems.</p>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-100 mb-6">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Professional Templates</h3>
              <p className="mt-3 text-gray-600">Every template is professionally crafted with real structure and frameworks. Not generic placeholders.</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 mb-6">
                <Sparkles className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Proprietary AI Prompts</h3>
              <p className="mt-3 text-gray-600">Each system includes a copy-paste AI execution prompt engineered to produce structured, high-quality output.</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-100 mb-6">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Step-by-Step Instructions</h3>
              <p className="mt-3 text-gray-600">Clear guidance on which AI tool to use, where to paste the prompt, what inputs to provide, and what output to expect.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600">Three steps to execute with AI and get professional results</p>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-3 text-gray-600">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full">
                    <ArrowRight className="w-6 h-6 text-gray-300 mx-auto" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Template Categories</h2>
            <p className="mt-4 text-lg text-gray-600">Find the perfect template for your needs</p>
          </div>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/templates?category=${category.id}`}
                className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-indigo-200 hover:shadow-lg transition-all"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                  {iconMap[category.icon]}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {category.name}
                </h3>
                <p className="mt-2 text-sm text-gray-600">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Who This Is For</h2>
            <p className="mt-4 text-lg text-gray-600">Templates designed for people who want results, not complexity</p>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {audiences.map((audience, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white shadow-sm">
                  {audience.icon}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">{audience.title}</h3>
                <p className="mt-3 text-gray-600">{audience.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What People Are Saying</h2>
            <p className="mt-4 text-lg text-gray-600">Join thousands of creators using our templates</p>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-8 border border-gray-200">
                <div className="flex gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                <div className="mt-6">
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="email-capture" className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <EmailCapture />
        </div>
      </section>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { FileText, Share2, Sparkles, ArrowRight, Search, Download, Zap, Users, Briefcase, Lightbulb, Home as HomeIcon, ShoppingCart, Calendar, Shield, Clock, Award } from 'lucide-react';
import EmailCapture from '../components/EmailCapture';
import { categories, templates, getCategoryById } from '../data/templates';

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

const steps = [
  {
    icon: <Search className="w-8 h-8 text-indigo-600" />,
    title: 'Browse Templates',
    description: 'Explore our library of AI-ready templates designed for creators, coaches, and small businesses.',
  },
  {
    icon: <Download className="w-8 h-8 text-indigo-600" />,
    title: 'Download & Customize',
    description: 'Get instant access to your template. Use the included AI prompts to customize everything.',
  },
  {
    icon: <Zap className="w-8 h-8 text-indigo-600" />,
    title: 'Create 10x Faster',
    description: 'Plug your customized templates into your workflow and watch your productivity soar.',
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
    description: 'Experts who want to scale their impact with courses, funnels, and automated marketing.',
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
              <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                100+ Premium Templates
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold text-gray-900 tracking-tight">
                AI-Ready Templates for Creators, Coaches, and Small Businesses
              </h1>
              <p className="mt-6 text-lg md:text-xl text-gray-600">
                Download plug-and-play templates built to work with AI tools so you can create content, funnels, and offers 10x faster.
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

      {/* Featured Templates Section */}
      <section className="py-20 bg-white">
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

      {/* Why ToolForgeHQ Section */}
      <section className="py-20 bg-gradient-to-b from-indigo-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Why ToolForgeHQ?</h2>
            <p className="mt-4 text-lg text-gray-600">Premium templates that deliver real results</p>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-100 mb-6">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Premium Quality</h3>
              <p className="mt-3 text-gray-600">Every template is professionally crafted with real content, not placeholders. Ready to use immediately.</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 mb-6">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Instant Download</h3>
              <p className="mt-3 text-gray-600">Get immediate access to your templates after purchase. No waiting, no hassle.</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-100 mb-6">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">AI-Optimized</h3>
              <p className="mt-3 text-gray-600">Templates designed to work seamlessly with AI tools like ChatGPT, Claude, and more.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600">Three simple steps to supercharge your productivity</p>
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

import { useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Check, Loader2, Shield, Download, Award, Package, RefreshCw, Clock, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { getBundleBySlug, getBundleTemplates, calculateBundleOriginalPrice, getCategoryForBundle } from '../data/bundles';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function BundleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const canceled = searchParams.get('canceled');
  const bundle = getBundleBySlug(slug || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!bundle) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Bundle not found</h1>
          <Link to="/bundles" className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-500">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Bundles
          </Link>
        </div>
      </div>
    );
  }

  const category = getCategoryForBundle(bundle);
  const bundleTemplates = getBundleTemplates(bundle);
  const originalPrice = calculateBundleOriginalPrice(bundle);
  const savings = originalPrice - bundle.priceCents;

  // Get all template preview images for the gallery
  const templatePreviewImages = bundleTemplates
    .map(t => ({
      src: t.previewImage || `/previews/${t.id}.png`,
      alt: t.name,
      templateName: t.name
    }))
    .filter(img => img.src);

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % templatePreviewImages.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + templatePreviewImages.length) % templatePreviewImages.length);
  };

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch(`${API_URL}/api/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bundleId: bundle.id,
          itemType: 'bundle',
        }),
      });
    
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Failed to create checkout session');
      }
    
      const data = await response.json();
    
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  };

  const formatPrice = (cents: number) => {
    return (cents / 100).toFixed(0);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/bundles"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Bundles
        </Link>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            {/* Main Image Gallery */}
            <div className="aspect-square bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl relative overflow-hidden group">
              {templatePreviewImages.length > 0 ? (
                <>
                  <img
                    src={templatePreviewImages[selectedImageIndex]?.src}
                    alt={templatePreviewImages[selectedImageIndex]?.alt}
                    className="w-full h-full object-cover"
                  />
                  {/* Navigation arrows */}
                  {templatePreviewImages.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-700" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-700" />
                      </button>
                    </>
                  )}
                  {/* Image counter */}
                  <div className="absolute bottom-4 left-4 bg-black/60 text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    {selectedImageIndex + 1} of {templatePreviewImages.length} templates
                  </div>
                  {/* Current template name */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/95 text-gray-800 text-xs font-medium px-3 py-1.5 rounded-full shadow-md max-w-xs truncate hidden sm:block">
                    {templatePreviewImages[selectedImageIndex]?.templateName}
                  </div>
                </>
              ) : bundle.previewImage ? (
                <img
                  src={bundle.previewImage}
                  alt={bundle.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-white/80 rounded-2xl flex items-center justify-center shadow-lg">
                    <Package className="w-12 h-12 text-indigo-600" />
                  </div>
                </div>
              )}
              {/* Bundle badge */}
              <div className="absolute top-4 right-4 bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-full">
                Bundle
              </div>
              {/* Savings badge */}
              {bundle.badgeText && (
                <div className="absolute top-4 left-4 bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded-full">
                  {bundle.badgeText}
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {templatePreviewImages.length > 1 && (
              <div className="mt-4 grid grid-cols-5 gap-2">
                {templatePreviewImages.slice(0, 5).map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? 'border-indigo-600 ring-2 ring-indigo-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
            
            {/* Trust Badges */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg">
                <Download className="w-5 h-5 text-indigo-600 mb-1" />
                <span className="text-xs font-medium text-gray-700">Instant Download</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg">
                <Shield className="w-5 h-5 text-green-600 mb-1" />
                <span className="text-xs font-medium text-gray-700">Secure Checkout</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg">
                <Award className="w-5 h-5 text-purple-600 mb-1" />
                <span className="text-xs font-medium text-gray-700">Premium Quality</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo/logo-badge.png" alt="ToolForgeHQ" className="w-8 h-8" />
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Premium Bundle</span>
              <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                {category?.name || bundle.categoryId}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{bundle.name}</h1>
            
            <p className="mt-4 text-lg text-gray-600">{bundle.description}</p>

            <div className="mt-6 flex items-center gap-3">
              <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                <Package className="w-4 h-4" />
                {bundle.templateIds.length} templates included
              </span>
            </div>

            <div className="mt-8">
              <div className="space-y-4">
                {canceled && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <p className="text-yellow-800">Your checkout was canceled. Feel free to try again when you're ready.</p>
                  </div>
                )}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-red-800">{error}</p>
                  </div>
                )}
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-gray-900">${formatPrice(bundle.priceCents)}</span>
                  <span className="text-xl text-gray-400 line-through">${formatPrice(originalPrice)}</span>
                  <span className="text-lg font-semibold text-green-600">Save ${formatPrice(savings)}</span>
                </div>
                <p className="text-sm text-gray-500">one-time purchase</p>
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="inline-flex items-center justify-center w-full sm:w-auto rounded-lg bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Package className="w-5 h-5 mr-2" />
                      Buy Bundle
                    </>
                  )}
                </button>
                <p className="text-sm text-gray-500">Instant download of all {bundle.templateIds.length} templates after purchase</p>

                {/* Money-Back Guarantee */}
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <RefreshCw className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800">7-Day Money-Back Guarantee</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Not satisfied? Email us within 7 days of purchase for a full refund. No questions asked.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Trust Points */}
                <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Instant access after purchase
                  </span>
                  <span className="flex items-center gap-1">
                    <Download className="w-3.5 h-3.5" />
                    Download to your device
                  </span>
                  <span className="flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5" />
                    Secure payment via Stripe
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What This Is */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What This Is</h2>
          <p className="text-gray-600 leading-relaxed">
            This is a bundle of {bundle.templateIds.length} AI Execution Systems. Each system combines a professional-grade template with a proprietary AI execution prompt and step-by-step instructions. You provide your specific inputs, paste the execution prompts into ChatGPT, Claude, or Gemini, and receive structured output ready to use.
          </p>
        </div>

        {/* What This Is NOT */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What This Is NOT</h2>
          <p className="text-gray-600 leading-relaxed">
            This is not software, not autonomous AI, and not a done-for-you service. These systems do not automatically generate content without your input. You must provide your specific details, context, and goals for each template. The AI generates output based on our engineered prompts and your inputs.
          </p>
        </div>

        {/* Why This Is Different */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why This Is Different</h2>
          <p className="text-gray-600 leading-relaxed">
            Unlike generic templates or random AI prompts, each system in this bundle is engineered to produce consistent, professional results. The execution prompts assign the AI specific expert roles, reference exact template structures, specify output formats and constraints, and include refinement instructions. This is the difference between asking AI vague questions and giving it precise execution frameworks.
          </p>
        </div>

        {/* What You Get */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What You Get</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bundleTemplates.map((template) => (
              <div
                key={template.id}
                className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100"
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm">{template.name}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{template.shortDescription}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-400 line-through">
                      ${template.priceCents ? formatPrice(template.priceCents) : '0'}
                    </span>
                    <span className="text-xs font-medium text-green-600">Included</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How This Actually Works */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How This Actually Works</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <p className="font-medium text-gray-900">Download all templates and review the instructions</p>
                <p className="text-gray-600 text-sm mt-1">Each template comes with its own AI execution prompt and guide</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <p className="font-medium text-gray-900">Choose which template to use first</p>
                <p className="text-gray-600 text-sm mt-1">Start with the one most relevant to your immediate needs</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <p className="font-medium text-gray-900">Gather your inputs and paste the execution prompt into AI</p>
                <p className="text-gray-600 text-sm mt-1">Open ChatGPT, Claude, or Gemini and copy the prompt exactly as provided</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">4</div>
              <div>
                <p className="font-medium text-gray-900">Provide your inputs and receive structured output</p>
                <p className="text-gray-600 text-sm mt-1">Refine as needed, then use the output in your template</p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Disclaimer */}
        <div className="mt-12 bg-amber-50 border border-amber-200 rounded-lg p-6">
          <p className="text-amber-800 text-sm">
            <strong>Important:</strong> These products work only when used with an AI tool such as ChatGPT, Claude, or Gemini. They are not software or autonomous AI. You provide the inputs, AI generates the output based on our engineered prompts.
          </p>
        </div>

        {/* Value Summary */}
        <div className="mt-12 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Bundle Value Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">${formatPrice(originalPrice)}</p>
              <p className="text-sm text-gray-500">If purchased separately</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">${formatPrice(savings)}</p>
              <p className="text-sm text-gray-500">Your savings</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-indigo-600">${formatPrice(bundle.priceCents)}</p>
              <p className="text-sm text-gray-500">Bundle price</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900">How do I access my templates after purchase?</h3>
              <p className="mt-2 text-gray-600 text-sm">After completing your purchase, you'll be redirected to a success page with download links for all templates in the bundle. You'll also receive a confirmation email with the same links.</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900">What's your refund policy?</h3>
              <p className="mt-2 text-gray-600 text-sm">We offer a 7-day money-back guarantee. If you're not satisfied with your purchase for any reason, simply email us within 7 days and we'll process a full refund - no questions asked.</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900">Can I buy individual templates instead?</h3>
              <p className="mt-2 text-gray-600 text-sm">Yes! All templates in this bundle are also available for individual purchase. However, buying the bundle saves you {bundle.savingsPercent}% compared to buying them separately.</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900">Do I get lifetime access?</h3>
              <p className="mt-2 text-gray-600 text-sm">Yes, you get lifetime access to all templates in the bundle, including any future updates we make to these templates.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

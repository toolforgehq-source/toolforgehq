import { useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Check, Loader2, Shield, Download, Award, Package } from 'lucide-react';
import { getBundleBySlug, getBundleTemplates, calculateBundleOriginalPrice, getCategoryForBundle } from '../data/bundles';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function BundleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const canceled = searchParams.get('canceled');
  const bundle = getBundleBySlug(slug || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
            <div className="aspect-square bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl relative overflow-hidden">
              {bundle.previewImage ? (
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
                <div className="absolute bottom-4 right-4 bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded-full">
                  {bundle.badgeText}
                </div>
              )}
            </div>
            
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
              </div>
            </div>
          </div>
        </div>

        {/* Included Templates */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Included in This Bundle</h2>
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

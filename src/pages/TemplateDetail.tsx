import { useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Check, Loader2, Shield, Download, Award } from 'lucide-react';
import { getTemplateById, categories, templates } from '../data/templates';
import EmailCapture from '../components/EmailCapture';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function TemplateDetail() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const canceled = searchParams.get('canceled');
  const template = getTemplateById(id || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!template) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Template not found</h1>
          <Link to="/templates" className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-500">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Templates
          </Link>
        </div>
      </div>
    );
  }

    const category = categories.find(c => c.id === template.category);

    const handleCheckout = async () => {
      setLoading(true);
      setError(null);
    
      try {
        const response = await fetch(`${API_URL}/api/checkout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ templateId: template.id }),
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

    // Format price from cents to dollars
    const formatPrice = (cents: number) => {
      return (cents / 100).toFixed(0);
    };

    return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/templates"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Templates
        </Link>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="aspect-square bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl relative overflow-hidden">
              {template.previewImage ? (
                <img
                  src={template.previewImage}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-white/80 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-4xl font-bold text-indigo-600">TF</span>
                  </div>
                </div>
              )}
              {template.comingSoon && (
                <div className="absolute top-4 right-4 bg-amber-500 text-white text-sm font-semibold px-4 py-2 rounded-full">
                  Coming Soon
                </div>
              )}
              {template.featured && !template.comingSoon && (
                <div className="absolute top-4 right-4 bg-amber-500 text-white text-sm font-semibold px-4 py-2 rounded-full">
                  Featured
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
              <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                {category?.name || template.category}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{template.name}</h1>
            
            <p className="mt-4 text-lg text-gray-600">{template.fullDescription}</p>

            <div className="mt-8">
              {template.comingSoon ? (
                <div className="space-y-4">
                  <p className="text-lg font-medium text-amber-600">This template is coming soon!</p>
                  <EmailCapture
                    title="Get notified when it launches"
                    description="Join the waitlist for early access and a special launch discount."
                    buttonText="Join Waitlist"
                    variant="compact"
                  />
                </div>
                            ) : (
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
                                <div className="flex items-baseline gap-2">
                                  <span className="text-4xl font-bold text-gray-900">${template.priceCents ? formatPrice(template.priceCents) : '0'}</span>
                                  <span className="text-gray-500">one-time purchase</span>
                                </div>
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
                                    'Buy Now'
                                  )}
                                </button>
                                <p className="text-sm text-gray-500">Instant download after purchase</p>
                              </div>
                            )}
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h2>
            <ul className="space-y-4">
              {template.whatsIncluded.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Who It's For</h2>
            <ul className="space-y-4">
              {template.whoItsFor.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-indigo-600" />
                  </div>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {template.faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-gray-900 font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Related Templates */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Templates</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates
              .filter(t => t.category === template.category && t.id !== template.id && !t.comingSoon)
              .slice(0, 3)
              .map((relatedTemplate) => (
                <Link
                  key={relatedTemplate.id}
                  to={`/templates/${relatedTemplate.id}`}
                  className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="aspect-square relative overflow-hidden bg-gray-100">
                    {relatedTemplate.previewImage ? (
                      <img
                        src={relatedTemplate.previewImage}
                        alt={relatedTemplate.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
                        <span className="text-3xl font-bold text-indigo-600">TF</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {relatedTemplate.name}
                    </h3>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">
                        ${relatedTemplate.priceCents ? (relatedTemplate.priceCents / 100).toFixed(0) : '0'}
                      </span>
                      <span className="text-sm text-indigo-600 font-medium">View</span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

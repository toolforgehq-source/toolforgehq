import { Link } from 'react-router-dom';
import { Search, CreditCard, Download, Sparkles, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: <Search className="w-8 h-8" />,
    title: 'Browse Our Template Library',
    description: 'Explore our curated collection of AI-ready templates. Each template is designed for a specific use case, whether you need content calendars, email sequences, landing page copy, or Notion dashboards. Use the category filters to find exactly what you need.',
  },
  {
    number: '02',
    icon: <CreditCard className="w-8 h-8" />,
    title: 'Purchase Your Template',
    description: 'Found the perfect template? Complete your purchase securely. All templates are one-time purchases with no subscriptions or hidden fees. You get lifetime access to your templates, including any future updates.',
  },
  {
    number: '03',
    icon: <Download className="w-8 h-8" />,
    title: 'Download Instantly',
    description: 'After purchase, you\'ll get immediate access to download your template. Most templates come in multiple formats (Google Sheets, Notion, PDF) so you can use them in your preferred tools.',
  },
  {
    number: '04',
    icon: <Sparkles className="w-8 h-8" />,
    title: 'Plug Into AI & Create',
    description: 'Here\'s where the magic happens. Each template includes AI prompts designed to help you customize everything for your brand and audience. Copy the prompts into ChatGPT, Claude, or your favorite AI tool, and watch your content come to life in minutes instead of hours.',
  },
];

export default function HowItWorks() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gradient-to-b from-indigo-50 to-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">How It Works</h1>
            <p className="mt-4 text-lg text-gray-600">
              From browsing to creating amazing content in four simple steps. No technical skills required.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-16">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    {step.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-sm font-bold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">
                      Step {step.number}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{step.title}</h2>
                  <p className="mt-4 text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute left-10 top-24 w-px h-16 bg-gradient-to-b from-indigo-200 to-transparent" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-20 bg-indigo-50 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Ready to Get Started?</h2>
          <p className="mt-4 text-gray-600 max-w-xl mx-auto">
            Browse our template library and find the perfect starting point for your next project.
          </p>
          <Link
            to="/templates"
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
          >
            Browse Templates
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

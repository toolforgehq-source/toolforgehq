import { Link } from 'react-router-dom';
import { Search, CreditCard, Download, Sparkles, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: <Search className="w-8 h-8" />,
    title: 'Choose Your AI Execution System',
    description: 'Browse our library of AI Execution Systems. Each system is designed for a specific use case and includes three components: a professional template, a proprietary AI execution prompt, and step-by-step instructions.',
  },
  {
    number: '02',
    icon: <CreditCard className="w-8 h-8" />,
    title: 'Purchase & Download',
    description: 'Complete your purchase securely. All systems are one-time purchases with no subscriptions. You get instant access to your template, AI execution prompt, and guided instructions.',
  },
  {
    number: '03',
    icon: <Download className="w-8 h-8" />,
    title: 'Gather Your Inputs',
    description: 'Review the included instructions to understand what inputs you need to provide. This might include your business details, target audience, specific goals, or other context that makes the output relevant to you.',
  },
  {
    number: '04',
    icon: <Sparkles className="w-8 h-8" />,
    title: 'Execute with AI',
    description: 'Open ChatGPT, Claude, or Gemini. Paste the execution prompt exactly as provided. Enter your inputs when prompted. The AI will generate structured output based on our engineered prompt. Refine if needed, then use the output in your template.',
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
              Four steps to execute with AI and get professional results. You provide the inputs, AI generates the output.
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

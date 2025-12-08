import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Zap, Users } from 'lucide-react';
import EmailCapture from '../components/EmailCapture';

export default function About() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gradient-to-b from-indigo-50 to-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Why ToolForgeHQ Exists</h1>
            <p className="mt-4 text-lg text-gray-600">
              Helping people harness the power of AI without needing to be technical.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg prose-indigo max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">The Problem We Saw</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            AI tools like ChatGPT and Claude have changed everything. Suddenly, anyone can generate content, write copy, and automate tasks that used to take hours. But here's the thing: most people don't know how to use these tools effectively.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            They stare at a blank prompt box, not sure what to type. They get mediocre outputs because they don't know the right questions to ask. They spend more time trying to figure out AI than actually creating.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-12">Our Solution</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            ToolForgeHQ bridges the gap between powerful AI tools and the people who want to use them. We create templates that are specifically designed to work with AI, complete with prompts, frameworks, and workflows that anyone can follow.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            Think of our templates as the missing instruction manual for AI. You don't need to be a prompt engineer or a tech expert. Just download a template, follow the included prompts, and watch AI do the heavy lifting.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-12">Who We Help</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            We built ToolForgeHQ for creators, coaches, consultants, and small business owners who know they should be using AI but don't have time to become experts. People who want results, not complexity. People who'd rather spend their time serving clients and creating value than wrestling with technology.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-indigo-50 text-indigo-600 mb-4">
              <Heart className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Built with Care</h3>
            <p className="mt-2 text-gray-600 text-sm">Every template is tested and refined to ensure it actually works.</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-indigo-50 text-indigo-600 mb-4">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">AI-First Design</h3>
            <p className="mt-2 text-gray-600 text-sm">Templates designed from the ground up to work with AI tools.</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-indigo-50 text-indigo-600 mb-4">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Community Driven</h3>
            <p className="mt-2 text-gray-600 text-sm">We listen to our users and build what they actually need.</p>
          </div>
        </div>

        <div className="mt-16 bg-gray-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Ready to Work Smarter?</h2>
          <p className="mt-4 text-gray-600">
            Browse our templates and see how AI can transform your workflow.
          </p>
          <Link
            to="/templates"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
          >
            Browse Templates
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>

        <div className="mt-16">
          <EmailCapture
            title="Stay in the Loop"
            description="Get notified about new templates, tips for using AI, and exclusive subscriber discounts."
          />
        </div>
      </div>
    </div>
  );
}

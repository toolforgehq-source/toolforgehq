export default function Terms() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gradient-to-b from-indigo-50 to-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Terms of Service</h1>
            <p className="mt-4 text-lg text-gray-600">
              Last updated: December 2024
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg prose-indigo max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Agreement to Terms</h2>
          <p className="text-gray-600 mb-6">
            By accessing or using ToolForgeHQ's website and purchasing our products, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">Products and Services</h2>
          <p className="text-gray-600 mb-6">
            ToolForgeHQ sells digital templates and resources designed to work with AI tools. All products are delivered digitally and are available for immediate download after purchase.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">License and Usage</h2>
          <p className="text-gray-600 mb-4">When you purchase a template from ToolForgeHQ:</p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
            <li>You receive a personal, non-exclusive license to use the template for your own business or personal projects</li>
            <li>You may modify and customize the templates for your own use</li>
            <li>You may NOT resell, redistribute, or share the templates with others</li>
            <li>You may NOT claim the templates as your own original work</li>
            <li>Team licenses are available for organizations wanting to share templates among multiple users</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">Payment and Pricing</h2>
          <p className="text-gray-600 mb-6">
            All prices are listed in USD. Payment is processed securely through our third-party payment processor. Prices are subject to change without notice, but changes will not affect orders already placed.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">Refund Policy</h2>
          <p className="text-gray-600 mb-6">
            Due to the digital nature of our products, all sales are final. However, if you experience technical issues with a download or believe a product was significantly misrepresented, please contact us within 14 days of purchase and we will work with you to resolve the issue.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">Intellectual Property</h2>
          <p className="text-gray-600 mb-6">
            All content on this website, including templates, text, graphics, logos, and software, is the property of ToolForgeHQ and is protected by intellectual property laws. Unauthorized use may violate copyright, trademark, and other laws.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">Disclaimer</h2>
          <p className="text-gray-600 mb-6">
            Our templates are provided "as is" without warranties of any kind. We do not guarantee specific results from using our templates. Success depends on many factors including your implementation, market conditions, and individual circumstances.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">Limitation of Liability</h2>
          <p className="text-gray-600 mb-6">
            ToolForgeHQ shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our products or services.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">Changes to Terms</h2>
          <p className="text-gray-600 mb-6">
            We reserve the right to modify these terms at any time. Continued use of our services after changes constitutes acceptance of the new terms.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">Contact</h2>
          <p className="text-gray-600 mb-6">
            For questions about these Terms of Service, please contact us at{' '}
            <a href="mailto:legal@toolforgehq.com" className="text-indigo-600 hover:text-indigo-500">
              legal@toolforgehq.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

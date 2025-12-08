export default function Privacy() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gradient-to-b from-indigo-50 to-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Privacy Policy</h1>
            <p className="mt-4 text-lg text-gray-600">
              Last updated: December 2024
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg prose-indigo max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
          <p className="text-gray-600 mb-6">
            ToolForgeHQ ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you visit our website or purchase our products.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">Information We Collect</h2>
          <p className="text-gray-600 mb-4">We may collect the following types of information:</p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
            <li>Personal identification information (name, email address)</li>
            <li>Payment information (processed securely through third-party payment processors)</li>
            <li>Usage data (how you interact with our website)</li>
            <li>Communication data (when you contact us)</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">How We Use Your Information</h2>
          <p className="text-gray-600 mb-4">We use the information we collect to:</p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
            <li>Process and deliver your purchases</li>
            <li>Send you important updates about your orders</li>
            <li>Send marketing communications (with your consent)</li>
            <li>Improve our website and products</li>
            <li>Respond to your inquiries and provide customer support</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">Data Security</h2>
          <p className="text-gray-600 mb-6">
            We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">Third-Party Services</h2>
          <p className="text-gray-600 mb-6">
            We may use third-party services for payment processing, email delivery, and analytics. These services have their own privacy policies, and we encourage you to review them.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">Your Rights</h2>
          <p className="text-gray-600 mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt out of marketing communications</li>
            <li>Withdraw consent where applicable</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">Cookies</h2>
          <p className="text-gray-600 mb-6">
            We use cookies and similar technologies to enhance your experience on our website. You can control cookie settings through your browser preferences.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">Changes to This Policy</h2>
          <p className="text-gray-600 mb-6">
            We may update this privacy policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the "Last updated" date.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-10">Contact Us</h2>
          <p className="text-gray-600 mb-6">
            If you have any questions about this privacy policy or our data practices, please contact us at{' '}
            <a href="mailto:privacy@toolforgehq.com" className="text-indigo-600 hover:text-indigo-500">
              privacy@toolforgehq.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

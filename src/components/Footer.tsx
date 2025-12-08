import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TF</span>
              </div>
              <span className="text-xl font-bold text-gray-900">ToolForgeHQ</span>
            </Link>
            <p className="mt-4 text-gray-600 max-w-md">
              AI-ready templates for creators, coaches, and small businesses. Create content, funnels, and offers 10x faster.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Navigation</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/templates" className="text-gray-600 hover:text-gray-900 transition-colors">Templates</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">How It Works</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-gray-900 transition-colors">About</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-gray-900 transition-colors">Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} ToolForgeHQ. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

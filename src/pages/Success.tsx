import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Download, AlertCircle, Loader2, Package } from 'lucide-react';

interface DownloadItem {
  templateId: string;
  templateName: string;
  downloadUrl: string;
}

interface PurchaseData {
  itemType?: string;
  templateId?: string;
  bundleId?: string;
  templateName: string;
  templateIds?: string[];
  email: string;
  downloadUrl: string;
  downloadUrls?: DownloadItem[];
  purchasedAt: string;
}

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://app-plcgyfon.fly.dev' : 'http://localhost:8000');

export default function Success() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchase, setPurchase] = useState<PurchaseData | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID provided. Please check your purchase confirmation email.');
      setLoading(false);
      return;
    }

    const fetchPurchase = async () => {
      try {
        const response = await fetch(`${API_URL}/api/purchase?session_id=${sessionId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Purchase not found. It may take a moment to process. Please refresh in a few seconds.');
          } else {
            const data = await response.json();
            setError(data.detail || 'Failed to load purchase information.');
          }
          setLoading(false);
          return;
        }
        
        const data = await response.json();
        setPurchase(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to connect to server. Please try again later.');
        setLoading(false);
      }
    };

    fetchPurchase();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your purchase...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <Link
                to="/templates"
                className="block w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Browse Templates
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isBundle = purchase?.itemType === 'bundle';

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Thank you for your purchase!
          </h1>
          
          <p className="text-gray-600 mb-8">
            {isBundle 
              ? `Your bundle is ready! You have access to ${purchase?.downloadUrls?.length || 0} templates.`
              : 'Your order has been confirmed and your template is ready to download.'
            }
          </p>
          
          {purchase && (
            <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
              <h2 className="font-semibold text-gray-900 mb-4">Order Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">{isBundle ? 'Bundle:' : 'Template:'}</span>
                  <span className="font-medium text-gray-900 flex items-center gap-2">
                    {isBundle && <Package className="w-4 h-4 text-indigo-600" />}
                    {purchase.templateName}
                  </span>
                </div>
                {isBundle && purchase.downloadUrls && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Templates included:</span>
                    <span className="font-medium text-gray-900">{purchase.downloadUrls.length}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium text-gray-900">{purchase.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(purchase.purchasedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {/* Bundle Downloads */}
          {isBundle && purchase?.downloadUrls && purchase.downloadUrls.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-4 text-left">Download Your Templates</h3>
              <div className="space-y-3">
                {purchase.downloadUrls.map((item, index) => (
                  <a
                    key={item.templateId || index}
                    href={item.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-3 px-4 rounded-lg font-medium transition-colors text-left"
                  >
                    <span className="truncate mr-2">{item.templateName}</span>
                    <Download className="w-5 h-5 flex-shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}
          
          {/* Single Template Download */}
          {!isBundle && purchase?.downloadUrl && (
            <a
              href={purchase.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-4"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Your Template
            </a>
          )}
          
          <p className="text-sm text-gray-500 mb-6">
            A confirmation email has been sent to {purchase?.email}. 
            Save this page or bookmark the download link{isBundle ? 's' : ''} for future access.
          </p>
          
          <div className="border-t pt-6">
            <p className="text-gray-600 mb-4">Want more templates?</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/templates"
                className="inline-block bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Browse Templates
              </Link>
              <Link
                to="/bundles"
                className="inline-block bg-indigo-100 text-indigo-700 py-3 px-6 rounded-lg font-semibold hover:bg-indigo-200 transition-colors"
              >
                View Bundles
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

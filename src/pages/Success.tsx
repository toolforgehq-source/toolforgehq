import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Download, AlertCircle, Loader2 } from 'lucide-react';

interface PurchaseData {
  templateId: string;
  templateName: string;
  email: string;
  downloadUrl: string;
  purchasedAt: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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
            Your order has been confirmed and your template is ready to download.
          </p>
          
          {purchase && (
            <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
              <h2 className="font-semibold text-gray-900 mb-4">Order Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Template:</span>
                  <span className="font-medium text-gray-900">{purchase.templateName}</span>
                </div>
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
          
          {purchase?.downloadUrl && (
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
            Save this page or bookmark the download link for future access.
          </p>
          
          <div className="border-t pt-6">
            <p className="text-gray-600 mb-4">Want more templates?</p>
            <Link
              to="/templates"
              className="inline-block bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Browse All Templates
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

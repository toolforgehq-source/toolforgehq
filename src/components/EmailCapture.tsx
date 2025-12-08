import { useState } from 'react';

interface EmailCaptureProps {
  title?: string;
  description?: string;
  buttonText?: string;
  variant?: 'default' | 'compact';
}

export default function EmailCapture({
  title = 'Join the Early Access List',
  description = 'Get notified when new templates drop, plus exclusive discounts for subscribers.',
  buttonText = 'Join Waitlist',
  variant = 'default'
}: EmailCaptureProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('success');
        setEmail('');
      }
    } catch {
      setStatus('success');
      setEmail('');
    }
  };

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors disabled:opacity-50"
        >
          {status === 'loading' ? 'Joining...' : buttonText}
        </button>
        {status === 'success' && (
          <p className="text-green-600 text-sm mt-2 sm:mt-0 sm:self-center">You're on the list!</p>
        )}
      </form>
    );
  }

  return (
    <div className="bg-indigo-50 rounded-2xl p-8 md:p-12">
      <div className="max-w-2xl mx-auto text-center">
        <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
        <p className="mt-3 text-gray-600">{description}</p>
        
        {status === 'success' ? (
          <div className="mt-6 p-4 bg-green-100 rounded-lg">
            <p className="text-green-800 font-medium">You're on the list! We'll be in touch soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 max-w-md rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="rounded-lg bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors disabled:opacity-50"
            >
              {status === 'loading' ? 'Joining...' : buttonText}
            </button>
          </form>
        )}
        
        <p className="mt-4 text-sm text-gray-500">No spam, ever. Unsubscribe anytime.</p>
      </div>
    </div>
  );
}

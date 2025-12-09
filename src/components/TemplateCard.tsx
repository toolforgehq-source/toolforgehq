import { Link } from 'react-router-dom';
import { Template } from '../data/templates';

interface TemplateCardProps {
  template: Template;
}

export default function TemplateCard({ template }: TemplateCardProps) {
  return (
    <Link
      to={`/templates/${template.id}`}
      className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-indigo-200"
    >
      <div className="aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 relative overflow-hidden">
        {template.previewImage || template.previewUrl ? (
          <img
            src={template.previewImage || template.previewUrl}
            alt={template.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-white/80 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-2xl font-bold text-indigo-600">TF</span>
            </div>
          </div>
        )}
        {template.comingSoon && (
          <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Coming Soon
          </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full capitalize">
            {template.category}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
          {template.name}
        </h3>
        
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {template.shortDescription}
        </p>
        
                <div className="mt-4 flex items-center justify-between">
                  {template.comingSoon ? (
                    <span className="text-sm font-medium text-amber-600">Join Waitlist</span>
                  ) : (
                    <span className="text-lg font-bold text-gray-900">${template.priceCents ? (template.priceCents / 100).toFixed(0) : '0'}</span>
                  )}
          <span className="text-sm font-medium text-indigo-600 group-hover:translate-x-1 transition-transform">
            View Details &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}

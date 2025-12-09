import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { Bundle, getCategoryForBundle } from '../data/bundles';

interface BundleCardProps {
  bundle: Bundle;
}

export default function BundleCard({ bundle }: BundleCardProps) {
  const category = getCategoryForBundle(bundle);
  
  return (
    <Link
      to={`/bundles/${bundle.slug}`}
      className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-indigo-200"
    >
      <div className="aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 relative overflow-hidden">
        {bundle.previewImage ? (
          <img
            src={bundle.previewImage}
            alt={bundle.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-white/80 rounded-xl flex items-center justify-center shadow-sm">
              <Package className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
        )}
        {/* Logo badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg p-1 shadow-sm">
          <img src="/logo/logo-badge.png" alt="ToolForgeHQ" className="w-6 h-6" />
        </div>
        {/* Bundle badge */}
        <div className="absolute top-3 right-3 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
          Bundle
        </div>
        {/* Savings badge */}
        {bundle.badgeText && (
          <div className="absolute bottom-3 right-3 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {bundle.badgeText}
          </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full capitalize">
            {category?.name || bundle.categoryId}
          </span>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1">
            <Package className="w-3 h-3" />
            {bundle.templateIds.length} templates
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
          {bundle.name}
        </h3>
        
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {bundle.description}
        </p>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              ${(bundle.priceCents / 100).toFixed(0)}
            </span>
            <span className="text-sm text-green-600 font-medium">
              Save {bundle.savingsPercent}%
            </span>
          </div>
          <span className="text-sm font-medium text-indigo-600 group-hover:translate-x-1 transition-transform">
            View Bundle &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}

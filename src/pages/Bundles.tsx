import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Package, Sparkles } from 'lucide-react';
import { bundles, getBundlesByCategory } from '../data/bundles';
import { categories } from '../data/templates';
import BundleCard from '../components/BundleCard';

export default function Bundles() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);

  const filteredBundles = useMemo(() => {
    if (!selectedCategory) return bundles;
    return getBundlesByCategory(selectedCategory);
  }, [selectedCategory]);

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    if (categoryId) {
      setSearchParams({ category: categoryId });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-indigo-50 to-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Package className="w-4 h-4" />
              Save up to 40% with Bundles
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Template Bundles</h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Get the best value with our curated template bundles. Each bundle combines our most popular templates at a significant discount.
            </p>
            <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Premium Quality</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-green-600" />
                <span>5-7 Templates per Bundle</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => handleCategoryChange(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !selectedCategory
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Bundles
          </button>
          {categories.map((category) => {
            const bundleCount = getBundlesByCategory(category.id).length;
            if (bundleCount === 0) return null;
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={selectedCategory === category.id ? { backgroundColor: category.color || '#4F46E5' } : {}}
              >
                {category.name}
              </button>
            );
          })}
        </div>

        {/* Bundle Count */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm text-gray-500">
            {filteredBundles.length} bundle{filteredBundles.length !== 1 ? 's' : ''} available
          </p>
        </div>

        {/* Bundles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBundles.map((bundle) => (
            <BundleCard key={bundle.id} bundle={bundle} />
          ))}
        </div>

        {filteredBundles.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No bundles found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { templates, categories, subcategories, getCategoryById } from '../data/templates';
import { bundles, getBundlesByCategory } from '../data/bundles';
import TemplateCard from '../components/TemplateCard';
import BundleCard from '../components/BundleCard';

type SortOption = 'newest' | 'popular' | 'price-low' | 'price-high';

export default function Templates() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const subcategoryParam = searchParams.get('subcategory');
  const sortParam = searchParams.get('sort') as SortOption | null;
  const showBundlesParam = searchParams.get('bundles') === 'true';
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(subcategoryParam);
  const [sortBy, setSortBy] = useState<SortOption>(sortParam || 'newest');
  const [showBundles, setShowBundles] = useState(showBundlesParam);

  const currentSubcategories = useMemo(() => {
    if (!selectedCategory) return [];
    return subcategories[selectedCategory] || [];
  }, [selectedCategory]);

  const filteredBundles = useMemo(() => {
    if (!selectedCategory) return bundles;
    return getBundlesByCategory(selectedCategory);
  }, [selectedCategory]);

  const filteredAndSortedTemplates = useMemo(() => {
    let result = [...templates];
    
    if (selectedCategory) {
      result = result.filter(t => t.category === selectedCategory);
    }
    
    if (selectedSubcategory) {
      result = result.filter(t => t.subcategory === selectedSubcategory);
    }
    
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        break;
      case 'popular':
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      case 'price-low':
        result.sort((a, b) => (a.priceCents || 0) - (b.priceCents || 0));
        break;
      case 'price-high':
        result.sort((a, b) => (b.priceCents || 0) - (a.priceCents || 0));
        break;
    }
    
    return result;
  }, [selectedCategory, selectedSubcategory, sortBy]);

  const updateSearchParams = (category: string | null, subcategory: string | null, sort: SortOption, bundlesView: boolean = false) => {
    const params: Record<string, string> = {};
    if (category) params.category = category;
    if (subcategory) params.subcategory = subcategory;
    if (sort !== 'newest') params.sort = sort;
    if (bundlesView) params.bundles = 'true';
    setSearchParams(params);
  };

  const handleBundlesToggle = () => {
    const newShowBundles = !showBundles;
    setShowBundles(newShowBundles);
    updateSearchParams(selectedCategory, selectedSubcategory, sortBy, newShowBundles);
  };

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(null);
    updateSearchParams(categoryId, null, sortBy, showBundles);
  };

  const handleSubcategoryChange = (subcategoryId: string | null) => {
    setSelectedSubcategory(subcategoryId);
    updateSearchParams(selectedCategory, subcategoryId, sortBy, showBundles);
  };

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort);
    updateSearchParams(selectedCategory, selectedSubcategory, sort, showBundles);
  };

  const selectedCategoryData = selectedCategory ? getCategoryById(selectedCategory) : null;

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gradient-to-b from-indigo-50 to-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Template Catalog</h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Browse our collection of AI-ready templates designed to help you create faster and smarter.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => handleCategoryChange(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !selectedCategory
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Templates
          </button>
          {categories.map((category) => (
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
          ))}
        </div>

        {currentSubcategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6 pl-4 border-l-4" style={{ borderColor: selectedCategoryData?.color || '#4F46E5' }}>
            <button
              onClick={() => handleSubcategoryChange(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                !selectedSubcategory
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              All {selectedCategoryData?.name}
            </button>
            {currentSubcategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => handleSubcategoryChange(sub.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedSubcategory === sub.id
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-500">
              {showBundles 
                ? `${filteredBundles.length} bundle${filteredBundles.length !== 1 ? 's' : ''}`
                : `${filteredAndSortedTemplates.length} template${filteredAndSortedTemplates.length !== 1 ? 's' : ''}`
              }
            </p>
            <button
              onClick={handleBundlesToggle}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                showBundles
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
              }`}
            >
              <Package className="w-4 h-4" />
              {showBundles ? 'Show Templates' : 'Show Bundles'}
            </button>
          </div>
          {!showBundles && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value as SortOption)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="newest">Newest</option>
                <option value="popular">Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          )}
        </div>

        {/* Bundles Grid */}
        {showBundles && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBundles.map((bundle) => (
                <BundleCard key={bundle.id} bundle={bundle} />
              ))}
            </div>
            {filteredBundles.length === 0 && (
              <div className="text-center py-16">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No bundles found in this category.</p>
                <Link to="/bundles" className="mt-4 inline-block text-indigo-600 hover:text-indigo-500 font-medium">
                  View all bundles
                </Link>
              </div>
            )}
          </>
        )}

        {/* Templates Grid */}
        {!showBundles && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
            {filteredAndSortedTemplates.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-500">No templates found in this category.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

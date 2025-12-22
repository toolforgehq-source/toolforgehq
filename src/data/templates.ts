import templatesData from './templates.json';

export interface Template {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  subcategory?: string;
  priceCents: number | null;
  comingSoon: boolean;
  image: string;
  previewImage?: string;
  previewUrl?: string;
  previewImages?: string[]; // Array of preview page images for gallery
  downloadUrl: string;
  promptUrl?: string; // URL to AI execution prompt file
  whatsIncluded: string[];
  whoItsFor: string[];
  faqs: { question: string; answer: string }[];
  tags?: string[];
  createdAt?: string;
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  color?: string;
  categoryPreview?: string;
}

export interface Subcategory {
  id: string;
  name: string;
}

export interface SubcategoriesMap {
  [categoryId: string]: Subcategory[];
}

export const categories: Category[] = templatesData.categories as Category[];

export const subcategories: SubcategoriesMap = templatesData.subcategories as SubcategoriesMap;

export const templates: Template[] = templatesData.templates as Template[];

export const getTemplatesByCategory = (categoryId: string): Template[] => {
  return templates.filter(t => t.category === categoryId);
};

export const getTemplatesBySubcategory = (subcategoryId: string): Template[] => {
  return templates.filter(t => t.subcategory === subcategoryId);
};

export const getTemplateById = (id: string): Template | undefined => {
  return templates.find(t => t.id === id);
};

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(c => c.id === id);
};

export const getSubcategoriesForCategory = (categoryId: string): Subcategory[] => {
  return subcategories[categoryId] || [];
};

import templatesData from './templates.json';

export interface Template {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  priceCents: number | null;
  comingSoon: boolean;
  image: string;
  downloadUrl: string;
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
}

export const categories: Category[] = templatesData.categories;

export const templates: Template[] = templatesData.templates as Template[];

export const getTemplatesByCategory = (categoryId: string): Template[] => {
  return templates.filter(t => t.category === categoryId);
};

export const getTemplateById = (id: string): Template | undefined => {
  return templates.find(t => t.id === id);
};

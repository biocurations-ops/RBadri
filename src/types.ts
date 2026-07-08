export type InquiryStatus = 'New' | 'Contacted' | 'Closed';

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  productInterest?: string;
  message?: string;
  date: string;
  status: InquiryStatus;
  internalNotes?: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  category: 'Plywood' | 'Pine board' | 'Flush doors' | 'MDF' | 'HMR' | 'HDHMR' | string;
  longDescription: string;
  image: string;
  features: string[];
  specs?: Record<string, string>;
  images?: string[]; // Multiple images uploaded
  video?: string; // Base64 or URL link for product video
  videoName?: string; // Name of uploaded video
}

export interface AdminLoginLog {
  id: string;
  date: string;
  status: 'SUCCESS' | 'FAILED';
  details: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Brand {
  id: string;
  name: string;
  tagline: string;
  image: string;
  logo?: string;
}

export interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
  isVerified: boolean;
}

export interface Material {
  id: string;
  name: string;
  order: number;
}

export interface WebsiteSettings {
  announcement: string;
  storeName: string;
  storeSubName: string;
  phone: string;
  altPhone: string;
  email: string;
  address: string;
  hours: string;
  heroHeading: string;
  heroSubheading: string;
  heroCtaText: string;
  heroBadge: string;
  aboutTagline: string;
  aboutTitle: string;
  aboutPara1: string;
  aboutPara2: string;
}


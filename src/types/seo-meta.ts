export interface SEOMetaInfo {
  title: string;
  metaDescription: string;
  metaKeywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  canonicalUrl: string;
  robots: string;
  author: string;
  viewport: string;
  charset: string;
  language: string;
  favicon: string;
  alternateLanguages: { lang: string; url: string }[];
  structuredData: any[];
  httpStatusCode: number;
  loadTime: number;
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
  };
}
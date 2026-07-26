import React, { useEffect } from 'react';
import { TOOLS_REGISTRY, ToolMetaData, BASE_URL } from '../constants/toolsData';
import {
  getWebSiteSchema,
  getOrganizationSchema,
  getSoftwareApplicationSchema,
  getBreadcrumbSchema,
  getFaqSchema
} from '../schemas/jsonLd';

interface SEOHeadProps {
  currentView: string;
  currentSubTab?: string | null;
}

export const SEOHead: React.FC<SEOHeadProps> = ({ currentView, currentSubTab }) => {
  const tool: ToolMetaData = TOOLS_REGISTRY[currentView] || TOOLS_REGISTRY['dashboard'];

  useEffect(() => {
    // 1. Update Title
    const title = tool.seoTitle;
    document.title = title;

    // 2. Update Meta Description
    let metaDescription = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = tool.seoDescription;

    // 3. Update Meta Keywords
    let metaKeywords = document.querySelector<HTMLMetaElement>('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = tool.keywords.join(', ');

    // 4. Update Canonical URL (Clean URL without # fragments)
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = tool.canonicalUrl;

    // 5. Update Open Graph Tags
    const ogTags = [
      { property: 'og:title', content: tool.seoTitle },
      { property: 'og:description', content: tool.seoDescription },
      { property: 'og:url', content: tool.canonicalUrl },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'ConvertVerse' },
      { property: 'og:image', content: `${BASE_URL}/favicon.svg` }
    ];

    ogTags.forEach(({ property, content }) => {
      let ogMeta = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
      if (!ogMeta) {
        ogMeta = document.createElement('meta');
        ogMeta.setAttribute('property', property);
        document.head.appendChild(ogMeta);
      }
      ogMeta.content = content;
    });

    // 6. Update Twitter Card Tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: tool.seoTitle },
      { name: 'twitter:description', content: tool.seoDescription },
      { name: 'twitter:image', content: `${BASE_URL}/favicon.svg` }
    ];

    twitterTags.forEach(({ name, content }) => {
      let twMeta = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!twMeta) {
        twMeta = document.createElement('meta');
        twMeta.name = name;
        document.head.appendChild(twMeta);
      }
      twMeta.content = content;
    });

    // 7. Inject / Refresh JSON-LD Schemas
    const existingSchemas = document.querySelectorAll('script[type="application/ld+json"].dynamic-seo');
    existingSchemas.forEach(el => el.remove());

    const schemas = [
      getWebSiteSchema(),
      getOrganizationSchema(),
      getSoftwareApplicationSchema(tool),
      getBreadcrumbSchema(tool),
      ...(tool.faqs ? [getFaqSchema(tool.faqs)] : [])
    ].filter(Boolean);

    schemas.forEach((schemaData) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.className = 'dynamic-seo';
      script.text = JSON.stringify(schemaData);
      document.head.appendChild(script);
    });

  }, [currentView, currentSubTab, tool]);

  return null;
};

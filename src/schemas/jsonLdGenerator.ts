export interface SchemaConfig {
  baseUrl: string;
  name: string;
  description: string;
  canonicalUrl: string;
  path: string;
  breadcrumbs?: { name: string; item: string }[];
  faqs?: { question: string; answer: string }[];
  instructions?: string[];
}

export function generateOrganizationSchema(baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    'name': 'ConvertVerse',
    'url': baseUrl,
    'logo': {
      '@type': 'ImageObject',
      'url': `${baseUrl}/favicon.svg`,
      'caption': 'ConvertVerse Logo'
    },
    'sameAs': [
      'https://github.com/umaradnaan123/ConvertVerse'
    ],
    'contactPoint': {
      '@type': 'ContactPoint',
      'contactType': 'customer support',
      'email': 'support@convertverse.app',
      'url': `${baseUrl}/contact`
    }
  };
}

export function generateWebSiteSchema(baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    'url': baseUrl,
    'name': 'ConvertVerse Workstation',
    'description': 'Free, private online PDF converter, image resizer, document suite & file compression hub.',
    'publisher': {
      '@id': `${baseUrl}/#organization`
    },
    'potentialAction': {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': `${baseUrl}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };
}

export function generateSiteNavigationSchema(baseUrl: string) {
  const items = [
    { name: 'PDF Tools', url: `${baseUrl}/pdf-tools` },
    { name: 'Image Tools', url: `${baseUrl}/image-tools` },
    { name: 'Image Converter', url: `${baseUrl}/image-converter` },
    { name: 'Merge PDF', url: `${baseUrl}/pdf-merge` },
    { name: 'Compress PDF', url: `${baseUrl}/pdf-compress` },
    { name: 'Tools Directory', url: `${baseUrl}/tools` },
    { name: 'Categories', url: `${baseUrl}/categories` },
    { name: 'Technical Blog', url: `${baseUrl}/blog` },
    { name: 'About ConvertVerse', url: `${baseUrl}/about` },
    { name: 'Contact Support', url: `${baseUrl}/contact` }
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'itemListElement': items.map((item, idx) => ({
      '@type': 'SiteNavigationElement',
      'position': idx + 1,
      'name': item.name,
      'url': item.url
    }))
  };
}

export function generateCollectionPageSchema(baseUrl: string, name: string, description: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}/#collection`,
    'name': name,
    'description': description,
    'url': url,
    'publisher': {
      '@id': `${baseUrl}/#organization`
    }
  };
}

export function generateWebApplicationSchema(config: SchemaConfig) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `${config.canonicalUrl}/#webapp`,
    'name': config.name,
    'url': config.canonicalUrl,
    'description': config.description,
    'applicationCategory': 'UtilityApplication',
    'operatingSystem': 'All (Web Browser)',
    'browserRequirements': 'Requires WebAssembly, Canvas, HTML5, and WebWorker support',
    'offers': {
      '@type': 'Offer',
      'price': '0.00',
      'priceCurrency': 'USD'
    },
    'author': {
      '@id': `${config.baseUrl}/#organization`
    }
  };
}

export function generateBreadcrumbSchema(baseUrl: string, breadcrumbs: { name: string; item: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': breadcrumbs.map((crumb, idx) => ({
      '@type': 'ListItem',
      'position': idx + 1,
      'name': crumb.name,
      'item': crumb.item.startsWith('http') ? crumb.item : `${baseUrl}${crumb.item}`
    }))
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  if (!faqs || faqs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  };
}

export function generateHowToSchema(config: SchemaConfig) {
  if (!config.instructions || config.instructions.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    'name': `How to use ${config.name}`,
    'description': config.description,
    'step': config.instructions.map((inst, idx) => ({
      '@type': 'HowToStep',
      'position': idx + 1,
      'name': `Step ${idx + 1}`,
      'text': inst
    }))
  };
}

export function generateArticleSchema(baseUrl: string, article: { id: string; title: string; snippet: string; date: string; authorName: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': article.title,
    'description': article.snippet,
    'url': `${baseUrl}/blog/${article.id}`,
    'datePublished': article.date,
    'dateModified': article.date,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${article.id}`
    },
    'author': {
      '@type': 'Person',
      'name': article.authorName,
      'url': `${baseUrl}/authors`
    },
    'publisher': {
      '@id': `${baseUrl}/#organization`
    }
  };
}

export function generatePersonSchema(baseUrl: string, author: { name: string; role: string; bio: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    'name': author.name,
    'jobTitle': author.role,
    'description': author.bio,
    'worksFor': {
      '@id': `${baseUrl}/#organization`
    }
  };
}

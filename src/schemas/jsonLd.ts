import { ToolMetaData, BASE_URL } from '../constants/toolsData';

export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'ConvertVerse',
    'url': BASE_URL,
    'description': '100% private, serverless browser utility suite to compress images, edit PDFs, convert document formats, and optimize media files locally.',
    'publisher': {
      '@type': 'Organization',
      'name': 'ConvertVerse',
      'logo': {
        '@type': 'ImageObject',
        'url': `${BASE_URL}/favicon.svg`
      }
    },
    'potentialAction': {
      '@type': 'SearchAction',
      'target': `${BASE_URL}/#dashboard?search={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };
}

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'ConvertVerse',
    'url': BASE_URL,
    'logo': `${BASE_URL}/favicon.svg`,
    'sameAs': [
      'https://github.com/umaradnaan123/ConvertVerse'
    ]
  };
}

export function getSoftwareApplicationSchema(tool?: ToolMetaData) {
  const name = tool ? `ConvertVerse - ${tool.name}` : 'ConvertVerse Application';
  const description = tool ? tool.seoDescription : 'All-in-One Local Browser File Utility Platform';

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': name,
    'url': tool ? tool.canonicalUrl : BASE_URL,
    'description': description,
    'applicationCategory': 'UtilityApplication',
    'operatingSystem': 'All',
    'browserRequirements': 'HTML5, Canvas, WebWorkers, WebAssembly',
    'offers': {
      '@type': 'Offer',
      'price': '0.00',
      'priceCurrency': 'USD'
    },
    'featureList': tool ? tool.features : [
      'Batch Image Compression Presets',
      'Physical Metric DPI Image Resizer',
      'PDF Merge & Range Split Editor',
      'Local Tesseract.js AI OCR Scanner',
      'AES-256 PBKDF2 Local Crypto Vault'
    ]
  };
}

export function getBreadcrumbSchema(tool?: ToolMetaData) {
  const itemListElement = [
    {
      '@type': 'ListItem',
      'position': 1,
      'name': 'Home',
      'item': BASE_URL
    }
  ];

  if (tool && tool.id !== 'dashboard') {
    itemListElement.push({
      '@type': 'ListItem',
      'position': 2,
      'name': tool.name,
      'item': tool.canonicalUrl
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': itemListElement
  };
}

export function getFaqSchema(faqs: { question: string; answer: string }[]) {
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

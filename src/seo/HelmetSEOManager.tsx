import React from 'react';
import { Helmet } from 'react-helmet-async';
import { BASE_URL, TOOLS_REGISTRY, resolveToolByPath } from '../constants/toolsData';
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateWebApplicationSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateHowToSchema
} from '../schemas/jsonLdGenerator';

interface HelmetSEOProps {
  toolId?: string;
  pathOverride?: string;
  titleOverride?: string;
  descriptionOverride?: string;
}

export function HelmetSEOManager({ toolId, pathOverride, titleOverride, descriptionOverride }: HelmetSEOProps) {
  const currentPath = pathOverride || (typeof window !== 'undefined' ? window.location.pathname : '/');
  const tool = toolId ? TOOLS_REGISTRY[toolId] : resolveToolByPath(currentPath);

  const pageTitle = titleOverride || tool.seoTitle || 'ConvertVerse | All-in-One Private File Workstation';
  const pageDescription = descriptionOverride || tool.seoDescription || '100% serverless online PDF & image converter hub operating locally in your browser sandbox.';
  
  // 100% Self-Referencing Canonical URL Alignment
  const canonicalUrl = `${BASE_URL}${currentPath === '/' ? '' : currentPath}`;
  const ogImageUrl = `${BASE_URL}/og-preview.png`;

  // Robots logic: noindex private dashboard and dynamic search queries
  let robotsDirective = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
  if (currentPath === '/dashboard') {
    robotsDirective = "noindex, nofollow";
  } else if (currentPath === '/search') {
    robotsDirective = "noindex, follow";
  }

  const breadcrumbs = [
    { name: 'Home', item: '/' },
    ...(currentPath !== '/' ? [{ name: tool.name, item: currentPath }] : [])
  ];

  const orgSchema = generateOrganizationSchema(BASE_URL);
  const websiteSchema = generateWebSiteSchema(BASE_URL);
  const webAppSchema = generateWebApplicationSchema({
    baseUrl: BASE_URL,
    name: tool.name,
    description: pageDescription,
    canonicalUrl,
    path: currentPath,
    instructions: tool.instructions
  });
  const breadcrumbSchema = generateBreadcrumbSchema(BASE_URL, breadcrumbs);
  const faqSchema = generateFAQSchema(tool.faqs);
  const howToSchema = generateHowToSchema({
    baseUrl: BASE_URL,
    name: tool.name,
    description: pageDescription,
    canonicalUrl,
    path: currentPath,
    instructions: tool.instructions
  });

  return (
    <Helmet>
      {/* HTML Attributes */}
      <html lang="en" />
      
      {/* Primary Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="title" content={pageTitle} />
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={tool.keywords ? tool.keywords.join(', ') : 'pdf converter, image resizer, file utility'} />
      <meta name="author" content="ConvertVerse" />
      <meta name="application-name" content="ConvertVerse Workstation" />
      <meta name="robots" content={robotsDirective} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#0f172a" />

      {/* 100% Self-Referencing Canonical Link */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook / LinkedIn */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:site_name" content="ConvertVerse" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={ogImageUrl} />

      {/* Structured Data JSON-LD Schemas */}
      <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      {faqSchema && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}
      {howToSchema && <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>}
    </Helmet>
  );
}

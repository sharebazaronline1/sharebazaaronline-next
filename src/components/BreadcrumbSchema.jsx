// src/components/BreadcrumbSchema.jsx

const SITE_URL = "https://www.sharebazaaronline.com";

/**
 * Google BreadcrumbList JSON-LD
 * @param {Array<{ name: string, url: string }>} items
 */
export default function BreadcrumbSchema({ items = [] }) {
  if (!items.length) return null;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http")
        ? item.url
        : `${SITE_URL}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemaData),
      }}
    />
  );
}
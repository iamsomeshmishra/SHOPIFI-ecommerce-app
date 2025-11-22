import React, { useEffect } from 'react';

const Meta = ({ 
  title = 'SHOPIFI — Cinematic Editorial Commerce', 
  description = 'Exquisite architectural artifacts and minimal lifestyle essentials crafted for modern living.',
  keywords = 'modern furniture, luxury apparel, minimal accessories, premium tech, editorial ecommerce',
  ogImage = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
  url = window.location.href,
  schema = null
}) => {
  useEffect(() => {
    // 1. Title
    document.title = title;

    // Helper to find or create a meta tag
    const setMetaTag = (attribute, attrValue, content) => {
      let element = document.querySelector(`meta[${attribute}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Standard Meta
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', keywords);

    // 3. OpenGraph
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:url', url);
    setMetaTag('property', 'og:type', 'website');

    // 4. Twitter Cards
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImage);

    // 5. Dynamic JSON-LD Structured Schema Injection
    let schemaScript = document.getElementById('jsonld-schema');
    if (schema) {
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'jsonld-schema';
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
      }
      schemaScript.innerHTML = JSON.stringify(schema);
    } else if (schemaScript) {
      schemaScript.remove();
    }

    return () => {
      // Clean up script on unmount
      const scriptToClean = document.getElementById('jsonld-schema');
      if (scriptToClean) {
        scriptToClean.remove();
      }
    };
  }, [title, description, keywords, ogImage, url, schema]);

  return null;
};

export default Meta;

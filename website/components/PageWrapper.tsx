import React from 'react';
import Header from "./Header";
import Footer from "./Footer";

export default function PageWrapper({
  children,
  title = "Pete Koomen",
  description = "Pete Koomen's website and blog",
  image = "/images/favicon.ico",
  url,
}: {
  children: React.ReactNode;
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}) {
  // Handle title and meta changes
  React.useEffect(() => {
    // Update document title
    document.title = title;
    
    // Set Open Graph meta tags
    const metaTags = {
      'og:title': title,
      'og:description': description,
      'og:image': image,
      'og:url': url || window.location.href,
      'og:type': 'website',
      'twitter:card': 'summary_large_image'
    };
    
    // Create or update meta tags
    Object.entries(metaTags).forEach(([property, content]) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    });
  }, [title, description, image, url]);

  // Handle hash scrolling after page has rendered
  React.useEffect(() => {
    // Function to scroll to hash
    const scrollToHash = () => {
      const { hash } = window.location;
      if (hash) {
        // Give the DOM time to render fully
        setTimeout(() => {
          const id = hash.replace('#', '');
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    };

    // Scroll on initial load
    scrollToHash();

    // Also attach to hashchange event
    window.addEventListener('hashchange', scrollToHash);
    return () => window.removeEventListener('hashchange', scrollToHash);
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-800 antialiased">
      <div className="max-w-[900px] mx-auto w-full px-4 pt-8 flex flex-col flex-grow">
        <Header />
        <div className="flex-grow py-4 leading-relaxed text-lg">
          {children}
        </div>
        <Footer />
      </div>
    </div>
  );
}

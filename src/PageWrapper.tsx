import React from 'react';
import Header from "./Header";
import Footer from "./Footer";

export default function PageWrapper({
  children,
  title = "Pete Koomen",
}: {
  children: React.ReactNode;
  title?: string;
}) {
  // Handle title change
  React.useEffect(() => {
    // Update document title
    document.title = title;
  }, [title]);

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
        <div className="flex-grow py-4 prose prose-lg max-w-none">
          {children}
        </div>
        <Footer />
      </div>
    </div>
  );
}

import React from 'react';
import Header from "./Header";
import Footer from "./Footer";

/**
 * A simple wrapper applied to every page in the demo project. Feel free to
 * replace this with your own layout – the scratch CLI will automatically detect
 * the component and wrap each MDX page with it during the build.
 */
export default function PageWrapper({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-gray-800 antialiased">
      <div className="max-w-2xl mx-auto w-full px-6 flex flex-col flex-grow">
        <Header />
        <div className="grow py-4 prose max-w-none">
          {children}
        </div>
        <Footer />
      </div>
    </div>
  );
}

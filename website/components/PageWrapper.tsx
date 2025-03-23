import React from 'react';
import Header from "./Header";
import Footer from "./Footer";

export default function PageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen mx-auto px-4 pt-4 sm:px-8 sm:pt-8 md:px-12 md:pt-12 lg:px-24 lg:pt-16 xl:px-48 xl:pt-20 font-sans text-gray-800 antialiased">
      <Header />
      <div className="flex-grow py-4 leading-relaxed text-lg">
        {children}
      </div>
      <Footer />
    </div>
  );
}

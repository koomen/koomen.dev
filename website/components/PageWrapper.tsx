import React from 'react';
import Header from "./Header";
import Footer from "./Footer";

export default function PageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen container mx-auto pt-12 px-24 font-sans text-gray-800 antialiased">
      <Header />
      <div className="flex-grow py-4 leading-relaxed text-lg">
        {children}
      </div>
      <Footer />
    </div>
  );
}

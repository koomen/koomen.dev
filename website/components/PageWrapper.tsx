import React from 'react';
import Header from "./Header";
import Footer from "./Footer";

export default function PageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
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

import React from 'react';
import Header from "./Header";
import Footer from "./Footer";

export default function PageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen container mx-auto pt-12 px-24">
      <Header />
      <div className="flex-grow py-4">
        {children}
      </div>
      <Footer />
    </div>
  );
}

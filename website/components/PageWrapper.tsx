import React from 'react';
import Header from "./Header";
import Footer from "./Footer";

export default function PageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto py-4 px-12">
      <Header />
      <div className="py-4">
        {children}
      </div>
      <Footer />
    </div>
  );
}

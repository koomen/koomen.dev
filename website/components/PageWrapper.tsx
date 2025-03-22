import React from 'react';
import Header from "./Header";

export default function PageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto py-4 px-6">
      <Header />
      <div className="py-4">
        {children}
      </div>
    </div>
  );
}

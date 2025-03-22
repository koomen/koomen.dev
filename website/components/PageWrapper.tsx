import React from 'react';
import Navigation from "./Navigation";

export default function PageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      <div className="container mx-auto p-4">{children}</div>
    </>
  );
}

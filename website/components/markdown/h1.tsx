import React from 'react';

export default function h1({ children }: { children: React.ReactNode }) {
  return <h1 className="text-3xl font-bold mb-4">{children}</h1>;
}

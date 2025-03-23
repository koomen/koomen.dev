import React from 'react';

export default function h2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-semibold mb-2">{children}</h2>;
}

import React from 'react';

export default function p({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 font-light leading-relaxed">{children}</p>;
}

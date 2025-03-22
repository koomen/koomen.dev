import React from 'react';

export default function p({ children }: { children: React.ReactNode }) {
  return <p className="mb-2">{children}</p>;
}

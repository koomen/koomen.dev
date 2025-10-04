import React from "react";

export default function pre({ children }: { children: React.ReactNode }) {
  return (
    <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto my-4 text-sm font-mono">
      {children}
    </pre>
  );
}

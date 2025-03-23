import React from "react";

export default function blockquote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="pl-4 border-l-4 border-gray-300 italic my-4 text-gray-700">
      {children}
    </blockquote>
  );
}

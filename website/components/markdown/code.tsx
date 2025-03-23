import React from "react";

export default function code({ children, className }: { children: React.ReactNode; className?: string }) {
  // Handle inline code vs code blocks
  const isInline = !className;
  
  if (isInline) {
    return <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>;
  }
  
  // For code blocks, the className will be in the format "language-xxx"
  return <code className={`${className} block`}>{children}</code>;
}

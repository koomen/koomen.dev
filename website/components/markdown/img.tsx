import React from "react";

export default function img({ src, alt, title }: { src: string; alt?: string; title?: string }) {
  return (
    <div className="my-4">
      <img 
        src={src} 
        alt={alt || ""} 
        title={title} 
        className="max-w-full h-auto rounded-md"
      />
      {alt && <p className="text-sm text-gray-500 mt-1 text-center">{alt}</p>}
    </div>
  );
}

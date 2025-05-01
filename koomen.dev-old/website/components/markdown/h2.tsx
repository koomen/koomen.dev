import React from 'react';

const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')         // Replace spaces with -
    .replace(/&/g, '-and-')       // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')     // Remove all non-word chars
    .replace(/\-\-+/g, '-');      // Replace multiple - with single -
};

export default function h2({ children }: { children: React.ReactNode }) {
  // Extract text content for the ID
  const childText = React.Children.toArray(children)
    .map(child => 
      typeof child === 'string' 
        ? child 
        : (child as any)?.props?.children || ''
    )
    .join('');
  
  const id = slugify(childText);
  
  return (
    <h2 id={id} className="text-2xl font-semibold mb-2 group flex items-center">
      {children}
      <a 
        href={`#${id}`} 
        className="opacity-0 group-hover:opacity-70 hover:opacity-100 ml-2 transition-opacity"
        aria-hidden="true"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="text-gray-400"
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      </a>
    </h2>
  );
}

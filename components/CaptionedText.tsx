import React from 'react';

interface CaptionedTextProps {
  caption: string;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  children: React.ReactNode;
}

const CaptionedText: React.FC<CaptionedTextProps> = ({ caption, size = 'medium', color = 'bg-gray-100', children }) => {
  const sizeClasses = {
    small: 'w-1/3',
    medium: 'w-1/2',
    large: 'w-3/4'
  };

  return (
    <figure className="my-8">
      <div 
        className={`${sizeClasses[size]} ${color} rounded-lg mx-auto p-4 font-light`}
      >
        {children}
      </div>
      <figcaption className="text-center text-sm text-gray-500 mt-2">
        {caption}
      </figcaption>
    </figure>
  );
};

export default CaptionedText;

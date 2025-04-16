import React from 'react';

interface CaptionedImageProps {
  src: string;
  alt: string;
  caption: string;
  size?: 'small' | 'medium' | 'large' | 'full';
}

const CaptionedImage: React.FC<CaptionedImageProps> = ({ src, alt, caption, size = 'full' }) => {
  const sizeClasses = {
    small: 'w-1/3',
    medium: 'w-1/2',
    large: 'w-3/4',
    full: 'w-full'
  };

  return (
    <figure className="my-8">
      <img 
        src={src} 
        alt={alt} 
        className={`${sizeClasses[size]} rounded-lg mx-auto`}
      />
      <figcaption className="text-center text-sm text-gray-500 mt-2">
        {caption}
      </figcaption>
    </figure>
  );
};

export default CaptionedImage;

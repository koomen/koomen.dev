import React from 'react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
  title?: string;
}

export function Image({ src, alt, title, ...props }: ImageProps) {
  // If there's an alt text, display it as a caption
  const showCaption = alt && alt.trim().length > 0;

  return (
    <figure className="my-4">
      <img
        src={src}
        alt={alt || ''}
        title={title}
        {...props}
      />
      {showCaption && (
        <figcaption className="text-center text-sm text-gray-500 mt-2">
          {alt}
        </figcaption>
      )}
    </figure>
  );
}

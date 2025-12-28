import React from 'react';

interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  className?: string;
}

export function Code({ children, className, ...props }: CodeProps) {
  // If className exists, it's likely a code block (e.g., "language-js")
  // Let the CodeBlock/pre handle styling in that case
  const isCodeBlock = className?.startsWith('language-');

  if (isCodeBlock) {
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  }

  // Inline code - prose handles basic styling, but we ensure it renders correctly
  return (
    <code className={className} {...props}>
      {children}
    </code>
  );
}

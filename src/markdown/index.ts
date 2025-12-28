export { CodeBlock } from './CodeBlock';
export { Code } from './Code';
export { H1, H2, H3, H4, H5, H6, Heading } from './Heading';
export { Image } from './Image';
export { default as Link } from './Link';
export { Table } from './Table';

import { CodeBlock } from './CodeBlock';
import { Code } from './Code';
import { H1, H2, H3, H4, H5, H6 } from './Heading';
import { Image } from './Image';
import Link from './Link';
import { Table } from './Table';

// MDX component overrides
// Only override elements that need interactivity or special handling
// All other styling is handled by Tailwind Typography 'prose' class
export const MDXComponents = {
  // Headings with anchor links
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  // Code with copy button
  pre: CodeBlock,
  code: Code,
  // Links with external handling
  a: Link,
  // Images with caption support
  img: Image,
  // Tables with overflow wrapper
  table: Table,
};

import React from 'react';

export default function Navigation() {
  return (
    <nav className="p-4 bg-gray-100">
      <ul className="flex space-x-4">
        <li>
          <a href="/" className="text-blue-600 hover:underline">
            Home
          </a>
        </li>
        <li>
          <a href="/about" className="text-blue-600 hover:underline">
            About
          </a>
        </li>
        <li>
          <a href="/example-blog" className="text-blue-600 hover:underline">
            Blog
          </a>
        </li>
        <li>
          <a href="/example-one" className="text-blue-600 hover:underline">
            Example One
          </a>
        </li>
        <li>
          <a href="/example-two" className="text-blue-600 hover:underline">
            Example Two
          </a>
        </li>
        <li>
          <a
            href="/example-blog/example-nested"
            className="text-blue-600 hover:underline"
          >
            Example Nested
          </a>
        </li>
      </ul>
    </nav>
  );
}

import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-6 mt-8 text-center text-sm text-gray-500">
      <p>© {currentYear} koomen.dev</p>
    </footer>
  );
}

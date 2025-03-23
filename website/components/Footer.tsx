import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-6 mt-8 text-center text-sm text-gray-500">
      <p>&copy; {currentYear} Pete Koomen. Built from <a href="https://scratch.dev" className="text-gray-700 hover:underline cursor-pointer">scratch</a></p>
    </footer>
  );
}

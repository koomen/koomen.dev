import React from "react";

function ScratchBadge() {
  return (
    <a
      href="https://scratch.dev"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center text-black text-base"
    >
      <span>Made from</span>
      <img src="/scratch-logo.svg" alt="Scratch" className="h-10" />
    </a>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-6 mt-8 flex flex-col items-center gap-2">
      <ScratchBadge />
      <p className="text-sm text-gray-500">
        &copy; {currentYear} Pete Koomen
      </p>
    </footer>
  );
}

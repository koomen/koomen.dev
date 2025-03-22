import React from "react";
import KoomenDev from "./KoomenDev";
import Links from "./Links";

export default function Header() {
  return (
    <header className="flex justify-between items-center py-4">
      <KoomenDev />
      <Links />
    </header>
  );
}

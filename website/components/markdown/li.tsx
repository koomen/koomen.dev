import React from "react";

export default function li({ children }: { children: React.ReactNode }) {
  return <li className="mb-1">{children}</li>;
}

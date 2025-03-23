import React from "react";

export default function h3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-xl font-semibold mt-6 mb-3">{children}</h3>;
}

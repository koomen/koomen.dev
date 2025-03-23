import React from "react";

export default function h5({ children }: { children: React.ReactNode }) {
  return <h5 className="text-base font-semibold mt-4 mb-2">{children}</h5>;
}

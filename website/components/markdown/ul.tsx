import React from "react";

export default function ul({ children }: { children: React.ReactNode }) {
  return <ul className="list-disc pl-6 mb-4 mt-2">{children}</ul>;
}

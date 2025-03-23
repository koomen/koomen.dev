import React from "react";

export default function ol({ children }: { children: React.ReactNode }) {
  return <ol className="list-decimal pl-6 mb-4 mt-2">{children}</ol>;
}

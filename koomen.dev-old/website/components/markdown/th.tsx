import React from "react";

export default function th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
      {children}
    </th>
  );
}

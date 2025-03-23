import React from "react";

export default function table({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-4 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-300 border-collapse">
        {children}
      </table>
    </div>
  );
}

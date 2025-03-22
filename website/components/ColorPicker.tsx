import React, { useState } from "react";

export default function ColorPicker() {
  const [color, setColor] = useState("#3b82f6");

  const colors = [
    { name: "Red", value: "#ef4444" },
    { name: "Green", value: "#22c55e" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Purple", value: "#a855f7" },
    { name: "Yellow", value: "#eab308" },
  ];

  return (
    <div className="my-4 p-4 border border-gray-200 rounded-md max-w-md">
      <h2 className="text-lg font-semibold mb-2">Color Picker Component</h2>

      <div
        className="w-full h-24 rounded-md mb-4"
        style={{ backgroundColor: color }}
      ></div>

      <div className="flex flex-wrap gap-2">
        {colors.map((c) => (
          <button
            key={c.value}
            onClick={() => setColor(c.value)}
            className="px-3 py-1 text-white rounded"
            style={{ backgroundColor: c.value }}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}

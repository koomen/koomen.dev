import React, { useState } from "react";

interface Penguin {
  species: string;
  height: number;
  weight: number;
  color: string;
}

export default function PenguinComparison() {
  const [selectedMetric, setSelectedMetric] = useState<"height" | "weight">("height");
  
  const penguins: Penguin[] = [
    { species: "Emperor", height: 122, weight: 45, color: "#3B4252" },
    { species: "King", height: 95, weight: 16, color: "#4C566A" },
    { species: "Adélie", height: 71, weight: 5.5, color: "#5E81AC" },
    { species: "Gentoo", height: 76, weight: 6, color: "#81A1C1" },
    { species: "Chinstrap", height: 68, weight: 4.5, color: "#88C0D0" },
    { species: "Macaroni", height: 70, weight: 5, color: "#8FBCBB" },
    { species: "Rockhopper", height: 55, weight: 3, color: "#A3BE8C" }
  ];
  
  // Sort penguins by the selected metric in descending order
  const sortedPenguins = [...penguins].sort((a, b) => b[selectedMetric] - a[selectedMetric]);
  
  // Calculate the maximum value for scaling
  const maxValue = Math.max(...penguins.map(p => p[selectedMetric]));
  
  return (
    <div className="my-8 p-6 bg-gray-50 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Penguin Size Comparison</h3>
        <div className="flex gap-4">
          <button 
            className={`px-3 py-1 rounded ${selectedMetric === "height" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setSelectedMetric("height")}
          >
            Height (cm)
          </button>
          <button 
            className={`px-3 py-1 rounded ${selectedMetric === "weight" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setSelectedMetric("weight")}
          >
            Weight (kg)
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {sortedPenguins.map(penguin => {
          const percentage = (penguin[selectedMetric] / maxValue) * 100;
          
          return (
            <div key={penguin.species} className="flex items-center">
              <div className="w-24 text-right pr-4">{penguin.species}</div>
              <div className="flex-1">
                <div 
                  className="h-8 rounded-r-sm flex items-center pl-2 text-white font-medium"
                  style={{ 
                    width: `${percentage}%`, 
                    backgroundColor: penguin.color,
                    minWidth: "40px"
                  }}
                >
                  {penguin[selectedMetric]}{selectedMetric === "height" ? "cm" : "kg"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        {selectedMetric === "height" ? 
          "Average adult height in centimeters" : 
          "Average adult weight in kilograms"}
      </div>
    </div>
  );
}

import React, { useState } from "react";

interface AnatomyFeature {
  id: string;
  name: string;
  description: string;
  x: number;
  y: number;
}

export default function PenguinAnatomy() {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  
  const features: AnatomyFeature[] = [
    {
      id: "feathers",
      name: "Dense Feathers",
      description: "Penguins have up to 70 feathers per square inch - the densest of any bird. These short, overlapping feathers create a waterproof outer layer while trapping an insulating layer of air against the skin.",
      x: 50,
      y: 40
    },
    {
      id: "wings",
      name: "Flipper-like Wings",
      description: "Penguin wings evolved into stiff, flat flippers perfect for swimming. They contain the same bones as flying birds, but are shorter and heavier with fused joints that limit movement to up-and-down motions.",
      x: 20,
      y: 45
    },
    {
      id: "feet",
      name: "Webbed Feet",
      description: "Specialized feet with thick webbing between the toes provide stability on ice and function as rudders while swimming. The rough texture helps with grip on slippery surfaces.",
      x: 50,
      y: 85
    },
    {
      id: "beak",
      name: "Specialized Beak",
      description: "The sharp, pointed beak is adapted for catching prey underwater. The upper mandible curves downward and overlaps the lower one, providing a secure grip on slippery fish.",
      x: 75,
      y: 25
    },
    {
      id: "tail",
      name: "Stiff Tail",
      description: "The short, stiff tail provides balance when standing upright on land and helps with steering during underwater dives.",
      x: 50,
      y: 70
    }
  ];

  return (
    <div className="my-8 p-6 bg-gray-50 rounded-lg shadow-sm">
      <h3 className="text-xl font-semibold mb-6">Penguin Anatomical Adaptations</h3>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 relative">
          <div className="relative w-full" style={{ paddingBottom: "120%" }}>
            {/* Simplified penguin silhouette */}
            <svg 
              viewBox="0 0 100 120" 
              className="absolute inset-0 w-full h-full"
            >
              {/* Body */}
              <ellipse cx="50" cy="60" rx="25" ry="40" fill="#3B4252" />
              
              {/* Head */}
              <circle cx="50" cy="25" r="15" fill="#3B4252" />
              
              {/* White front */}
              <ellipse cx="50" cy="60" rx="15" ry="30" fill="#ECEFF4" />
              <circle cx="50" cy="30" r="8" fill="#ECEFF4" />
              
              {/* Eyes */}
              <circle cx="45" cy="22" r="2" fill="#2E3440" />
              <circle cx="55" cy="22" r="2" fill="#2E3440" />
              
              {/* Beak */}
              <path d="M47,27 L53,27 L50,34 Z" fill="#D08770" />
              
              {/* Wings */}
              <path d="M25,45 Q20,65 30,85" fill="#3B4252" stroke="#2E3440" strokeWidth="1" />
              <path d="M75,45 Q80,65 70,85" fill="#3B4252" stroke="#2E3440" strokeWidth="1" />
              
              {/* Feet */}
              <path d="M40,100 L35,110 L40,110 L45,110 L50,110" fill="none" stroke="#D08770" strokeWidth="2" />
              <path d="M60,100 L55,110 L60,110 L65,110 L70,110" fill="none" stroke="#D08770" strokeWidth="2" />
              
              {/* Feature markers */}
              {features.map(feature => (
                <g 
                  key={feature.id}
                  onClick={() => setSelectedFeature(feature.id === selectedFeature ? null : feature.id)}
                  className="cursor-pointer"
                >
                  <circle 
                    cx={feature.x} 
                    cy={feature.y} 
                    r="4" 
                    fill={selectedFeature === feature.id ? "#5E81AC" : "#EBCB8B"} 
                    stroke="#2E3440" 
                    strokeWidth="1"
                  />
                  <circle 
                    cx={feature.x} 
                    cy={feature.y} 
                    r="8" 
                    fill="none" 
                    stroke={selectedFeature === feature.id ? "#5E81AC" : "#EBCB8B"} 
                    strokeWidth="1"
                    opacity="0.6"
                  />
                </g>
              ))}
            </svg>
          </div>
          <div className="mt-2 text-sm text-center text-gray-500">
            Click on a highlighted area to learn more
          </div>
        </div>
        
        <div className="flex-1 bg-white p-4 rounded border border-gray-200">
          {selectedFeature ? (
            <>
              <h4 className="font-semibold text-lg">
                {features.find(f => f.id === selectedFeature)?.name}
              </h4>
              <p className="text-gray-600 mt-2">
                {features.find(f => f.id === selectedFeature)?.description}
              </p>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Select a feature to learn about penguin adaptations
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

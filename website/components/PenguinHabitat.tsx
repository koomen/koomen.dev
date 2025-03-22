import React, { useState } from "react";

interface HabitatRegion {
  name: string;
  species: string[];
  description: string;
  color: string;
}

export default function PenguinHabitat() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  
  const regions: HabitatRegion[] = [
    {
      name: "Antarctica",
      species: ["Emperor", "Adélie"],
      description: "The coldest habitat where Emperor and Adélie penguins have adapted to extreme conditions with temperatures dropping below -60°C.",
      color: "#E5E9F0"
    },
    {
      name: "Sub-Antarctic Islands",
      species: ["King", "Gentoo", "Chinstrap", "Macaroni", "Rockhopper"],
      description: "Islands surrounding Antarctica with milder conditions, hosting a greater diversity of penguin species.",
      color: "#81A1C1"
    },
    {
      name: "New Zealand",
      species: ["Yellow-eyed", "Little Blue", "Fiordland"],
      description: "Temperate coastal regions with unique endemic species found nowhere else on Earth.",
      color: "#A3BE8C"
    },
    {
      name: "South America",
      species: ["Magellanic", "Humboldt", "Galapagos"],
      description: "Ranging from cold southern tips to tropical Galapagos Islands, demonstrating remarkable adaptability.",
      color: "#EBCB8B"
    },
    {
      name: "South Africa",
      species: ["African"],
      description: "Warm temperate waters where the endangered African penguin has adapted to higher temperatures.",
      color: "#D08770"
    },
    {
      name: "Australia",
      species: ["Little Blue", "Fairy"],
      description: "Coastal regions of southern Australia with the smallest penguin species in the world.",
      color: "#B48EAD"
    }
  ];

  const handleRegionClick = (region: string) => {
    setSelectedRegion(region === selectedRegion ? null : region);
  };

  const selectedRegionData = regions.find(r => r.name === selectedRegion);
  
  return (
    <div className="my-8 p-6 bg-gray-50 rounded-lg shadow-sm">
      <h3 className="text-xl font-semibold mb-6">Penguin Geographic Distribution</h3>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="relative w-full" style={{ paddingBottom: "100%" }}>
            <svg 
              viewBox="0 0 400 400" 
              className="absolute inset-0 w-full h-full"
            >
              {/* Simplified world map focused on Southern Hemisphere */}
              <circle cx="200" cy="200" r="180" fill="#ECEFF4" stroke="#4C566A" strokeWidth="1" />
              
              {/* Antarctica */}
              <circle 
                cx="200" 
                cy="200" 
                r="60" 
                fill={selectedRegion === "Antarctica" ? "#5E81AC" : "#E5E9F0"} 
                stroke="#4C566A" 
                strokeWidth="1"
                onClick={() => handleRegionClick("Antarctica")}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              />
              
              {/* Sub-Antarctic Islands */}
              <circle 
                cx="200" 
                cy="200" 
                r="90" 
                fill="none" 
                stroke={selectedRegion === "Sub-Antarctic Islands" ? "#5E81AC" : "#81A1C1"} 
                strokeWidth="15"
                onClick={() => handleRegionClick("Sub-Antarctic Islands")}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              />
              
              {/* New Zealand */}
              <circle 
                cx="300" 
                cy="250" 
                r="15" 
                fill={selectedRegion === "New Zealand" ? "#5E81AC" : "#A3BE8C"} 
                stroke="#4C566A" 
                strokeWidth="1"
                onClick={() => handleRegionClick("New Zealand")}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              />
              
              {/* South America */}
              <path 
                d="M120,180 Q100,220 120,260 Q140,280 130,300" 
                fill="none" 
                stroke={selectedRegion === "South America" ? "#5E81AC" : "#EBCB8B"} 
                strokeWidth="12" 
                strokeLinecap="round"
                onClick={() => handleRegionClick("South America")}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              />
              
              {/* South Africa */}
              <circle 
                cx="220" 
                cy="300" 
                r="12" 
                fill={selectedRegion === "South Africa" ? "#5E81AC" : "#D08770"} 
                stroke="#4C566A" 
                strokeWidth="1"
                onClick={() => handleRegionClick("South Africa")}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              />
              
              {/* Australia */}
              <circle 
                cx="280" 
                cy="280" 
                r="20" 
                fill={selectedRegion === "Australia" ? "#5E81AC" : "#B48EAD"} 
                stroke="#4C566A" 
                strokeWidth="1"
                onClick={() => handleRegionClick("Australia")}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              />
              
              {/* Labels */}
              <text x="200" y="200" textAnchor="middle" fill="#2E3440" fontSize="10" fontWeight="bold">Antarctica</text>
              <text x="300" y="250" textAnchor="middle" fill="#2E3440" fontSize="8">NZ</text>
              <text x="120" y="230" textAnchor="middle" fill="#2E3440" fontSize="8">S. America</text>
              <text x="220" y="300" textAnchor="middle" fill="#2E3440" fontSize="8">S. Africa</text>
              <text x="280" y="280" textAnchor="middle" fill="#2E3440" fontSize="8">Australia</text>
            </svg>
          </div>
          <div className="mt-2 text-sm text-center text-gray-500">
            Click on a region to see penguin species
          </div>
        </div>
        
        <div className="flex-1 bg-white p-4 rounded border border-gray-200">
          {selectedRegionData ? (
            <>
              <h4 className="font-semibold text-lg">{selectedRegionData.name}</h4>
              <p className="text-gray-600 mt-2 mb-4">{selectedRegionData.description}</p>
              <h5 className="font-medium">Penguin Species:</h5>
              <ul className="list-disc pl-5 mt-2">
                {selectedRegionData.species.map(species => (
                  <li key={species}>{species}</li>
                ))}
              </ul>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Select a region to view penguin species
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

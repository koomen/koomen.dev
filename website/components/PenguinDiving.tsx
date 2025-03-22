import React, { useState } from "react";

interface PenguinDiveData {
  species: string;
  maxDepth: number;
  avgDepth: number;
  maxDuration: number;
  color: string;
}

export default function PenguinDiving() {
  const [selectedPenguin, setSelectedPenguin] = useState<string | null>(null);
  
  const penguins: PenguinDiveData[] = [
    { 
      species: "Emperor", 
      maxDepth: 565, 
      avgDepth: 150, 
      maxDuration: 22, 
      color: "#3B4252" 
    },
    { 
      species: "King", 
      maxDepth: 343, 
      avgDepth: 100, 
      maxDuration: 9, 
      color: "#4C566A" 
    },
    { 
      species: "Gentoo", 
      maxDepth: 200, 
      avgDepth: 80, 
      maxDuration: 7, 
      color: "#81A1C1" 
    },
    { 
      species: "Adélie", 
      maxDepth: 180, 
      avgDepth: 70, 
      maxDuration: 6, 
      color: "#5E81AC" 
    },
    { 
      species: "Chinstrap", 
      maxDepth: 100, 
      avgDepth: 40, 
      maxDuration: 5, 
      color: "#88C0D0" 
    },
    { 
      species: "Macaroni", 
      maxDepth: 115, 
      avgDepth: 50, 
      maxDuration: 4.5, 
      color: "#8FBCBB" 
    },
    { 
      species: "Little Blue", 
      maxDepth: 30, 
      avgDepth: 15, 
      maxDuration: 2, 
      color: "#A3BE8C" 
    }
  ];
  
  // Sort penguins by max diving depth
  const sortedPenguins = [...penguins].sort((a, b) => b.maxDepth - a.maxDepth);
  
  // Calculate the maximum depth for scaling
  const maxDepth = Math.max(...penguins.map(p => p.maxDepth));
  
  // Human diving depth references
  const scubaNovice = 18;
  const scubaAdvanced = 40;
  const scubaTechnical = 100;
  const submarineDepth = 400;
  
  const getDepthPosition = (depth: number) => {
    return (depth / maxDepth) * 100;
  };
  
  return (
    <div className="my-8 p-6 bg-gray-50 rounded-lg shadow-sm">
      <h3 className="text-xl font-semibold mb-6">Penguin Diving Capabilities</h3>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="relative h-[500px] border-l border-gray-300">
            {/* Depth scale */}
            {[0, 100, 200, 300, 400, 500].map(depth => (
              <div key={depth} className="absolute left-0 flex items-center" style={{ bottom: `${getDepthPosition(depth)}%` }}>
                <div className="w-2 h-0.5 bg-gray-300 -ml-2"></div>
                <span className="text-xs text-gray-500 ml-1">{depth}m</span>
              </div>
            ))}
            
            {/* Human diving references */}
            <div 
              className="absolute left-0 right-0 border-t border-dashed border-blue-300 flex justify-end"
              style={{ bottom: `${getDepthPosition(scubaNovice)}%` }}
            >
              <span className="text-xs text-blue-500 pr-2">Recreational Scuba (18m)</span>
            </div>
            
            <div 
              className="absolute left-0 right-0 border-t border-dashed border-blue-400 flex justify-end"
              style={{ bottom: `${getDepthPosition(scubaAdvanced)}%` }}
            >
              <span className="text-xs text-blue-600 pr-2">Advanced Scuba (40m)</span>
            </div>
            
            <div 
              className="absolute left-0 right-0 border-t border-dashed border-blue-500 flex justify-end"
              style={{ bottom: `${getDepthPosition(scubaTechnical)}%` }}
            >
              <span className="text-xs text-blue-700 pr-2">Technical Diving (100m)</span>
            </div>
            
            <div 
              className="absolute left-0 right-0 border-t border-dashed border-blue-600 flex justify-end"
              style={{ bottom: `${getDepthPosition(submarineDepth)}%` }}
            >
              <span className="text-xs text-blue-800 pr-2">Military Submarines (400m)</span>
            </div>
            
            {/* Penguin dive bars */}
            <div className="absolute inset-0 flex items-end justify-around">
              {sortedPenguins.map((penguin, index) => {
                const isSelected = selectedPenguin === penguin.species;
                const barWidth = isSelected ? "w-10" : "w-6";
                
                return (
                  <div 
                    key={penguin.species}
                    className="flex flex-col items-center mb-2 cursor-pointer group"
                    onClick={() => setSelectedPenguin(penguin.species === selectedPenguin ? null : penguin.species)}
                  >
                    {/* Max depth bar */}
                    <div 
                      className={`${barWidth} relative transition-all duration-300 rounded-t`}
                      style={{ 
                        height: `${getDepthPosition(penguin.maxDepth)}%`,
                        backgroundColor: penguin.color
                      }}
                    >
                      {/* Average depth marker */}
                      <div 
                        className="absolute left-0 right-0 h-1 bg-white"
                        style={{ bottom: `${(penguin.avgDepth / penguin.maxDepth) * 100}%` }}
                      ></div>
                      
                      {/* Depth label on hover */}
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Max: {penguin.maxDepth}m
                        <br />
                        Avg: {penguin.avgDepth}m
                      </div>
                    </div>
                    
                    {/* Species label */}
                    <div className="mt-2 text-xs font-medium" style={{ color: isSelected ? penguin.color : "inherit" }}>
                      {penguin.species}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-500 mt-4">
            Click on a species to see more details
          </div>
        </div>
        
        <div className="flex-1 bg-white p-4 rounded border border-gray-200">
          {selectedPenguin ? (
            <>
              {(() => {
                const penguin = penguins.find(p => p.species === selectedPenguin)!;
                return (
                  <>
                    <h4 className="font-semibold text-lg">{penguin.species} Penguin</h4>
                    <div className="mt-4 space-y-4">
                      <div>
                        <div className="font-medium">Maximum Diving Depth</div>
                        <div className="text-2xl font-bold">{penguin.maxDepth} meters</div>
                        <div className="text-sm text-gray-500">
                          {penguin.maxDepth > submarineDepth ? 
                            `Deeper than many military submarines (${submarineDepth}m)` : 
                            penguin.maxDepth > scubaTechnical ?
                              `Deeper than technical human divers (${scubaTechnical}m)` :
                              penguin.maxDepth > scubaAdvanced ?
                                `Deeper than advanced scuba divers (${scubaAdvanced}m)` :
                                `Deeper than novice scuba divers (${scubaNovice}m)`
                          }
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-medium">Average Diving Depth</div>
                        <div>{penguin.avgDepth} meters</div>
                        <div className="text-sm text-gray-500">Typical foraging depth</div>
                      </div>
                      
                      <div>
                        <div className="font-medium">Maximum Dive Duration</div>
                        <div>{penguin.maxDuration} minutes</div>
                        <div className="text-sm text-gray-500">
                          {penguin.maxDuration > 10 ? 
                            "Exceptional breath-holding capacity" : 
                            penguin.maxDuration > 5 ?
                              "Very good breath-holding capacity" :
                              "Good breath-holding capacity"
                          }
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-medium">Diving Adaptations</div>
                        <ul className="list-disc pl-5 text-sm">
                          <li>Enhanced myoglobin concentration in muscles</li>
                          <li>Specialized hemoglobin with high oxygen affinity</li>
                          <li>Reinforced air sacs that collapse under pressure</li>
                          <li>Reduced blood flow to non-essential organs while diving</li>
                        </ul>
                      </div>
                    </div>
                  </>
                );
              })()}
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Select a penguin species to view detailed diving information
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

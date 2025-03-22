import React, { useState } from "react";

interface ThermalLayer {
  name: string;
  description: string;
  thickness: number;
  insulation: number;
  color: string;
}

export default function PenguinThermoregulation() {
  const [temperature, setTemperature] = useState<"cold" | "moderate" | "warm">("cold");
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  
  const temperatureValues = {
    cold: -40,
    moderate: -10,
    warm: 10
  };
  
  const layers: ThermalLayer[] = [
    {
      name: "Feathers",
      description: "Dense, overlapping feathers create a waterproof barrier. Each square inch contains up to 70 feathers - more than any other bird. The structure traps a layer of air for insulation.",
      thickness: 30,
      insulation: 0.8,
      color: "#4C566A"
    },
    {
      name: "Air Layer",
      description: "Trapped air provides excellent insulation. Penguins can control the amount of air trapped by erecting or flattening their feathers, adjusting insulation as needed.",
      thickness: 15,
      insulation: 0.9,
      color: "#ECEFF4"
    },
    {
      name: "Fat Layer",
      description: "Subcutaneous fat can constitute up to 30% of body mass. This blubber layer provides both insulation and energy reserves during fasting periods.",
      thickness: 40,
      insulation: 0.7,
      color: "#EBCB8B"
    },
    {
      name: "Muscle",
      description: "Dense muscle tissue generates heat through shivering and activity. Blood vessels can dilate or constrict to control heat distribution.",
      thickness: 50,
      insulation: 0.4,
      color: "#BF616A"
    },
    {
      name: "Core",
      description: "The vital organs maintain a constant temperature of about 38°C (100°F) regardless of external conditions, protected by the multiple insulating layers.",
      thickness: 60,
      insulation: 0,
      color: "#B48EAD"
    }
  ];
  
  // Calculate heat flow visualization
  const calculateHeatFlow = (layer: ThermalLayer) => {
    // More insulation = less heat flow
    const baseFlow = 1 - layer.insulation;
    
    // Adjust based on temperature - more flow in cold conditions
    let tempMultiplier = 1;
    if (temperature === "cold") tempMultiplier = 1.5;
    if (temperature === "warm") tempMultiplier = 0.5;
    
    return baseFlow * tempMultiplier;
  };
  
  // Calculate layer width based on temperature
  const getLayerWidth = (layer: ThermalLayer) => {
    // In cold conditions, feathers and air layer expand
    if (temperature === "cold" && (layer.name === "Feathers" || layer.name === "Air Layer")) {
      return layer.thickness * 1.2;
    }
    
    // In warm conditions, feathers compress and blood vessels dilate to release heat
    if (temperature === "warm" && layer.name === "Feathers") {
      return layer.thickness * 0.8;
    }
    
    return layer.thickness;
  };
  
  return (
    <div className="my-8 p-6 bg-gray-50 rounded-lg shadow-sm">
      <h3 className="text-xl font-semibold mb-6">Penguin Thermoregulation System</h3>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="mb-4 flex justify-center">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium ${
                  temperature === "cold"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                } border border-gray-200 rounded-l-lg`}
                onClick={() => setTemperature("cold")}
              >
                Cold (-40°C)
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium ${
                  temperature === "moderate"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                } border-t border-b border-gray-200`}
                onClick={() => setTemperature("moderate")}
              >
                Moderate (-10°C)
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium ${
                  temperature === "warm"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                } border border-gray-200 rounded-r-lg`}
                onClick={() => setTemperature("warm")}
              >
                Warm (10°C)
              </button>
            </div>
          </div>
          
          <div className="relative bg-gradient-to-r from-blue-100 to-blue-300 rounded-lg p-4" style={{ height: "400px" }}>
            {/* External temperature indicator */}
            <div className="absolute top-2 left-2 bg-white bg-opacity-70 rounded px-2 py-1 text-sm">
              External: {temperatureValues[temperature]}°C
            </div>
            
            {/* Core temperature indicator */}
            <div className="absolute top-2 right-2 bg-white bg-opacity-70 rounded px-2 py-1 text-sm">
              Core: 38°C
            </div>
            
            {/* Penguin cross-section */}
            <div className="flex justify-center items-center h-full">
              <svg viewBox="0 0 400 300" className="w-full h-full">
                {/* Penguin outline */}
                <ellipse cx="200" cy="150" rx="150" ry="120" fill="none" stroke="#2E3440" strokeWidth="1" strokeDasharray="5,5" />
                
                {/* Thermal layers - from outside to inside */}
                {layers.map((layer, index) => {
                  const prevLayersWidth = layers
                    .slice(0, index)
                    .reduce((sum, l) => sum + getLayerWidth(l), 0);
                  
                  const radius = 150 - prevLayersWidth;
                  const layerWidth = getLayerWidth(layer);
                  
                  return (
                    <g key={layer.name}>
                      <ellipse 
                        cx="200" 
                        cy="150" 
                        rx={radius} 
                        ry={radius * 0.8} 
                        fill={layer.color}
                        stroke="#2E3440"
                        strokeWidth="0.5"
                        className="cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setSelectedLayer(layer.name === selectedLayer ? null : layer.name)}
                      />
                      
                      {/* Layer label */}
                      {radius > 30 && (
                        <text 
                          x="200" 
                          y="150" 
                          textAnchor="middle" 
                          fill={layer.name === "Air Layer" ? "#2E3440" : "#FFFFFF"} 
                          fontSize="10"
                          fontWeight={layer.name === selectedLayer ? "bold" : "normal"}
                          className="pointer-events-none"
                        >
                          {layer.name}
                        </text>
                      )}
                      
                      {/* Heat flow visualization */}
                      {index < layers.length - 1 && temperature === "cold" && (
                        <>
                          {[...Array(8)].map((_, i) => {
                            const angle = (i * 45) * (Math.PI / 180);
                            const x1 = 200 + (radius - layerWidth / 2) * Math.cos(angle);
                            const y1 = 150 + (radius - layerWidth / 2) * Math.sin(angle) * 0.8;
                            
                            // Heat flows from inside to outside
                            const arrowLength = 10 * calculateHeatFlow(layer);
                            const x2 = x1 + arrowLength * Math.cos(angle);
                            const y2 = y1 + arrowLength * Math.sin(angle) * 0.8;
                            
                            return (
                              <line 
                                key={`heat-${layer.name}-${i}`}
                                x1={x1} 
                                y1={y1} 
                                x2={x2} 
                                y2={y2} 
                                stroke="#BF616A" 
                                strokeWidth="1"
                                strokeOpacity={calculateHeatFlow(layer)}
                                markerEnd="url(#heatArrow)"
                              />
                            );
                          })}
                        </>
                      )}
                      
                      {/* Blood vessel visualization in warm conditions */}
                      {temperature === "warm" && layer.name === "Muscle" && (
                        <>
                          {[...Array(12)].map((_, i) => {
                            const angle = (i * 30) * (Math.PI / 180);
                            const vesselRadius = radius - 5;
                            const x = 200 + vesselRadius * Math.cos(angle);
                            const y = 150 + vesselRadius * Math.sin(angle) * 0.8;
                            
                            return (
                              <circle 
                                key={`vessel-${i}`}
                                cx={x} 
                                cy={y} 
                                r="3" 
                                fill="#BF616A" 
                              />
                            );
                          })}
                        </>
                      )}
                    </g>
                  );
                })}
                
                {/* Arrow marker definition */}
                <defs>
                  <marker
                    id="heatArrow"
                    markerWidth="6"
                    markerHeight="4"
                    refX="6"
                    refY="2"
                    orient="auto"
                  >
                    <polygon points="0 0, 6 2, 0 4" fill="#BF616A" />
                  </marker>
                </defs>
              </svg>
            </div>
          </div>
          
          <div className="mt-2 text-sm text-center text-gray-500">
            Click on a layer to learn more about its insulating properties
          </div>
        </div>
        
        <div className="flex-1 bg-white p-4 rounded border border-gray-200">
          {selectedLayer ? (
            <>
              <h4 className="font-semibold text-lg">
                {layers.find(l => l.name === selectedLayer)?.name}
              </h4>
              <p className="text-gray-600 mt-2">
                {layers.find(l => l.name === selectedLayer)?.description}
              </p>
              
              <div className="mt-4">
                <div className="font-medium">Thermal Properties</div>
                <div className="mt-2 space-y-2">
                  <div>
                    <div className="text-sm text-gray-500">Insulation Effectiveness</div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ 
                          width: `${layers.find(l => l.name === selectedLayer)?.insulation! * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500">Relative Thickness</div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                      <div 
                        className="bg-green-600 h-2.5 rounded-full" 
                        style={{ 
                          width: `${(layers.find(l => l.name === selectedLayer)?.thickness! / 60) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="font-medium">Adaptation to {temperature} conditions</div>
                <p className="text-sm text-gray-600 mt-1">
                  {temperature === "cold" && selectedLayer === "Feathers" && 
                    "Feathers are fully erected to maximize trapped air and insulation. This creates the thickest possible barrier against the extreme cold."}
                  {temperature === "cold" && selectedLayer === "Air Layer" && 
                    "Maximum air is trapped between feathers, creating an excellent insulating layer that prevents heat loss."}
                  {temperature === "cold" && selectedLayer === "Fat Layer" && 
                    "The fat layer serves as both insulation and energy reserve during extreme cold conditions."}
                  {temperature === "cold" && selectedLayer === "Muscle" && 
                    "Blood vessels constrict to minimize heat loss. Shivering may occur to generate additional heat."}
                  {temperature === "cold" && selectedLayer === "Core" && 
                    "Core temperature remains stable at 38°C despite the extreme external cold, protected by multiple insulating layers."}
                  
                  {temperature === "moderate" && selectedLayer === "Feathers" && 
                    "Feathers are partially erected, providing balanced insulation for typical Antarctic conditions."}
                  {temperature === "moderate" && selectedLayer === "Air Layer" && 
                    "Moderate amount of air is trapped, providing sufficient insulation without overheating."}
                  {temperature === "moderate" && selectedLayer === "Fat Layer" && 
                    "Fat provides steady insulation in these common Antarctic conditions."}
                  {temperature === "moderate" && selectedLayer === "Muscle" && 
                    "Blood flow is regulated to maintain optimal temperature balance."}
                  {temperature === "moderate" && selectedLayer === "Core" && 
                    "Core temperature remains stable at 38°C, with balanced heat retention and dissipation."}
                  
                  {temperature === "warm" && selectedLayer === "Feathers" && 
                    "Feathers are flattened to reduce insulation and allow more heat to escape from the body."}
                  {temperature === "warm" && selectedLayer === "Air Layer" && 
                    "Minimal air is trapped as the penguin needs to release heat rather than retain it."}
                  {temperature === "warm" && selectedLayer === "Fat Layer" && 
                    "While still present, the insulating effect of fat becomes a challenge in warm conditions."}
                  {temperature === "warm" && selectedLayer === "Muscle" && 
                    "Blood vessels dilate to bring warm blood closer to the surface, allowing heat to dissipate."}
                  {temperature === "warm" && selectedLayer === "Core" && 
                    "Core temperature remains stable at 38°C despite external warmth, as the penguin actively works to release excess heat."}
                </p>
              </div>
            </>
          ) : (
            <>
              <h4 className="font-semibold text-lg">Penguin Thermal Regulation</h4>
              
              <div className="mt-4 space-y-4 text-sm">
                <p className="text-gray-600">
                  Penguins maintain a stable internal body temperature of approximately 38°C (100°F) 
                  despite living in environments that can range from -60°C to +30°C. This remarkable 
                  thermal regulation is achieved through multiple specialized adaptations.
                </p>
                
                <div>
                  <div className="font-medium text-base">Current Environment: {temperature === "cold" ? "Extreme Cold" : temperature === "moderate" ? "Moderate Cold" : "Warm"}</div>
                  <p className="text-gray-600">
                    {temperature === "cold" && 
                      "In extreme cold conditions (-40°C), penguins maximize insulation by erecting feathers to trap more air and restricting blood flow to extremities."}
                    {temperature === "moderate" && 
                      "In moderate conditions (-10°C), penguins maintain balanced insulation with partially erected feathers and controlled blood flow."}
                    {temperature === "warm" && 
                      "In warm conditions (10°C), penguins must dissipate heat by flattening feathers, dilating blood vessels, and increasing blood flow to extremities."}
                  </p>
                </div>
                
                <div>
                  <div className="font-medium text-base">Countercurrent Heat Exchange</div>
                  <p className="text-gray-600">
                    One of the most remarkable adaptations is the countercurrent heat exchange system in 
                    penguin extremities. Arteries carrying warm blood from the core run parallel to veins 
                    carrying cold blood from the extremities. This allows heat to transfer from outgoing 
                    to incoming blood, conserving thermal energy with efficiency exceeding 90%.
                  </p>
                </div>
                
                <div>
                  <div className="font-medium text-base">Thermal Windows</div>
                  <p className="text-gray-600">
                    Penguins have specialized areas called "thermal windows" on their bodies where 
                    feathers are thinner. In warm conditions, they can increase blood flow to these 
                    areas to release excess heat. In cold conditions, blood flow to these areas is 
                    restricted to minimize heat loss.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

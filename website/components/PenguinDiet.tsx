import React, { useState } from "react";

interface FoodItem {
  name: string;
  percentage: number;
  description: string;
  color: string;
}

interface PenguinDietData {
  species: string;
  diet: FoodItem[];
  feedingStrategy: string;
  dailyConsumption: string;
  huntingDepth: string;
}

export default function PenguinDiet() {
  const [selectedPenguin, setSelectedPenguin] = useState<string>("Emperor");
  
  const dietData: PenguinDietData[] = [
    {
      species: "Emperor",
      diet: [
        { name: "Fish", percentage: 35, description: "Antarctic silverfish, lanternfish", color: "#5E81AC" },
        { name: "Squid", percentage: 57, description: "Primarily glacial squid", color: "#B48EAD" },
        { name: "Krill", percentage: 8, description: "Antarctic krill", color: "#BF616A" }
      ],
      feedingStrategy: "Deep diving pursuit hunter, can dive over 500m to catch prey",
      dailyConsumption: "2-3kg during normal periods, up to 6kg when fattening before breeding season",
      huntingDepth: "100-250m typical, up to 565m maximum"
    },
    {
      species: "King",
      diet: [
        { name: "Fish", percentage: 30, description: "Lanternfish, myctophids", color: "#5E81AC" },
        { name: "Squid", percentage: 65, description: "Various species of small squid", color: "#B48EAD" },
        { name: "Crustaceans", percentage: 5, description: "Small crustaceans", color: "#BF616A" }
      ],
      feedingStrategy: "Deep diving pursuit hunter, similar to Emperor but in sub-Antarctic waters",
      dailyConsumption: "1.5-2kg during normal periods, up to 4kg when fattening",
      huntingDepth: "50-150m typical, up to 343m maximum"
    },
    {
      species: "Adélie",
      diet: [
        { name: "Krill", percentage: 78, description: "Antarctic krill (Euphausia superba)", color: "#BF616A" },
        { name: "Fish", percentage: 20, description: "Antarctic silverfish, lanternfish", color: "#5E81AC" },
        { name: "Squid", percentage: 2, description: "Small squid species", color: "#B48EAD" }
      ],
      feedingStrategy: "Surface forager and shallow pursuit hunter, forages within 50km of colony",
      dailyConsumption: "0.5-1kg daily, primarily krill",
      huntingDepth: "10-70m typical, up to 180m maximum"
    },
    {
      species: "Gentoo",
      diet: [
        { name: "Fish", percentage: 55, description: "Various coastal fish species", color: "#5E81AC" },
        { name: "Krill", percentage: 38, description: "Antarctic krill", color: "#BF616A" },
        { name: "Squid", percentage: 7, description: "Small coastal squid", color: "#B48EAD" }
      ],
      feedingStrategy: "Coastal pursuit hunter, typically stays within 25km of colony",
      dailyConsumption: "0.5-1kg daily",
      huntingDepth: "20-80m typical, up to 200m maximum"
    },
    {
      species: "Chinstrap",
      diet: [
        { name: "Krill", percentage: 95, description: "Almost exclusively Antarctic krill", color: "#BF616A" },
        { name: "Fish", percentage: 4, description: "Small fish species", color: "#5E81AC" },
        { name: "Squid", percentage: 1, description: "Rarely consumed", color: "#B48EAD" }
      ],
      feedingStrategy: "Specialized krill hunter, forages in large groups",
      dailyConsumption: "0.5kg daily, almost entirely krill",
      huntingDepth: "10-40m typical, up to 100m maximum"
    },
    {
      species: "Macaroni",
      diet: [
        { name: "Krill", percentage: 85, description: "Antarctic krill and other euphausiids", color: "#BF616A" },
        { name: "Fish", percentage: 10, description: "Small pelagic fish", color: "#5E81AC" },
        { name: "Squid", percentage: 5, description: "Small squid species", color: "#B48EAD" }
      ],
      feedingStrategy: "Pelagic forager, can travel over 300km from colony when feeding",
      dailyConsumption: "0.4-0.8kg daily",
      huntingDepth: "15-50m typical, up to 115m maximum"
    },
    {
      species: "Little Blue",
      diet: [
        { name: "Fish", percentage: 75, description: "Small coastal fish, anchovies", color: "#5E81AC" },
        { name: "Squid", percentage: 15, description: "Small squid species", color: "#B48EAD" },
        { name: "Crustaceans", percentage: 10, description: "Krill and other small crustaceans", color: "#BF616A" }
      ],
      feedingStrategy: "Coastal forager, typically hunts within 15km of colony",
      dailyConsumption: "0.2-0.3kg daily (25% of body weight)",
      huntingDepth: "5-15m typical, up to 30m maximum"
    }
  ];
  
  const selectedData = dietData.find(d => d.species === selectedPenguin)!;
  
  // For the pie chart
  const total = selectedData.diet.reduce((sum, item) => sum + item.percentage, 0);
  let startAngle = 0;
  
  return (
    <div className="my-8 p-6 bg-gray-50 rounded-lg shadow-sm">
      <h3 className="text-xl font-semibold mb-6">Penguin Diet Analysis</h3>
      
      <div className="flex justify-center mb-4">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          {dietData.map(data => (
            <button
              key={data.species}
              type="button"
              className={`px-4 py-2 text-sm font-medium ${
                selectedPenguin === data.species
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              } border border-gray-200 ${
                data.species === dietData[0].species
                  ? "rounded-l-lg"
                  : data.species === dietData[dietData.length - 1].species
                  ? "rounded-r-lg"
                  : ""
              }`}
              onClick={() => setSelectedPenguin(data.species)}
            >
              {data.species}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 flex justify-center">
          <div className="relative" style={{ width: "250px", height: "250px" }}>
            {/* Pie chart */}
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="48" fill="#ECEFF4" stroke="#E5E9F0" strokeWidth="1" />
              
              {selectedData.diet.map((item) => {
                const angle = (item.percentage / total) * 360;
                const endAngle = startAngle + angle;
                
                // Calculate the SVG arc path
                const x1 = 50 + 48 * Math.cos((startAngle - 90) * (Math.PI / 180));
                const y1 = 50 + 48 * Math.sin((startAngle - 90) * (Math.PI / 180));
                const x2 = 50 + 48 * Math.cos((endAngle - 90) * (Math.PI / 180));
                const y2 = 50 + 48 * Math.sin((endAngle - 90) * (Math.PI / 180));
                
                // For the label position
                const labelAngle = startAngle + (angle / 2);
                const labelRadius = 30;
                const labelX = 50 + labelRadius * Math.cos((labelAngle - 90) * (Math.PI / 180));
                const labelY = 50 + labelRadius * Math.sin((labelAngle - 90) * (Math.PI / 180));
                
                // For the large arc flag
                const largeArcFlag = angle > 180 ? 1 : 0;
                
                // Create the path
                const path = `M 50 50 L ${x1} ${y1} A 48 48 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
                
                // Update startAngle for the next segment
                const nextStartAngle = endAngle;
                startAngle = nextStartAngle;
                
                return (
                  <g key={item.name}>
                    <path
                      d={path}
                      fill={item.color}
                      stroke="#ECEFF4"
                      strokeWidth="0.5"
                    />
                    {item.percentage >= 10 && (
                      <text
                        x={labelX}
                        y={labelY}
                        textAnchor="middle"
                        fill="white"
                        fontSize="4"
                        fontWeight="bold"
                      >
                        {item.percentage}%
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
            
            {/* Legend */}
            <div className="absolute bottom-0 left-0 right-0">
              <div className="flex justify-center gap-4">
                {selectedData.diet.map(item => (
                  <div key={item.name} className="flex items-center">
                    <div 
                      className="w-3 h-3 mr-1" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-xs">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 bg-white p-4 rounded border border-gray-200">
          <h4 className="font-semibold text-lg">{selectedPenguin} Penguin Diet</h4>
          
          <div className="mt-4 space-y-4">
            <div>
              <div className="font-medium">Primary Food Sources</div>
              <ul className="mt-1 space-y-2">
                {selectedData.diet.map(item => (
                  <li key={item.name} className="flex items-center">
                    <div 
                      className="w-3 h-3 mr-2 rounded-sm" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <div>
                      <span className="font-medium">{item.name} ({item.percentage}%)</span>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <div className="font-medium">Feeding Strategy</div>
              <p className="text-sm text-gray-600">{selectedData.feedingStrategy}</p>
            </div>
            
            <div>
              <div className="font-medium">Daily Consumption</div>
              <p className="text-sm text-gray-600">{selectedData.dailyConsumption}</p>
            </div>
            
            <div>
              <div className="font-medium">Typical Hunting Depth</div>
              <p className="text-sm text-gray-600">{selectedData.huntingDepth}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

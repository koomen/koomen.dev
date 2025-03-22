import React, { useState, useEffect, useRef } from "react";

export default function PenguinSwimming() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<"slow" | "normal" | "fast">("normal");
  const [showForces, setShowForces] = useState(true);
  const requestRef = useRef<number>();
  const animationStartTimeRef = useRef<number | null>(null);
  
  const speedMultiplier = {
    slow: 0.5,
    normal: 1,
    fast: 2
  };
  
  useEffect(() => {
    if (isPlaying) {
      const animate = (time: number) => {
        if (animationStartTimeRef.current === null) {
          animationStartTimeRef.current = time;
        }
        
        const elapsed = time - animationStartTimeRef.current;
        const cycle = (elapsed * 0.001 * speedMultiplier[speed]) % 1;
        
        // Update wing position
        const wingElements = document.querySelectorAll(".penguin-wing");
        wingElements.forEach((wing) => {
          const wingEl = wing as SVGElement;
          const isLeftWing = wingEl.classList.contains("left-wing");
          
          // Calculate wing rotation based on cycle
          let rotation = Math.sin(cycle * Math.PI * 2) * 25;
          
          // Apply rotation to wings
          if (isLeftWing) {
            wingEl.style.transform = `rotate(${rotation}deg)`;
          } else {
            wingEl.style.transform = `rotate(${-rotation}deg)`;
          }
        });
        
        // Update force arrows visibility and size based on cycle
        if (showForces) {
          const thrustArrow = document.querySelector(".thrust-arrow") as SVGElement;
          const dragArrow = document.querySelector(".drag-arrow") as SVGElement;
          const liftArrow = document.querySelector(".lift-arrow") as SVGElement;
          
          if (thrustArrow && dragArrow && liftArrow) {
            // Thrust is strongest at mid-stroke
            const thrustMagnitude = Math.abs(Math.sin(cycle * Math.PI * 2));
            thrustArrow.style.opacity = thrustMagnitude.toString();
            thrustArrow.style.strokeWidth = (1 + thrustMagnitude * 2).toString();
            
            // Drag increases with speed
            dragArrow.style.opacity = (0.3 + thrustMagnitude * 0.7).toString();
            
            // Lift varies based on wing position
            const liftMagnitude = 0.3 + Math.abs(Math.cos(cycle * Math.PI * 2)) * 0.7;
            liftArrow.style.opacity = liftMagnitude.toString();
            liftArrow.style.strokeWidth = (1 + liftMagnitude).toString();
          }
        }
        
        // Continue animation loop
        requestRef.current = requestAnimationFrame(animate);
      };
      
      requestRef.current = requestAnimationFrame(animate);
      return () => {
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }
        animationStartTimeRef.current = null;
      };
    }
  }, [isPlaying, speed, showForces]);
  
  const toggleAnimation = () => {
    setIsPlaying(!isPlaying);
  };
  
  return (
    <div className="my-8 p-6 bg-gray-50 rounded-lg shadow-sm">
      <h3 className="text-xl font-semibold mb-4">Penguin Swimming Mechanics</h3>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 relative">
          <div className="bg-gradient-to-b from-blue-300 to-blue-600 rounded-lg overflow-hidden" style={{ height: "350px" }}>
            <svg 
              viewBox="0 0 400 300" 
              className="w-full h-full"
              style={{ overflow: "visible" }}
            >
              {/* Water surface */}
              <line x1="0" y1="50" x2="400" y2="50" stroke="#E5E9F0" strokeWidth="2" strokeDasharray="5,3" />
              
              {/* Penguin body */}
              <g transform="translate(200, 150)">
                {/* Body */}
                <ellipse cx="0" cy="0" rx="40" ry="70" fill="#3B4252" />
                
                {/* White front */}
                <ellipse cx="0" cy="0" rx="25" ry="55" fill="#ECEFF4" />
                
                {/* Head */}
                <circle cx="0" cy="-75" r="25" fill="#3B4252" />
                <circle cx="0" cy="-80" r="15" fill="#ECEFF4" />
                
                {/* Eyes */}
                <circle cx="-8" cy="-85" r="3" fill="#2E3440" />
                <circle cx="8" cy="-85" r="3" fill="#2E3440" />
                
                {/* Beak */}
                <path d="M-5,-75 L5,-75 L0,-65 Z" fill="#D08770" />
                
                {/* Left wing */}
                <path 
                  d="M-40,0 Q-60,-20 -65,-50 Q-60,-70 -40,-80" 
                  fill="#3B4252" 
                  stroke="#2E3440" 
                  strokeWidth="1"
                  className="penguin-wing left-wing"
                  style={{ transformOrigin: "-40px 0px" }}
                />
                
                {/* Right wing */}
                <path 
                  d="M40,0 Q60,-20 65,-50 Q60,-70 40,-80" 
                  fill="#3B4252" 
                  stroke="#2E3440" 
                  strokeWidth="1"
                  className="penguin-wing right-wing"
                  style={{ transformOrigin: "40px 0px" }}
                />
                
                {/* Tail */}
                <path d="M-10,70 L0,90 L10,70" fill="#3B4252" />
                
                {/* Force arrows - only visible when showForces is true */}
                {showForces && (
                  <>
                    {/* Thrust force (backward) */}
                    <line 
                      x1="0" y1="0" 
                      x2="100" y2="0" 
                      stroke="#5E81AC" 
                      strokeWidth="3"
                      markerEnd="url(#arrowhead)"
                      className="thrust-arrow"
                    />
                    
                    {/* Drag force (forward) */}
                    <line 
                      x1="0" y1="0" 
                      x2="-70" y2="0" 
                      stroke="#BF616A" 
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                      className="drag-arrow"
                    />
                    
                    {/* Lift force (upward) */}
                    <line 
                      x1="0" y1="0" 
                      x2="0" y2="-50" 
                      stroke="#A3BE8C" 
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                      className="lift-arrow"
                    />
                  </>
                )}
              </g>
              
              {/* Arrow marker definition */}
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" />
                </marker>
              </defs>
              
              {/* Streamlines */}
              {isPlaying && (
                <>
                  {[...Array(8)].map((_, i) => (
                    <path
                      key={i}
                      d={`M${400 - (i * 50) % 400},${70 + i * 30} Q${350 - (i * 50) % 400},${70 + i * 30} ${300 - (i * 50) % 400},${70 + i * 30}`}
                      fill="none"
                      stroke="#E5E9F0"
                      strokeWidth="1"
                      strokeDasharray="5,5"
                      opacity="0.7"
                    >
                      <animate
                        attributeName="d"
                        dur={`${3 / speedMultiplier[speed]}s`}
                        repeatCount="indefinite"
                        values={`
                          M${400 - (i * 50) % 400},${70 + i * 30} Q${350 - (i * 50) % 400},${70 + i * 30} ${300 - (i * 50) % 400},${70 + i * 30};
                          M${350 - (i * 50) % 400},${70 + i * 30} Q${300 - (i * 50) % 400},${70 + i * 30} ${250 - (i * 50) % 400},${70 + i * 30};
                          M${300 - (i * 50) % 400},${70 + i * 30} Q${250 - (i * 50) % 400},${70 + i * 30} ${200 - (i * 50) % 400},${70 + i * 30};
                          M${250 - (i * 50) % 400},${70 + i * 30} Q${200 - (i * 50) % 400},${70 + i * 30} ${150 - (i * 50) % 400},${70 + i * 30};
                          M${200 - (i * 50) % 400},${70 + i * 30} Q${150 - (i * 50) % 400},${70 + i * 30} ${100 - (i * 50) % 400},${70 + i * 30};
                          M${150 - (i * 50) % 400},${70 + i * 30} Q${100 - (i * 50) % 400},${70 + i * 30} ${50 - (i * 50) % 400},${70 + i * 30};
                          M${100 - (i * 50) % 400},${70 + i * 30} Q${50 - (i * 50) % 400},${70 + i * 30} ${0 - (i * 50) % 400},${70 + i * 30};
                          M${50 - (i * 50) % 400},${70 + i * 30} Q${0 - (i * 50) % 400},${70 + i * 30} ${-50 - (i * 50) % 400},${70 + i * 30};
                          M${0 - (i * 50) % 400},${70 + i * 30} Q${-50 - (i * 50) % 400},${70 + i * 30} ${-100 - (i * 50) % 400},${70 + i * 30};
                          M${400 - (i * 50) % 400},${70 + i * 30} Q${350 - (i * 50) % 400},${70 + i * 30} ${300 - (i * 50) % 400},${70 + i * 30};
                        `}
                      />
                    </path>
                  ))}
                </>
              )}
            </svg>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={toggleAnimation}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {isPlaying ? "Pause" : "Play Animation"}
            </button>
            
            <div className="flex items-center gap-2">
              <span className="text-sm">Speed:</span>
              <select
                value={speed}
                onChange={(e) => setSpeed(e.target.value as "slow" | "normal" | "fast")}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="slow">Slow</option>
                <option value="normal">Normal</option>
                <option value="fast">Fast</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={showForces}
                  onChange={() => setShowForces(!showForces)}
                />
                Show Forces
              </label>
            </div>
          </div>
        </div>
        
        <div className="flex-1 bg-white p-4 rounded border border-gray-200">
          <h4 className="font-semibold text-lg">Penguin Swimming Biomechanics</h4>
          
          <div className="mt-4 space-y-4 text-sm">
            <div>
              <div className="font-medium text-base">Wing Propulsion</div>
              <p className="text-gray-600">
                Unlike fish that use their tails for propulsion, penguins "fly" underwater using their wings. 
                The wings have evolved into stiff, flat flippers that generate thrust through up-and-down 
                motion rather than the forward-and-back motion used by flying birds.
              </p>
            </div>
            
            <div>
              <div className="font-medium text-base">Hydrodynamic Forces</div>
              <ul className="list-disc pl-5 space-y-1">
                <li className="text-blue-600">
                  <span className="font-medium">Thrust</span>: Generated by the downstroke and upstroke of the wings
                </li>
                <li className="text-red-600">
                  <span className="font-medium">Drag</span>: Resistance from water against forward motion
                </li>
                <li className="text-green-600">
                  <span className="font-medium">Lift</span>: Upward force created by the shape of the body and wings
                </li>
              </ul>
            </div>
            
            <div>
              <div className="font-medium text-base">Efficiency Metrics</div>
              <p className="text-gray-600">
                Penguins achieve remarkable propulsive efficiency, with a Froude efficiency of up to 0.87 
                (compared to 0.7 for many human-engineered propellers). This allows Emperor penguins to 
                maintain speeds of 7-9 km/h for hours while foraging, with burst speeds up to 36 km/h.
              </p>
            </div>
            
            <div>
              <div className="font-medium text-base">Body Adaptations</div>
              <p className="text-gray-600">
                The fusiform (spindle-shaped) body minimizes drag. Special feathers create micro-turbulence 
                that reduces drag by up to 25%, similar to the dimples on a golf ball. The stiff, rudder-like 
                tail provides stability and assists with steering.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

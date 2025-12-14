import React from 'react';
import { ChamberType, CalculationResult } from '../types';

interface ChamberDiagramProps {
  type: ChamberType;
  result: CalculationResult;
}

export const ChamberDiagram: React.FC<ChamberDiagramProps> = ({ type, result }) => {
  const { length, totalWidth, totalDepth, effectiveDepth } = result;
  
  // Scaling factors to fit SVG
  const maxDim = Math.max(length, totalWidth * 3, totalDepth * 3); // Weight width/depth to make side view visible
  const scale = 350 / maxDim;

  const L_scaled = length * scale;
  const H_total_scaled = totalDepth * scale;
  const H_water_scaled = effectiveDepth * scale;
  
  // Colors
  const concreteColor = "#94a3b8";
  const waterColor = "#38bdf8";
  const gritColor = "#a16207";

  if (type === ChamberType.HORIZONTAL) {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-slate-200 shadow-sm mt-4">
        <h3 className="text-sm font-semibold text-slate-500 mb-4">纵剖面图 (侧视)</h3>
        <svg width="100%" height="250" viewBox={`0 0 ${L_scaled + 100} ${H_total_scaled + 50}`} className="max-w-md">
          {/* Tank Body */}
          <path 
            d={`M 10,10 L ${10 + L_scaled},10 L ${10 + L_scaled},${10 + H_total_scaled} L 10,${10 + H_total_scaled} Z`} 
            fill="none" 
            stroke={concreteColor} 
            strokeWidth="4"
          />
          
          {/* Water Level */}
          <rect 
            x="12" 
            y={10 + (totalDepth - effectiveDepth) * scale} 
            width={L_scaled - 4} 
            height={H_water_scaled} 
            fill={waterColor} 
            opacity="0.3" 
          />
          <line 
            x1="10" 
            y1={10 + (totalDepth - effectiveDepth) * scale} 
            x2={10 + L_scaled} 
            y2={10 + (totalDepth - effectiveDepth) * scale} 
            stroke="#0ea5e9" 
            strokeWidth="2" 
            strokeDasharray="4 2"
          />

          {/* Grit Layer (Schematic) */}
          <path 
            d={`M 12,${10 + H_total_scaled - 2} L ${10 + L_scaled - 2},${10 + H_total_scaled - 2} L ${10 + L_scaled - 2},${10 + H_total_scaled - 20} L 12,${10 + H_total_scaled - 10} Z`} 
            fill={gritColor}
          />

          {/* Dimensions Labels */}
          {/* Length */}
          <line x1="10" y1={H_total_scaled + 30} x2={10 + L_scaled} y2={H_total_scaled + 30} stroke="black" markerEnd="url(#arrow)" markerStart="url(#arrow)" />
          <text x={10 + L_scaled / 2} y={H_total_scaled + 45} textAnchor="middle" fontSize="12">L = {length}m</text>

          {/* Depth */}
          <line x1={L_scaled + 30} y1="10" x2={L_scaled + 30} y2={10 + H_total_scaled} stroke="black" markerEnd="url(#arrow)" markerStart="url(#arrow)" />
          <text x={L_scaled + 35} y={10 + H_total_scaled / 2} textAnchor="start" fontSize="12">H = {totalDepth}m</text>

          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L9,3 z" fill="#000" />
            </marker>
          </defs>
        </svg>
        <p className="text-xs text-slate-400 mt-2 italic">示意图，非等比例显示</p>
      </div>
    );
  }

  if (type === ChamberType.AERATED) {
     return (
      <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-slate-200 shadow-sm mt-4">
        <h3 className="text-sm font-semibold text-slate-500 mb-4">横剖面图 (前视)</h3>
        <svg width="300" height="250" viewBox="0 0 200 200">
           {/* Basic Hopper Shape for Aerated */}
           <path 
             d="M 50,20 L 150,20 L 150,120 L 120,150 L 80,150 L 80,120 L 50,120 Z" 
             fill="none" 
             stroke={concreteColor} 
             strokeWidth="3"
           />
           {/* Water */}
           <path 
             d="M 52,30 L 148,30 L 148,120 L 120,148 L 82,148 L 82,118 L 52,118 Z" 
             fill={waterColor} 
             opacity="0.3"
           />
           
           {/* Air Diffusers */}
           <circle cx="65" cy="110" r="3" fill="#64748b" />
           <line x1="65" y1="110" x2="65" y2="10" stroke="#64748b" strokeWidth="2" />
           
           {/* Bubbles */}
           <circle cx="70" cy="100" r="2" fill="white" stroke={waterColor} />
           <circle cx="75" cy="80" r="3" fill="white" stroke={waterColor} />
           <circle cx="85" cy="60" r="4" fill="white" stroke={waterColor} />

            {/* Labels */}
           <text x="160" y="80" fontSize="10" fill="#333">宽 B = {totalWidth}m</text>
           <text x="160" y="100" fontSize="10" fill="#333">深 H = {totalDepth}m</text>
           <text x="100" y="170" fontSize="10" textAnchor="middle" fill="#333">曝气廊道</text>
        </svg>
      </div>
     )
  }

  // Vertical
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-slate-200 shadow-sm mt-4">
        <h3 className="text-sm font-semibold text-slate-500 mb-4">竖流式剖面</h3>
        <svg width="250" height="250" viewBox="0 0 200 250">
            {/* Cone Tank */}
            <path d="M 50,50 L 150,50 L 150,150 L 100,200 L 50,150 Z" fill="none" stroke={concreteColor} strokeWidth="3" />
            <rect x="52" y="60" width="96" height="85" fill={waterColor} opacity="0.3" />
            <path d="M 52,145 L 148,145 L 100,195 Z" fill={gritColor} opacity="0.8" />
            
            {/* Center Pipe */}
            <rect x="90" y="20" width="20" height="100" fill="#e2e8f0" stroke="#64748b" />
            
            <text x="160" y="100" fontSize="10" fill="#333">直径 D = {result.diameter}m</text>
        </svg>
    </div>
  );
};
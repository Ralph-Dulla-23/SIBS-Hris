import React from "react";

export type ArrowColor = "blue" | "teal" | "purple" | "orange" | "emerald" | "amber" | "red" | "slate";

interface FlowArrowProps {
  label?: string;
  sublabel?: string;
  color?: ArrowColor;
  direction?: "right" | "down" | "left" | "up";
  animated?: boolean;
  className?: string;
  length?: "sm" | "md" | "lg" | "xl";
  dashed?: boolean;
  onClick?: () => void;
}

const COLOR_MAP: Record<ArrowColor, {
  stroke: string;
  badge: string;
  particle: string;
  glow: string;
  ring: string;
}> = {
  blue: {
    stroke: "#1D68BD",
    badge: "bg-[#1D68BD] text-white border-blue-600",
    particle: "#60A5FA",
    glow: "drop-shadow-[0_0_6px_rgba(29,104,189,0.4)]",
    ring: "ring-blue-200"
  },
  teal: {
    stroke: "#0E8773",
    badge: "bg-[#0E8773] text-white border-teal-700",
    particle: "#2DD4BF",
    glow: "drop-shadow-[0_0_6px_rgba(14,135,115,0.4)]",
    ring: "ring-teal-200"
  },
  purple: {
    stroke: "#6B21A8",
    badge: "bg-[#6B21A8] text-white border-purple-800",
    particle: "#C084FC",
    glow: "drop-shadow-[0_0_6px_rgba(107,33,168,0.4)]",
    ring: "ring-purple-200"
  },
  orange: {
    stroke: "#FF5C28",
    badge: "bg-[#FF5C28] text-white border-orange-600",
    particle: "#FDBA74",
    glow: "drop-shadow-[0_0_6px_rgba(255,92,40,0.4)]",
    ring: "ring-orange-200"
  },
  emerald: {
    stroke: "#059669",
    badge: "bg-emerald-600 text-white border-emerald-700",
    particle: "#34D399",
    glow: "drop-shadow-[0_0_6px_rgba(5,150,105,0.4)]",
    ring: "ring-emerald-200"
  },
  amber: {
    stroke: "#D97706",
    badge: "bg-amber-600 text-white border-amber-700",
    particle: "#FBBF24",
    glow: "drop-shadow-[0_0_6px_rgba(217,119,6,0.4)]",
    ring: "ring-amber-200"
  },
  red: {
    stroke: "#DC2626",
    badge: "bg-red-600 text-white border-red-700",
    particle: "#F87171",
    glow: "drop-shadow-[0_0_6px_rgba(220,38,38,0.4)]",
    ring: "ring-red-200"
  },
  slate: {
    stroke: "#475569",
    badge: "bg-slate-700 text-white border-slate-800",
    particle: "#94A3B8",
    glow: "drop-shadow-[0_0_6px_rgba(71,85,105,0.3)]",
    ring: "ring-slate-200"
  }
};

export function HorizontalFlowArrow({
  label,
  sublabel,
  color = "blue",
  animated = true,
  length = "md",
  dashed = false,
  className = "",
  onClick
}: FlowArrowProps) {
  const c = COLOR_MAP[color];
  const markerId = `h-arrow-${color}-${Math.random().toString(36).substr(2, 9)}`;

  const widthClasses = {
    sm: "w-8 sm:w-10 min-w-[32px]",
    md: "w-12 sm:w-16 min-w-[48px]",
    lg: "w-18 sm:w-24 min-w-[72px]",
    xl: "w-28 sm:w-36 min-w-[110px]"
  }[length];

  const svgWidth = { sm: 40, md: 60, lg: 90, xl: 130 }[length];

  return (
    <div
      onClick={onClick}
      className={`flex flex-col items-center justify-center shrink-0 relative select-none py-1 group ${
        onClick ? "cursor-pointer" : ""
      } ${widthClasses} ${className}`}
      title={label ? `Process Flow: ${label}` : "Process Flow"}
    >
      {/* Step Transition Label Badge */}
      {label && (
        <div
          className={`px-2 py-0.5 rounded-md text-[8.5px] font-black uppercase tracking-wider whitespace-nowrap shadow-xs border transition-all duration-300 z-10 ${
            c.badge
          } group-hover:scale-105 group-hover:shadow-md mb-0.5`}
        >
          {label}
        </div>
      )}

      {/* SVG Arrow Line with Arrowhead and Moving Pulse */}
      <div className="w-full h-6 flex items-center justify-center relative my-0.5">
        <svg
          viewBox={`0 0 ${svgWidth} 16`}
          className={`w-full h-4 overflow-visible transition-all duration-300 ${c.glow}`}
        >
          <defs>
            <marker
              id={markerId}
              markerWidth="6"
              markerHeight="6"
              refX="5"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 6 3, 0 6" fill={c.stroke} />
            </marker>
          </defs>

          {/* Main Connector Line */}
          <line
            x1="2"
            y1="8"
            x2={svgWidth - 7}
            y2="8"
            stroke={c.stroke}
            strokeWidth="2.5"
            strokeDasharray={dashed ? "4,3" : undefined}
            strokeLinecap="round"
            markerEnd={`url(#${markerId})`}
          />

          {/* Animated Flow Pulse */}
          {animated && (
            <circle r="3" cy="8" fill={c.particle}>
              <animate
                attributeName="cx"
                from="4"
                to={svgWidth - 10}
                dur="1.3s"
                repeatCount="indefinite"
              />
            </circle>
          )}
        </svg>
      </div>

      {/* Optional Micro Sub-label */}
      {sublabel && (
        <span className="text-[7.5px] font-bold text-slate-500 uppercase tracking-tighter truncate max-w-[90px] leading-none text-center mt-0.5">
          {sublabel}
        </span>
      )}
    </div>
  );
}

export function VerticalFlowArrow({
  label,
  sublabel,
  color = "blue",
  animated = true,
  length = "md",
  dashed = false,
  className = "",
  onClick
}: FlowArrowProps) {
  const c = COLOR_MAP[color];
  const markerId = `v-arrow-${color}-${Math.random().toString(36).substr(2, 9)}`;

  const heightClasses = {
    sm: "h-8 min-h-[32px]",
    md: "h-12 min-h-[48px]",
    lg: "h-18 min-h-[72px]",
    xl: "h-24 min-h-[96px]"
  }[length];

  const svgHeight = { sm: 32, md: 48, lg: 72, xl: 96 }[length];

  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-center shrink-0 relative select-none px-1 group ${
        onClick ? "cursor-pointer" : ""
      } ${heightClasses} ${className}`}
      title={label ? `Process Flow: ${label}` : "Process Flow"}
    >
      <div className="flex flex-col items-center relative h-full justify-center">
        {/* SVG Arrow Line with Arrowhead and Moving Pulse */}
        <svg
          viewBox={`0 0 16 ${svgHeight}`}
          className={`h-full w-4 overflow-visible transition-all duration-300 ${c.glow}`}
        >
          <defs>
            <marker
              id={markerId}
              markerWidth="6"
              markerHeight="6"
              refX="3"
              refY="5"
              orient="auto"
            >
              <polygon points="0 0, 3 6, 6 0" fill={c.stroke} />
            </marker>
          </defs>

          {/* Main Connector Line */}
          <line
            x1="8"
            y1="2"
            x2="8"
            y2={svgHeight - 7}
            stroke={c.stroke}
            strokeWidth="2.5"
            strokeDasharray={dashed ? "4,3" : undefined}
            strokeLinecap="round"
            markerEnd={`url(#${markerId})`}
          />

          {/* Animated Flow Pulse */}
          {animated && (
            <circle r="3" cx="8" fill={c.particle}>
              <animate
                attributeName="cy"
                from="4"
                to={svgHeight - 10}
                dur="1.2s"
                repeatCount="indefinite"
              />
            </circle>
          )}
        </svg>

        {/* Floating Label Badge */}
        {label && (
          <div
            className={`absolute px-2 py-0.5 rounded-md text-[8.5px] font-black uppercase tracking-wider whitespace-nowrap shadow-xs border transition-all duration-300 z-10 ${
              c.badge
            } group-hover:scale-105 group-hover:shadow-md`}
          >
            {label}
          </div>
        )}
      </div>

      {/* Sublabel next to vertical arrow if provided */}
      {sublabel && (
        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tight ml-2">
          {sublabel}
        </span>
      )}
    </div>
  );
}

/**
 * Split branch connector for Decision Diamonds
 */
export function DecisionBranchConnector({
  leftLabel = "Option A",
  leftSublabel,
  leftColor = "blue",
  rightLabel = "Option B",
  rightSublabel,
  rightColor = "orange",
  animated = true
}: {
  leftLabel?: string;
  leftSublabel?: string;
  leftColor?: ArrowColor;
  rightLabel?: string;
  rightSublabel?: string;
  rightColor?: ArrowColor;
  animated?: boolean;
}) {
  const leftC = COLOR_MAP[leftColor];
  const rightC = COLOR_MAP[rightColor];

  return (
    <div className="w-full flex flex-col items-center select-none my-2">
      {/* Stem down from decision */}
      <div className="w-0.5 h-4 bg-slate-300"></div>

      {/* Horizontal splitter with directional arrows pointing left and right, then down */}
      <div className="w-full max-w-xl relative flex justify-between items-center px-4 sm:px-12">
        {/* Horizontal crossbar */}
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-slate-300 -z-0"></div>

        {/* Left Branch Out */}
        <div className="z-10 flex flex-col items-center">
          <div className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider shadow-xs border ${leftC.badge}`}>
            {leftLabel}
          </div>
          {leftSublabel && (
            <span className="text-[7.5px] font-bold text-slate-500 mt-0.5">{leftSublabel}</span>
          )}
          <VerticalFlowArrow color={leftColor} length="sm" animated={animated} />
        </div>

        {/* Center Pivot Indicator */}
        <div className="z-10 w-2 h-2 rounded-full bg-[#042C51] ring-4 ring-slate-100"></div>

        {/* Right Branch Out */}
        <div className="z-10 flex flex-col items-center">
          <div className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider shadow-xs border ${rightC.badge}`}>
            {rightLabel}
          </div>
          {rightSublabel && (
            <span className="text-[7.5px] font-bold text-slate-500 mt-0.5">{rightSublabel}</span>
          )}
          <VerticalFlowArrow color={rightColor} length="sm" animated={animated} />
        </div>
      </div>
    </div>
  );
}

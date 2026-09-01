import React from "react";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  taglineText?: string;
  theme?: "dark" | "light";
  customCompanyName?: string;
  customMonogram?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = "md",
  showTagline = true,
  taglineText = "MAEK7-TAXI SMART FLEET",
  theme = "dark",
  customCompanyName,
  customMonogram,
}) => {
  const sizeConfig = {
    sm: { icon: "w-8 h-8 text-sm", title: "text-base", sub: "text-[9px]" },
    md: { icon: "w-10 h-10 text-base", title: "text-lg", sub: "text-[10px]" },
    lg: { icon: "w-12 h-12 text-lg", title: "text-xl", sub: "text-xs" },
    xl: { icon: "w-16 h-16 text-2xl", title: "text-2xl sm:text-3xl", sub: "text-xs" },
  }[size];

  const displayName = customCompanyName || "MAEK7-TAXI";
  const monogram = customMonogram || (customCompanyName ? customCompanyName.slice(0, 2).toUpperCase() : "M7");

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Aerodynamic Luxury Taxi Shield Badge */}
      <div
        className={`relative ${sizeConfig.icon} rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center font-black text-slate-950 shadow-lg shadow-amber-500/25 border-2 border-amber-300/60 transition-transform hover:scale-105 shrink-0`}
      >
        {/* Subtle Checkered Accent Motif */}
        <div className="absolute inset-x-1 top-1 flex justify-center gap-0.5 opacity-40">
          <span className="w-1 h-0.5 bg-slate-950 rounded-sm"></span>
          <span className="w-1 h-0.5 bg-amber-200 rounded-sm"></span>
          <span className="w-1 h-0.5 bg-slate-950 rounded-sm"></span>
          <span className="w-1 h-0.5 bg-amber-200 rounded-sm"></span>
        </div>

        {/* Brand Monogram */}
        <span className="font-extrabold tracking-tighter leading-none mt-1">{monogram}</span>

        {/* Illuminated Beacon Dot */}
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-900 animate-pulse"></span>
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-black tracking-tight truncate ${sizeConfig.title} ${
              theme === "dark" ? "text-white" : "text-slate-900"
            }`}
          >
            {displayName.includes("MAEK") ? (
              <>
                MAEK<span className="text-amber-400 font-extrabold">7</span>-TAXI
              </>
            ) : (
              displayName
            )}
          </span>
          <span className="px-1.5 py-0.2 rounded bg-amber-500/20 border border-amber-400/40 text-amber-300 font-bold text-[9px] uppercase tracking-wider shrink-0">
            PRO
          </span>
        </div>
        {showTagline && (
          <p
            className={`font-medium tracking-wide truncate ${sizeConfig.sub} ${
              theme === "dark" ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {taglineText}
          </p>
        )}
      </div>
    </div>
  );
};


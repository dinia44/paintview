export function RoomModel3D({ wallColour = "#A8B5A1" }: { wallColour?: string }) {
  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-sm">
      <svg viewBox="0 0 400 320" className="h-full w-full drop-shadow-[0_20px_40px_rgba(31,35,40,0.15)]">
        {/* Floor */}
        <polygon points="40,220 360,220 320,300 80,300" fill="#C4A574" opacity="0.85" />
        {/* Left wall */}
        <polygon points="40,220 80,300 80,120 40,80" fill={wallColour} opacity="0.95" />
        {/* Back wall */}
        <polygon points="40,80 360,80 320,220 40,220" fill={wallColour} />
        {/* Right wall */}
        <polygon points="360,80 380,100 380,240 320,220" fill={wallColour} opacity="0.75" />
        {/* Ceiling */}
        <polygon points="40,80 360,80 380,100 80,100" fill="#FAFAF8" />
        {/* Skirting */}
        <polygon points="40,220 360,220 360,232 40,232" fill="#FFFFFF" />
        <polygon points="80,300 320,300 320,312 80,312" fill="#FFFFFF" />
        {/* Window */}
        <rect x="220" y="110" width="70" height="60" fill="#E8F4FC" stroke="#fff" strokeWidth="3" rx="2" />
        {/* Door */}
        <rect x="100" y="140" width="45" height="80" fill="#8B7355" rx="2" />
        {/* Plant */}
        <circle cx="300" cy="200" r="12" fill="#5F7E55" />
        <rect x="296" y="200" width="8" height="20" fill="#8B7355" />
        {/* Dimensions */}
        <text x="200" y="68" textAnchor="middle" fill="#6E6A64" fontSize="11" fontWeight="600">
          3.42m
        </text>
        <text x="24" y="160" fill="#6E6A64" fontSize="11" fontWeight="600" transform="rotate(-90 24 160)">
          2.60m
        </text>
      </svg>
    </div>
  );
}

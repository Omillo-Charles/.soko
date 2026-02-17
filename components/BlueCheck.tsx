import React from 'react';

export const BlueCheck = ({ className = "w-5 h-5" }: { className?: string }) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      className={className} 
      aria-label="Verified Account" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="premium-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1D9BF0" />
          <stop offset="100%" stopColor="#0C7ABF" />
        </linearGradient>
      </defs>
      <g>
        {/* The wavy rosette shape (filled) */}
        <path 
          d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-4-3.99-4-.85 0-1.63.25-2.28.68C13.68 2.52 12.06 2 10.25 2 7.195 2 4.537 4.05 3.5 6.86c-.34-.05-.69-.09-1.05-.09C1.096 6.77 0 7.87 0 9.22c0 .91.49 1.7 1.22 2.12C.86 11.97.65 12.7.65 13.5c0 2.39 1.63 4.41 3.84 5.03C5.55 20.94 8.01 22 10.25 22c1.78 0 3.37-.56 4.65-1.51.55.23 1.15.36 1.78.36 2.76 0 5-2.24 5-5 0-.49-.08-.96-.23-1.4 1.27-.64 2.15-2.02 2.15-3.6z" 
          fill="url(#premium-gradient)"
        />
        {/* The checkmark (white) */}
        <path 
          d="M10.25 16.5l-3.5-3.5 1.41-1.41 2.09 2.09 4.59-4.59 1.41 1.41-6 6z" 
          fill="#ffffff"
        />
      </g>
    </svg>
  );
};

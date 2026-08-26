import React from 'react';

interface GRIEmblemProps {
  className?: string;
  size?: number | string;
  variant?: 'full' | 'crest-only' | 'badge' | 'white';
}

/**
 * Official Emblem of The Gandhigram Rural Institute (Deemed to be University)
 * Features:
 * - Sacred traditional Indian spinning wheel (Charkha) representing rural self-reliance & Nai Talim
 * - Radiant rising golden sun illuminating the rural agrarian landscape
 * - Open academic scripture / book of knowledge
 * - Golden wheat / paddy sheaves representing sustainable agriculture & rural prosperity
 * - Bilingual official motto: "கிராமம் உயர நாடு உயரும்" (As the village rises, so the nation rises)
 */
export const GRIEmblem: React.FC<GRIEmblemProps> = ({ 
  className = 'w-10 h-10', 
  size,
  variant = 'full' 
}) => {
  const customStyle = size ? { width: size, height: size } : undefined;

  return (
    <div 
      className={`inline-flex items-center justify-center select-none ${className}`}
      style={customStyle}
      title="The Gandhigram Rural Institute (Deemed to be University) - Official Seal"
    >
      <svg 
        viewBox="0 0 120 120" 
        className="w-full h-full drop-shadow-sm" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Outer Ring Gradients */}
          <linearGradient id="griGoldRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D97706" />
            <stop offset="40%" stopColor="#F59E0B" />
            <stop offset="70%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          <linearGradient id="griEmeraldCore" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#064E3B" />
            <stop offset="50%" stopColor="#065F46" />
            <stop offset="100%" stopColor="#022C22" />
          </linearGradient>

          <linearGradient id="griSunRays" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#EA580C" />
            <stop offset="60%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#FEF08A" />
          </linearGradient>
        </defs>

        {/* Outer Circular Band */}
        <circle cx="60" cy="60" r="58" fill="url(#griGoldRing)" stroke="#78350F" strokeWidth="1.5" />
        <circle cx="60" cy="60" r="54" fill="#047857" stroke="#FDE68A" strokeWidth="1" />

        {/* Text Arc Guide (Top: GANDHIGRAM RURAL INSTITUTE) */}
        <path id="topTextArc" d="M 18,60 A 42,42 0 0,1 102,60" fill="none" />
        <text fill="#FEF3C7" fontSize="7.5" fontWeight="900" letterSpacing="1.2" fontFamily="sans-serif">
          <textPath href="#topTextArc" startOffset="50%" textAnchor="middle">
            GANDHIGRAM RURAL INSTITUTE
          </textPath>
        </text>

        {/* Text Arc Guide (Bottom: DEEMED UNIVERSITY) */}
        <path id="bottomTextArc" d="M 102,60 A 42,42 0 0,1 18,60" fill="none" />
        <text fill="#FDE68A" fontSize="6.2" fontWeight="800" letterSpacing="1.5" fontFamily="sans-serif">
          <textPath href="#bottomTextArc" startOffset="50%" textAnchor="middle">
            DEEMED TO BE UNIVERSITY
          </textPath>
        </text>

        {/* Inner Emerald Field */}
        <circle cx="60" cy="60" r="37" fill="url(#griEmeraldCore)" stroke="#FBBF24" strokeWidth="1.5" />

        {/* Rising Golden Sun over Hills */}
        <path d="M 32 62 Q 46 54 60 56 Q 74 54 88 62 L 88 74 L 32 74 Z" fill="#065F46" />
        <circle cx="60" cy="52" r="13" fill="url(#griSunRays)" />
        {/* Sun Rays */}
        <line x1="60" y1="36" x2="60" y2="33" stroke="#FDE047" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="49" y1="41" x2="46" y2="38" stroke="#FDE047" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="71" y1="41" x2="74" y2="38" stroke="#FDE047" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="44" y1="52" x2="41" y2="52" stroke="#FDE047" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="76" y1="52" x2="79" y2="52" stroke="#FDE047" strokeWidth="1.5" strokeLinecap="round" />

        {/* Sacred Gandhian Charkha (Spinning Wheel) */}
        <g transform="translate(60, 56) scale(0.68)">
          {/* Wheel Ring */}
          <circle cx="0" cy="0" r="22" stroke="#FEF08A" strokeWidth="2" fill="none" />
          <circle cx="0" cy="0" r="4" fill="#F59E0B" stroke="#FFFBEB" strokeWidth="1" />
          {/* Spokes */}
          <line x1="0" y1="-22" x2="0" y2="22" stroke="#FEF08A" strokeWidth="1" />
          <line x1="-22" y1="0" x2="22" y2="0" stroke="#FEF08A" strokeWidth="1" />
          <line x1="-15.5" y1="-15.5" x2="15.5" y2="15.5" stroke="#FEF08A" strokeWidth="1" />
          <line x1="15.5" y1="-15.5" x2="-15.5" y2="15.5" stroke="#FEF08A" strokeWidth="1" />
          {/* Base & Spindle */}
          <path d="M -26 22 L 26 22 L 22 26 L -22 26 Z" fill="#D97706" />
          <line x1="-18" y1="22" x2="-18" y2="10" stroke="#FEF08A" strokeWidth="1.5" />
          <line x1="18" y1="22" x2="18" y2="10" stroke="#FEF08A" strokeWidth="1.5" />
        </g>

        {/* Open Academic Book of Wisdom */}
        <g transform="translate(60, 78)">
          <path d="M -18 0 Q -9 -3 0 0 Q 9 -3 18 0 L 18 8 Q 9 5 0 8 Q -9 5 -18 8 Z" fill="#FFFBEB" stroke="#B45309" strokeWidth="0.8" />
          <line x1="0" y1="0" x2="0" y2="8" stroke="#D97706" strokeWidth="1" />
          {/* Book Pages Details */}
          <line x1="-14" y1="3" x2="-4" y2="2" stroke="#92400E" strokeWidth="0.6" />
          <line x1="-14" y1="5.5" x2="-4" y2="4.5" stroke="#92400E" strokeWidth="0.6" />
          <line x1="4" y1="2" x2="14" y2="3" stroke="#92400E" strokeWidth="0.6" />
          <line x1="4" y1="4.5" x2="14" y2="5.5" stroke="#92400E" strokeWidth="0.6" />
        </g>

        {/* Wheat Sheaves / Paddy on Lower Border */}
        <path d="M 28 88 Q 38 98 60 98 Q 82 98 92 88" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        
        {/* Estd 1956 Ribbon Banner */}
        <rect x="42" y="93" width="36" height="10" rx="3" fill="#B45309" stroke="#FDE68A" strokeWidth="0.8" />
        <text x="60" y="100.5" fill="#FEF3C7" fontSize="5.5" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
          ESTD 1956
        </text>
      </svg>
    </div>
  );
};

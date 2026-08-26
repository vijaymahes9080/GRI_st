import React, { useState } from 'react';

interface GRIEmblemProps {
  className?: string;
  size?: number | string;
  variant?: 'full' | 'crest-only' | 'badge' | 'white';
}

/**
 * Official Insignia of The Gandhigram Rural Institute (Deemed to be University)
 * Sourced directly from official university specifications (https://ruraluniv.ac.in/):
 * 
 * 1. Book nestled inside a Lotus: Enlightenment through knowledge & academic learning.
 * 2. Deepam / Sacred Lamp: Dissemination of wisdom & knowledge to the wider rural community.
 * 3. Kolam on top & bottom: Femininity, artistic orientation, and origins in training rural women health workers.
 * 4. Two Connected Concentric Squares: Continuity & extension of learning to action (Theory & Practice).
 * 5. Traditional Indian Plough: Rural agrarian orientation and agricultural research.
 * 6. Gandhian Charkha (Spinning Wheel): Gandhian spirit, swadeshi, and rural self-reliance.
 * 7. Staff of Asclepius: Rural sanitation, public health, and holistic well-being.
 */
export const GRIEmblem: React.FC<GRIEmblemProps> = ({ 
  className = 'w-10 h-10', 
  size,
  variant = 'full' 
}) => {
  const [imageError, setImageError] = useState(false);

  if (!imageError) {
    return (
      <img 
        src="/logo.png" 
        alt="GRI Logo" 
        className={`object-contain ${className}`}
        style={size ? { width: size, height: size } : {}}
        onError={() => setImageError(true)}
      />
    );
  }
  const customStyle = size ? { width: size, height: size } : undefined;

  return (
    <div 
      className={`inline-flex items-center justify-center select-none ${className}`}
      style={customStyle}
      title="The Gandhigram Rural Institute (Deemed to be University) - Official Seal"
    >
      <svg 
        viewBox="0 0 140 140" 
        className="w-full h-full drop-shadow-md" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Rich Gold Gradient */}
          <linearGradient id="griOfficialGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="35%" stopColor="#FBBF24" />
            <stop offset="70%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#92400E" />
          </linearGradient>

          {/* Emerald Green Ring */}
          <linearGradient id="griOfficialEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#065F46" />
            <stop offset="50%" stopColor="#047857" />
            <stop offset="100%" stopColor="#022C22" />
          </linearGradient>

          {/* Deep Navy/Slate Inner Core */}
          <radialGradient id="griCoreField" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="75%" stopColor="#022C22" />
            <stop offset="100%" stopColor="#064E3B" />
          </radialGradient>

          {/* Radiant Lamp Flame Gradient */}
          <linearGradient id="griFlameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#DC2626" />
            <stop offset="40%" stopColor="#F97316" />
            <stop offset="80%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#FEF08A" />
          </linearGradient>

          {/* Lotus Petal Gradient */}
          <linearGradient id="griLotusPetal" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#BE185D" />
            <stop offset="60%" stopColor="#F472B6" />
            <stop offset="100%" stopColor="#FFF1F2" />
          </linearGradient>
        </defs>

        {/* 1. Outer Border & Textured Gold Ring */}
        <circle cx="70" cy="70" r="67" fill="url(#griOfficialGold)" stroke="#78350F" strokeWidth="1.5" />
        <circle cx="70" cy="70" r="62" fill="url(#griOfficialEmerald)" stroke="#FDE68A" strokeWidth="1" />

        {/* 2. Top Arch Text: THE GANDHIGRAM RURAL INSTITUTE */}
        <path id="griTopArch" d="M 20,70 A 50,50 0 0,1 120,70" fill="none" />
        <text fill="#FEF3C7" fontSize="8.2" fontWeight="900" letterSpacing="1.2" fontFamily="sans-serif">
          <textPath href="#griTopArch" startOffset="50%" textAnchor="middle">
            THE GANDHIGRAM RURAL INSTITUTE
          </textPath>
        </text>

        {/* 3. Bottom Arch Text: DEEMED TO BE UNIVERSITY */}
        <path id="griBottomArch" d="M 120,70 A 50,50 0 0,1 20,70" fill="none" />
        <text fill="#FDE68A" fontSize="7.2" fontWeight="800" letterSpacing="1.4" fontFamily="sans-serif">
          <textPath href="#griBottomArch" startOffset="50%" textAnchor="middle">
            DEEMED TO BE UNIVERSITY
          </textPath>
        </text>

        {/* 4. Inner Ring with Fine Gold Beaded Perimeter */}
        <circle cx="70" cy="70" r="44" fill="url(#griCoreField)" stroke="#F59E0B" strokeWidth="1.5" />
        <circle cx="70" cy="70" r="41.5" stroke="#FDE68A" strokeWidth="0.5" strokeDasharray="1.5,1.5" fill="none" />

        {/* 5. TOP & BOTTOM KOLAM MOTIFS (Artistic heritage & women health training origins) */}
        {/* Top Kolam */}
        <g transform="translate(70, 34) scale(0.6)">
          <path d="M 0,-6 L 6,0 L 0,6 L -6,0 Z" fill="none" stroke="#FDE68A" strokeWidth="1" />
          <circle cx="0" cy="0" r="1.5" fill="#FEF3C7" />
          <circle cx="-9" cy="0" r="1" fill="#FDE68A" />
          <circle cx="9" cy="0" r="1" fill="#FDE68A" />
          <path d="M -9,0 Q 0,-8 9,0 Q 0,8 -9,0" fill="none" stroke="#FDE68A" strokeWidth="0.8" />
        </g>
        {/* Bottom Kolam */}
        <g transform="translate(70, 102) scale(0.6)">
          <path d="M 0,-6 L 6,0 L 0,6 L -6,0 Z" fill="none" stroke="#FDE68A" strokeWidth="1" />
          <circle cx="0" cy="0" r="1.5" fill="#FEF3C7" />
          <circle cx="-9" cy="0" r="1" fill="#FDE68A" />
          <circle cx="9" cy="0" r="1" fill="#FDE68A" />
          <path d="M -9,0 Q 0,-8 9,0 Q 0,8 -9,0" fill="none" stroke="#FDE68A" strokeWidth="0.8" />
        </g>

        {/* 6. SACRED DEEPAM / KUTHU VILAKKU (Spreading wisdom & knowledge) */}
        <g transform="translate(70, 44)">
          {/* Flame Rays Glow */}
          <circle cx="0" cy="-3" r="8" fill="#F59E0B" opacity="0.25" />
          {/* Radiant Flame */}
          <path d="M 0 -11 C 3 -6 4 -3 0 1 C -4 -3 -3 -6 0 -11 Z" fill="url(#griFlameGrad)" />
          {/* Lamp Bowl / Agal */}
          <path d="M -7 1 Q 0 4 7 1 L 5 4 Q 0 6 -5 4 Z" fill="#F59E0B" stroke="#FFFBEB" strokeWidth="0.5" />
          {/* Lamp Base Stand */}
          <path d="M -3 4 L -5 7 L 5 7 L 3 4 Z" fill="#D97706" />
        </g>

        {/* 7. LEFT QUADRANT: GANDHIAN CHARKHA (Spinning Wheel of Self-Reliance) */}
        <g transform="translate(42, 60) scale(0.48)">
          <circle cx="0" cy="0" r="16" stroke="#FDE68A" strokeWidth="1.8" fill="none" />
          <circle cx="0" cy="0" r="3.5" fill="#F59E0B" />
          {/* Spokes */}
          <line x1="0" y1="-16" x2="0" y2="16" stroke="#FEF08A" strokeWidth="1" />
          <line x1="-16" y1="0" x2="16" y2="0" stroke="#FEF08A" strokeWidth="1" />
          <line x1="-11" y1="-11" x2="11" y2="11" stroke="#FEF08A" strokeWidth="1" />
          <line x1="11" y1="-11" x2="-11" y2="11" stroke="#FEF08A" strokeWidth="1" />
          {/* Stand & Spindle */}
          <line x1="-18" y1="16" x2="18" y2="16" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" />
          <line x1="-12" y1="16" x2="-12" y2="8" stroke="#FDE68A" strokeWidth="1.5" />
          <line x1="12" y1="16" x2="12" y2="8" stroke="#FDE68A" strokeWidth="1.5" />
        </g>

        {/* 8. RIGHT QUADRANT: TRADITIONAL INDIAN PLOUGH (Aer / Rural Agriculture) */}
        <g transform="translate(98, 60) scale(0.48)">
          {/* Curved Beam & Share */}
          <path d="M -14 12 Q 2 6 12 -12" stroke="#FDE68A" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          {/* Plough Share Blade */}
          <path d="M 0 10 L 16 14 L 6 4 Z" fill="#F59E0B" stroke="#FEF3C7" strokeWidth="0.8" />
          {/* Handle */}
          <line x1="2" y1="8" x2="-6" y2="-8" stroke="#FDE68A" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="-8" y1="-8" x2="-4" y2="-8" stroke="#FEF3C7" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* 9. CONNECTED CONCENTRIC SQUARES (Theory & Practice Extension / Yantras) */}
        {/* Left Side Concentric Squares */}
        <g transform="translate(36, 78) scale(0.55)">
          <rect x="-8" y="-8" width="16" height="16" fill="none" stroke="#FDE68A" strokeWidth="1" />
          <rect x="-4.5" y="-4.5" width="9" height="9" fill="none" stroke="#F59E0B" strokeWidth="1" />
          <line x1="0" y1="-8" x2="0" y2="8" stroke="#FEF08A" strokeWidth="0.6" />
          <line x1="-8" y1="0" x2="8" y2="0" stroke="#FEF08A" strokeWidth="0.6" />
        </g>
        {/* Right Side Concentric Squares */}
        <g transform="translate(104, 78) scale(0.55)">
          <rect x="-8" y="-8" width="16" height="16" fill="none" stroke="#FDE68A" strokeWidth="1" />
          <rect x="-4.5" y="-4.5" width="9" height="9" fill="none" stroke="#F59E0B" strokeWidth="1" />
          <line x1="0" y1="-8" x2="0" y2="8" stroke="#FEF08A" strokeWidth="0.6" />
          <line x1="-8" y1="0" x2="8" y2="0" stroke="#FEF08A" strokeWidth="0.6" />
        </g>

        {/* 10. ROD OF ASCLEPIUS (Rural Health, Sanitation & Hygiene) */}
        <g transform="translate(70, 92) scale(0.48)">
          {/* Healing Staff */}
          <line x1="0" y1="-12" x2="0" y2="12" stroke="#FEF08A" strokeWidth="2" strokeLinecap="round" />
          {/* Serpent entwining the staff */}
          <path 
            d="M -5 -9 Q 5 -6 0 -2 Q -5 2 4 6 Q 1 10 -4 10" 
            fill="none" 
            stroke="#34D399" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
          />
          <circle cx="-5" cy="-9" r="1.2" fill="#6EE7B7" />
        </g>

        {/* 11. CENTRAL BLOOMING LOTUS & OPEN BOOK OF WISDOM (Central Core) */}
        <g transform="translate(70, 72)">
          {/* Lotus Petals Base */}
          <g>
            {/* Outer Petals Left & Right */}
            <path d="M 0 10 C -14 8 -22 0 -22 -6 C -14 -4 -6 2 0 10 Z" fill="url(#griLotusPetal)" stroke="#BE185D" strokeWidth="0.6" />
            <path d="M 0 10 C 14 8 22 0 22 -6 C 14 -4 6 2 0 10 Z" fill="url(#griLotusPetal)" stroke="#BE185D" strokeWidth="0.6" />
            {/* Mid Petals */}
            <path d="M 0 10 C -10 4 -16 -8 -12 -12 C -6 -6 0 2 0 10 Z" fill="url(#griLotusPetal)" stroke="#BE185D" strokeWidth="0.6" />
            <path d="M 0 10 C 10 4 16 -8 12 -12 C 6 -6 0 2 0 10 Z" fill="url(#griLotusPetal)" stroke="#BE185D" strokeWidth="0.6" />
            {/* Center Front Petal */}
            <path d="M 0 10 C -6 2 -6 -12 0 -15 C 6 -12 6 2 0 10 Z" fill="#FFF1F2" stroke="#BE185D" strokeWidth="0.6" />
          </g>

          {/* Open Academic Book Nestled Inside the Lotus */}
          <g transform="translate(0, -1)">
            {/* Open Pages */}
            <path 
              d="M -16 -4 Q -8 -7 0 -4 Q 8 -7 16 -4 L 16 4 Q 8 1 0 4 Q -8 1 -16 4 Z" 
              fill="#FFFBEB" 
              stroke="#B45309" 
              strokeWidth="0.9" 
            />
            {/* Spine */}
            <line x1="0" y1="-4" x2="0" y2="4" stroke="#D97706" strokeWidth="1.2" />
            {/* Page Lines */}
            <line x1="-12" y1="-2" x2="-3" y2="-2" stroke="#92400E" strokeWidth="0.7" />
            <line x1="-12" y1="1" x2="-3" y2="1" stroke="#92400E" strokeWidth="0.7" />
            <line x1="3" y1="-2" x2="12" y2="-2" stroke="#92400E" strokeWidth="0.7" />
            <line x1="3" y1="1" x2="12" y2="1" stroke="#92400E" strokeWidth="0.7" />
          </g>
        </g>

        {/* 12. LOWER ESTD 1956 RIBBON BANNER & GANDHIGRAM */}
        <g transform="translate(70, 114)">
          <rect x="-38" y="-7" width="76" height="13" rx="3.5" fill="#78350F" stroke="#FDE68A" strokeWidth="1" />
          <text x="0" y="2.2" fill="#FEF3C7" fontSize="6.4" fontWeight="900" textAnchor="middle" fontFamily="sans-serif" letterSpacing="0.8">
            ESTD 1956 • GANDHIGRAM
          </text>
        </g>
      </svg>
    </div>
  );
};


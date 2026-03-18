import React from 'react';

// Professional Technical Flat Sketch Templates
// Industry-standard garment construction with proper architecture

export const GarmentSVG = ({ 
  template, 
  sleeve, 
  fabricUrl, 
  fabricScale, 
  fabricRotation, 
  fabricOffsetX, 
  fabricOffsetY 
}) => {
  const patternId = `fabric-pattern-${Date.now()}`;
  
  const renderGarment = () => {
    switch(template) {
      case 'button_down': return <ButtonDownShirt sleeve={sleeve} patternId={patternId} fabricUrl={fabricUrl} />;
      case 'polo': return <PoloShirt sleeve={sleeve} patternId={patternId} fabricUrl={fabricUrl} />;
      case 'blouse': return <Blouse sleeve={sleeve} patternId={patternId} fabricUrl={fabricUrl} />;
      case 'flared': return <FlaredDress sleeve={sleeve} patternId={patternId} fabricUrl={fabricUrl} />;
      case 'maxi': return <MaxiDress sleeve={sleeve} patternId={patternId} fabricUrl={fabricUrl} />;
      case 'fitted': return <FittedDress sleeve={sleeve} patternId={patternId} fabricUrl={fabricUrl} />;
      case 'aline': return <ALineDress sleeve={sleeve} patternId={patternId} fabricUrl={fabricUrl} />;
      case 'kaftan': return <Kaftan sleeve={sleeve} patternId={patternId} fabricUrl={fabricUrl} />;
      case 'agbada': return <Agbada patternId={patternId} fabricUrl={fabricUrl} />;
      case 'senator': return <Senator sleeve={sleeve} patternId={patternId} fabricUrl={fabricUrl} />;
      case 'fitted_trousers': return <FittedTrousers patternId={patternId} fabricUrl={fabricUrl} />;
      case 'baggy': return <BaggyTrousers patternId={patternId} fabricUrl={fabricUrl} />;
      case 'palazzo': return <PalazzoPants patternId={patternId} fabricUrl={fabricUrl} />;
      case 'denim': return <DenimJacket sleeve={sleeve} patternId={patternId} fabricUrl={fabricUrl} />;
      case 'blazer': return <Blazer sleeve={sleeve} patternId={patternId} fabricUrl={fabricUrl} />;
      case 'utility': return <UtilityJacket sleeve={sleeve} patternId={patternId} fabricUrl={fabricUrl} />;
      default: return <ButtonDownShirt sleeve={sleeve} patternId={patternId} fabricUrl={fabricUrl} />;
    }
  };

  return (
    <svg viewBox="0 0 400 520" className="w-full h-full">
      <defs>
        {fabricUrl && (
          <pattern 
            id={patternId} 
            patternUnits="userSpaceOnUse" 
            width={100 * fabricScale} 
            height={100 * fabricScale}
            patternTransform={`rotate(${fabricRotation} 200 260) translate(${fabricOffsetX || 0}, ${fabricOffsetY || 0})`}
          >
            <image 
              href={fabricUrl} 
              width={100 * fabricScale} 
              height={100 * fabricScale}
              preserveAspectRatio="xMidYMid slice"
            />
          </pattern>
        )}
      </defs>
      <rect width="400" height="520" fill="#fafafa" />
      {renderGarment()}
      {!fabricUrl && (
        <text x="200" y="505" textAnchor="middle" fill="#9ca3af" fontSize="11" fontFamily="system-ui">
          Upload fabric to preview
        </text>
      )}
    </svg>
  );
};

// ============================================================================
// BUTTON DOWN SHIRT - Professional Technical Flat
// ============================================================================
const ButtonDownShirt = ({ sleeve, patternId, fabricUrl }) => {
  // Main body with sloped shoulders and contoured sides
  const bodyPath = `
    M 200,52
    C 182,52 165,54 152,58
    L 138,64 L 127,74 L 120,88 L 117,106
    L 117,130 L 119,160 L 120,195 L 119,235
    L 118,280 L 117,325 L 117,365
    L 283,365
    L 283,325 L 282,280 L 281,235
    L 280,195 L 281,160 L 283,130
    L 283,106 L 280,88 L 273,74 L 262,64
    L 248,58 C 235,54 218,52 200,52 Z
  `;

  // Collar stand (the band that goes around neck)
  const collarStand = `
    M 160,58 L 156,50 L 158,42 L 168,36 L 185,33 L 200,32 L 215,33 L 232,36 L 242,42 L 244,50 L 240,58
    L 225,62 L 200,64 L 175,62 Z
  `;

  // Collar leaves (the folded parts)
  const collarLeft = `
    M 156,50 L 140,42 L 118,38 L 102,44 L 98,54 L 104,64 L 125,70 L 152,64 L 158,56 Z
  `;
  const collarRight = `
    M 244,50 L 260,42 L 282,38 L 298,44 L 302,54 L 296,64 L 275,70 L 248,64 L 242,56 Z
  `;

  // Long sleeve with proper taper to wrist + cuff
  const sleeveLeftLong = `
    M 117,106
    C 108,102 95,100 80,102
    C 62,105 45,115 32,132
    C 20,150 12,175 10,205
    C 8,235 12,268 22,295
    C 30,315 42,328 56,332
    L 80,328 L 98,318
    C 108,305 116,285 122,260
    C 128,235 132,205 132,175
    C 132,150 128,128 122,115 Z
  `;
  const cuffLeft = `M 22,290 L 18,332 L 80,340 L 84,298 Z`;

  const sleeveRightLong = `
    M 283,106
    C 292,102 305,100 320,102
    C 338,105 355,115 368,132
    C 380,150 388,175 390,205
    C 392,235 388,268 378,295
    C 370,315 358,328 344,332
    L 320,328 L 302,318
    C 292,305 284,285 278,260
    C 272,235 268,205 268,175
    C 268,150 272,128 278,115 Z
  `;
  const cuffRight = `M 378,290 L 382,332 L 320,340 L 316,298 Z`;

  // Short sleeve with hem band
  const sleeveLeftShort = `
    M 117,106
    C 105,102 90,100 74,104
    C 56,110 40,124 30,145
    C 24,162 24,182 32,198
    C 42,212 60,220 82,218
    C 102,216 118,205 128,188
    C 135,172 136,152 132,135
    C 128,120 122,110 117,106 Z
  `;
  const sleeveRightShort = `
    M 283,106
    C 295,102 310,100 326,104
    C 344,110 360,124 370,145
    C 376,162 376,182 368,198
    C 358,212 340,220 318,218
    C 298,216 282,205 272,188
    C 265,172 264,152 268,135
    C 272,120 278,110 283,106 Z
  `;

  const sleeveLeft = sleeve === 'long' ? sleeveLeftLong : sleeve === 'short' ? sleeveLeftShort : null;
  const sleeveRight = sleeve === 'long' ? sleeveRightLong : sleeve === 'short' ? sleeveRightShort : null;

  const fill = fabricUrl ? `url(#${patternId})` : '#ffffff';

  return (
    <g>
      {/* Fabric Layer */}
      <path d={bodyPath} fill={fill} />
      {sleeveLeft && <path d={sleeveLeft} fill={fill} />}
      {sleeveRight && <path d={sleeveRight} fill={fill} />}
      {sleeve === 'long' && (
        <>
          <path d={cuffLeft} fill={fill} />
          <path d={cuffRight} fill={fill} />
        </>
      )}
      <path d={collarStand} fill={fill} />
      <path d={collarLeft} fill={fill} />
      <path d={collarRight} fill={fill} />

      {/* Shadow/Fold Layer - Multiply blend for depth */}
      <g style={{ mixBlendMode: 'multiply' }} opacity="0.15">
        {/* Body vertical folds */}
        <path d="M 160,130 Q 155,245 152,365" stroke="#000" strokeWidth="12" fill="none" strokeLinecap="round"/>
        <path d="M 240,130 Q 245,245 248,365" stroke="#000" strokeWidth="12" fill="none" strokeLinecap="round"/>
        {/* Under arm shadow */}
        <ellipse cx="125" cy="115" rx="10" ry="18" fill="#000"/>
        <ellipse cx="275" cy="115" rx="10" ry="18" fill="#000"/>
        {/* Placket shadow */}
        <path d="M 195,70 L 195,365" stroke="#000" strokeWidth="6" fill="none"/>
        {/* Hem shadow */}
        <rect x="117" y="355" width="166" height="10" fill="#000" opacity="0.5"/>
        {/* Sleeve folds */}
        {sleeve === 'long' && (
          <>
            <path d="M 65,140 Q 45,210 35,280" stroke="#000" strokeWidth="14" fill="none" strokeLinecap="round"/>
            <path d="M 335,140 Q 355,210 365,280" stroke="#000" strokeWidth="14" fill="none" strokeLinecap="round"/>
          </>
        )}
        {sleeve === 'short' && (
          <>
            <path d="M 75,125 Q 55,160 50,195" stroke="#000" strokeWidth="10" fill="none" strokeLinecap="round"/>
            <path d="M 325,125 Q 345,160 350,195" stroke="#000" strokeWidth="10" fill="none" strokeLinecap="round"/>
          </>
        )}
      </g>

      {/* Construction Line Layer - On top */}
      <g fill="none" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        {/* Main outlines */}
        <path d={bodyPath} strokeWidth="1.8"/>
        {sleeveLeft && <path d={sleeveLeft} strokeWidth="1.8"/>}
        {sleeveRight && <path d={sleeveRight} strokeWidth="1.8"/>}
        {sleeve === 'long' && (
          <>
            <path d={cuffLeft} strokeWidth="1.5"/>
            <path d={cuffRight} strokeWidth="1.5"/>
          </>
        )}
        <path d={collarStand} strokeWidth="1.5"/>
        <path d={collarLeft} strokeWidth="1.8"/>
        <path d={collarRight} strokeWidth="1.8"/>

        {/* Yoke seam */}
        <path d="M 117,115 Q 200,130 283,115" strokeDasharray="4,2" strokeWidth="0.8"/>

        {/* Placket lines */}
        <line x1="200" y1="64" x2="200" y2="365" strokeWidth="1"/>
        <line x1="190" y1="64" x2="190" y2="365" strokeWidth="0.6"/>
        <line x1="210" y1="64" x2="210" y2="365" strokeWidth="0.6"/>

        {/* Hem */}
        <path d="M 117,365 L 283,365" strokeWidth="2"/>

        {/* Armhole seams for sleeveless */}
        {sleeve === 'sleeveless' && (
          <>
            <path d="M 117,106 Q 110,130 122,160" strokeWidth="1.2"/>
            <path d="M 283,106 Q 290,130 278,160" strokeWidth="1.2"/>
          </>
        )}
      </g>

      {/* Stitch details */}
      <g fill="none" stroke="#4a4a4a" strokeWidth="0.5" strokeDasharray="2,1.5">
        {/* Collar stitching */}
        <path d="M 165,55 Q 200,60 235,55"/>
        <path d="M 108,50 L 148,62"/>
        <path d="M 292,50 L 252,62"/>
        {/* Yoke stitching */}
        <path d="M 120,118 Q 200,132 280,118"/>
        {/* Hem stitching */}
        <path d="M 120,360 L 280,360"/>
        {/* Cuff stitching */}
        {sleeve === 'long' && (
          <>
            <path d="M 25,295 L 78,302"/>
            <path d="M 375,295 L 322,302"/>
          </>
        )}
        {/* Sleeve hem stitching */}
        {sleeve === 'short' && (
          <>
            <path d="M 35,192 Q 60,215 100,210"/>
            <path d="M 365,192 Q 340,215 300,210"/>
          </>
        )}
      </g>

      {/* Buttons */}
      {[90, 130, 175, 220, 265, 310, 350].map((y, i) => (
        <g key={i}>
          <circle cx="200" cy={y} r="5" fill="#fafafa" stroke="#333" strokeWidth="1"/>
          <circle cx="198" cy={y-1} r="0.8" fill="#555"/>
          <circle cx="202" cy={y-1} r="0.8" fill="#555"/>
          <circle cx="198" cy={y+2} r="0.8" fill="#555"/>
          <circle cx="202" cy={y+2} r="0.8" fill="#555"/>
        </g>
      ))}

      {/* Pocket */}
      <g fill="none" stroke="#1a1a1a" strokeWidth="1">
        <path d="M 225,175 L 225,230 L 270,230 L 270,175"/>
        <path d="M 225,175 L 270,175" strokeWidth="1.2"/>
      </g>
      <path d="M 228,178 L 228,227 L 267,227 L 267,178" fill="none" stroke="#4a4a4a" strokeWidth="0.5" strokeDasharray="2,1.5"/>

      {/* Cuff buttons */}
      {sleeve === 'long' && (
        <>
          <circle cx="50" cy="318" r="3.5" fill="#fafafa" stroke="#333" strokeWidth="0.8"/>
          <circle cx="350" cy="318" r="3.5" fill="#fafafa" stroke="#333" strokeWidth="0.8"/>
        </>
      )}
    </g>
  );
};

// ============================================================================
// FLARED DRESS - V-neck with gravity-based drape
// ============================================================================
const FlaredDress = ({ sleeve, patternId, fabricUrl }) => {
  const bodyPath = `
    M 200,55
    L 175,60 L 155,72 L 142,90 L 135,115 L 133,145 L 136,180
    L 130,210 L 115,260 L 90,330 L 60,420 L 50,480
    L 350,480 L 340,420 L 310,330 L 285,260 L 270,210
    L 264,180 L 267,145 L 265,115 L 258,90 L 245,72 L 225,60 L 200,55 Z
  `;

  // V-neckline shape
  const necklineLeft = `M 175,60 L 155,72 L 160,95 L 180,115 L 200,125`;
  const necklineRight = `M 225,60 L 245,72 L 240,95 L 220,115 L 200,125`;

  const sleeveLeftShort = `
    M 135,115 C 120,108 100,108 80,118 C 58,132 45,155 48,182 C 52,205 72,222 98,225 C 122,227 142,215 152,195 C 160,178 158,158 150,142 C 145,130 140,120 135,115 Z
  `;
  const sleeveRightShort = `
    M 265,115 C 280,108 300,108 320,118 C 342,132 355,155 352,182 C 348,205 328,222 302,225 C 278,227 258,215 248,195 C 240,178 242,158 250,142 C 255,130 260,120 265,115 Z
  `;

  const sleeveLeftLong = `
    M 135,115 C 115,108 90,110 65,128 C 42,148 25,180 20,220 C 16,260 22,305 40,340 C 55,365 78,378 102,372 C 125,366 142,345 152,315 C 162,285 165,248 162,215 C 160,185 152,155 145,135 Z
  `;
  const sleeveRightLong = `
    M 265,115 C 285,108 310,110 335,128 C 358,148 375,180 380,220 C 384,260 378,305 360,340 C 345,365 322,378 298,372 C 275,366 258,345 248,315 C 238,285 235,248 238,215 C 240,185 248,155 255,135 Z
  `;

  const cuffLeft = sleeve === 'long' ? `M 40,335 L 35,375 L 102,378 L 108,338 Z` : null;
  const cuffRight = sleeve === 'long' ? `M 360,335 L 365,375 L 298,378 L 292,338 Z` : null;

  const sleeveLeft = sleeve === 'long' ? sleeveLeftLong : sleeve === 'short' ? sleeveLeftShort : null;
  const sleeveRight = sleeve === 'long' ? sleeveRightLong : sleeve === 'short' ? sleeveRightShort : null;

  const fill = fabricUrl ? `url(#${patternId})` : '#ffffff';

  return (
    <g>
      {/* Fabric Layer */}
      <path d={bodyPath} fill={fill} />
      {sleeveLeft && <path d={sleeveLeft} fill={fill} />}
      {sleeveRight && <path d={sleeveRight} fill={fill} />}
      {cuffLeft && <path d={cuffLeft} fill={fill} />}
      {cuffRight && <path d={cuffRight} fill={fill} />}

      {/* Shadow/Fold Layer */}
      <g style={{ mixBlendMode: 'multiply' }} opacity="0.12">
        {/* Gravity-based skirt folds */}
        <path d="M 200,210 Q 185,320 150,420 L 120,480" stroke="#000" strokeWidth="20" fill="none" strokeLinecap="round"/>
        <path d="M 200,210 Q 215,320 250,420 L 280,480" stroke="#000" strokeWidth="20" fill="none" strokeLinecap="round"/>
        <path d="M 136,210 Q 110,310 75,420 L 55,480" stroke="#000" strokeWidth="16" fill="none" strokeLinecap="round"/>
        <path d="M 264,210 Q 290,310 325,420 L 345,480" stroke="#000" strokeWidth="16" fill="none" strokeLinecap="round"/>
        {/* Center fold */}
        <path d="M 200,210 L 200,480" stroke="#000" strokeWidth="10" fill="none"/>
        {/* Waist shadow */}
        <ellipse cx="200" cy="200" rx="50" ry="10" fill="#000"/>
        {/* Bust shadow */}
        <ellipse cx="170" cy="115" rx="18" ry="25" fill="#000" opacity="0.6"/>
        <ellipse cx="230" cy="115" rx="18" ry="25" fill="#000" opacity="0.6"/>
      </g>

      {/* Construction Lines */}
      <g fill="none" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d={bodyPath} strokeWidth="1.8"/>
        {sleeveLeft && <path d={sleeveLeft} strokeWidth="1.5"/>}
        {sleeveRight && <path d={sleeveRight} strokeWidth="1.5"/>}
        {cuffLeft && <path d={cuffLeft}/>}
        {cuffRight && <path d={cuffRight}/>}
        {/* V-neckline */}
        <path d={necklineLeft} strokeWidth="1.8"/>
        <path d={necklineRight} strokeWidth="1.8"/>
        {/* Waist seam */}
        <path d="M 136,200 Q 200,215 264,200" strokeDasharray="5,3"/>
        {/* Hem */}
        <path d="M 50,480 Q 200,490 350,480" strokeWidth="2.2"/>
      </g>

      {/* Stitch details */}
      <g fill="none" stroke="#4a4a4a" strokeWidth="0.5" strokeDasharray="2,1.5">
        <path d="M 162,98 L 182,118 L 200,125 L 218,118 L 238,98"/>
        <path d="M 138,198 Q 200,212 262,198"/>
        <path d="M 55,475 Q 200,485 345,475"/>
      </g>
    </g>
  );
};

// ============================================================================
// DENIM JACKET - Technical Flat with pockets and details
// ============================================================================
const DenimJacket = ({ sleeve, patternId, fabricUrl }) => {
  const bodyPath = `
    M 200,48
    C 178,48 158,52 142,60 L 128,72 L 118,90 L 114,115 L 114,150
    L 118,195 L 122,245 L 120,295 L 118,350 L 118,390
    L 282,390 L 282,350 L 280,295 L 278,245 L 282,195
    L 286,150 L 286,115 L 282,90 L 272,72 L 258,60 C 242,52 222,48 200,48 Z
  `;

  // Pointed collar
  const collarLeft = `
    M 160,60 L 145,52 L 122,48 L 100,56 L 95,72 L 105,88 L 135,92 L 165,80 L 168,68 Z
  `;
  const collarRight = `
    M 240,60 L 255,52 L 278,48 L 300,56 L 305,72 L 295,88 L 265,92 L 235,80 L 232,68 Z
  `;

  const sleeveLeftLong = `
    M 114,150 C 100,145 80,145 58,158 C 35,175 18,205 12,245 C 8,285 15,330 35,365 C 52,392 78,405 105,398 C 130,392 148,370 158,340 C 168,310 170,272 168,238 C 166,205 158,175 148,155 Z
  `;
  const sleeveRightLong = `
    M 286,150 C 300,145 320,145 342,158 C 365,175 382,205 388,245 C 392,285 385,330 365,365 C 348,392 322,405 295,398 C 270,392 252,370 242,340 C 232,310 230,272 232,238 C 234,205 242,175 252,155 Z
  `;

  const cuffLeft = `M 35,358 L 28,405 L 105,412 L 112,365 Z`;
  const cuffRight = `M 365,358 L 372,405 L 295,412 L 288,365 Z`;

  const sleeveLeftShort = `
    M 114,150 C 98,145 78,148 58,165 C 40,185 35,212 45,238 C 58,262 85,275 115,270 C 142,265 160,245 165,218 C 168,195 162,172 150,158 Z
  `;
  const sleeveRightShort = `
    M 286,150 C 302,145 322,148 342,165 C 360,185 365,212 355,238 C 342,262 315,275 285,270 C 258,265 240,245 235,218 C 232,195 238,172 250,158 Z
  `;

  const sleeveLeft = sleeve === 'long' ? sleeveLeftLong : sleeve === 'short' ? sleeveLeftShort : null;
  const sleeveRight = sleeve === 'long' ? sleeveRightLong : sleeve === 'short' ? sleeveRightShort : null;

  const fill = fabricUrl ? `url(#${patternId})` : '#ffffff';

  return (
    <g>
      {/* Fabric Layer */}
      <path d={bodyPath} fill={fill} />
      {sleeveLeft && <path d={sleeveLeft} fill={fill} />}
      {sleeveRight && <path d={sleeveRight} fill={fill} />}
      {sleeve === 'long' && (
        <>
          <path d={cuffLeft} fill={fill} />
          <path d={cuffRight} fill={fill} />
        </>
      )}
      <path d={collarLeft} fill={fill} />
      <path d={collarRight} fill={fill} />

      {/* Shadow Layer */}
      <g style={{ mixBlendMode: 'multiply' }} opacity="0.15">
        <path d="M 158,150 L 152,280 L 148,390" stroke="#000" strokeWidth="14" fill="none" strokeLinecap="round"/>
        <path d="M 242,150 L 248,280 L 252,390" stroke="#000" strokeWidth="14" fill="none" strokeLinecap="round"/>
        <ellipse cx="122" cy="140" rx="10" ry="20" fill="#000"/>
        <ellipse cx="278" cy="140" rx="10" ry="20" fill="#000"/>
        {sleeve === 'long' && (
          <>
            <path d="M 75,180 Q 50,270 42,350" stroke="#000" strokeWidth="18" fill="none" strokeLinecap="round"/>
            <path d="M 325,180 Q 350,270 358,350" stroke="#000" strokeWidth="18" fill="none" strokeLinecap="round"/>
          </>
        )}
      </g>

      {/* Construction Lines */}
      <g fill="none" stroke="#1a1a1a" strokeWidth="1.5">
        <path d={bodyPath} strokeWidth="1.8"/>
        {sleeveLeft && <path d={sleeveLeft} strokeWidth="1.5"/>}
        {sleeveRight && <path d={sleeveRight} strokeWidth="1.5"/>}
        {sleeve === 'long' && (
          <>
            <path d={cuffLeft}/>
            <path d={cuffRight}/>
          </>
        )}
        <path d={collarLeft} strokeWidth="1.8"/>
        <path d={collarRight} strokeWidth="1.8"/>
        
        {/* Center placket */}
        <line x1="200" y1="88" x2="200" y2="390" strokeWidth="1.2"/>
        <line x1="188" y1="88" x2="188" y2="390" strokeWidth="0.6"/>
        <line x1="212" y1="88" x2="212" y2="390" strokeWidth="0.6"/>
        
        {/* Hem */}
        <path d="M 118,390 L 282,390" strokeWidth="2.2"/>
        
        {/* Yoke seam */}
        <path d="M 114,140 Q 200,155 286,140" strokeDasharray="4,2" strokeWidth="0.8"/>
      </g>

      {/* Chest pockets */}
      <g fill="none" stroke="#1a1a1a" strokeWidth="1.2">
        <path d="M 135,175 L 135,245 L 185,245 L 185,175 L 135,175"/>
        <path d="M 135,190 L 185,190"/>
        <path d="M 160,175 L 160,190"/>
        <path d="M 215,175 L 215,245 L 265,245 L 265,175 L 215,175"/>
        <path d="M 215,190 L 265,190"/>
        <path d="M 240,175 L 240,190"/>
      </g>

      {/* Pocket flap stitching */}
      <g fill="none" stroke="#4a4a4a" strokeWidth="0.5" strokeDasharray="2,1.5">
        <path d="M 138,178 L 138,187 L 182,187 L 182,178"/>
        <path d="M 218,178 L 218,187 L 262,187 L 262,178"/>
        <path d="M 138,192 L 182,192"/>
        <path d="M 218,192 L 262,192"/>
      </g>

      {/* Waist pockets */}
      <g fill="none" stroke="#1a1a1a" strokeWidth="1">
        <path d="M 130,295 L 145,350 L 185,345 L 180,290"/>
        <path d="M 270,295 L 255,350 L 215,345 L 220,290"/>
      </g>

      {/* Buttons */}
      {[125, 180, 240, 300, 355].map((y, i) => (
        <g key={i}>
          <circle cx="200" cy={y} r="6" fill="#94a3b8" stroke="#475569" strokeWidth="1.5"/>
          <circle cx="198" cy={y-1} r="1.2" fill="#e2e8f0"/>
        </g>
      ))}

      {/* Collar stitching */}
      <g fill="none" stroke="#4a4a4a" strokeWidth="0.5" strokeDasharray="2,1.5">
        <path d="M 105,58 L 130,85"/>
        <path d="M 295,58 L 270,85"/>
      </g>
    </g>
  );
};

// ============================================================================
// FITTED TROUSERS - With waistband, fly, and leg creases
// ============================================================================
const FittedTrousers = ({ patternId, fabricUrl }) => {
  const trouserPath = `
    M 145,40 L 255,40
    L 260,58 L 262,85 L 258,125 L 252,175
    L 250,235 L 255,310 L 260,400 L 262,480
    L 208,480 L 205,400 L 200,310 L 200,250
    L 200,310 L 195,400 L 192,480
    L 138,480 L 140,400 L 145,310 L 150,235
    L 148,175 L 142,125 L 138,85 L 140,58 Z
  `;

  const fill = fabricUrl ? `url(#${patternId})` : '#ffffff';

  return (
    <g>
      {/* Fabric Layer */}
      <path d={trouserPath} fill={fill} />

      {/* Shadow Layer */}
      <g style={{ mixBlendMode: 'multiply' }} opacity="0.12">
        {/* Leg creases */}
        <path d="M 168,125 L 165,310 L 165,480" stroke="#000" strokeWidth="10" fill="none" strokeLinecap="round"/>
        <path d="M 232,125 L 235,310 L 235,480" stroke="#000" strokeWidth="10" fill="none" strokeLinecap="round"/>
        {/* Inner leg shadow */}
        <path d="M 155,200 Q 200,290 245,200" stroke="#000" strokeWidth="20" fill="none" strokeLinecap="round"/>
        {/* Waistband shadow */}
        <rect x="145" y="52" width="110" height="8" fill="#000" opacity="0.5"/>
      </g>

      {/* Construction Lines */}
      <g fill="none" stroke="#1a1a1a" strokeWidth="1.5">
        <path d={trouserPath} strokeWidth="1.8"/>
        {/* Waistband */}
        <path d="M 145,40 L 255,40" strokeWidth="2.2"/>
        <path d="M 145,58 L 255,58" strokeWidth="1.2"/>
        {/* Fly */}
        <path d="M 200,58 L 200,145" strokeWidth="1"/>
        {/* Hem */}
        <path d="M 138,480 L 192,480" strokeWidth="2"/>
        <path d="M 208,480 L 262,480" strokeWidth="2"/>
      </g>

      {/* Belt loops */}
      <g fill="none" stroke="#1a1a1a" strokeWidth="1.2">
        <rect x="158" y="42" width="6" height="14" rx="1"/>
        <rect x="185" y="42" width="6" height="14" rx="1"/>
        <rect x="209" y="42" width="6" height="14" rx="1"/>
        <rect x="236" y="42" width="6" height="14" rx="1"/>
      </g>

      {/* Front pockets */}
      <g fill="none" stroke="#1a1a1a" strokeWidth="1">
        <path d="M 148,75 Q 160,95 168,140"/>
        <path d="M 252,75 Q 240,95 232,140"/>
      </g>

      {/* Stitch details */}
      <g fill="none" stroke="#4a4a4a" strokeWidth="0.5" strokeDasharray="2,1.5">
        <path d="M 148,55 L 252,55"/>
        <path d="M 170,130 L 168,475"/>
        <path d="M 230,130 L 232,475"/>
        <path d="M 142,475 L 188,475"/>
        <path d="M 212,475 L 258,475"/>
      </g>

      {/* Button/clasp */}
      <circle cx="200" cy="49" r="4" fill="#94a3b8" stroke="#475569" strokeWidth="1"/>
    </g>
  );
};

// ============================================================================
// KAFTAN - Nigerian Native with embroidered V-neckline
// ============================================================================
const Kaftan = ({ sleeve, patternId, fabricUrl }) => {
  const bodyPath = `
    M 200,50
    C 170,50 145,60 132,80 L 125,110 L 122,150 L 128,200
    L 135,250 L 130,300 L 128,370 L 130,450 L 132,490
    L 268,490 L 270,450 L 272,370 L 270,300
    L 265,250 L 272,200 L 278,150 L 275,110 L 268,80
    C 255,60 230,50 200,50 Z
  `;

  // V-neckline embroidery panel
  const necklinePanel = `
    M 175,62 L 162,95 L 170,140 L 190,175 L 200,185
    L 210,175 L 230,140 L 238,95 L 225,62 L 200,55 Z
  `;

  const sleeveLeftShort = `
    M 122,150 C 102,145 78,150 55,172 C 35,198 30,235 45,268 C 62,298 95,312 130,302 C 158,294 175,268 175,238 C 175,210 162,182 148,165 Z
  `;
  const sleeveRightShort = `
    M 278,150 C 298,145 322,150 345,172 C 365,198 370,235 355,268 C 338,298 305,312 270,302 C 242,294 225,268 225,238 C 225,210 238,182 252,165 Z
  `;

  const sleeveLeftLong = `
    M 122,150 C 95,145 65,155 40,185 C 18,218 8,265 15,315 C 22,362 48,400 85,415 C 120,428 152,412 172,378 C 190,348 195,305 188,265 C 182,228 168,195 150,172 Z
  `;
  const sleeveRightLong = `
    M 278,150 C 305,145 335,155 360,185 C 382,218 392,265 385,315 C 378,362 352,400 315,415 C 280,428 248,412 228,378 C 210,348 205,305 212,265 C 218,228 232,195 250,172 Z
  `;

  const sleeveLeft = sleeve === 'long' ? sleeveLeftLong : sleeve === 'short' ? sleeveLeftShort : null;
  const sleeveRight = sleeve === 'long' ? sleeveRightLong : sleeve === 'short' ? sleeveRightShort : null;

  const fill = fabricUrl ? `url(#${patternId})` : '#ffffff';

  return (
    <g>
      {/* Fabric Layer */}
      <path d={bodyPath} fill={fill} />
      {sleeveLeft && <path d={sleeveLeft} fill={fill} />}
      {sleeveRight && <path d={sleeveRight} fill={fill} />}

      {/* Shadow Layer */}
      <g style={{ mixBlendMode: 'multiply' }} opacity="0.12">
        <path d="M 170,250 L 165,380 L 162,490" stroke="#000" strokeWidth="14" fill="none" strokeLinecap="round"/>
        <path d="M 230,250 L 235,380 L 238,490" stroke="#000" strokeWidth="14" fill="none" strokeLinecap="round"/>
        <ellipse cx="200" cy="240" rx="45" ry="10" fill="#000"/>
      </g>

      {/* Construction Lines */}
      <g fill="none" stroke="#1a1a1a" strokeWidth="1.5">
        <path d={bodyPath} strokeWidth="1.8"/>
        {sleeveLeft && <path d={sleeveLeft}/>}
        {sleeveRight && <path d={sleeveRight}/>}
        <path d="M 132,490 L 268,490" strokeWidth="2.2"/>
      </g>

      {/* Embroidered Neckline */}
      <path d={necklinePanel} fill="none" stroke="#92400e" strokeWidth="2.5"/>
      <g fill="none" stroke="#92400e" strokeWidth="1.2">
        <path d="M 185,68 L 185,165"/>
        <path d="M 200,60 L 200,185"/>
        <path d="M 215,68 L 215,165"/>
        <path d="M 170,90 Q 200,115 230,90"/>
        <path d="M 175,120 Q 200,142 225,120"/>
        <path d="M 182,150 Q 200,168 218,150"/>
      </g>

      {/* Side slits */}
      <g fill="none" stroke="#1a1a1a" strokeWidth="1">
        <path d="M 132,420 L 132,490"/>
        <path d="M 268,420 L 268,490"/>
      </g>

      {/* Stitch details */}
      <g fill="none" stroke="#4a4a4a" strokeWidth="0.5" strokeDasharray="2,1.5">
        <path d="M 135,485 L 265,485"/>
      </g>
    </g>
  );
};

// ============================================================================
// Additional templates with same quality...
// ============================================================================

const PoloShirt = ({ sleeve, patternId, fabricUrl }) => {
  const bodyPath = `
    M 200,55 C 180,55 162,58 148,65 L 135,78 L 125,98 L 122,125 L 124,160
    L 125,200 L 124,250 L 122,300 L 122,360
    L 278,360 L 278,300 L 276,250 L 275,200 L 276,160
    L 278,125 L 275,98 L 265,78 L 252,65 C 238,58 220,55 200,55 Z
  `;
  
  const collarPath = `
    M 165,65 L 155,55 L 152,42 L 162,32 L 185,28 L 200,27 L 215,28 L 238,32
    L 248,42 L 245,55 L 235,65 L 215,72 L 200,75 L 185,72 Z
  `;

  const sleeveLeftShort = `
    M 122,125 C 105,118 82,120 62,138 C 45,158 40,188 52,215 C 68,242 98,255 130,245 C 155,238 170,215 168,188 C 166,165 152,142 138,130 Z
  `;
  const sleeveRightShort = `
    M 278,125 C 295,118 318,120 338,138 C 355,158 360,188 348,215 C 332,242 302,255 270,245 C 245,238 230,215 232,188 C 234,165 248,142 262,130 Z
  `;

  const fill = fabricUrl ? `url(#${patternId})` : '#ffffff';

  return (
    <g>
      <path d={bodyPath} fill={fill} />
      <path d={sleeveLeftShort} fill={fill} />
      <path d={sleeveRightShort} fill={fill} />
      <path d={collarPath} fill={fill} />

      <g style={{ mixBlendMode: 'multiply' }} opacity="0.12">
        <path d="M 158,160 L 155,280 L 152,360" stroke="#000" strokeWidth="10" fill="none"/>
        <path d="M 242,160 L 245,280 L 248,360" stroke="#000" strokeWidth="10" fill="none"/>
      </g>

      <g fill="none" stroke="#1a1a1a" strokeWidth="1.5">
        <path d={bodyPath} strokeWidth="1.8"/>
        <path d={sleeveLeftShort}/>
        <path d={sleeveRightShort}/>
        <path d={collarPath} strokeWidth="1.8"/>
        <path d="M 122,360 L 278,360" strokeWidth="2.2"/>
      </g>

      {/* Placket */}
      <g fill="none" stroke="#1a1a1a" strokeWidth="1">
        <line x1="200" y1="75" x2="200" y2="165"/>
        <line x1="192" y1="75" x2="192" y2="165" strokeWidth="0.5"/>
        <line x1="208" y1="75" x2="208" y2="165" strokeWidth="0.5"/>
      </g>

      {[95, 130].map((y, i) => (
        <g key={i}>
          <circle cx="200" cy={y} r="4" fill="#fafafa" stroke="#333" strokeWidth="1"/>
          <circle cx="200" cy={y} r="1.5" fill="#555"/>
        </g>
      ))}
    </g>
  );
};

const Blouse = ({ sleeve, patternId, fabricUrl }) => {
  const bodyPath = `
    M 200,60 C 175,60 152,68 138,85 L 125,110 L 120,145 L 122,190
    L 122,240 L 120,295 L 118,350 L 118,380
    L 282,380 L 282,350 L 280,295 L 278,240 L 278,190
    L 280,145 L 275,110 L 262,85 C 248,68 225,60 200,60 Z
  `;

  const sleeveLeftShort = `
    M 120,145 C 100,138 75,142 55,165 C 38,190 38,225 55,255 C 78,285 115,295 148,280 C 172,268 185,240 180,210 C 176,182 158,158 140,148 Z
  `;
  const sleeveRightShort = `
    M 280,145 C 300,138 325,142 345,165 C 362,190 362,225 345,255 C 322,285 285,295 252,280 C 228,268 215,240 220,210 C 224,182 242,158 260,148 Z
  `;

  const fill = fabricUrl ? `url(#${patternId})` : '#ffffff';

  return (
    <g>
      <path d={bodyPath} fill={fill} />
      <path d={sleeveLeftShort} fill={fill} />
      <path d={sleeveRightShort} fill={fill} />

      <g style={{ mixBlendMode: 'multiply' }} opacity="0.12">
        <path d="M 155,190 L 150,300 L 148,380" stroke="#000" strokeWidth="12" fill="none"/>
        <path d="M 245,190 L 250,300 L 252,380" stroke="#000" strokeWidth="12" fill="none"/>
        <ellipse cx="165" cy="140" rx="20" ry="30" fill="#000" opacity="0.5"/>
        <ellipse cx="235" cy="140" rx="20" ry="30" fill="#000" opacity="0.5"/>
      </g>

      <g fill="none" stroke="#1a1a1a" strokeWidth="1.5">
        <path d={bodyPath} strokeWidth="1.8"/>
        <path d={sleeveLeftShort}/>
        <path d={sleeveRightShort}/>
        <path d="M 160,68 Q 200,95 240,68" strokeWidth="1.8"/>
        <path d="M 118,380 L 282,380" strokeWidth="2.2"/>
      </g>

      {/* Gather details at neckline */}
      <g fill="none" stroke="#4a4a4a" strokeWidth="0.5">
        {[172, 182, 192, 208, 218, 228].map((x, i) => (
          <path key={i} d={`M ${x},${65 + Math.abs(x-200)*0.12} Q ${x},78 ${x},${88 - Math.abs(x-200)*0.08}`}/>
        ))}
      </g>
    </g>
  );
};

const MaxiDress = ({ sleeve, patternId, fabricUrl }) => {
  const bodyPath = `
    M 200,55 C 172,55 150,65 138,85 L 130,115 L 128,155 L 135,200
    L 132,250 L 130,320 L 132,400 L 135,480
    L 265,480 L 268,400 L 270,320 L 268,250
    L 265,200 L 272,155 L 270,115 L 262,85 C 250,65 228,55 200,55 Z
  `;

  const fill = fabricUrl ? `url(#${patternId})` : '#ffffff';

  return (
    <g>
      <path d={bodyPath} fill={fill} />

      <g style={{ mixBlendMode: 'multiply' }} opacity="0.12">
        <path d="M 170,250 L 165,380 L 162,480" stroke="#000" strokeWidth="14" fill="none"/>
        <path d="M 230,250 L 235,380 L 238,480" stroke="#000" strokeWidth="14" fill="none"/>
        <path d="M 200,250 L 200,480" stroke="#000" strokeWidth="8" fill="none"/>
        <ellipse cx="200" cy="195" rx="38" ry="8" fill="#000"/>
      </g>

      <g fill="none" stroke="#1a1a1a" strokeWidth="1.5">
        <path d={bodyPath} strokeWidth="1.8"/>
        <path d="M 158,65 Q 200,90 242,65" strokeWidth="1.8"/>
        <path d="M 132,200 Q 200,215 268,200" strokeDasharray="5,3"/>
        <path d="M 135,480 L 265,480" strokeWidth="2.2"/>
      </g>
    </g>
  );
};

const FittedDress = ({ sleeve, patternId, fabricUrl }) => {
  const bodyPath = `
    M 200,55 C 172,55 152,65 140,85 L 132,115 L 130,155 L 138,200
    L 135,235 L 132,290 L 138,360 L 148,440 L 155,480
    L 245,480 L 252,440 L 262,360 L 268,290 L 265,235
    L 262,200 L 270,155 L 268,115 L 260,85 C 248,65 228,55 200,55 Z
  `;

  const fill = fabricUrl ? `url(#${patternId})` : '#ffffff';

  return (
    <g>
      <path d={bodyPath} fill={fill} />

      <g style={{ mixBlendMode: 'multiply' }} opacity="0.12">
        <path d="M 172,235 Q 165,350 160,440" stroke="#000" strokeWidth="12" fill="none"/>
        <path d="M 228,235 Q 235,350 240,440" stroke="#000" strokeWidth="12" fill="none"/>
        <ellipse cx="200" cy="225" rx="35" ry="8" fill="#000"/>
        <ellipse cx="170" cy="145" rx="18" ry="25" fill="#000" opacity="0.5"/>
        <ellipse cx="230" cy="145" rx="18" ry="25" fill="#000" opacity="0.5"/>
      </g>

      <g fill="none" stroke="#1a1a1a" strokeWidth="1.5">
        <path d={bodyPath} strokeWidth="1.8"/>
        <path d="M 158,65 Q 200,90 242,65" strokeWidth="1.8"/>
        <path d="M 135,235 Q 200,250 265,235" strokeDasharray="5,3"/>
        <path d="M 155,480 L 245,480" strokeWidth="2.2"/>
      </g>
    </g>
  );
};

const ALineDress = ({ sleeve, patternId, fabricUrl }) => {
  const bodyPath = `
    M 200,55 C 172,55 152,65 140,85 L 132,115 L 130,155 L 138,200
    L 128,250 L 105,330 L 72,420 L 55,480
    L 345,480 L 328,420 L 295,330 L 272,250
    L 262,200 L 270,155 L 268,115 L 260,85 C 248,65 228,55 200,55 Z
  `;

  const fill = fabricUrl ? `url(#${patternId})` : '#ffffff';

  return (
    <g>
      <path d={bodyPath} fill={fill} />

      <g style={{ mixBlendMode: 'multiply' }} opacity="0.12">
        <path d="M 200,250 Q 180,350 140,440 L 105,480" stroke="#000" strokeWidth="18" fill="none"/>
        <path d="M 200,250 Q 220,350 260,440 L 295,480" stroke="#000" strokeWidth="18" fill="none"/>
        <path d="M 128,250 Q 98,350 68,440 L 58,480" stroke="#000" strokeWidth="14" fill="none"/>
        <path d="M 272,250 Q 302,350 332,440 L 342,480" stroke="#000" strokeWidth="14" fill="none"/>
        <ellipse cx="200" cy="195" rx="42" ry="10" fill="#000"/>
      </g>

      <g fill="none" stroke="#1a1a1a" strokeWidth="1.5">
        <path d={bodyPath} strokeWidth="1.8"/>
        <path d="M 158,65 Q 200,90 242,65" strokeWidth="1.8"/>
        <path d="M 128,250 Q 200,265 272,250" strokeDasharray="5,3"/>
        <path d="M 55,480 Q 200,492 345,480" strokeWidth="2.2"/>
      </g>
    </g>
  );
};

const Agbada = ({ patternId, fabricUrl }) => {
  const outerRobe = `
    M 200,35 C 135,35 75,58 45,95 L 25,155 L 15,240 L 18,350 L 30,450 L 45,490
    L 355,490 L 370,450 L 382,350 L 385,240 L 375,155 L 355,95 C 325,58 265,35 200,35 Z
  `;
  const innerGarment = `
    M 200,65 C 172,65 148,75 138,95 L 132,130 L 135,180 L 142,235
    L 142,340 L 145,430 L 148,460 L 252,460 L 255,430 L 258,340
    L 258,235 L 265,180 L 268,130 L 262,95 C 252,75 228,65 200,65 Z
  `;

  const fill = fabricUrl ? `url(#${patternId})` : '#ffffff';

  return (
    <g>
      <path d={outerRobe} fill={fill} />
      <path d={innerGarment} fill={fabricUrl ? `url(#${patternId})` : '#f5f5f5'} />

      <g style={{ mixBlendMode: 'multiply' }} opacity="0.12">
        <path d="M 75,155 Q 50,300 40,430" stroke="#000" strokeWidth="30" fill="none"/>
        <path d="M 325,155 Q 350,300 360,430" stroke="#000" strokeWidth="30" fill="none"/>
        <path d="M 142,235 L 138,380 L 148,460" stroke="#000" strokeWidth="12" fill="none"/>
        <path d="M 258,235 L 262,380 L 252,460" stroke="#000" strokeWidth="12" fill="none"/>
        <ellipse cx="200" cy="225" rx="50" ry="15" fill="#000"/>
      </g>

      <g fill="none" stroke="#1a1a1a" strokeWidth="2">
        <path d={outerRobe} strokeWidth="2.5"/>
        <path d={innerGarment} strokeWidth="1.8"/>
        <path d="M 45,490 L 355,490" strokeWidth="3"/>
      </g>

      {/* Ornate embroidery */}
      <g fill="none" stroke="#92400e" strokeWidth="2">
        <path d="M 165,78 Q 200,110 235,78"/>
        <ellipse cx="200" cy="92" rx="25" ry="14"/>
        <circle cx="200" cy="92" r="8" strokeWidth="1.5"/>
      </g>
    </g>
  );
};

const Senator = ({ sleeve, patternId, fabricUrl }) => {
  const bodyPath = `
    M 200,55 C 172,55 150,68 140,90 L 132,125 L 132,175 L 142,230
    L 140,280 L 138,350 L 142,430 L 148,490
    L 252,490 L 258,430 L 262,350 L 260,280
    L 258,230 L 268,175 L 268,125 L 260,90 C 250,68 228,55 200,55 Z
  `;

  const collarBand = `
    M 165,62 L 160,52 L 168,42 L 188,38 L 200,37 L 212,38 L 232,42 L 240,52 L 235,62
    L 218,68 L 200,70 L 182,68 Z
  `;

  const fill = fabricUrl ? `url(#${patternId})` : '#ffffff';

  return (
    <g>
      <path d={bodyPath} fill={fill} />
      <path d={collarBand} fill={fill} />

      <g style={{ mixBlendMode: 'multiply' }} opacity="0.12">
        <path d="M 175,280 L 170,400 L 168,490" stroke="#000" strokeWidth="12" fill="none"/>
        <path d="M 225,280 L 230,400 L 232,490" stroke="#000" strokeWidth="12" fill="none"/>
        <ellipse cx="200" cy="270" rx="35" ry="8" fill="#000"/>
      </g>

      <g fill="none" stroke="#1a1a1a" strokeWidth="1.5">
        <path d={bodyPath} strokeWidth="1.8"/>
        <path d={collarBand}/>
        <path d="M 148,490 L 252,490" strokeWidth="2.2"/>
      </g>

      {/* Placket and buttons */}
      <line x1="200" y1="70" x2="200" y2="280" stroke="#1a1a1a" strokeWidth="1"/>
      {[100, 145, 195, 245].map((y, i) => (
        <g key={i}>
          <circle cx="200" cy={y} r="4.5" fill="#fafafa" stroke="#333" strokeWidth="1"/>
          <circle cx="200" cy={y} r="1.5" fill="#555"/>
        </g>
      ))}
    </g>
  );
};

const BaggyTrousers = ({ patternId, fabricUrl }) => {
  const trouserPath = `
    M 135,40 L 265,40
    L 272,60 L 278,95 L 275,150 L 268,220
    L 275,300 L 285,390 L 290,480
    L 212,480 L 208,390 L 200,300 L 200,250
    L 200,300 L 192,390 L 188,480
    L 110,480 L 115,390 L 125,300 L 132,220
    L 125,150 L 122,95 L 128,60 Z
  `;

  const fill = fabricUrl ? `url(#${patternId})` : '#ffffff';

  return (
    <g>
      <path d={trouserPath} fill={fill} />

      <g style={{ mixBlendMode: 'multiply' }} opacity="0.12">
        <path d="M 158,150 Q 145,300 132,420" stroke="#000" strokeWidth="18" fill="none"/>
        <path d="M 242,150 Q 255,300 268,420" stroke="#000" strokeWidth="18" fill="none"/>
        <path d="M 200,220 L 200,250" stroke="#000" strokeWidth="12" fill="none"/>
        <path d="M 148,220 Q 200,320 252,220" stroke="#000" strokeWidth="22" fill="none"/>
      </g>

      <g fill="none" stroke="#1a1a1a" strokeWidth="1.5">
        <path d={trouserPath} strokeWidth="1.8"/>
        <path d="M 135,40 L 265,40" strokeWidth="2.2"/>
        <path d="M 135,60 L 265,60" strokeWidth="1.2"/>
        <path d="M 110,480 L 188,480" strokeWidth="2"/>
        <path d="M 212,480 L 290,480" strokeWidth="2"/>
      </g>

      <path d="M 200,60 L 200,160" stroke="#1a1a1a" strokeWidth="1"/>
      
      <g fill="none" stroke="#1a1a1a" strokeWidth="1.2">
        <rect x="150" y="42" width="6" height="14" rx="1"/>
        <rect x="182" y="42" width="6" height="14" rx="1"/>
        <rect x="212" y="42" width="6" height="14" rx="1"/>
        <rect x="244" y="42" width="6" height="14" rx="1"/>
      </g>
    </g>
  );
};

const PalazzoPants = ({ patternId, fabricUrl }) => {
  const trouserPath = `
    M 150,40 L 250,40
    L 258,60 L 262,95 L 258,145 L 250,195
    L 268,280 L 302,380 L 335,480
    L 205,480 L 202,380 L 200,300 L 200,250
    L 200,300 L 198,380 L 195,480
    L 65,480 L 98,380 L 132,280 L 150,195
    L 142,145 L 138,95 L 142,60 Z
  `;

  const fill = fabricUrl ? `url(#${patternId})` : '#ffffff';

  return (
    <g>
      <path d={trouserPath} fill={fill} />

      <g style={{ mixBlendMode: 'multiply' }} opacity="0.12">
        <path d="M 155,195 Q 120,320 85,440" stroke="#000" strokeWidth="22" fill="none"/>
        <path d="M 245,195 Q 280,320 315,440" stroke="#000" strokeWidth="22" fill="none"/>
        <path d="M 175,220 Q 150,350 125,460" stroke="#000" strokeWidth="16" fill="none"/>
        <path d="M 225,220 Q 250,350 275,460" stroke="#000" strokeWidth="16" fill="none"/>
        <path d="M 200,195 L 200,300" stroke="#000" strokeWidth="10" fill="none"/>
      </g>

      <g fill="none" stroke="#1a1a1a" strokeWidth="1.5">
        <path d={trouserPath} strokeWidth="1.8"/>
        <path d="M 150,40 L 250,40" strokeWidth="2.2"/>
        <path d="M 150,60 L 250,60" strokeWidth="1.2"/>
        <path d="M 65,480 L 195,480" strokeWidth="2"/>
        <path d="M 205,480 L 335,480" strokeWidth="2"/>
      </g>

      <path d="M 200,60 L 200,145" stroke="#1a1a1a" strokeWidth="1"/>
    </g>
  );
};

const Blazer = ({ sleeve, patternId, fabricUrl }) => {
  const bodyPath = `
    M 200,42 C 165,42 135,55 120,80 L 112,120 L 112,175 L 122,235
    L 125,295 L 122,360 L 120,420
    L 280,420 L 278,360 L 275,295 L 278,235
    L 288,175 L 288,120 L 280,80 C 265,55 235,42 200,42 Z
  `;

  const lapelLeft = `
    M 162,52 L 142,68 L 132,105 L 142,155 L 175,200 L 200,175 L 195,120 L 190,80 L 178,58 Z
  `;
  const lapelRight = `
    M 238,52 L 258,68 L 268,105 L 258,155 L 225,200 L 200,175 L 205,120 L 210,80 L 222,58 Z
  `;

  const sleeveLeftLong = `
    M 112,175 C 88,168 60,178 38,205 C 18,235 8,280 15,330 C 22,378 48,415 85,428 C 120,440 150,420 168,385 C 185,352 188,308 182,268 C 176,230 162,198 145,182 Z
  `;
  const sleeveRightLong = `
    M 288,175 C 312,168 340,178 362,205 C 382,235 392,280 385,330 C 378,378 352,415 315,428 C 280,440 250,420 232,385 C 215,352 212,308 218,268 C 224,230 238,198 255,182 Z
  `;

  const cuffLeft = `M 15,325 L 8,428 L 85,438 L 92,335 Z`;
  const cuffRight = `M 385,325 L 392,428 L 315,438 L 308,335 Z`;

  const fill = fabricUrl ? `url(#${patternId})` : '#ffffff';

  return (
    <g>
      <path d={bodyPath} fill={fill} />
      <path d={sleeveLeftLong} fill={fill} />
      <path d={sleeveRightLong} fill={fill} />
      <path d={cuffLeft} fill={fill} />
      <path d={cuffRight} fill={fill} />
      <path d={lapelLeft} fill={fill} />
      <path d={lapelRight} fill={fill} />

      <g style={{ mixBlendMode: 'multiply' }} opacity="0.12">
        <path d="M 158,235 L 152,340 L 148,420" stroke="#000" strokeWidth="10" fill="none"/>
        <path d="M 242,235 L 248,340 L 252,420" stroke="#000" strokeWidth="10" fill="none"/>
        <path d="M 65,220 Q 45,310 35,390" stroke="#000" strokeWidth="16" fill="none"/>
        <path d="M 335,220 Q 355,310 365,390" stroke="#000" strokeWidth="16" fill="none"/>
      </g>

      <g fill="none" stroke="#1a1a1a" strokeWidth="1.5">
        <path d={bodyPath} strokeWidth="1.8"/>
        <path d={sleeveLeftLong}/>
        <path d={sleeveRightLong}/>
        <path d={cuffLeft}/>
        <path d={cuffRight}/>
        <path d={lapelLeft} strokeWidth="1.8"/>
        <path d={lapelRight} strokeWidth="1.8"/>
        <path d="M 120,420 L 280,420" strokeWidth="2.2"/>
      </g>

      {/* Single button */}
      <g>
        <circle cx="200" cy="295" r="7" fill="#475569" stroke="#1e293b" strokeWidth="1.5"/>
        <circle cx="198" cy="293" r="1.8" fill="#94a3b8"/>
      </g>

      {/* Breast pocket welt */}
      <path d="M 222,200 L 222,218 L 262,218" fill="none" stroke="#1a1a1a" strokeWidth="1.2"/>

      {/* Cuff buttons */}
      <circle cx="48" cy="385" r="3.5" fill="#475569" stroke="#1e293b"/>
      <circle cx="68" cy="388" r="3.5" fill="#475569" stroke="#1e293b"/>
      <circle cx="352" cy="385" r="3.5" fill="#475569" stroke="#1e293b"/>
      <circle cx="332" cy="388" r="3.5" fill="#475569" stroke="#1e293b"/>
    </g>
  );
};

const UtilityJacket = ({ sleeve, patternId, fabricUrl }) => {
  const bodyPath = `
    M 200,42 C 162,42 130,58 115,88 L 108,130 L 108,190 L 120,255
    L 118,320 L 115,395 L 115,455
    L 285,455 L 285,395 L 282,320 L 280,255
    L 292,190 L 292,130 L 285,88 C 270,58 238,42 200,42 Z
  `;

  const collarBand = `
    M 162,48 L 155,38 L 165,28 L 190,24 L 200,23 L 210,24 L 235,28 L 245,38 L 238,48
    L 218,55 L 200,58 L 182,55 Z
  `;

  const sleeveLeftLong = `
    M 108,190 C 80,182 48,195 25,228 C 5,265 -2,318 10,372 C 22,422 55,458 98,468 C 138,478 172,455 192,415 C 210,378 212,330 202,285 C 192,242 172,208 150,195 Z
  `;
  const sleeveRightLong = `
    M 292,190 C 320,182 352,195 375,228 C 395,265 402,318 390,372 C 378,422 345,458 302,468 C 262,478 228,455 208,415 C 190,378 188,330 198,285 C 208,242 228,208 250,195 Z
  `;

  const cuffLeft = `M 10,365 L 2,468 L 98,478 L 106,375 Z`;
  const cuffRight = `M 390,365 L 398,468 L 302,478 L 294,375 Z`;

  const fill = fabricUrl ? `url(#${patternId})` : '#ffffff';

  return (
    <g>
      <path d={bodyPath} fill={fill} />
      <path d={sleeveLeftLong} fill={fill} />
      <path d={sleeveRightLong} fill={fill} />
      <path d={cuffLeft} fill={fill} />
      <path d={cuffRight} fill={fill} />
      <path d={collarBand} fill={fill} />

      <g style={{ mixBlendMode: 'multiply' }} opacity="0.12">
        <path d="M 158,255 L 152,360 L 148,455" stroke="#000" strokeWidth="10" fill="none"/>
        <path d="M 242,255 L 248,360 L 252,455" stroke="#000" strokeWidth="10" fill="none"/>
        <path d="M 62,240 Q 38,340 28,420" stroke="#000" strokeWidth="18" fill="none"/>
        <path d="M 338,240 Q 362,340 372,420" stroke="#000" strokeWidth="18" fill="none"/>
      </g>

      <g fill="none" stroke="#1a1a1a" strokeWidth="1.5">
        <path d={bodyPath} strokeWidth="1.8"/>
        <path d={sleeveLeftLong}/>
        <path d={sleeveRightLong}/>
        <path d={cuffLeft}/>
        <path d={cuffRight}/>
        <path d={collarBand}/>
        <path d="M 115,455 L 285,455" strokeWidth="2.2"/>
      </g>

      {/* Center zipper */}
      <g stroke="#475569" strokeWidth="2">
        <line x1="200" y1="58" x2="200" y2="455"/>
        {Array.from({length: 18}, (_, i) => (
          <g key={i}>
            <line x1="195" y1={75 + i * 22} x2="200" y2={80 + i * 22}/>
            <line x1="205" y1={75 + i * 22} x2="200" y2={80 + i * 22}/>
          </g>
        ))}
      </g>

      {/* Large cargo pockets */}
      <g fill="none" stroke="#1a1a1a" strokeWidth="1.2">
        <path d="M 130,290 L 130,385 L 185,385 L 185,290"/>
        <path d="M 130,310 L 185,310"/>
        <path d="M 157,290 L 157,310"/>
        <path d="M 215,290 L 215,385 L 270,385 L 270,290"/>
        <path d="M 215,310 L 270,310"/>
        <path d="M 242,290 L 242,310"/>
      </g>

      {/* Chest pockets */}
      <g fill="none" stroke="#1a1a1a" strokeWidth="1">
        <path d="M 135,180 L 135,235 L 180,235 L 180,180"/>
        <path d="M 135,198 L 180,198"/>
        <path d="M 220,180 L 220,235 L 265,235 L 265,180"/>
        <path d="M 220,198 L 265,198"/>
      </g>
    </g>
  );
};

export default GarmentSVG;

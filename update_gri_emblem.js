const fs = require('fs');

let content = fs.readFileSync('src/components/common/GRIEmblem.tsx', 'utf-8');

if (!content.includes("import React, { useState }")) {
  content = content.replace("import React from 'react';", "import React, { useState } from 'react';");
}

const functionStartRegex = /export const GRIEmblem: React\.FC<GRIEmblemProps> = \(\{\s*className = 'w-10 h-10',\s*size,\s*variant = 'full'\s*\}\) => \{/;

const newStart = `export const GRIEmblem: React.FC<GRIEmblemProps> = ({ 
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
        className={\`object-contain \${className}\`}
        style={size ? { width: size, height: size } : {}}
        onError={() => setImageError(true)}
      />
    );
  }`;

content = content.replace(functionStartRegex, newStart);
fs.writeFileSync('src/components/common/GRIEmblem.tsx', content);

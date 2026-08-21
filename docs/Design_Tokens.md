# Enterprise Specification: Design Tokens & Tailwind Theme

## 1. Color Palette Tokens (`tailwind.config.js`)

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        khadi: {
          blue: "#0D47A1",   // Primary Institutional Khadi Blue
          light: "#82B1FF",  // Light Blue Accent
          dark: "#002171",   // Deep Navy Accent
        },
        saffron: {
          DEFAULT: "#E65100", // Saffron Secondary Token
          light: "#FF9800",
        },
        sage: {
          DEFAULT: "#2E7D32", // Rural Sage Token
          light: "#4CAF50",
        },
      },
    },
  },
};
```

---

## 2. Typography Scale Tokens

- `text-3xl font-bold`: Headings, Banners (`32px`)
- `text-2xl font-semibold`: Screen Headers (`24px`)
- `text-lg font-medium`: Card Titles (`18px`)
- `text-base`: Body Paragraphs (`16px`)
- `text-sm text-gray-500`: Subtitles (`14px`)
- `text-xs font-semibold`: Micro Badges (`12px`)

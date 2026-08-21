# Enterprise UI/UX Design Specification
## Production-Ready Flutter Application for Gandhigram Rural Institute (GRI)
**Website Reference**: [https://ruraluniv.ac.in](https://ruraluniv.ac.in)  
**Version**: 1.0.0  
**Lead UX Architect**: Vijay Mahes  
**Design System**: Exact Website Style Adaptation + Material Design 3 (M3)  

---

## 1. Executive Summary & Design System Origin

This UI/UX specification directly mirrors the visual identity, color scheme, components, typography, and button styles of the official **Gandhigram Rural Institute (https://ruraluniv.ac.in)** website into a high-performance Flutter mobile and web application.

---

## 2. Website Exact Style Mapping

### 2.1 Brand Color Palette (Extracted from Website CSS)

```css
/* Official Website CSS Color Definitions */
.TopUtilityBar    { background-color: #518214; color: #FFFFFF; } /* Khadi Green */
.StartDDMdropbtn  { background-color: #911C03; color: #FFFFFF; } /* GRI Deep Maroon */
.StartDDMhover    { background-color: #D12905; }               /* Crimson Accent */
.ButtonPhd        { background-color: #F26B0F; color: #FFFFFF; } /* Terracotta Orange */
.ButtonPhdHover   { background-color: #F082AC; }               /* Soft Pink Accent */
.FoundersBox      { background-color: #466C09; border: 2px solid #BFBFBF; } /* Deep Olive */
.ZoomGreenBtn     { background-color: #518214; border: 1px solid #FFFFFF; }
.ZoomOrangeBtn    { background-color: #F16236; }
```

| Token Name | HEX Code | Website Selector / Element | Flutter `AppColors` Mapping |
| :--- | :--- | :--- | :--- |
| **GRI Primary Maroon** | `#911C03` | `.StartDDMdropbtn`, `#tdi_gri` | `AppColors.primaryMaroon` |
| **GRI Crimson Hover** | `#D12905` | `.StartDDMdropbtn:hover` | `AppColors.primaryMaroonDark` |
| **Khadi Green Header** | `#518214` | `#tdi_header`, top bar | `AppColors.secondaryGreen` |
| **Founders Deep Olive**| `#466C09` | Founders banner container | `AppColors.secondaryGreenDark` |
| **Terracotta Orange**  | `#F26B0F` | `.button-1` (Ph.D. CTA) | `AppColors.accentAmber` |
| **Soft Pink Accent**   | `#F082AC` | `.button-1:hover` | `AppColors.accentGold` |
| **Light Gray Background**| `#F8F9FA` | Body container | `AppColors.lightBackground` |
| **Card Surface**       | `#FFFFFF` | News & Notice containers | `AppColors.lightSurface` |

---

### 2.2 Typography Mapping (Bilingual English & Tamil)

The website features custom Tamil font support alongside standard web fonts:

- **English Font Family**: `Roboto` / `Calibri` / `Helvetica Neue` / `sans-serif`
- **Tamil Font Family**: `BaminiTamil` (`baamini.ttf`) for authentic institutional typography
- **Heading Styles**:
  - **Display Title**: `28px`, Bold (700) — Used in Banner & Section Titles
  - **Button Text**: `20px`, Medium (500), Line Height `20px` — Used in `.button-1` CTAs
  - **Marquee Notice**: `18px`, Bold, Color: `Brown` (`#A52A2A`) — Urgent announcements
  - **Nav Links**: `14px`, SemiBold — Menubar items

---

### 2.3 Exact Component Replica Specs

#### Component 1: Top Utility Header (`#tdi_header`)
- **Background**: `#518214` (Khadi Green)
- **Elements**: 
  - Text Links: `STUDY IN INDIA` | `Samarth@GRI` | `Accessibility`
  - Accessibility Controls: Zoom In (`A+`), Reset (`A`), Zoom Out (`A-`)
  - Color Theme Toggles: Green (`#518214`) and Orange (`#F16236`)
  - Search Input Box + Submit Button

#### Component 2: Main Brand Banner (`#banner`)
- **Image Asset**: `images/banner.png` (Official GRI Logo & Emblem)
- **Quick Links Alignment**: Right-aligned stack with icons (`images/home.png`, `images/contact.png`, `images/email.png`)
- **Portal Dropdown Button**: Maroon pill button `#911C03` with 10px rounded corners (`border-radius: 10px`).

#### Component 3: Navigation Menu Bar (`#cssmenu`)
- **Main Nav Items**:
  1. `About GRI` (Vision, Profile, Genesis, Campus, Map, Location)
  2. `Governance` (Board of Management, Finance Committee, Academic Council)
  3. `Administration` (Chancellor, Vice-Chancellor, Registrar, CoE, Finance Officer, Deans, HODs)
  4. `Academics` (CBCS, Programmes, Schools, Research & Dev Cell, Student Handbook)
  5. `Admissions` (Prospectus 2026-27, M.Phil./Ph.D. Regulations, Fee Refund Policy, Hostel Fees)
  6. `Examination` (System, ESE Timetable, Transcript App, Ph.D. Tracking, e-SANAD)
  7. `Facilities` (Library, Computer Centre, Nano Centre, Instrument Facility, Museum)
  8. `Infrastructure` (Hostels, Guest House, Health Centre, Exam Hall)
  9. `Alumni`
  10. `e-News` (e-News 2026, 2025, 2024 archive)
  11. `Portal`

#### Component 4: Urgent Notice Marquee Ticker
- **Background**: Light Amber `#FFF8E7`
- **Text Color**: Brown `#8B0000` / `#650909`
- **Behavior**: Horizontal smooth scroll left with `onmouseover="this.stop()"` logic.

#### Component 5: Action Button `.button-1` (Ph.D. / CUET Application CTA)
- **Background**: `#F26B0F` (Terracotta Orange)
- **Hover Background**: `#F082AC`
- **Border Radius**: `8px`
- **Text Color**: `#FFFFFF`
- **Font Size**: `20px`

#### Component 6: Founders Message Box
- **Background**: `#466C09` (Deep Olive Green)
- **Border**: `2px solid #BFBFBF`
- **Border Radius**: `8px`
- **Image**: `images/founders_START.png`

#### Component 7: Camera Slider Photo Gallery (`#camera_wrap_1`)
- **Aspect Ratio**: 16:9
- **Caption Overlay**: Dark semi-transparent bottom overlay (`.camera_caption fadeFromBottom`) with italicized text (`<emp>`).

---

## 3. Flutter Theme & Widget Mapping Code

### 3.1 Material 3 Theme Sync (`lib/core/theme/app_theme.dart`)

```dart
// Exact color matching from ruraluniv.ac.in
class AppColors {
  static const Color primaryMaroon = Color(0xFF911C03);
  static const Color secondaryGreen = Color(0xFF518214);
  static const Color accentOrange   = Color(0xFFF26B0F);
  static const Color foundersOlive  = Color(0xFF466C09);
  static const Color textBrown      = Color(0xFF650909);
}
```

---

## 4. Screen Blueprints (Website Replica Layouts)

### 4.1 Home Screen Layout
```
+-------------------------------------------------------+
|  [Top Bar: #518214] STUDY IN INDIA | Samarth@GRI      |
+-------------------------------------------------------+
|  [GRI Banner Logo: images/banner.png]    [Home|Contact|Email] |
+-------------------------------------------------------+
|  [Nav Bar: About | Governance | Academics | Admissions... ] |
+-------------------------------------------------------+
|  [Marquee Ticker: Urgent Notices & Admission Dates]   |
+-------------------------------------------------------+
|  [CTA Buttons: Ph.D. Application | CUET 2026 | ITEP]    |
|  [Founders Box: images/founders_START.png (#466C09)]  |
+-------------------------------------------------------+
|  [Photo Gallery Slider with Bottom Caption Overlay]   |
+-------------------------------------------------------+
|  [Bottom Nav Bar: Home | Academics | AI Chat | Profile] |
+-------------------------------------------------------+
```

---
*End of Website Style UI/UX Specification Document.*

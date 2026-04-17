# Image Placement Guide - BayanLink Aliaga Portal

## Strategic Image Integration for Aliaga Municipality

This guide documents the strategic placement of Aliaga municipality images throughout the BayanLink portal for optimal visual impact and user experience.

---

## 1. Municipality Seal (Aliaga_Nueva_Ecija.png)

**Official Image**: Circular emblem featuring mountains, agricultural elements (corn/maize), founded date (1849), and official text "BAYAN NG ALIAGA" with stars.

### Placement Locations:

#### A. Public Navbar (HIGHEST VISIBILITY)
- **Location**: `client/src/components/layout/PublicNavbar.jsx`
- **Position**: Top-left brand logo area (replacing generic "B" mark)
- **Size**: 48x48px (h-12 w-12)
- **Purpose**: Immediate municipal identity recognition
- **User Impact**: First impression - users instantly know they're on Aliaga's official portal
- **Alt Text**: "Municipality of Aliaga Official Seal"

#### B. About Page - Municipal Profile Section
- **Location**: `client/src/pages/public/AboutPage.jsx` (Municipality Profile section)
- **Position**: Left side of profile text in grid layout
- **Size**: 256x256px (h-64 w-64)
- **Purpose**: Visual representation of municipal branding
- **User Impact**: Educational - explains Aliaga's official identity
- **Alt Text**: "Municipality of Aliaga Official Seal"

#### C. Public Footer
- **Location**: `client/src/components/layout/PublicFooter.jsx`
- **Position**: Top-right of footer introduction section (desktop only)
- **Size**: 96x96px (h-24 w-24) with 90% opacity
- **Purpose**: Brand reinforcement at page bottom
- **User Impact**: Consistent branding throughout portal
- **Display**: Hidden on mobile (responsive)

---

## 2. Taong Putik Festival (Taong_Putik_Festival.jpg)

**Image Description**: Aerial photograph showing the famous mud festival celebration with devotees covered in mud/dried banana leaves and people in white robes, representing cultural heritage (June 24 feast of Saint John the Baptist).

### Placement Location:

#### A. About Page - Culture & Traditions Section
- **Location**: `client/src/pages/public/AboutPage.jsx`
- **Section Name**: "Culture & Traditions" / "Taong Putik Festival"
- **Position**: Left side of content grid (visual-first layout)
- **Size**: Full-width responsive with rounded corners
- **Purpose**: Showcase unique cultural celebration
- **User Impact**: HIGH - Memorable cultural storytelling
- **Features**:
  - Full-width responsive image
  - Rounded corners (rounded-lg)
  - Shadow effect (shadow-card)
  - Accompanied by detailed text about festival traditions
  - Festival highlights in teal accent box
  - Explains mud costumes, house visits, candle offerings

### Why This Placement?
- About page is where users learn about the municipality
- Festival represents living culture and community spirit
- Visually striking image creates engagement
- Educational context helps tourists/new residents understand Aliaga

---

## 3. Municipal Hall (Aliaga_Municipal_Hall.jpg)

**Image Description**: Photograph of the white/blue Municipal Hall building with metal roofing, situated in a public plaza with landscaping, trees, and fountains - representing government administration center.

### Placement Locations:

#### A. About Page - Government & Administration Section
- **Location**: `client/src/pages/public/AboutPage.jsx`
- **Section Name**: "Municipal Government"
- **Position**: Right side of content grid
- **Size**: Full-width responsive with rounded corners
- **Purpose**: Show administrative center and government accessibility
- **User Impact**: Builds trust - users see actual government infrastructure
- **Features**:
  - Full-width responsive image
  - Rounded corners and shadow effects
  - Positioned alongside government structure information
  - Context about Sangguniang Bayan and services

### Why This Placement?
- Demonstrates legitimate government institution
- Shows clean, organized municipal infrastructure
- Builds citizen confidence in services
- Complements government structure information

---

## 4. Geographic Location Map (Aliaga_in_Nueva_Ecija.svg.png)

**Image Description**: Map showing Aliaga highlighted in red within Nueva Ecija province, with barangay divisions outlined and water features (rivers) shown in blue.

### Placement Location:

#### A. About Page - Geographic Profile Section
- **Location**: `client/src/pages/public/AboutPage.jsx`
- **Section Name**: "Geographic Profile"
- **Position**: Left side of content grid
- **Size**: Responsive, max-width with natural aspect ratio
- **Purpose**: Show location context and administrative divisions
- **User Impact**: INFORMATIONAL - Users understand geographic positioning
- **Features**:
  - Responsive responsive image
  - Rounded corners and shadow effects
  - Left-aligned on desktop (right on mobile)
  - Accompanied by geographic facts:
    - Land area: 90.04 km²
    - Population density: 801/km²
    - Location between Pampanga rivers
    - Central Luzon positioning

### Why This Placement?
- Geography section is logical location
- Map shows administrative boundaries (26 barangays)
- Helps new users understand municipal structure
- Provides geographic context for services

---

## Visual Impact Summary

| Image | Primary Use | Secondary Uses | Visibility Level |
|-------|------------|-----------------|-----------------|
| **Seal** | Navbar branding | About page, Footer | HIGHEST (every page) |
| **Festival** | Cultural showcase | Social media, Tourism | HIGH (About page) |
| **Municipal Hall** | Trust building | Contact page | HIGH (About page) |
| **Map** | Geography info | Barangay navigation | MEDIUM (About page) |

---

## Responsive Design Considerations

### Desktop (md and above)
- All images display at full intended size
- Grid layouts show images on left/right clearly
- Footer seal visible on right side

### Tablet (sm - md)
- Images scale proportionally
- Grids remain 2-column where applicable
- Footer seal still visible

### Mobile (below sm)
- Images stack vertically
- Full-width responsive images
- Footer seal hidden (hidden md:flex)
- Text remains readable with proper spacing

---

## Image Optimization

### File Sizes
- Seal: Small (logo format) - optimized for repeated loading
- Festival: Medium (high-res photo) - loaded once per page view
- Hall: Medium (high-res photo) - loaded once per page view
- Map: Small (SVG-based) - vector format, scales perfectly

### Loading Performance
All images use public blob URLs from Vercel storage:
- CDN-optimized delivery
- Automatic caching
- No local processing overhead

### Alt Text Strategy
- All images have descriptive alt text
- Helps accessibility and SEO
- Provides context if images fail to load

---

## Future Enhancement Ideas

1. **Lightbox Gallery**: Click images on About page to view full-screen
2. **Image Carousel**: Rotate through municipal photos on homepage
3. **Festival Timeline**: Interactive festival history with photos
4. **Barangay Gallery**: One photo per barangay on map/list
5. **Before/After**: Infrastructure development showcase

---

## Current Implementation Status

✅ **Completed**:
- Seal in Navbar
- Seal in About page profile section
- Seal in Footer
- Festival image in Culture section
- Municipal Hall in Government section
- Map in Geographic Profile section

✅ **All images responsively designed**
✅ **All images have proper alt text**
✅ **All images properly styled with shadows/borders**

---

*Last Updated: 2024*
*Guide Version: 1.0*

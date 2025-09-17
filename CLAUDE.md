# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a modern React-based real estate landing page project for rural properties. The project showcases Brazilian rural real estate with interactive features, Firebase integration, and responsive design. It's specifically designed for "terrenos rurais" (rural lands) with pricing in Brazilian Real and focuses on farms, ranches, and agricultural properties.

## Project Architecture

This is a single React application with the following structure:

### Main Application (`frontend/` directory)
- Built with Vite + React
- `src/App.jsx` - Main React application with all integrated components
- `src/main.jsx` - React entry point
- `src/lib/firebase.js` - Firebase configuration
- `src/lib/seed.js` - Database seeding utilities
- `src/services/db.js` - Firestore data access layer
- `src/styles/main.css` - Complete CSS styles (integrated from original static version)
- `public/images/` - All visual assets

## Development Commands

### Local Development
```bash
cd frontend/
npm install          # Install dependencies
npm run dev         # Development server (port 5173)
npm run build       # Production build
npm run preview     # Preview production build
```

### Docker (OrbStack)
```bash
# Production build and run
docker-compose up -d

# Access application:
# React app: http://localhost:3000

# Development mode with hot reload
docker-compose --profile dev up -d
# React dev server: http://localhost:5173

# Stop containers
docker-compose down

# Build the application
docker build -t es-terrenos ./frontend
```

## Firebase Integration

The project uses Firebase for data persistence:
- **Firestore**: Property data storage with collections for properties, property types, and search filters
- **Analytics**: User behavior tracking (when supported)
- **Auth**: Anonymous authentication for data access
- **Configuration**: Stored in `src/js/firebase/init.js` (static) and `src/lib/firebase.js` (React)

### Key Firebase Collections
- `properties` - Main property listings with detailed rural information
- `propertyTypes` - Categories like farms, ranches, construction land
- `searchFilters` - Available filter options for location, type, area, purpose

## Code Architecture Patterns

### Data Flow
Firebase npm → firebase.js → db.js → App.jsx → React state → Component updates

### Component Structure
- **App.jsx**: Main application orchestrating all sections
- **HeroSection**: Header navigation + search functionality
- **FeaturedProperties**: Displays highlighted rural properties
- **Benefits**: Why invest in rural properties section
- **AvailableProperties**: All properties grid
- **PropertyTypes**: Different property categories
- **Footer**: Contact info and recent properties

### Styling Approach
- CSS custom properties for theming
- Rural property color scheme (greens and earth tones)
- Mobile-first responsive design
- Complete integration of original static styles

### JavaScript Patterns
- React functional components with hooks
- State management for property filtering
- ES6+ syntax, async/await for Firebase operations
- Integrated search and filter functionality

## Testing and Quality Assurance

### Manual Testing Requirements
- Test at breakpoints: 1440px, 1024px, 768px, 375px
- Verify rural property search functionality with location/type/area filters
- Check Firebase data loading and error states
- Validate form interactions and dropdown menus
- Test lazy loading and parallax effects
- Run Lighthouse audit for performance

### Console Validation
- No JavaScript errors on page load
- Firebase connection successful
- Property data fetching without errors

## Content and Localization

- **Language**: Portuguese (Brazil)
- **Currency**: Brazilian Real (R$)
- **Content Focus**: Rural properties including farms, ranches, and agricultural land
- **Geographic Scope**: Brazilian rural real estate market
- **Property Metrics**: Area in hectares, soil types, water access, infrastructure details

## Design System

### Colors (Rural Property Theme)
- Primary: `#2E7D33` (Nature Green)
- Primary Light: `#4CAF50` (Light Green)
- Primary Dark: `#1B5E20` (Dark Green)
- Secondary: `#8D6E63` (Earth Brown)
- Accent: `#7F57F1` (Purple - for UI accents)
- Backgrounds: `#FFFFFF`, `#F8FBF8` (Soft Green)

### Typography
- Headers: Playfair Display (500, 600, 700)
- Body: Montserrat (400, 500, 600, 700)
- Loaded via Google Fonts CDN

## File Organization Conventions

### Naming Patterns
- Images: lowercase, kebab-case (`recent-property-1.png`)
- CSS Classes: kebab-case following BEM methodology
- JavaScript: camelCase for variables/functions
- Components: PascalCase (React version)

### Code Style
- Indentation: 4 spaces (HTML/CSS/JS)
- JavaScript: ES6+ features, semicolons required, single quotes preferred
- CSS: Group rules by section, use CSS custom properties
- Semantic HTML with appropriate ARIA attributes

## Performance Considerations

- Lazy loading implemented for property images
- Firebase connection pooling and caching
- Optimized image assets in `images/` directory
- Minimal external dependencies (Google Fonts only for static version)
- Vite bundling and optimization for React version
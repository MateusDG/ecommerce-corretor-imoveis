# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a modern, responsive rural real estate landing page built with vanilla HTML5, CSS3, and JavaScript. The page is specifically designed for selling rural properties including farms, ranches, and country estates. It includes multiple interactive sections showcasing rural properties with detailed information about land area, infrastructure, and agricultural potential.

## Project Structure

The project follows a simple static website structure:
- `index.html` - Main HTML structure with semantic sections
- `styles.css` - Complete CSS styling with responsive design
- `script.js` - JavaScript for interactivity and animations
- `images/` - All visual assets including hero background and property images
- `README.md` - Project documentation in Portuguese

## Architecture

### HTML Structure
The page is organized into semantic sections:
- Hero section with header navigation and rural property search functionality
- Featured Rural Properties ("Terrenos em Destaque") gallery
- Investment Benefits ("Por que Investir em Terrenos Rurais") section
- Available Properties ("Propriedades Disponíveis") with detailed rural information
- Property Types ("Tipos de Propriedade") showcase
- Footer with rural property contact information and recent listings

### CSS Architecture
- Global reset and base styles
- Component-based styling approach
- Responsive design using Flexbox and CSS Grid
- CSS custom properties for consistent theming
- Mobile-first responsive breakpoints

### JavaScript Features
- Rural property search with specific filters (location, type, area, purpose)
- Interactive dropdown functionality for property search
- Smooth scrolling and navigation
- Element animations and hover effects
- Lazy loading for performance
- Parallax effect on hero background
- Search form validation and feedback

## Design System

### Colors
- Primary: `#2E7D33` (Nature Green)
- Primary Light: `#4CAF50` (Light Green)
- Primary Dark: `#1B5E20` (Dark Green)
- Secondary: `#8D6E63` (Earth Brown)
- Accent: `#7F57F1` (Purple - maintained for accent elements)
- Background: `#FFFFFF`
- Light Background: `#F8FBF8` (Soft Green Background)

### Typography
- Headers: Playfair Display (500, 600, 700)
- Body text: Montserrat (400, 500, 600, 700)

### Responsive Breakpoints
- Desktop: 1440px+
- Tablet: 768px - 1024px  
- Mobile: 320px - 767px

## Development

### Running the Project
Simply open `index.html` in any modern web browser. No build process or server required.

### File Dependencies
- Google Fonts: Montserrat and Playfair Display loaded via CDN
- All images are locally referenced in the `images/` directory
- No external JavaScript libraries or frameworks

### Key Interactive Elements
- Navigation menu with smooth scrolling
- Rural property search form with specific filters (Location, Type, Area, Purpose)
- Property cards with hover effects showcasing rural properties
- Property types section with detailed information cards
- Investment benefits section highlighting rural property advantages
- Responsive image galleries
- Contact forms in footer section with rural property focus

### Rural Property Features
The site specifically caters to rural real estate with:
- Detailed property information (area in hectares, soil type, water access, infrastructure)
- Property type categorization (Leisure Farms, Productive Farms, Construction Land, Rural Investment)
- Investment-focused content highlighting rural property benefits
- Pricing in Brazilian Real (R$)
- Location-specific information for Brazilian rural properties
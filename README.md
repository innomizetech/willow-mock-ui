# CaringUp Revamp - RPM Ecosystem Website

A modern, enterprise-focused React.js website for CaringUp's Remote Patient Monitoring (RPM) ecosystem, targeting hospitals, insurers, corporates, TPAs, and monitoring-as-a-service partners.

## Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Custom Animations** - Canvas-based data visualization with animated nodes

## Features

- **Full-bleed Hero Section** - Dark gradient background with centered/left-aligned headline
- **Animated Data Visualization** - Subtle pulsing nodes and connecting lines in the hero
- **Enterprise Typography** - Large, geometric sans-serif with heavy weights and generous spacing
- **Brand Colors** - CaringUp logo colors + Teal/Cyan accents
- **Responsive Design** - Mobile-first approach with breakpoints
- **Two CTAs** - Primary solid button and secondary ghost button

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── Hero.jsx              # Main hero section with CTAs
│   │   └── DataVisualization.jsx # Animated canvas visualization
│   ├── App.jsx                   # Main app component
│   ├── main.jsx                  # React entry point
│   └── index.css                 # Global styles with Tailwind
├── index.html                    # HTML template
├── tailwind.config.js            # Tailwind configuration
├── vite.config.js                # Vite configuration
└── package.json                  # Dependencies
```

## Customization

### Colors

Edit `tailwind.config.js` to adjust the CaringUp brand colors:
- `caringup.primary` - Primary brand color
- `caringup.secondary` - Secondary brand color
- `caringup.accent` - Teal/Cyan accent color
- `caringup.dark` - Deep navy for hero background

### Typography

The hero uses large geometric sans-serif fonts. Adjust in `tailwind.config.js`:
- `fontSize.hero` - Desktop hero text size
- `fontSize.hero-mobile` - Mobile hero text size

### Animations

The data visualization animation can be customized in `src/components/DataVisualization.jsx`:
- `nodeCount` - Number of animated nodes
- Animation speed and behavior

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Proprietary - CaringUp


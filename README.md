# Willow Prebill Mock UI

Willow Prebill Mock UI

## Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Custom Animations** - Canvas-based data visualization with animated nodes

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

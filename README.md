# Lai Kah Keen - Portfolio Website

A modern, single-page developer portfolio built with Vue 3, Tailwind CSS, and GSAP animations. Features a strict black and white monochrome theme with advanced scroll animations and smooth interactions.

## Features

- **Modern Tech Stack**: Vue 3 (Composition API), Tailwind CSS, GSAP, Lenis smooth scroll
- **Monochrome Design**: Strict black and white theme with strategic grayscale
- **Advanced Animations**: Scroll-triggered animations, parallax effects, interactive hover states
- **Fully Responsive**: Mobile-first design that looks great on all devices
- **SEO Optimized**: Meta tags, Open Graph tags, and semantic HTML
- **Sections**:
  - Hero with parallax background shapes
  - About with profile photo
  - Journey timeline
  - Skills categorized by type
  - Featured projects showcase
  - Work experience
  - Contact form

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open http://localhost:5173 in your browser

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## Customization

### Content

Update the content in these data files:

- `src/data/projects.js` - Your project portfolio
- `src/data/skills.js` - Your technical skills
- `src/data/journey.js` - Your career/education timeline
- `src/data/experience.js` - Your work experience

### Profile Photo

Replace `/public/images/profile.jpg` with your profile photo. For best results:
- Size: 800x800px minimum
- Format: JPG or PNG
- Subject: Professional headshot

### Project Images

Add project screenshots to `/public/images/` folder and update the image paths in `src/data/projects.js`.

### Social Links

Update social media links in:
- `src/components/layout/Footer.vue`
- `src/components/sections/ContactSection.vue`

### Contact Form

The contact form currently has a placeholder submission. To make it functional:

1. **Using Formspree**: Sign up at https://formspree.io
2. **Using EmailJS**: Sign up at https://www.emailjs.com
3. Update the `handleSubmit` function in `src/components/sections/ContactSection.vue`

### Colors & Theme

The monochrome theme is defined in `tailwind.config.js`. You can adjust:
- Gray scale variations
- Font families
- Animation timings
- Custom animations

## Project Structure

```
laikahkeen/
├── public/              # Static assets
├── src/
│   ├── assets/          # Styles and images
│   ├── components/
│   │   ├── layout/      # Navigation, Footer
│   │   ├── sections/    # Page sections
│   │   └── ui/          # Reusable UI components
│   ├── composables/     # Vue composables for animations
│   ├── data/            # Content data files
│   ├── utils/           # Utility functions
│   ├── App.vue          # Root component
│   └── main.js          # App entry point
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## Technologies Used

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Next-generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **GSAP** - Professional-grade animation library
- **Lenis** - Smooth scroll library

## Deployment

### Netlify

1. Push code to GitHub
2. Connect repository to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`

### Vercel

1. Push code to GitHub
2. Import project to Vercel
3. Build command: `npm run build`
4. Output directory: `dist`

### GitHub Pages

1. Install gh-pages: `npm install -D gh-pages`
2. Add to package.json scripts: `"deploy": "npm run build && gh-pages -d dist"`
3. Run: `npm run deploy`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Lighthouse Score Target: 90+ (Performance, Accessibility, SEO)
- Core Web Vitals optimized
- Lazy loading for images
- Code splitting for optimal bundle size

## License

This project is open source and available under the MIT License.

## Contact

Lai Kah Keen - hello@laikahkeen.com

Portfolio: https://laikahkeen.com

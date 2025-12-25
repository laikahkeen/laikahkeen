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
  - Work experience with resume download
  - Contact form with Web3Forms integration

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

Update the content in these TypeScript data files:

- `src/data/projects.ts` - Your project portfolio
- `src/data/skills.ts` - Your technical skills
- `src/data/journey.ts` - Your career/education timeline
- `src/data/experience.ts` - Your work experience

### Profile Photo

Replace `/public/images/profile.jpeg` with your profile photo. For best results:

- Size: 800x800px minimum
- Format: JPEG or PNG
- Subject: Professional headshot

### Resume

Replace `/public/resume.pdf` with your latest resume. The download link is available in the Experience section.

### Favicons & OG Image

Update your site's visual identity:

- Replace `/public/og-image.png` with your Open Graph preview image (1200x630px recommended)
- Update favicon suite in `/public/` (favicon.ico, favicon-16x16.png, favicon-32x32.png, apple-touch-icon.png, android icons)

### Social Links

Update social media links in:

- `src/components/layout/Footer.vue`
- `src/components/sections/ContactSection.vue`

### Contact Form

The contact form is integrated with **Web3Forms**:

1. Sign up at https://web3forms.com to get your access key
2. Create a `.env` file in the project root:
   ```env
   VITE_WEB3FORMS_ACCESS_TOKEN=your_access_key_here
   ```
3. Form submissions are handled automatically via `src/api.ts`

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
│   ├── main.ts          # App entry point
│   └── api.ts           # Web3Forms integration
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## Technologies Used

- **Vue 3** - Progressive JavaScript framework with TypeScript
- **Vite 5** - Next-generation frontend tooling
- **Tailwind CSS 3** - Utility-first CSS framework
- **GSAP 3** - Professional-grade animation library with ScrollTrigger
- **Lenis** - Smooth scroll library
- **Axios** - HTTP client for API requests
- **Web3Forms** - Contact form backend

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

Lai Kah Keen - laikahkeen@gmail.com

Portfolio: https://laikahkeen.com
GitHub: https://github.com/laikahkeen
LinkedIn: https://linkedin.com/in/lai-kah-keen

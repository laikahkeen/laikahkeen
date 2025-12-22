# Portfolio Customization Checklist

## Before You Deploy - Must Do Items

### 1. Content Updates

#### Profile Information
- [ ] Update your bio in `src/components/sections/AboutSection.vue` (lines with placeholder text)
- [ ] Update statistics (Years Experience, Projects Completed, Happy Clients) in AboutSection.vue

#### Skills
- [ ] Edit `src/data/skills.js` to match your actual skills
- [ ] Organize skills into relevant categories
- [ ] Set appropriate skill levels (beginner, intermediate, advanced, expert)

#### Projects
- [ ] Update `src/data/projects.js` with your real projects
- [ ] Add project screenshots to `public/images/` folder
  - Name them: project1.jpg, project2.jpg, etc.
  - Recommended size: 1200x800px
  - Format: JPG or WebP for best performance
- [ ] Update project URLs (GitHub and live demo links)

#### Journey/Timeline
- [ ] Edit `src/data/journey.js` with your actual career milestones
- [ ] Add education, career moves, achievements
- [ ] Update years and descriptions

#### Experience
- [ ] Update `src/data/experience.js` with your work history
- [ ] Add company names, roles, dates, locations
- [ ] List key responsibilities and achievements

### 2. Images

#### Profile Photo
- [ ] Add your professional headshot to `public/images/profile.jpg`
  - Recommended: 800x800px square format
  - High quality, professional lighting
  - Can be grayscale to match theme

#### OG Image (Social Sharing)
- [ ] Create OG image at `public/og-image.png`
  - Size: 1200x630px
  - Include your name and "Full Stack Developer" or similar
  - Use black and white theme to match portfolio

#### Favicon
- [ ] Replace `public/favicon.ico` with your actual favicon
  - Size: 32x32px or 64x64px
  - Simple icon that represents you

### 3. Contact Information

#### Email & Social Links
- [ ] Update email in:
  - `src/components/layout/Footer.vue`
  - `src/components/sections/ContactSection.vue`
  - `index.html` (meta tags)

- [ ] Update social media URLs:
  - GitHub: Update in Footer.vue and ContactSection.vue
  - LinkedIn: Update in Footer.vue and ContactSection.vue
  - Any other platforms you want to include

#### Contact Form
- [ ] Set up form submission service:
  - Option 1: Formspree (https://formspree.io)
  - Option 2: EmailJS (https://www.emailjs.com)
  - Option 3: Netlify Forms (if using Netlify)
- [ ] Update `handleSubmit` function in `src/components/sections/ContactSection.vue`

### 4. SEO & Meta Tags

- [ ] Update title in `index.html` (currently "Lai Kah Keen - Full Stack Developer Portfolio")
- [ ] Update meta description
- [ ] Update Open Graph title, description, and image URL
- [ ] Update Twitter Card meta tags
- [ ] Add your actual domain to og:url and twitter:url

### 5. Resume/CV

- [ ] Add resume PDF to `public/` folder (e.g., `public/resume.pdf`)
- [ ] Update download link in `src/components/sections/ExperienceSection.vue`

### 6. Optional Customizations

#### Colors (if you want to adjust the monochrome palette)
- [ ] Edit `tailwind.config.js` to adjust gray shades
- [ ] Modify font families if desired

#### Animations
- [ ] Adjust animation speeds in composables if they're too fast/slow
- [ ] Modify scroll trigger points in section components

#### Content Additions
- [ ] Add testimonials section if you have client feedback
- [ ] Add blog section if you write articles
- [ ] Add certifications if relevant

## Testing Before Deployment

### Functionality
- [ ] Test navigation - all links work correctly
- [ ] Test contact form submission
- [ ] Verify all external links open in new tabs
- [ ] Check smooth scrolling works properly

### Responsive Design
- [ ] Test on mobile devices (or Chrome DevTools device mode)
- [ ] Test on tablet sizes
- [ ] Test on desktop (various screen sizes)

### Performance
- [ ] Run Lighthouse audit (aim for 90+ scores)
- [ ] Optimize all images (compress, use WebP if possible)
- [ ] Verify no console errors

### Cross-Browser
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari (if on Mac)
- [ ] Test in Edge

## Deployment

### Pre-Deployment
- [ ] Run `npm run build` to ensure build works
- [ ] Test production build with `npm run preview`
- [ ] Commit all changes to git

### Deploy to Hosting
- [ ] Choose hosting platform (Netlify, Vercel, GitHub Pages, etc.)
- [ ] Deploy the `dist/` folder
- [ ] Configure custom domain (laikahkeen.com)
- [ ] Enable HTTPS

### Post-Deployment
- [ ] Test live site on actual domain
- [ ] Verify OG image shows correctly when sharing on social media
- [ ] Test contact form on production
- [ ] Set up analytics (Google Analytics, Plausible, etc.) if desired

## Quick Tips

1. **Replace placeholder content gradually** - Start with About, then Skills, then Projects
2. **Use high-quality images** - This is a portfolio, first impressions matter
3. **Keep it updated** - Add new projects as you complete them
4. **Get feedback** - Ask friends/colleagues to review before going live
5. **Monitor performance** - Use Lighthouse to ensure fast load times

## Need Help?

- Vue 3 Docs: https://vuejs.org/
- Tailwind CSS: https://tailwindcss.com/
- GSAP Docs: https://greensock.com/docs/
- Vite Docs: https://vitejs.dev/

Good luck with your portfolio! 🚀

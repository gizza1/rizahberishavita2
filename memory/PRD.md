# PRD — Qumështorja VITA (Premium Dairy Landing Page)

## Original Problem Statement
Build a world-class, Awwwards-level premium dairy landing page for **Qumështorja VITA**, Kosovo's leading dairy producer. Modern, minimalist-luxurious, white background with VITA blue (#007BFF) + light blue + green accents, glassmorphism, soft shadows, gradients, and smooth animations everywhere (loader, parallax, cursor glow, floating milk particles, magnetic buttons, scroll reveals, product 3D tilt, featured slider, farm-to-table journey, quality counters, recipes, sustainability, about timeline, testimonials, gallery lightbox, contact + newsletter). Use REAL VITA products researched online.

## User Choices
- Stack: React + Tailwind + Framer Motion + GSAP + Lenis (not Next.js).
- Products: real VITA products from qumeshtorjavita.com; combination of real photos + AI-generated packaging renders.
- Contact form: persisted to backend. Newsletter: persisted to backend.

## Architecture
- **Frontend**: React 19 SPA. `src/components/site/*` (Navbar, Hero, Marquee, ProductShowcase+ProductModal, FeaturedSlider, FarmToTable, Quality, Recipes, Sustainability, About, Testimonials, Gallery, Contact, Footer, Cursor, Loader, MagneticButton, Reveal, FloatingParticles). Data in `src/data/products.js` & `content.js`. Lenis smooth scroll + framer-motion. Fonts: Cabinet Grotesk (display) + Manrope (body).
- **Backend**: FastAPI + MongoDB (motor). Routes under `/api`: `contact` (POST/GET), `newsletter` (POST/GET, unique index + 409 on dup). Collections: `contacts`, `newsletter`.
- **Design**: `/app/design_guidelines.json`.

## Implemented (2026-06)
- Full single-page premium site with all requested sections + animations.
- 17 real/AI VITA products (Milk, Yogurt, Cheese, Butter, Cream, Drinks) with category tabs, live search (name/category/tags), toggleable filter chips, animated grid, 3D-tilt cards, premium product modal (nutrition, ingredients, sizes, storage, related products) rendered via portal.
- Featured auto-slider (color-per-type, autoplay resets on interaction), farm-to-table scroll journey, animated quality counters + certs, recipe filter tabs, sustainability, about timeline, testimonial carousel, masonry gallery + portal lightbox.
- Working contact form + newsletter (persist to MongoDB; email normalized/lowercased, duplicate → 409).
- CSS intro loader (dismisses on window load + fallback), custom cursor, floating particles, scroll progress bar, scroll-to-top.
- Verified: backend 100% (14-test pytest suite). Frontend 95% (testing agent); HIGH overlay/stacking bug fixed via React portals; toasts moved to bottom-right.

## Backlog / Next
- P1: Recipe detail modal/pages; product "Find in Stores" real store locator/map.
- P2: i18n (Albanian/English toggle); real social links; wire real Google Maps API key.
- P2: Admin view for contact/newsletter submissions.
- Nice-to-have: subtle Three.js hero 3D, Lottie micro-animations.

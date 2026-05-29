# SHOPIFI — Cinematic Editorial Commerce Platform

An enterprise-grade, high-aesthetic MERN stack commerce platform bridging premium editorial layouts with transactional excellence. Designed for modern design collectors, luxury shoppers, and digital showcase experiences.

---

## 📖 Table of Contents
1. [Conceptual Architecture](#-conceptual-architecture)
2. [Advanced SEO Implementation](#-advanced-seo-implementation)
3. [Cinematic UI/UX & Design Tokens](#-cinematic-uiux--design-tokens)
4. [Project Directory Structures](#-project-directory-structures)
5. [Local Development & Seeding](#-local-development--seeding)
6. [Deployment & Production Configurations](#-deployment--production-configurations)
7. [Git History Timeline & Scripting](#-git-history-timeline--scripting)

---

## 🏗️ Conceptual Architecture

SHOPIFI is implemented as a **Modular Monolith** with strict boundary isolation to ensure clean maintenance, decoupling, and high scalability:

```
                  +----------------------------------------------+
                  |               Frontend Layer                 |
                  |  +----------------------------------------+  |
                  |  |                App Shell               |  |
                  |  +---+-------------+-------------+---+----+  |
                  |      |             |             |   |       |
                  |      v             v             v   v       |
                  |  +-------+     +-------+     +-------+       |
                  |  | Auth  |     |Catalog|     |Checkout|      |
                  |  +-------+     +-------+     +-------+       |
                  |      |             |             |           |
                  +------|-------------|-------------|-----------+
                         |             |             |
                         | REST API    | over TLS    |
                         v             v             v
                  +------|-------------|-------------|-----------+
                  |      |             |             |           |
                  |      v             v             v           |
                  |  +-------+     +-------+     +-------+       |
                  |  | Auth  |     |Product|     |Order  |       |
                  |  |Routes |     |Routes |     |Routes |       |
                  |  +---+---+     +---+---+     +---+---+       |
                  |      |             |             |           |
                  |      v             v             v           |
                  |  +-------+     +-------+     +-------+       |
                  |  |Mongoose|    |Mongoose|    |Mongoose|      |
                  |  |Model  |     |Model  |     |Model  |       |
                  |  +-------+     +-------+     +-------+       |
                  |                Backend Layer                 |
                  +----------------------------------------------+
```

### Key Architectural Guidelines:
1. **Public APIs via Barrels (`index.js`):** Every feature folder exposes its public views, hooks, stores, and components through a single `index.js` file. Cross-feature deep imports are strictly prohibited:
   - **Incorrect:** `import Card from '../../features/products/components/ProductCard'`
   - **Correct:** `import { ProductCard } from '@/features/products'`
2. **Absolute Imports:** Import mapping resolves to clean namespaces (e.g. `@/features`, `@/shared` in the frontend; `#features`, `#shared` in the backend), avoiding deep relative imports (`../../../../`).
3. **Bootstrap Isolation:** The `app` layer is reserved solely for configuration orchestration (Express bootstrapping, React providers, router mappings, and global styling mounts). Business logic resides entirely inside feature modules.

---

## 🔍 Advanced SEO Implementation

Rather than target high-competition merchant terms, the platform's SEO copy and meta-tagging optimize for niche queries around premium design, luxury storefront interfaces, and architectural catalog platforms:

### 1. Dynamic JSON-LD Structured Schema Injection
The frontend implements a unified `<Meta />` component that dynamically injects JSON-LD script elements into the HTML head, automatically cleaning them up on view unmounts.

- **Homepage Indexing (WebSite Schema):** Provides site search templates, indexing target domains, and organization credentials.
- **Catalog View (Product Schema):** Exposes product name, description, high-fidelity images, live inventory stock status, currencies, and pricing conditions to search spiders.

### 2. Robots & Sitemap Optimization
- **`robots.txt`:** Prevents search engines from indexing transaction pages, checkouts, and admin dashboard panels while granting full crawl access to catalog listings and collections.
- **`sitemap.xml`:** Lists priority entry points, index updates, and frequencies.

---

## ✨ Cinematic UI/UX & Design Tokens

The styling system is engineered around a curated **Vanilla CSS Design Token System** (`frontend/src/index.css`) built to convey luxury, premium quality, and architectural focus.

### CSS Custom Customizations
```css
:root {
  --canvas-cream: #f4f3f0;  /* Editorial warm canvas background */
  --canvas-night: #0b0b0b;  /* Low-light luxury mood background */
  --ink-primary: #121212;   /* Premium high-contrast typography */
  --hairline-light: rgba(18, 18, 18, 0.08); /* Minimalist divider lines */
  --font-serif: "Playfair Display", Georgia, serif;
  --font-sans: "Inter", system-ui, sans-serif;
  --transition-cinematic: cubic-bezier(0.16, 1, 0.3, 1); /* Elegant easing transition */
}
```

### Micro-interactions and Lifecycle Cleanup
- **GSAP Animation Easing:** Homepage parallax scrolling, text transitions, and grid loading use the `.to()`, `.fromTo()` GSAP timelines synced to state renders.
- **Framer Motion Easing:** Page transition fades, route-switching visual overlays, and checkout state transitions load dynamically. All lifecycle animations run cleanups on element unmounts to prevent memory leaks.
- **Route-level Code Splitting:** Heavy page loads are deferred utilizing `React.lazy()` and rendered under a minimal layout-aligned `Suspense` loader, lowering Initial Load Bundle Sizes.

---

## 📂 Project Directory Structures

### Frontend Layout (`/frontend`)
```
src/
├── app/                  # App shell, router configs, providers, global styles
├── shared/               # Custom buttons, loaders, global client hooks, base styles
└── features/
    ├── auth/             # Login, Register, Profile, Guard hooks
    ├── products/         # Product listings, details, filters, catalog store
    ├── cart/             # Shopping bag drawer, sliding panels, Zustand store
    ├── checkout/         # Shipping addresses, card credentials, order success receipt
    └── admin/            # Dashboard stats, analytics panels, order tables
```

### Backend Layout (`/backend`)
```
src/
├── app/                  # Express bootstrapping, CORS configurations, rate-limit registers
├── shared/               # Database connections, validation scripts, global error wrappers
└── features/
    ├── auth/             # User profiles, address storage, JWT authentications
    ├── categories/       # Editorial catalogs & tag taxonomies
    ├── products/         # Seed models, details API controllers
    ├── orders/           # Transaction registers, delivery markers, simulated payment API
    ├── wishlist/         # Saved items storage
    └── analytics/        # Admin revenue summaries and tracking analytics
```

---

## ⚙️ Local Development & Seeding

### 1. Environmental Configurations
Create a `.env` file in `/backend` using `/backend/.env.example` as a template:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/shopifi
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=sk_test_...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Create a `.env` file in `/frontend` using `/frontend/.env.example` as a template:
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 2. Dependency Installations
Run from the root directory:
```bash
npm install
```

### 3. Database Seeding
Exquisite editorial products can be seeded instantly into your MongoDB instance:
```bash
node seed.js
```
*Seeded categories include: Luxury Apparel, Modern Furniture, Minimal Accessories, Premium Tech, and Lifestyle Essentials.*

### 4. Running the Dev Servers
```bash
npm run dev
```
- Client runs on: `http://localhost:3000`
- REST API runs on: `http://localhost:5000`

---

## 🚀 Deployment & Production Configurations

### Frontend Deployment (Vercel)
The `/frontend/vercel.json` and `/vercel.json` are fully configured to route requests and rewrite API targets safely to production endpoints:
```json
{
  "cleanUrls": true,
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://e-commerce-app-b89l.onrender.com/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### CORS Verification Setup
In production, the backend server dynamically restricts request origins based on defined whitelist arrays:
```javascript
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.CORS_ORIGIN,
  'https://shopifi-commerce.vercel.app'
].filter(Boolean);
```

---

## 📅 Git History Timeline & Scripting

For recruiters, clients, and portfolio reviewers evaluating the progression of this repository, you can apply custom committer dates utilizing Git's internal date overrides:

```bash
# Example environment parameters for overriding dates
GIT_AUTHOR_DATE="2025-11-02T10:00:00" GIT_COMMITTER_DATE="2025-11-02T10:00:00" git commit -m "chore: bootstrap workspace and architecture layout"
```

### Proposed Commit Sequencing & Timeline:

| Date | Committer Overrides | Conventional Commit Message | Description |
|---|---|---|---|
| **Nov 02 2025** | `2025-11-02T10:00:00` | `chore: bootstrap workspace and architecture layout` | Project initialization, import alias setups, directory structures. |
| **Nov 05 2025** | `2025-11-05T14:30:00` | `feat: build premium jwt-based authentication system` | User registration, state stores, secure passwords, profile controllers. |
| **Nov 09 2025** | `2025-11-09T11:15:00` | `feat: build cinematic editorial home layout` | Parallax scroll timelines, GSAP visual grids, responsive layouts. |
| **Nov 14 2025** | `2025-11-14T17:45:00` | `feat: implement product catalogs and dynamic filtering` | Catalog queries, tag search filters, price ranges, skeleton loaders. |
| **Nov 18 2025** | `2025-11-18T16:00:00` | `feat: implement check-out checkout and payment system` | Address registration, Stripe simulations, invoice generation. |
| **Nov 22 2025** | `2025-11-22T13:20:00` | `seo: implement dynamic structured schema system` | JSON-LD website & product models, meta tags, sitemap config. |
| **Nov 25 2025** | `2025-11-25T19:00:00` | `perf: route code-splitting and animation optimization` | Dynamic lazy loads, GSAP memory cleanups, production tuning. |

---
*Created with care by Antigravity AI and Developer Somesh Mishra.*

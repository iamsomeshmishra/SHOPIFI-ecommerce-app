# Implementation Plan - Enterprise Refinements

We will implement the final enterprise architecture refinements to ensure clean boundaries, strict encapsulation via Public APIs, absolute path imports, and normalized API layers.

---

## User Review Required

Please review the path alias mappings and directory layout changes:

> [!IMPORTANT]
> **Node.js ESM Path Aliasing Limitation**
> Node.js ES Modules (`"type": "module"`) natively enforce that all custom subpath imports in `package.json` must start with a `#` character. Therefore:
> - **Frontend** will use the `@/*` alias mapped to `src/*` (e.g., `@/features`, `@/shared`, `@/app`).
> - **Backend** will use the `#/*` alias mapped to `src/*` (e.g., `#features`, `#shared`, `#app`) utilizing native Node.js ESM subpath imports.
> 
> **Public API Encapsulation**
> Every feature will have a single entry `index.js` (barrel file). Cross-feature imports must only use the public entry point. Direct deep imports into another feature's subfolders are strictly forbidden.

---

## Proposed Structural Layout

### 1. Frontend Absolute Imports Configuration
We will configure `frontend/vite.config.js` and `frontend/jsconfig.json` with the following alias:
- `@/*` -> `src/*`

### 2. Backend Absolute Imports Configuration
We will configure `backend/package.json` with the native subpath import mapping:
```json
"imports": {
  "#app/*": "./src/app/*",
  "#features/*": "./src/features/*",
  "#shared/*": "./src/shared/*"
}
```

### 3. Public API Mappings (Example)

#### Products Feature Public API (`frontend/src/features/products/index.js`)
```javascript
export { default as ProductCard } from './components/ProductCard';
export { default as Products } from './pages/Products';
export { default as ProductDetail } from './pages/ProductDetail';
export { useProductApi } from './api';
```

---

## Refactoring Roadmap

1. **Vite & Package Config**: Update `vite.config.js` and `backend/package.json` with the absolute import settings.
2. **Directory Relocation**: Create folders and move files matching the domain-driven target layout.
3. **API Standardization**: Create `frontend/src/features/shared/api/axiosClient.js` with base configurations, response/error interceptors, and JWT headers.
4. **Code Rewrite & Import Wiring**: Update all import headers to use absolute paths (`@/` and `#/`) and public barrel exports.
5. **Database Seeding Update**: Modify `seed.js` to import models from the `#features/...` subpaths.
6. **Validation & Verification**: Compile the code and run local verification tests.
7. **Legacy Cleanup**: Delete all legacy folder paths.

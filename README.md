# Omni Store

![Development demo](https://img.shields.io/badge/status-development%20demo-orange)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-12-E0234E?logo=nestjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%209-47A248?logo=mongodb&logoColor=white)

Omni Store is a full-stack, multi-branch e-commerce demo. It combines a React storefront with a NestJS API backed by MongoDB, including product catalog management, branch inventory, authenticated carts and wishlists, and an admin dashboard.

**Status:** Functional development demo; not ready for production transactions. Checkout does not create orders or process payments.

## Features

### Storefront and catalog

- Browse, search, sort, filter, and paginate the API-backed product catalog.
- View product availability for the selected branch.
- The home page's featured-products row uses the backend catalog. Category tiles and the spotlight section still use local demo data and image URLs.

### Cart, wishlist, and profile

- Authenticated users can manage carts and wishlists through the API.
- Profile changes and saved addresses use the backend.
- Theme, avatar selection, and payment-method metadata are stored in browser `localStorage`; they are not server-side payment or media services.

### Product images and administration

- Admins can create, edit, and delete products, including branch stock.
- Admins can upload one JPEG, PNG, or WebP product image up to 5 MB. The backend validates the image signature, saves files under `uploads/products` relative to its working directory, and serves them under `/uploads`.
- Admins can view registered users and their roles. Role changes and account blocking are not available in the dashboard.
- Admins can list orders and update their status. The dashboard and sales summary depend on orders actually existing in the database.

### Authentication and security

- Registration creates customer accounts; JWTs are used for authenticated API requests.
- Passwords are hashed with `bcryptjs`; admin-only endpoints use role checks.
- Do not use shared demo passwords or grant admin access broadly outside local testing.

## Tech stack

| Area | Libraries and versions |
| --- | --- |
| Frontend | React `^19.3.1`, React Router `^7.18.5`, Vite `^8.3.4`, Tailwind CSS `^4.3.3`, Lucide React `^1.65.0` |
| Backend | NestJS `^12.0.1`, TypeScript `^6.0.2`, Express platform adapter |
| Database | MongoDB through Mongoose `^9.12.2` and `@nestjs/mongoose` |
| Authentication | Passport, `passport-jwt`, `@nestjs/jwt`, and `bcryptjs` |
| Validation and uploads | `class-validator`, `class-transformer`, NestJS `FileInterceptor`/Multer |
| Tests and lint | Jest, Supertest, ESLint, Oxlint |
| Observability | `@nestjs/observe` (optional credentials) |

## Architecture

```text
.
├── backend/
│   ├── src/
│   │   ├── admin/       # Admin dashboard and order endpoints
│   │   ├── auth/        # Registration, login, JWT strategy, role guard
│   │   ├── carts/       # Authenticated cart API
│   │   ├── orders/      # Order schema (no order-creation endpoint yet)
│   │   ├── products/    # Catalog API, product image uploads
│   │   ├── reviews/     # Review schema; no review API module yet
│   │   ├── users/       # Profiles, addresses, admin user listing
│   │   ├── wishlist/    # Authenticated wishlist API
│   │   ├── app.module.ts
│   │   └── main.ts      # HTTP setup, validation, static uploads
│   ├── test/            # E2E tests
│   ├── .env.example
│   └── package.json
├── src/
│   ├── components/      # Storefront, product, cart, and layout UI
│   ├── context/         # Auth-dependent cart, wishlist, branch, theme, toast state
│   ├── dashboard/       # Admin overview, product, order, and user screens
│   ├── data/            # Branch settings and remaining demo/home data
│   ├── layouts/         # Store, authentication, and dashboard layouts
│   ├── pages/           # Store routes and pages
│   ├── services/        # API clients and product adapters
│   ├── utility/         # Form validation and image helpers
│   ├── App.jsx           # Client-side routes
│   └── main.jsx          # React providers and application bootstrap
├── public/               # Static frontend assets
├── package.json          # Frontend scripts and dependencies
└── vite.config.js
```

### API overview

The API has no global prefix; routes are relative to the backend origin.

| Area | Routes | Access |
| --- | --- | --- |
| Auth | `POST /auth/register`, `POST /auth/login`, `POST /auth/logout` | Register/login are public; logout requires a JWT |
| Products | `GET /products`, `GET /products/:id` | Public |
| Product administration | `POST /products`, `PATCH /products/:id`, `DELETE /products/:id`, `POST /products/images` | Admin JWT |
| Users | `GET /users`, `GET /users/me`, `PATCH /users/me`, `/users/me/addresses` | User JWT; listing users requires admin |
| Cart | `GET /cart`, `POST /cart/items`, `PATCH /cart/items/:productId`, `DELETE /cart/items/:productId`, `DELETE /cart` | User JWT |
| Wishlist | `GET /users/me/wishlist`, `POST /users/me/wishlist/items`, `DELETE /users/me/wishlist/items/:productId` | User JWT |
| Admin | `GET /admin/orders`, `PATCH /admin/orders/:id/status`, `GET /admin/dashboard/summary`, `GET /admin/dashboard/sales` | Admin JWT |

## Getting started

### Prerequisites

- The locked backend tooling supports Node.js **22.22.3+ within 22.x**, **24.15+ within 24.x**, or **26+**. Node.js **24.15** was used for this workspace.
- npm (included with Node.js).
- A running MongoDB instance, local or hosted, and a connection URI.

### Install

From the repository root:

```bash
git clone https://github.com/Allaith-lio/Store.git
cd Store
npm install
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env` with a valid MongoDB URI and a private JWT secret (see [Environment variables](#environment-variables)). The checked-in example contains placeholders and is not ready to run unchanged.

Run the backend and frontend in separate terminals:

```bash
# Terminal 1: from backend/
npm run start:dev
```

```bash
# Terminal 2: from the repository root
npm run dev
```

By default, the API listens on `http://localhost:3000` and Vite serves the frontend on its development port (normally `http://localhost:5173`).

### Build and test

Frontend commands, from the repository root:

```bash
npm run build
npm run lint
```

Backend commands, from `backend/`:

```bash
npm run build
npm run test
npm run test:e2e -- --runInBand
npm run lint
```

The backend e2e suite is in `backend/test/`. The repository does not define a root-level test script.

## Environment variables

| Variable | Required | Purpose | Safe example |
| --- | --- | --- | --- |
| `MONGODB_URI` | Yes | MongoDB connection used by Mongoose | `mongodb://127.0.0.1:27017/store` |
| `JWT_SECRET` | Yes | Signs and verifies access tokens | `replace-with-a-long-random-secret` |
| `PORT` | No | Backend listen port; defaults to `3000` | `3000` |
| `VITE_API_URL` | No | Frontend API origin; defaults to `http://localhost:3000` | `http://localhost:3000` |
| `OBSERVE_APP_KEY` | No | Nest Observe telemetry key | `your-observe-app-key` |
| `OBSERVE_APP_SECRET` | No | Nest Observe telemetry secret | `your-observe-app-secret` |

`MONGODB_URI`, `JWT_SECRET`, `PORT`, and the Observe variables belong in `backend/.env`. Put `VITE_API_URL` in a root `.env.local` if the API is not at the default URL. Keep real secrets in ignored local environment files or a deployment secret manager; never commit them.

## Database setup and seeding

- MongoDB is connected at application startup through Mongoose. There are no migration or seed scripts in this repository.
- Registration (`POST /auth/register`) creates a user with the `customer` role. There is no admin-creation screen or bundled default admin account.
- For local development, register a trusted account first, then promote only that account in the local database:

```bash
mongosh "mongodb://127.0.0.1:27017/store" --eval 'db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })'
```

- Sign in as that account and add products through `/dashboard/products`. Product records are stored in MongoDB; uploaded image files are stored on the backend filesystem in `uploads/products`.
- No test credentials or seeded users are defined in the repository. Any data already present in a developer's local database is not reproducible from a clean clone.
- The local filesystem upload directory must be persistent and writable. For deployments, mount a persistent volume or move media storage to an object-storage service.

## Known limitations and roadmap

### Implemented

- [x] API-backed catalog, branch stock, cart, and wishlist.
- [x] JWT authentication, customer/admin roles, and admin-only product/image routes.
- [x] Product image upload and static serving.
- [x] Admin order listing/status updates and user listing.
- [x] User profile and address API operations.

### Production work remaining

- [ ] Implement order creation, inventory reservation/decrement, and customer order history.
- [ ] Integrate a payment provider; payment-method UI is not payment processing.
- [ ] Restrict admin privileges to trusted accounts and add safe role-management procedures.
- [ ] Replace remaining static home category/spotlight content and demo product data with API-backed data.
- [ ] Add password reset, account blocking controls, and a review API if those features are required.
- [ ] Use durable, scalable media storage and configure backups, monitoring, and deployment secrets.
- [ ] Complete end-to-end testing against the production-like deployment environment.

## Team and contributors

| Name | Role |
| --- | --- |
| **Allaith** | Technical Team Lead |
| **Ziena** | Team Member / Developer |
| **Jawa** | Team Member / Developer |
| **Zaid** | Team Member / Developer |
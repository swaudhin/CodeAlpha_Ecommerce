# CodeAlpha_Ecommerce

A full-stack e-commerce store built for the CodeAlpha Full Stack Development internship (Task 1).

## Stack
- **Frontend:** React 18 + Vite, React Router, Axios
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT auth, bcrypt

## Features
- Product listing with search, category filter, pagination
- Product detail page
- Shopping cart (persisted in localStorage)
- User registration / login (JWT)
- Checkout → order creation with stock deduction
- Order history + order detail view
- Admin dashboard: add/edit/delete products, view all orders, update order status

## Project structure
```
CodeAlpha_Ecommerce/
  backend/     Express API (models, routes, middleware)
  frontend/    React app (Vite)
```

## Running locally

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env      # then edit MONGO_URI / JWT_SECRET if needed
npm run seed               # optional: loads sample products + admin user
npm run dev                 # starts on http://localhost:5000
```
You need a MongoDB instance — either install MongoDB locally, or use a free
[MongoDB Atlas](https://www.mongodb.com/atlas) cluster and paste its connection
string into `MONGO_URI`.

Seeded admin login: `admin@codealpha.com` / `admin123`

### 2. Frontend
```bash
cd frontend
npm install
cp .env.example .env       # VITE_API_URL, defaults to http://localhost:5000/api
npm run dev                 # starts on http://localhost:5173
```

## Deployment
- **Backend:** deploy to Render / Railway / Cyclic / a VPS. Set env vars
  `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (your deployed frontend URL) in the
  host's dashboard.
- **Frontend:** `npm run build` produces a `dist/` folder — deploy to Vercel,
  Netlify, or GitHub Pages. Set `VITE_API_URL` to your deployed backend URL
  (e.g. `https://your-backend.onrender.com/api`).
- **Database:** MongoDB Atlas free tier works well for a deployed demo.

## API overview
| Method | Route | Description | Auth |
|---|---|---|---|
| POST | /api/auth/register | Create account | — |
| POST | /api/auth/login | Login, get JWT | — |
| GET | /api/auth/me | Current user | user |
| GET | /api/products | List/search/filter products | — |
| GET | /api/products/:id | Product detail | — |
| POST/PUT/DELETE | /api/products/:id | Manage products | admin |
| POST | /api/orders | Place an order | user |
| GET | /api/orders/my | My order history | user |
| GET | /api/orders/:id | Order detail | user/admin |
| GET | /api/orders | All orders | admin |
| PUT | /api/orders/:id/status | Update order status | admin |

## Notes for submission
Rename nothing — this repo is already named `CodeAlpha_ProjectName` style
(`CodeAlpha_Ecommerce`) as required by the internship instructions. Push it to
GitHub as-is, record your walkthrough video, and submit the repo link.

# ChargEase — Full Stack Corporate Website

A premium, production-ready corporate website with dynamic CMS.

## Project Structure

```
chargeees/
├── backend/       ← Express.js API + MongoDB
└── frontend/      ← Next.js 15 App + Admin CMS
```

---

## Quick Start

### 1. Backend

```bash
cd backend
cp .env.example .env   # fill in your credentials
npm install
npm run seed           # seed the database with sample data
npm run dev            # starts on http://localhost:5000
```

**Admin Credentials (after seed):**
- Email: ``admin@chargeease.com
- Password: `Admin@1234`

### 2. Frontend

```bash
cd frontend
# .env.local is pre-configured for local dev
npm install
npm run dev            # starts on http://localhost:3000
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `CLOUDINARY_*` | Cloudinary API credentials |
| `SMTP_*` | Email (Gmail/SMTP) credentials |
| `COMPANY_EMAIL` | Email that receives inquiries |
| `FRONTEND_URL` | Frontend URL for CORS |

### Frontend (`frontend/.env.local`)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL |
| `NEXT_PUBLIC_SITE_URL` | Frontend site URL |

---

## API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/health` | GET | — | Health check |
| `/api/auth/login` | POST | — | Admin login |
| `/api/auth/forgot-password` | POST | — | Password reset email |
| `/api/auth/reset-password/:token` | POST | — | Reset with token |
| `/api/sections/hero` | GET/PUT | PUT: Admin | Hero content |
| `/api/sections/about` | GET/PUT | PUT: Admin | About content |
| `/api/sections/vision` | GET/PUT | PUT: Admin | Vision content |
| `/api/sections/mission` | GET/PUT | PUT: Admin | Mission content |
| `/api/founders` | GET/POST | POST: Admin | Founders |
| `/api/founders/:id` | GET/PUT/DELETE | PUT/DELETE: Admin | Single founder |
| `/api/projects` | GET/POST | POST: Admin | Projects |
| `/api/projects/:id` | GET/PUT/DELETE | Admin | Single project |
| `/api/projects/:id/gallery` | POST | Admin | Add to project gallery |
| `/api/services` | GET/POST | POST: Admin | Services |
| `/api/gallery` | GET/POST | POST: Admin | Gallery items |
| `/api/inquiries` | POST | — | Submit inquiry |
| `/api/inquiries` | GET | Admin | List inquiries |
| `/api/inquiries/:id/reply` | POST | Admin | Reply to inquiry |
| `/api/inquiries/export` | GET | Admin | Export CSV |
| `/api/settings` | GET/PUT | PUT: Admin | Site settings |
| `/api/settings/dashboard` | GET | Admin | Dashboard stats |

---

## Tech Stack

### Frontend
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- GSAP
- Lenis Smooth Scroll
- Three.js particles
- Lucide Icons

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary (media)
- Nodemailer (email)
- Helmet, Rate-limiting, CORS

---

## Features

### Public Website
- ✅ Hero with particle animation
- ✅ About with timeline
- ✅ Vision with parallax
- ✅ Mission with commitments
- ✅ Founder & Co-Founder profiles
- ✅ Projects with search/filter/modal
- ✅ Services with hover animations
- ✅ Gallery with masonry/lightbox
- ✅ Inquiry form with email notifications
- ✅ Contact with animated counters + map
- ✅ Premium footer

### Admin CMS
- ✅ JWT Auth (login/logout/reset password)
- ✅ Dashboard with stats
- ✅ Edit all sections
- ✅ Manage projects, services, gallery
- ✅ View/reply/export inquiries
- ✅ Site settings + SEO

---

## Deployment

### Backend (Railway / Render)
1. Set environment variables in dashboard
2. Deploy from GitHub

### Frontend (Vercel)
1. Connect GitHub repository
2. Set `NEXT_PUBLIC_API_URL` to your backend URL
3. Deploy

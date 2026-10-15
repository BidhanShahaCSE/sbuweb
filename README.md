# sbuweb: Minimal Authentication Module

A clean, minimal, professional authentication module for sbuweb with independent **Backend** (Node.js + Express + TypeScript + Zod) and **Frontend** (Next.js + TypeScript + Tailwind CSS).

---

## 📁 Project Structure

```text
sbuweb/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── auth.routes.ts
│   │   ├── schemas/
│   │   │   └── auth.schema.ts
│   │   └── app.ts
│   ├── migrations/
│   │   └── 001_auth_tables.sql
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── page.tsx
│   │       ├── layout.tsx
│   │       └── globals.css
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── postcss.config.mjs
│   ├── next.config.mjs
│   └── tsconfig.json
│
├── .gitignore
└── README.md
```

---

## 🔒 Current Status & Design Rules

- **Decoupled Architecture:** Frontend and backend are completely separate and independent.
- **No Active Database / Supabase Connection:** Neither backend nor frontend connects to a live database or Supabase instance yet.
- **Safe 503 Fallback:** All authentication and profile endpoints respond with `503 NOT_CONFIGURED`.
- **Zero Mock Data:** No fake authentication, tokens, or mock sessions are implemented.
- **Single Page UI:** The frontend provides a single, responsive authentication page supporting Client Login, Client Registration, and Owner Login.

---

## 🛠 Backend API Routes

| Method | Endpoint | Description | Status |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/client/register` | Client registration with Zod validation | `503 NOT_CONFIGURED` |
| `POST` | `/api/v1/auth/client/login` | Client email/password login | `503 NOT_CONFIGURED` |
| `POST` | `/api/v1/auth/owner/login` | Owner company login | `503 NOT_CONFIGURED` |
| `GET` | `/api/v1/client/profile` | Client profile retrieval | `503 NOT_CONFIGURED` |
| `PATCH` | `/api/v1/client/profile` | Client profile update | `503 NOT_CONFIGURED` |
| `GET` | `/api/v1/health` | Service health check | `200 OK` |

---

## 🗄 Database Schema (`001_auth_tables.sql`)

- **`public.client_profiles`**: Linked 1:1 to `auth.users(id)` for registered clients (full name, country, whatsapp number, timestamps).
- **`public.owner_accounts`**: Company-provisioned administrative accounts (`user_id`, `is_active`, `created_at`). Public registration is blocked via Row Level Security (RLS).

---

## 🚀 Running the Projects

### Backend
```bash
cd backend
npm install
npm run build     # Verify TypeScript compilation
npm run dev       # Start development server on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run build     # Build production bundle
npm run dev       # Start development server on http://localhost:3000
```

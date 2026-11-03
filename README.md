# sbuweb: Minimal Authentication Module

A clean, minimal, and decoupled authentication foundation for sbuweb with independent **Backend** (Node.js + Express + TypeScript + Zod) and **Frontend** (Next.js App Router + TypeScript + Tailwind CSS).

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

## 🔒 Current Design Rules

- **Strict Decoupling:** Frontend and backend remain independent with zero network coupling.
- **No Database Connection:** Neither Supabase nor PostgreSQL is connected in this phase.
- **No Fake Authentication:** No mock tokens, sessions, or hardcoded credentials.
- **Safe 503 Fallback:** All authentication endpoints return a clean `503 NOT_CONFIGURED` response.
- **Single Page UI:** A single responsive authentication page with Client Login, Client Registration, and Owner Login. When submitted with valid data, the form displays a notice stating that authentication is not configured yet.

---

## 🛠 Backend API Routes

Mounted under `/api/v1`:

| Method | Endpoint | Description | Status |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/client/register` | Client registration validation | `503 NOT_CONFIGURED` |
| `POST` | `/api/v1/auth/client/login` | Client login validation | `503 NOT_CONFIGURED` |
| `POST` | `/api/v1/auth/owner/login` | Owner login validation | `503 NOT_CONFIGURED` |
| `GET` | `/api/v1/client/profile` | Client profile retrieval | `503 NOT_CONFIGURED` |
| `PATCH` | `/api/v1/client/profile` | Client profile update | `503 NOT_CONFIGURED` |
| `GET` | `/api/v1/health` | Server health check | `200 OK` |

---

## 🚀 Running the Projects

### Backend
```bash
cd backend
npm install
npm run build     # Compile TypeScript
npm run dev       # Start development server on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run build     # Build production bundle
npm run dev       # Start development server on http://localhost:3000
```

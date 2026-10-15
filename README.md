# sbuweb: Authentication & Profile Management Foundation

A professional company website foundation featuring completely decoupled **Backend** (Express + TypeScript + Zod) and **Frontend** (Next.js App Router + Tailwind CSS) authentication modules, prepared for future PostgreSQL / Supabase integration.

---

## 🏗 System Architecture & Separation

The repository is organized into strictly independent directories:

```
sbuweb/
├── backend/                  # Node.js + Express + TypeScript API
│   ├── migrations/           # Supabase/PostgreSQL schema & RLS policies
│   │   ├── 001_initial_schema.sql
│   │   └── 002_rls_policies.sql
│   ├── src/
│   │   ├── config/           # Environment configuration
│   │   ├── controllers/      # Route controllers (ClientAuth, OwnerAuth, ClientProfile)
│   │   ├── errors/           # AppError, ServiceUnavailableError, ValidationError
│   │   ├── middlewares/      # Zod validation, Auth guard, Owner check, Central error handler
│   │   ├── repositories/     # Interfaces and unconfigured implementations
│   │   ├── routes/           # Express router endpoints
│   │   ├── schemas/          # Zod validation schemas
│   │   ├── scripts/          # Server-only owner provisioning script template
│   │   ├── services/         # Business logic layer
│   │   ├── types/            # TypeScript domain types
│   │   ├── app.ts            # Express app assembly
│   │   └── server.ts         # Server HTTP listener
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── frontend/                 # Next.js 14 App Router + Tailwind CSS UI
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css   # Tailwind directives & theme
│   │   │   ├── layout.tsx    # Root layout
│   │   │   └── page.tsx      # EXACTLY ONE UI page: Authentication Portal
│   │   ├── components/ui/    # Reusable FormInput, PasswordInput, TabSelector, NoticeBanner
│   │   └── types/            # Form data and validation interfaces
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.ts
│   └── tsconfig.json
└── docs/                     # Specifications and architectural blueprints
    ├── api-contract.md       # Full HTTP endpoints, payloads, and error codes
    └── database-design.md    # Schema, RLS policies, and provisioning flows
```

---

## 🔒 Architectural Isolation & Safety Guarantees

1. **Zero Database / Supabase Connection:** Neither backend nor frontend connects to Supabase, external databases, or third-party auth services.
2. **Zero Frontend/Backend Coupling:** The frontend does not make network calls or Axios/Fetch requests to the backend.
3. **No Fake Authentication:** No mock tokens, simulated logins, in-memory credential storage, or pseudo-success states exist.
4. **Clean 503 Fallback:** When endpoints requiring database access or token verification are called, the backend responds with a clear `503 SERVICE_UNAVAILABLE` error indicating that integration is pending.
5. **Clear Decoupling Notice:** The frontend page validates form inputs locally and shows a clear banner notifying the user that authentication is awaiting integration.
6. **Privilege Boundary Defense:** Clients cannot register as owners. Owner accounts are managed solely server-side and protected by database Row Level Security.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node.js v24)
- npm 9+

---

### Backend Setup & Build

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment configuration:
   ```bash
   cp .env.example .env
   ```

4. Build the TypeScript project (verifies types without Supabase):
   ```bash
   npm run build
   ```

5. Run in development mode:
   ```bash
   npm run dev
   ```
   The backend server runs on `http://localhost:5000` with the health check available at `http://localhost:5000/api/v1/health`.

---

### Frontend Setup & Build

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the Next.js production bundle:
   ```bash
   npm run build
   ```

4. Run development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser to view the Authentication Portal.

---

## 🔌 Instructions for Connecting Supabase Later

When you are ready to enable real authentication and persistence:

### Step 1: Run SQL Migrations in Supabase
In your Supabase project dashboard, navigate to the **SQL Editor** and run:
1. `backend/migrations/001_initial_schema.sql` (Creates `client_profiles` and `owner_accounts`)
2. `backend/migrations/002_rls_policies.sql` (Applies Row Level Security policies)

### Step 2: Configure Backend Environment
Install the official client in `backend`:
```bash
npm install @supabase/supabase-js
```
Update `backend/.env`:
```env
SUPABASE_URL=https://<your-project-id>.supabase.co
SUPABASE_ANON_KEY=<your-anon-public-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-admin-key>
```
Swap out the classes in `backend/src/repositories/unconfiguredRepositories.ts` with real implementations calling `@supabase/supabase-js`.

### Step 3: Provision Company Owners
Execute the secure administrative provisioning script with administrative environment variables:
```bash
$env:OWNER_EMAIL="admin@company.com"
$env:OWNER_PASSWORD="SecureTempPassword123!"
$env:RUN_PROVISION_SCRIPT="true"
npx tsx src/scripts/provision-owner.ts
```

### Step 4: Connect Frontend to Backend (Future Phase)
Set `NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1` in `frontend/.env.local` and connect form actions to the documented endpoints in `docs/api-contract.md`.

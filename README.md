# Blips

A full-stack social network where users share short posts ("blips") with text and images, comment on each other's posts, and browse top news headlines.

**Live:** https://blips-steel.vercel.app &nbsp;|&nbsp; **API:** https://blips-api-ayvb.onrender.com

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black&style=flat-square)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white&style=flat-square)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white&style=flat-square)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql&logoColor=white&style=flat-square)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white&style=flat-square)
![Cloudflare R2](https://img.shields.io/badge/Cloudflare-R2-F38020?logo=cloudflare&logoColor=white&style=flat-square)
![Vercel](https://img.shields.io/badge/Vercel-frontend-000000?logo=vercel&logoColor=white&style=flat-square)
![Render](https://img.shields.io/badge/Render-backend-46E3B7?logo=render&logoColor=white&style=flat-square)

---

## Features

- **Auth** — register, login, logout with JWT cookies; session restored on page load
- **Blips** — create, edit, delete posts with optional image upload
- **Comments** — add, edit, delete comments on any blip
- **Profiles** — view your own profile or any user's public profile; upload avatar
- **News banner** — top US headlines shown on the home page (non-critical, fails silently)

---

## Local Development

### Prerequisites

- Node.js 18+
- Python 3.9+ (seed script only)
- A [Neon](https://neon.tech) PostgreSQL database
- A [Cloudflare R2](https://developers.cloudflare.com/r2/) bucket with public access enabled
- A [GNews](https://gnews.io) API key

### Backend

1. Create `api/.env`:
   ```
   DATABASE_URL=postgresql://<user>:<password>@<host>/neondb?sslmode=require&pgbouncer=true
   DIRECT_URL=postgresql://<user>:<password>@<host>/neondb?sslmode=require
   JWT_SECRET=<your-secret>
   CLIENT_URL=http://localhost:3000
   R2_ACCOUNT_ID=<cloudflare-account-id>
   R2_ACCESS_KEY_ID=<r2-access-key>
   R2_SECRET_ACCESS_KEY=<r2-secret-key>
   R2_BUCKET_NAME=<bucket-name>
   R2_PUBLIC_URL=https://pub-<id>.r2.dev
   NEWS_API_KEY=<gnews-api-key>
   ```

2. Install and migrate:
   ```bash
   cd api
   npm install
   npx prisma migrate deploy
   ```

3. Start:
   ```bash
   npm run dev        # node --watch
   # or
   npm start          # production
   ```

### Frontend

1. Create `client/.env`:
   ```
   REACT_APP_API_URL=http://localhost:8080
   ```

2. Install and start:
   ```bash
   cd client
   npm install
   npm start
   ```

### Seed Data

Populates 4 users, 8 blips (3 with images from R2), and 6 comments:

```bash
cd scripts
pip install -r requirements.txt
python seed.py
```

The script reads credentials from `api/.env` and is idempotent on user emails.

---

## Deployment

| Service | Config |
|---|---|
| **Render** (API) | Build: `npm install && npx prisma generate && npx prisma migrate deploy` · Start: `npm start` |
| **Vercel** (client) | Build: `CI=false react-scripts build` · Output: `build/` |
| **Neon** (DB) | Set `DATABASE_URL` (pooler URL) and `DIRECT_URL` in Render env vars |

Set all `api/.env` variables as environment variables in Render. Set `REACT_APP_API_URL` (no trailing slash) in Vercel.


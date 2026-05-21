# TalentTurbo — Self-Hosted React App

A fully portable, self-hostable recruitment platform built with React + Vite.

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# URL of your own backend API (see "Backend" section below)
VITE_API_BASE_URL=http://localhost:4000/api
```

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Build for Production

```bash
npm run build
```

The output is in the `dist/` folder — a fully static site you can serve from any web host.

### Preview the production build locally

```bash
npm run preview
```

---

## Deploy

### Option A — Static host (Netlify, Vercel, Cloudflare Pages)

Upload or push the `dist/` folder. Set `VITE_API_BASE_URL` as a build environment variable pointing at your backend.

### Option B — VPS / own server (nginx)

```bash
npm run build
# Copy dist/ to your server
scp -r dist/ user@yourserver.com:/var/www/talentturbo/
```

Nginx config example:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/talentturbo;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;  # SPA fallback
    }

    location /api/ {
        proxy_pass http://localhost:4000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Option C — Docker

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

---

## Backend

The frontend calls a REST API at `VITE_API_BASE_URL`. You need to implement (or adapt) the following endpoints on your own server:

### Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | `{ email, password }` → `{ token, user }` |
| GET | `/api/auth/me` | Returns current user (Bearer token required) |
| PATCH | `/api/auth/me` | Update current user profile |

### Entities (generic CRUD)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/entities/:name` | List / filter records (`?sort=&limit=`) |
| GET | `/api/entities/:name/:id` | Get single record |
| POST | `/api/entities/:name` | Create record |
| POST | `/api/entities/:name/bulk` | Bulk create |
| PATCH | `/api/entities/:name/:id` | Update record |
| DELETE | `/api/entities/:name/:id` | Delete record |

Entity names used by this app: `Job`, `Application`, `SavedJob`, `JobAlert`, `Notification`, `User`

### Integrations (optional)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/integrations/llm` | Proxy to OpenAI / Claude for cover-letter AI |
| POST | `/api/integrations/email` | Send transactional email (Resend, SendGrid, etc.) |
| POST | `/api/integrations/upload` | File upload → returns `{ file_url }` |

### Functions
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/functions/checkJobAlerts` | Job alert matching — run on a daily cron |

### Users
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/users/invite` | Invite a user `{ email, role }` |

### Real-time (optional)
| Path | Description |
|------|-------------|
| `GET /api/events/:entityName` | SSE stream for real-time entity updates |

> A reference Node.js/Express backend scaffold is in `server/` (see below).

---

## Logo

Place your logo image at `public/logo.png`. It is referenced as `/logo.png` in the Navbar and Footer.

---

## External URLs still referenced

| Where | URL | Notes |
|-------|-----|-------|
| `index.css` | `fonts.googleapis.com` | Syne + Inter fonts. Self-host via `fontsource` if needed |
| `components/home/HeroSection.jsx` | Unsplash (none) | No external images |
| Job email in `checkJobAlerts` | `https://talentturbo.us` | Update to your own domain in `functions/checkJobAlerts.js` |

---

## Removed Base44 dependencies

- `@base44/sdk` package removed from imports — replaced by `api/client.js`
- `lib/app-params.js` — stripped of all Base44 URL param / localStorage logic
- `lib/AuthContext.jsx` — no longer calls Base44 auth APIs
- `lib/PageNotFound.jsx` — removed Base44 admin-note
- Navbar / Footer logos — changed from `media.base44.com` CDN to `/logo.png`
- `api/base44Client.js` — now re-exports the portable client
- `functions/checkJobAlerts.js` — remains as a backend function (adapt to your own server runtime)

---

## Tech Stack

- **React 18** + **Vite**
- **Tailwind CSS** + custom design tokens
- **shadcn/ui** component library
- **TanStack Query** for data fetching
- **Framer Motion** for animations
- **React Router v6** for routing
- **Lucide React** for icons
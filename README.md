# BayanLink MERN Platform

BayanLink is a MERN municipal citizen engagement platform scaffold. This repository keeps the original template modules for municipalities and news feeds, then extends them with role-based portals, secure authentication, scoped data access, audit logging, and production-oriented API patterns.

## Overview ng BayanLink System

Ang BayanLink ay isang integrated at modular digital system na pinagsasama-sama ang iba't ibang serbisyo ng Local Government Unit (LGU) sa iisang platform. Layunin nitong mabawasan ang manual processing, mapabilis ang serbisyo, at mapataas ang transparency at convenience para sa mga mamamayan ng Aliaga.

## Mga Pangunahing Bahagi ng Sistema

- Citizen Portal: registration, login, at personal dashboard para sa mga mamamayan.
- Online Document Request System: online request ng Barangay Clearance, Business Permit, at iba pang certifications.
- Request Tracking System: unique tracking number para ma-monitor ang status ng requests.
- Appointment System: online booking upang maiwasan ang pila.
- Online Payment Integration: online payment para sa permits at service fees.
- Complaint and Reporting System: pag-report ng community issues na may larawan at location.
- Announcement System / Mayor's News Feed: official updates, advisories, at announcements mula sa LGU at Mayor.
- Driver Profile and TODA Communication System: digital registry at QR verification ng tricycle drivers.
- Safety / SOS Feature: emergency button para sa agarang paghingi ng tulong.
- Admin Dashboard: management ng requests at data ng LGU staff.
- Analytics Dashboard: reports at statistics para sa mas mahusay na decision-making.

## Karagdagang Features

- Chatbot para sa basic inquiries.
- Mobile-friendly system.
- QR Code verification.
- Map/GIS feature para sa location-based services.

## Feature Placement by Portal

Citizen Portal:

- Announcements / Mayor's News Feed
- Online Document Requests
- Request Tracking
- Appointment Booking
- Online Payments
- Complaints and Reports with photo/location
- Safety SOS
- Driver and TODA QR verification
- Chatbot and basic inquiries

Barangay Portal:

- Barangay-specific announcements
- Resident verification
- Barangay-level request review
- Complaint review
- Map/location report review
- QR verification support

Municipal Admin Portal:

- Municipality-wide announcements and Mayor's News Feed
- Document request management
- Request tracking and approvals
- Appointment management
- Payment reconciliation
- Complaints and report monitoring
- Driver and TODA registry
- Safety/SOS monitoring
- Analytics dashboard
- Map/GIS operations

Super Admin Portal:

- Municipality records only
- Municipal Admin assignment
- Municipality audit logs
- Security controls for protected Super Admin actions

Super Admin remains intentionally limited. It must not manage citizen records, complaints, requests, barangay operations, or news content directly.

## Layunin ng Kahilingan

- Technical Consultation: maunawaan ang kasalukuyang daloy ng serbisyo ng LGU.
- System Alignment: masigurong akma ang system sa policies at proseso.
- Data Validation: masiguro ang tamang impormasyon at requirements.
- User Experience Improvement: ma-design ang system base sa aktwal na paggamit.

## Inaasahang Benepisyo sa LGU

- Mas mabilis at organisadong serbisyo.
- Mas malinaw at transparent na proseso.
- Mas kaunting pila at manual workload.
- Mas maayos na record keeping at data management.
- Mas mataas na satisfaction ng mamamayan.

Kami po ay umaasa sa inyong suporta at gabay upang mas mapaunlad pa ang sistemang ito at maihanda ito para sa aktwal na implementasyon sa Munisipyo ng Aliaga.

## Portals

- Citizen Portal: self-service profile, own transactions, scoped announcements.
- Barangay Portal: barangay-scoped requests, resident verification, complaints, and barangay news.
- Municipal Admin Portal: municipality-scoped dashboard, barangays, requests, reports, and municipality-wide announcements.
- Super Admin Portal: municipality master management only.

Super Admin can create municipalities, browse/read them, edit only `officialEmail`, `officialContactNumber`, `officeAddress`, `logoUrl`, and `status`, assign a municipal admin, and read audit logs. Super Admin does not manage citizens, complaints, requests, barangay operations, or news content.

## Project Structure

```text
client/
  src/
    auth/
    components/
    pages/
      auth/
      citizen/
      barangay/
      municipal-admin/
      super-admin/
      news/
    routes/
    services/
    utils/
server/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    scripts/
    services/
    utils/
    validators/
  app.js
  server.js
```

The root `server/app.js` and `server/server.js` remain as compatibility shims and load the new `server/src` architecture.

## Setup

Install all dependencies from the repository root:

```bash
npm run install:all
```

PowerShell quick start from the repository root:

```powershell
npm run setup:windows
```

`npm run setup:windows` creates `server/.env` and `client/.env` from their example files, fills local development defaults, and runs the seed commands from the correct directory.

Manual setup is also fine. Create the env files first:

```powershell
Copy-Item server/.env.example server/.env
Copy-Item client/.env.example client/.env
```

Then edit `server/.env` with your MongoDB connection and secrets:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/bayanlink
JWT_ACCESS_SECRET=replace_with_a_long_random_access_secret
JWT_REFRESH_SECRET=replace_with_a_long_random_refresh_secret
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

The client default is already correct for local development:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

PowerShell note: do not paste `PORT=5000` style lines directly into the terminal. Put them in `.env`, or use `$env:PORT = "5000"` if you need a temporary session override.

## Seed Data

Run these from the repository root after `MONGO_URI` and the seed Super Admin env values are set:

```bash
npm run seed:all
```

Or run them one at a time:

```bash
npm run seed:roles
npm run seed:super-admin
npm run seed:municipalities
npm run seed:portal-users
```

If you are already inside `server`, drop the `--prefix server` part and run the server package scripts directly.

The Super Admin seed uses:

```env
SEED_SUPER_ADMIN_EMAIL=superadmin@bayanlink.local
SEED_SUPER_ADMIN_PASSWORD=ReplaceWith_StrongPassword123!
```

Use a real strong password outside local development.

Local portal test users:

- Municipal Admin: `municipal.admin@bayanlink.local` / `PortalTest123!`
- Barangay Admin: `barangay.admin@bayanlink.local` / `PortalTest123!`
- Citizen: `citizen@bayanlink.local` / `PortalTest123!`

## Run

From the repository root:

```bash
npm run dev
```

Default URLs:

- Client: `http://127.0.0.1:5173`
- API: `http://localhost:5000`
- Health: `http://localhost:5000/api/health`

## API Routes

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/refresh`
- `GET /api/auth/me`

Super Admin:

- `GET /api/super-admin/municipalities`
- `POST /api/super-admin/municipalities`
- `GET /api/super-admin/municipalities/:id`
- `PATCH /api/super-admin/municipalities/:id`
- `POST /api/super-admin/municipalities/:id/municipal-admin`
- `GET /api/super-admin/audit-logs`

Municipal Admin:

- `GET /api/municipal/dashboard`
- `GET /api/municipal/municipality`
- `GET /api/municipal/news-feeds`
- `POST /api/municipal/news-feeds`
- `GET /api/municipal/news-feeds/:id`
- `PATCH /api/municipal/news-feeds/:id`
- `DELETE /api/municipal/news-feeds/:id` archives the post

Barangay Admin:

- `GET /api/barangay/dashboard`
- `GET /api/barangay/news-feeds`
- `POST /api/barangay/news-feeds`
- `GET /api/barangay/news-feeds/:id`
- `PATCH /api/barangay/news-feeds/:id`
- `DELETE /api/barangay/news-feeds/:id` archives the post

Citizen:

- `GET /api/citizen/dashboard`
- `GET /api/citizen/profile`
- `GET /api/citizen/news-feed`
- `GET /api/citizen/news-feed/:id`

Compatibility aliases from the original template remain secured:

- `/api/municipalities`
- `/api/news-feeds`

## Security Notes

- Passwords are hashed with bcrypt at 12 rounds. Plain text passwords are never stored.
- Access tokens are short-lived JWTs. Refresh tokens are opaque, hashed in MongoDB, rotated on refresh, and revoked on logout.
- Auth cookies are `httpOnly`; the frontend also keeps the short-lived access token in `sessionStorage` for local dev API calls.
- Login and Super Admin routes are rate limited.
- Helmet, strict CORS, request body limits, centralized error handling, and safe production errors are enabled.
- Request validators reject unknown fields on sensitive endpoints.
- Municipality updates are whitelisted in the validator, service layer, and Mongoose update hooks.
- Municipality hard delete is not exposed. `deletedAt` exists for a future soft-delete workflow only.
- News feed queries are filtered by server-side municipality and barangay scope.
- Audit logs are written for municipality create/update, municipal admin assignment, and Super Admin login success/failure.

## Validation

Useful local checks:

```bash
npm run check --prefix server
npm run build --prefix client
```

The API can start without `MONGO_URI` for health checks, but database-backed routes return `503` until MongoDB is configured.

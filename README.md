# BayanLink MERN + BREAD Starter Template

BayanLink is a starter MERN application for municipal service workflows. It uses React + Vite + Tailwind CSS + Bootstrap on the client and Node + Express + MongoDB on the server, with a BREAD structure for Browse, Read, Edit, Add, and Delete operations.

The first complete modules are:

- Municipality
- Mayor's News Feed / Announcements

Future BayanLink modules are represented in the dashboard roadmap so the team can extend the same pattern.

## Project Structure

```bash
bayanlink/
├── client/
│   ├── src/
│   │   ├── components/common/
│   │   ├── components/layout/ 
│   │   ├── pages/dashboard/
│   │   ├── pages/municipality/
│   │   ├── pages/news/
│   │   ├── routes/
│   │   └── services/
│   └── package.json
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── app.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
└── README.md
```

## Setup

Install frontend dependencies:

```bash
cd client
npm install
```

Frontend styling uses Tailwind CSS through the official Vite plugin:

- `tailwindcss`
- `@tailwindcss/vite`
- `@import "tailwindcss";` in `client/src/index.css`

Bootstrap is also installed for polished tables, forms, and button defaults:

- `bootstrap`
- `import "bootstrap/dist/css/bootstrap.min.css";` in `client/src/main.jsx`

Install backend dependencies:

```bash
cd server
npm install
```

Create the server environment file:

```bash
cd server
copy .env.example .env
```

Update `server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
```

Optional client API override:

```bash
cd client
copy .env.example .env
```

## Run

From the project root, run both API and client together:

```bash
npm run dev
```

You can also run them separately:

Start the API:

```bash
cd server
npm run dev
```

Start the React app:

```bash
cd client
npm run dev
```

Default URLs:

- Client: `http://127.0.0.1:5173`
- API: `http://localhost:5000`
- API health: `http://localhost:5000/api/health`

## BREAD Endpoints

Municipality:

- `GET /api/municipalities`
- `GET /api/municipalities/:id`
- `POST /api/municipalities`
- `PUT /api/municipalities/:id`
- `DELETE /api/municipalities/:id`

News Feed:

- `GET /api/news-feeds`
- `GET /api/news-feeds/:id`
- `POST /api/news-feeds`
- `PUT /api/news-feeds/:id`
- `DELETE /api/news-feeds/:id`

Sample response:

```json
{
  "success": true,
  "message": "Municipality created",
  "data": {
    "_id": "123",
    "name": "Aliaga"
  }
}
```

## MongoDB Collections

Implemented:

- `municipalities`
- `newsfeeds`

Suggested next collections:

- `users`
- `staffs`
- `departments`
- `services`
- `documentrequests`
- `appointments`
- `complaints`
- `sosreports`
- `drivers`
- `todas`

## Module Roadmap

Recommended build order:

1. Shared layout
2. Login/authentication
3. Municipality module
4. News Feed module
5. Users module
6. Services module
7. Document Requests
8. Appointments
9. Complaints and Reports
10. Payments
11. SOS, Drivers, TODA, and Analytics

## Team Notes

- Frontend lead: extend shared components and dashboard pages.
- API team: clone the existing controller/model/route BREAD pattern.
- Testing support: test all endpoints in Postman or another API client.
- Keep every module on the same response format.

# BayanLink MERN Stack Setup Guide

## Overview
BayanLink is a full-stack MERN (MongoDB, Express, React, Node.js) application for municipal citizen engagement and service delivery.

## Project Structure
```
bayanlink/
├── server/              # Node.js/Express backend
│   ├── src/
│   │   ├── models/     # MongoDB models
│   │   ├── routes/     # API endpoints
│   │   ├── controllers/# Request handlers
│   │   ├── services/   # Business logic
│   │   ├── middleware/ # Auth, validation, etc.
│   │   ├── utils/      # Helpers
│   │   ├── validators/ # Input validation
│   │   └── app.js      # Express app
│   ├── data/           # Static JSON data (municipalities, barangays)
│   ├── package.json
│   └── .env.example
├── client/              # React frontend
│   ├── src/
│   │   ├── pages/      # Page components
│   │   ├── components/ # Reusable components
│   │   ├── routes/     # Route definitions
│   │   ├── auth/       # Authentication context
│   │   ├── App.jsx
│   │   └── index.css
│   ├── package.json
│   └── .env.example
└── package.json         # Root monorepo config
```

## Prerequisites
- Node.js 16+ and npm/pnpm/yarn
- MongoDB Atlas account (or local MongoDB)
- Git

## Installation

### 1. Clone and Install Dependencies
```bash
# Install root dependencies
npm run install:all

# Or individually:
npm install
cd server && npm install
cd ../client && npm install
```

### 2. Configure Environment Variables

PowerShell quick start from the repository root:

```powershell
npm run setup:windows
```

That command creates `server/.env` and `client/.env`, applies local development defaults, and runs the seed scripts from the right working directory.

**Server (.env):**
```powershell
Copy-Item server/.env.example server/.env

# Edit .env with:
MONGO_URI=mongodb://localhost:27017/bayanlink
PORT=5000
NODE_ENV=development
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

**Client (.env):**
```powershell
Copy-Item client/.env.example client/.env

# Edit .env with:
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Initialize Database
The app uses static JSON data for municipalities and barangays (immutable):
- `server/data/municipalities.json` - Municipality records
- `server/data/barangays.json` - Barangay records

MongoDB stores user accounts, sessions, and dynamic content.

## Running the Application

### Development Mode (Both Server & Client)
```bash
# From root directory
npm run dev

# This runs concurrently:
# - Server on http://localhost:5000
# - Client on http://localhost:5173
```

### Individual Services
```bash
# Terminal 1: Start backend
npm run server

# Terminal 2: Start frontend
npm run client
```

## Key Features Implemented

### Authentication & Authorization
- **Sign Up**: Citizens create accounts with fullName, email, password, phone, affiliate, municipality, barangay
- **Password Hashing**: bcryptjs with 12 rounds for security
- **JWT Sessions**: Access tokens + refresh tokens with role-based access control
- **Static Data**: Municipalities and barangays loaded from JSON (cannot be modified via API)

### User Schema
```javascript
{
  email,           // unique
  fullName,        // instead of firstName/lastName
  phone,           // optional
  affiliate,       // optional (organization/barangay)
  passwordHash,    // bcrypt hashed
  role,            // citizen|barangay_admin|municipal_admin|super_admin
  municipalityId,  // reference to municipality
  barangayId,      // reference to barangay
  status,          // active|pending|suspended|locked
  timestamps       // createdAt, updatedAt
}
```

### Public API Endpoints (No Auth Required)
- `GET /api/public/news` - Featured news articles
- `GET /api/public/municipality/info` - Municipalities list from JSON
- `GET /api/public/barangays` - Barangays list from JSON
- `GET /api/public/municipality/stats` - Municipality statistics
- `GET /api/public/services/catalog` - Available services

### Protected Routes
- Public pages: `/`, `/about`, `/services`, `/news`
- Authentication: `/login`, `/signup`
- Citizen portal: `/citizen/dashboard`
- Barangay admin: `/barangay/dashboard`
- Municipal admin: `/municipal/dashboard`
- Super admin: `/super-admin/dashboard`

## Deployment

### For Production
1. Build the frontend:
   ```bash
   npm run build
   ```

2. Set up production MongoDB URI

3. Deploy server to Node.js hosting (Vercel, Railway, Render, AWS, etc.)

4. Deploy client to static hosting (Vercel, Netlify, GitHub Pages, etc.)

### Local Testing
```bash
# Build frontend
npm run build

# Set NODE_ENV=production
NODE_ENV=production npm run start --prefix server
```

## Architecture Highlights

- **MERN Stack**: MongoDB (database) + Express (API) + React (UI) + Node.js (backend runtime)
- **Modular Structure**: Separate concerns with controllers, services, validators, middleware
- **Static Data**: Municipalities and barangays are immutable JSON files (no edit endpoints)
- **Role-Based Access**: Users have scoped access to their municipality and barangay
- **Security**: Password hashing, JWT authentication, CORS protection, input validation

## Troubleshooting

### Port Already in Use
```bash
# Server port 3000 in use?
lsof -i :3000
kill -9 <PID>

# Client port 5173 in use?
lsof -i :5173
```

### MongoDB Connection Error
- Check `MONGO_URI` in `.env`
- Ensure your IP is whitelisted in MongoDB Atlas
- Verify credentials are correct

### CORS Error
- Ensure `CORS_ORIGINS` matches frontend URL
- Default: `http://localhost:5173`

### Dependencies Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules server/node_modules client/node_modules
npm run install:all
```

## Support
For issues, check logs in server terminal or browser console (F12 DevTools).

# BayanLink MERN - Quick Reference Card

## Quick Start (Copy & Paste)

```bash
# 1. Install everything
npm run install:all

# 2. Setup server environment
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
cd ..

# 3. Setup client environment
cd client
cp .env.example .env
cd ..

# 4. Start development
npm run dev

# Result:
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
```

## Key URLs When Running

| Purpose | URL |
|---------|-----|
| Homepage | http://localhost:5173 |
| Signup | http://localhost:5173/signup |
| Login | http://localhost:5173/login |
| Citizen Dashboard | http://localhost:5173/citizen/dashboard |
| API Health | http://localhost:3000/api/health |
| Public Municipalities | http://localhost:3000/api/public/municipality/info |
| Public Barangays | http://localhost:3000/api/public/barangays |

## Essential Environment Variables

**server/.env**
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/bayanlink
PORT=3000
NODE_ENV=development
JWT_SECRET=your_secret_key_here_min_32_chars
CORS_ORIGIN=http://localhost:5173
```

**client/.env**
```
VITE_API_URL=http://localhost:3000
```

## Database Connection

1. Go to: https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Add to server/.env as MONGODB_URI

## Useful Commands

```bash
# Dev mode (both frontend + backend)
npm run dev

# Backend only
npm run server

# Frontend only
npm run client

# Build frontend for production
npm run build

# Production server
NODE_ENV=production npm start --prefix server
```

## New User Registration

**Form Fields:**
- Email (required, unique)
- Full Name (required)
- Phone (optional)
- Affiliate (optional)
- Municipality (required, dropdown)
- Barangay (required, dropdown)
- Password (required, min 12 chars)
- Confirm Password

**Password Rules:**
- Minimum 12 characters
- Must contain uppercase letter
- Must contain lowercase letter
- Must contain number
- Must contain symbol (!@#$%^&*)

## User Roles

| Role | Dashboard | Scope |
|------|-----------|-------|
| citizen | /citizen/dashboard | Personal + municipality/barangay |
| barangay_admin | /barangay/dashboard | Entire barangay |
| municipal_admin | /municipal/dashboard | Entire municipality |
| super_admin | /super-admin/dashboard | System-wide |

## API Response Format

```javascript
{
  "success": true,
  "statusCode": 200,
  "message": "Success message",
  "data": {
    // Response data
  }
}
```

## Login Credentials (After Registration)

```
Email: (whatever you registered)
Password: (whatever you set during signup)
```

## Static Data (JSON - Cannot Edit via API)

**Municipalities:** `server/data/municipalities.json`
- 1 municipality: Aliaga, Nueva Ecija

**Barangays:** `server/data/barangays.json`
- 14 barangays (San Rafael, San Juan, etc.)

These are loaded from files, not from database!

## Troubleshooting 30-Second Solutions

| Problem | Solution |
|---------|----------|
| Port 3000 in use | `lsof -i :3000` then `kill -9 <PID>` |
| Can't connect MongoDB | Check MONGODB_URI in .env |
| Signup form blank | Check if server running, VITE_API_URL correct |
| Login fails | Verify user exists in MongoDB, JWT_SECRET set |
| CORS error | Check CORS_ORIGIN in server .env |
| npm install fails | Delete node_modules, run `npm run install:all` |

## File Structure (Main)

```
bayanlink/
├── server/
│   ├── data/
│   │   ├── municipalities.json
│   │   └── barangays.json
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   └── .env
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   └── auth/SignupPage.jsx (NEW)
│   │   └── components/
│   └── .env
├── SETUP.md
├── CHANGES.md
└── package.json
```

## What Was Changed

✅ Added fullName field (instead of firstName/lastName)
✅ Added affiliate field for organization tracking
✅ Added complete signup page
✅ Added public API endpoints
✅ Added static JSON data (municipalities/barangays)
✅ Removed Netlify (true MERN stack now)
✅ Password hashing with bcryptjs

## Deployment Hosts (Recommendations)

**Backend:**
- Vercel (Node.js support)
- Railway (free tier)
- Render (free tier)
- AWS

**Frontend:**
- Vercel (recommended)
- Netlify
- GitHub Pages
- AWS S3

**Database:**
- MongoDB Atlas (free tier included)

## Security Checklist

- [ ] JWT_SECRET is 32+ characters
- [ ] MONGODB_URI is correct and secret
- [ ] CORS_ORIGIN matches frontend domain
- [ ] Password hashing enabled (bcryptjs)
- [ ] .env files are .gitignored
- [ ] HTTPS enabled in production
- [ ] Environment variables set on host

## Need Help?

1. Check `DEPLOYMENT_CHECKLIST.md` for detailed troubleshooting
2. Check browser console (F12) for frontend errors
3. Check server terminal for backend errors
4. Verify .env files are correctly set
5. Check MongoDB connection string

## Success = When You See

✓ Server starts on port 3000 without errors
✓ Client loads at http://localhost:5173
✓ Can click "Sign Up" button
✓ Municipalities and barangays appear in dropdowns
✓ Can create account
✓ Can login
✓ Dashboard appears after login

**You're ready to develop and deploy! 🚀**

# BayanLink Deployment & Authentication Fixes

## Frontend Deployment Setup (SPA Routing Fixed)

### Files Modified

#### 1. `/client/public/_redirects`
```
/* /index.html 200
```
- Ensures all routes fallback to index.html for client-side routing
- Required for SPA deployments on Netlify/Vercel

#### 2. `/client/index.html`
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <title>BayanLink - Aliaga Municipal Portal</title>
    <meta name="description" content="BayanLink - Official Municipal Portal for Aliaga, Nueva Ecija. Access government services, information, and citizen engagement tools." />
    <meta name="theme-color" content="#0f766e" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```
- Added favicon reference
- Updated title for better SEO
- Added meta description and theme color

#### 3. `/client/vite.config.js`
- Build output: `outDir: 'dist'`
- Code splitting with vendor chunk
- Minification enabled with terser
- Source maps disabled for production

#### 4. `/vercel.json` (NEW)
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
- Vercel configuration for SPA routing
- Fallback rewrite ensures all routes go to index.html

---

## Backend Authentication Fixes

### Field Changes

#### User Model (`/server/src/models/User.js`)
- Changed: `passwordHash` → `password`
- Added: Pre-save middleware for automatic bcrypt hashing
- Benefit: Passwords are hashed only if modified, preventing double-hashing

### Files Modified

#### 1. `/server/src/models/User.js`
- Replaced `passwordHash` field with `password`
- Added pre-save hook:
  ```javascript
  userSchema.pre("save", async function hashPasswordBeforeSave() {
    if (!this.isModified("password")) {
      return;
    }
    this.password = await bcrypt.hash(this.password, PASSWORD_HASH_ROUNDS);
  });
  ```
- Updated `comparePassword()` to use `this.password`
- Updated `toJSON` transform to exclude `password`

#### 2. `/server/src/services/authService.js`
- Updated `serializeUser()` to delete `password` instead of `passwordHash`
- Updated `registerCitizen()` to set `password: passwordHash` (middleware will hash it)
- Updated `loginWithPassword()` to select `+password` instead of `+passwordHash`

#### 3. `/server/src/scripts/seedSuperAdmin.js`
- Changed env var: `SEED_SUPER_ADMIN_FIRST_NAME` + `LAST_NAME` → `SEED_SUPER_ADMIN_FULL_NAME`
- Changed field: `firstName`/`lastName` → `fullName`
- Removed manual `User.hashPassword()` call - middleware handles hashing
- Now uses: `password: password` (middleware will hash on save)

#### 4. `/server/src/scripts/seedPortalUsers.js`
- Changed fields: `firstName`/`lastName` → `fullName`
- Removed manual `User.hashPassword()` call
- Now uses: `password: defaultPassword` (middleware will hash on save)

#### 5. `/server/package.json`
- Added `seed:all` script that runs correct order:
  ```json
  "seed:all": "npm run seed:roles && npm run seed:municipalities && npm run seed:super-admin && npm run seed:portal-users"
  ```

---

## Deployment Verification Checklist

### Frontend
- [x] `_redirects` file exists with correct SPA fallback rule
- [x] `index.html` has favicon and proper title/meta tags
- [x] `vite.config.js` configured for production build
- [x] `vercel.json` configured for SPA routing

### Backend Authentication
- [x] User model uses `password` field instead of `passwordHash`
- [x] Pre-save middleware hashes passwords automatically
- [x] Login comparison uses `comparePassword()` method
- [x] Seed scripts use `password` field and `fullName`
- [x] Seed order maintained: roles → municipalities → super-admin → portal-users

### MongoDB
```
MONGO_URI=mongodb://localhost:27017/bayanlink
```

### Running Seeds
```bash
# Individual seeds
npm run seed:roles --prefix server
npm run seed:super-admin --prefix server
npm run seed:municipalities --prefix server
npm run seed:portal-users --prefix server

# Or run all at once
npm run seed:all --prefix server
```

### Test Credentials (after seeding)
- **Super Admin**: `admin@bayanlink.local` / Password from `SEED_SUPER_ADMIN_PASSWORD` env
- **Test Users**: All use `SEED_PORTAL_USER_PASSWORD` (default: `PortalTest123!`)

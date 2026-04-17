# MongoDB Database Setup Guide

## Prerequisites
1. MongoDB installed locally or MongoDB Atlas account
2. Node.js and npm installed

## Step 1: Set up Environment Variables

1. Copy the example environment file:
```bash
cd server
cp .env.example .env
```

2. Edit the `.env` file with your configuration:

### For Local MongoDB:
```
MONGO_URI=mongodb://localhost:27017/bayanlink
```

### For MongoDB Atlas:
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a free cluster
3. Get your connection string (click "Connect" → "Connect your application")
4. Replace `<password>` with your database password:
```
MONGO_URI=mongodb+srv://yourusername:<password>@cluster0.xxxxx.mongodb.net/bayanlink?retryWrites=true&w=majority
```

3. Set your JWT secrets (generate strong random strings):
```
JWT_ACCESS_SECRET=your-super-secret-jwt-access-key-here
JWT_REFRESH_SECRET=your-super-secret-jwt-refresh-key-here
```

## Step 2: Install Dependencies

```bash
cd server
npm install
```

## Step 3: Seed the Database

Run these commands in order:

1. **Seed roles:**
```bash
npm run seed:roles
```

2. **Seed super admin:**
```bash
npm run seed:super-admin
```

3. **Seed municipalities:**
```bash
npm run seed:municipalities
```

4. **Seed portal users (optional):**
```bash
npm run seed:portal-users
```

5. **Seed services:**
```bash
npm run seed:phase1
```

## Step 4: Update Barangays Data

The system will automatically use the barangays from `server/data/barangays.json` (already updated with 26 Aliaga barangays).

## Step 5: Start the Server

```bash
npm run dev
```

## Step 6: Start the Client

In another terminal:
```bash
cd client
npm install
npm run dev
```

## Testing the System

1. Visit `http://localhost:5173`
2. Click "Sign up"
3. Fill out the registration form:
   - Email: your email
   - Full Name: your name
   - Municipality: Aliaga
   - Barangay: Select from the 26 barangays
   - Password: Min 12 characters

## Default Login Credentials (if you seeded portal users)

- **Super Admin:**
  - Email: `superadmin@bayanlink.local`
  - Password: `ReplaceWith_StrongPassword123!`

- **Municipality Admin:**
  - Email: `municipal.admin@bayanlink.local`
  - Password: `PortalTest123!`

- **Barangay Admin:**
  - Email: `barangay.admin@bayanlink.local`
  - Password: `PortalTest123!`

- **Citizen:**
  - Email: `citizen@bayanlink.local`
  - Password: `PortalTest123!`

## Troubleshooting

### Database Connection Issues
- Make sure MongoDB is running (local) or your Atlas connection string is correct
- Check that your IP is whitelisted in MongoDB Atlas
- Verify your username/password are correct

### Signup Issues
- Ensure municipalities are seeded: `npm run seed:municipalities`
- Check browser console for API errors
- Verify the server is running on port 5000

### CORS Issues
- Make sure `VITE_API_URL` is set in client `.env`:
```
VITE_API_URL=http://localhost:5000
```

## Database Schema

The system uses these main collections:
- `users` - User accounts with roles (citizen, barangay_admin, municipal_admin, super_admin)
- `municipalities` - Municipality information
- `roles` - System roles
- `services` - Available services
- `auditlogs` - Audit trail

## Dynamic Features

Once the database is set up:
1. ✅ User registration and authentication
2. ✅ Role-based access control
3. ✅ Municipality and barangay management
4. ✅ Service catalog
5. ✅ Audit logging
6. ✅ Dynamic content loading

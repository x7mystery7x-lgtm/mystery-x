# ⚡ QUICK START - Copy & Paste Commands

## PHASE 1: SETUP (Run Once)

```bash
# Navigate to Desktop
cd "c:\Users\Lenovo E14\Desktop"

# Create React app
npm create vite@latest psp_frontend -- --template react

# Enter directory
cd psp_frontend

# Install packages
npm install react-router-dom axios react-query formik yup
npm install -D tailwindcss postcss autoprefixer

# Setup Tailwind
npx tailwindcss init -p

# Create folders
mkdir -p src/pages/Public src/pages/Auth src/pages/Client src/pages/Admin
mkdir -p src/components/common src/services src/context src/styles

# Start development server
npm run dev
```

---

## PHASE 2: FILE CREATION CHECKLIST

### Core Configuration Files
- [ ] `tailwind.config.js` - Copy from FRONTEND_SETUP_GUIDE.md
- [ ] `src/styles/tailwind.css` - Copy from FRONTEND_SETUP_GUIDE.md
- [ ] `src/main.jsx` - Updated with Tailwind import

### Core Logic
- [ ] `src/services/api.js` - All API calls
- [ ] `src/context/AuthContext.jsx` - Auth state
- [ ] `src/components/common/ProtectedRoute.jsx` - Route protection
- [ ] `src/components/common/Navbar.jsx` - Navigation
- [ ] `src/App.jsx` - Main router

### Public Pages (5 files)
- [ ] `src/pages/Public/Home.jsx`
- [ ] `src/pages/Public/About.jsx`
- [ ] `src/pages/Public/Contact.jsx`
- [ ] `src/pages/Public/Services.jsx`

### Auth Pages (2 files)
- [ ] `src/pages/Auth/Login.jsx`
- [ ] `src/pages/Auth/Register.jsx`

### Client Pages (4 files)
- [ ] `src/pages/Client/Dashboard.jsx`
- [ ] `src/pages/Client/Profile.jsx`
- [ ] `src/pages/Client/Payments.jsx`
- [ ] `src/pages/Client/Messages.jsx`

### Admin Pages (4 files)
- [ ] `src/pages/Admin/Dashboard.jsx`
- [ ] `src/pages/Admin/Clients.jsx`
- [ ] `src/pages/Admin/AdminPayments.jsx`
- [ ] `src/pages/Admin/AdminMessages.jsx`

---

## PHASE 3: TESTING COMMANDS

```bash
# Test frontend only
npm run dev
# Visit http://localhost:5173

# Test with backend
# Terminal 1:
cd psp_project_1
npm run server

# Terminal 2:
cd psp_frontend
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## PHASE 4: DEPLOYMENT

### Vercel (Easiest)
```bash
npm install -g vercel
vercel
# Follow prompts
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Manual
```bash
npm run build
# Upload 'dist' folder to your hosting
```

---

## 🔑 KEY API ENDPOINTS (Ready in Backend)

```
PUBLIC:
  POST   /api/public/register
  POST   /api/public/login
  POST   /api/public/logout
  GET    /api/public/service

USER:
  GET    /api/user/me
  PATCH  /api/user/me/profile
  PATCH  /api/user/me/password
  POST   /api/user/me/address
  GET    /api/user/me/address
  PATCH  /api/user/me/address
  DELETE /api/user/me/address

PAYMENTS:
  POST   /api/payments/me/payments/mock-pay
  GET    /api/payments/me/payments
  GET    /api/payments/admin/payments
  PATCH  /api/payments/admin/payments/:id

MESSAGES:
  POST   /api/messages/me/messages
  GET    /api/messages/me/messages
  PATCH  /api/messages/me/messages/:id/read
  GET    /api/messages/admin/messages
  POST   /api/messages/admin/messages

ADMIN:
  GET    /api/admin/clients
  GET    /api/admin/clients/:id
  PATCH  /api/admin/clients/:id
```

---

## 🧪 QUICK TEST SCENARIOS

### Test 1: Register & Profile
```
1. Go to /register
2. Enter: name, email, password (match)
3. Click Register
4. Should redirect to /client/dashboard
5. Go to /client/profile
6. Edit name
7. Add address (watch UUID generate)
8. Verify UUID displays
```

### Test 2: Payments
```
1. Go to /client/payments
2. Click "Create Mock Payment"
3. Enter: month=1, year=2025
4. Payment should appear in table
5. Filter by status
6. Should show paid/unpaid correctly
```

### Test 3: Admin Payments
```
1. Login as admin (from adminSeed.js)
2. Go to /admin/payments
3. Filter by month=1
4. Change status to "paid"
5. Click "Export CSV"
6. CSV file downloads
```

### Test 4: Messaging
```
CLIENT:
1. Go to /client/messages
2. Send message to admin
3. Message appears in list
4. Click "Mark as read"

ADMIN:
1. Go to /admin/messages
2. See client message
3. Send reply (enter client ID)
4. Message sent
```

---

## 🚨 TROUBLESHOOTING

### Backend Not Connecting
```
Error: Cannot POST /api/public/login

Solution:
1. Check backend running: npm run server (in psp_project_1)
2. Check port 5000 is available
3. Check api.js baseURL: http://localhost:5000/api
```

### Build Error
```
Error: Module not found

Solution:
npm install
npm run dev
```

### CORS Error
```
Error: Access to XMLHttpRequest blocked by CORS

Solution:
Backend already has CORS enabled
Check API_BASE in src/services/api.js = http://localhost:5000/api
```

---

## 📊 FILE COUNT

Total files to create: ~25

Breakdown:
- Config files: 2
- Service files: 3
- Public pages: 4
- Auth pages: 2
- Client pages: 4
- Admin pages: 4
- Common components: 2
- Other: 3

All code provided in implementation guides.

---

## ✅ FINAL CHECKLIST

Before Deadline (Jan 15):

Day 1 (Jan 12):
- [ ] React project created
- [ ] All core files setup
- [ ] Public pages done
- [ ] Auth pages done
- [ ] Can register & login

Day 2 (Jan 13):
- [ ] Client dashboard complete
- [ ] Profile page working
- [ ] Payments page working
- [ ] Messages working

Day 3 (Jan 14):
- [ ] Admin dashboard complete
- [ ] All admin features working
- [ ] CSV export working
- [ ] All pages tested

Day 4 (Jan 15):
- [ ] Final testing
- [ ] Bug fixes
- [ ] Deployed to production
- [ ] Ready for demo

---

## 🎯 SUCCESS = PROJECT COMPLETE

✅ Backend: 100% (Already done)
✅ Frontend: 0% → 100% (Your work)
✅ Testing: All critical flows pass
✅ Deployment: Live and running

**You've got this! 💪**

# 🎯 STEP-BY-STEP VISUAL WORKFLOW

## COMPLETE BUILD PROCESS

```
┌─────────────────────────────────────────────────────────────────┐
│                    DAY 1: PROJECT SETUP                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Step 1: Create Vite App                                        │
│  ├─ npm create vite@latest psp_frontend                        │
│  └─ cd psp_frontend                                             │
│                                                                 │
│  Step 2: Install Dependencies                                   │
│  ├─ npm install                                                 │
│  ├─ npm install react-router-dom axios react-query             │
│  └─ npm install -D tailwindcss postcss autoprefixer            │
│                                                                 │
│  Step 3: Setup Tailwind                                         │
│  ├─ npx tailwindcss init -p                                    │
│  └─ Update tailwind.config.js                                   │
│                                                                 │
│  Step 4: Create Folder Structure                                │
│  ├─ src/pages/Public                                            │
│  ├─ src/pages/Auth                                              │
│  ├─ src/pages/Client                                            │
│  ├─ src/pages/Admin                                             │
│  ├─ src/components                                              │
│  ├─ src/services                                                │
│  └─ src/context                                                 │
│                                                                 │
│  Step 5: Create Core Files (5 files)                            │
│  ├─ src/styles/tailwind.css                                    │
│  ├─ src/services/api.js                                         │
│  ├─ src/context/AuthContext.jsx                                 │
│  ├─ src/components/common/Navbar.jsx                            │
│  └─ src/App.jsx (Router)                                        │
│                                                                 │
│  ✅ Result: Basic framework ready                              │
│             npm run dev works                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## PUBLIC PAGES WORKFLOW

```
┌─────────────────────────────────────────────────────────────────┐
│                    PUBLIC PAGES (4 files)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Page 1: Home.jsx                                               │
│  ├─ Hero section with CTA                                       │
│  ├─ Features grid                                               │
│  └─ Links to other pages                                        │
│                                                                 │
│  Page 2: About.jsx                                              │
│  ├─ Mission statement                                           │
│  ├─ Vision                                                      │
│  └─ Core values                                                 │
│                                                                 │
│  Page 3: Services.jsx                                           │
│  ├─ Fetch services from API                                     │
│  └─ Display in grid                                             │
│                                                                 │
│  Page 4: Contact.jsx                                            │
│  ├─ Contact form                                                │
│  └─ Contact info display                                        │
│                                                                 │
│  ✅ All accessible without login                               │
│  ✅ Navbar shows public links                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## AUTHENTICATION WORKFLOW

```
┌─────────────────────────────────────────────────────────────────┐
│                  AUTHENTICATION (2 files)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  REGISTER FLOW                                                  │
│  ├─ User visits /register                                       │
│  ├─ Fills form: name, email, password                           │
│  ├─ Validates password match & length                           │
│  ├─ POST /api/public/register                                   │
│  ├─ Backend creates user                                        │
│  └─ Redirects to /client/dashboard                              │
│                                                                 │
│  LOGIN FLOW                                                     │
│  ├─ User visits /login                                          │
│  ├─ Fills form: email, password                                 │
│  ├─ POST /api/public/login                                      │
│  ├─ Backend verifies credentials                                │
│  ├─ Session/JWT returned                                        │
│  └─ Redirects based on role (client/admin)                      │
│                                                                 │
│  LOGOUT FLOW                                                    │
│  ├─ User clicks Logout in navbar                                │
│  ├─ POST /api/public/logout                                     │
│  └─ Redirects to /                                              │
│                                                                 │
│  ✅ Context stores user state                                   │
│  ✅ ProtectedRoute blocks unauthenticated access                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## CLIENT DASHBOARD WORKFLOW

```
┌─────────────────────────────────────────────────────────────────┐
│              CLIENT DASHBOARD (4 pages)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  /client/dashboard (Home)                                       │
│  ├─ Welcome message                                             │
│  └─ Navigation cards                                            │
│      ├─ → Profile                                               │
│      ├─ → Payments                                              │
│      └─ → Messages                                              │
│                                                                 │
│  /client/profile                                                │
│  ├─ Edit name                                                   │
│  ├─ Change password                                             │
│  ├─ View UUID                                                   │
│  └─ Manage address                                              │
│      ├─ POST /api/user/me/address (create)                      │
│      ├─ GET /api/user/me/address (fetch)                        │
│      └─ PATCH /api/user/me/address (update)                     │
│                                                                 │
│  /client/payments                                               │
│  ├─ View all payments                                           │
│  ├─ Create mock payment                                         │
│  ├─ Filter by month/year/status                                 │
│  ├─ GET /api/payments/me/payments                               │
│  └─ POST /api/payments/me/payments/mock-pay                     │
│                                                                 │
│  /client/messages                                               │
│  ├─ Send message form                                           │
│  ├─ View message list                                           │
│  ├─ Mark as read                                                │
│  ├─ POST /api/messages/me/messages                              │
│  └─ PATCH /api/messages/me/messages/:id/read                    │
│                                                                 │
│  ✅ All protected (ProtectedRoute)                              │
│  ✅ Auth context checks login                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## ADMIN DASHBOARD WORKFLOW

```
┌─────────────────────────────────────────────────────────────────┐
│               ADMIN DASHBOARD (4 pages)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  /admin/dashboard (Home)                                        │
│  ├─ Stats cards                                                 │
│  └─ Navigation to all admin sections                            │
│                                                                 │
│  /admin/clients                                                 │
│  ├─ Client list table                                           │
│  ├─ Filter: email, uuid, search                                 │
│  ├─ View client details                                         │
│  ├─ Edit client info                                            │
│  ├─ Delete client                                               │
│  ├─ GET /api/admin/clients                                      │
│  ├─ PATCH /api/admin/clients/:id                                │
│  └─ DELETE /api/admin/clients/:id                               │
│                                                                 │
│  /admin/payments                                                │
│  ├─ Payments table                                              │
│  ├─ Advanced filters:                                           │
│  │  ├─ Month (1-12)                                             │
│  │  ├─ Year                                                     │
│  │  ├─ UUID                                                     │
│  │  ├─ Email                                                    │
│  │  └─ Status (paid/unpaid)                                     │
│  ├─ Update payment status                                       │
│  ├─ Export to CSV                                               │
│  ├─ GET /api/payments/admin/payments?filters                    │
│  └─ PATCH /api/payments/admin/payments/:id                      │
│                                                                 │
│  /admin/messages                                                │
│  ├─ All messages list                                           │
│  ├─ Filter by user ID                                           │
│  ├─ Send message to client                                      │
│  ├─ Delete messages                                             │
│  ├─ GET /api/messages/admin/messages                            │
│  └─ POST /api/messages/admin/messages                           │
│                                                                 │
│  ✅ Protected (role: admin only)                                │
│  ✅ ProtectedRoute checks requiredRole                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## DATA FLOW DIAGRAM

```
┌──────────────────────────────────────────────────────────────┐
│                      USER BROWSER                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  React App (http://localhost:5173)                  │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │  Pages: Home, Login, Register, Profile, etc         │   │
│  │  Components: Navbar, ProtectedRoute                 │   │
│  │  Context: AuthContext (user state)                  │   │
│  └──────────────────┬───────────────────────────────────┘   │
│                     │                                        │
│                 HTTP Requests                                │
│                     │                                        │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────────┐
│               BACKEND API (Port 5000)                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Express Server (http://localhost:5000)             │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │  Routes:                                             │   │
│  │  ├─ /api/public     (Auth, Services)                 │   │
│  │  ├─ /api/user       (Profile, Address)              │   │
│  │  ├─ /api/payments   (Client & Admin)                 │   │
│  │  ├─ /api/messages   (Client & Admin)                 │   │
│  │  └─ /api/admin      (Admin operations)              │   │
│  │                                                      │   │
│  │  Middleware:                                         │   │
│  │  ├─ auth.js         (Session, RBAC)                 │   │
│  │  └─ Validation                                       │   │
│  └──────────────────┬───────────────────────────────────┘   │
│                     │                                        │
│                 Database Queries                             │
│                     │                                        │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────────┐
│                  MONGODB DATABASE                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Collections:                                        │   │
│  │  ├─ Users        (email unique, account unique)      │   │
│  │  ├─ Addresses    (userId unique, uuid unique)        │   │
│  │  ├─ Profiles     (userId unique)                     │   │
│  │  ├─ Payments     (filtered by userId, month, year)   │   │
│  │  ├─ Messages     (sender/receiver relationships)     │   │
│  │  └─ Services     (company services list)             │   │
│  │                                                      │   │
│  │  Indexes: Optimized for filtering & searches        │   │
│  └──────────────────────────────────────────────────────┘   │
│  Cloud: MongoDB Atlas (clusterpsp.lxuafzn.mongodb.net)      │
└──────────────────────────────────────────────────────────────┘
```

---

## USER AUTHENTICATION FLOW

```
                        ┌─ New User
                        │
                        ▼
                    /register
                        │
        ┌───────────────┴───────────────┐
        │                               │
    Backend                          Frontend
    Process                          Validate
    ├─ Hash password                 ├─ Email format
    ├─ Create user                   ├─ Password length
    ├─ Store session                 ├─ Password match
    └─ Return user data              └─ Fill required fields
        │                               │
        └───────────┬───────────────────┘
                    │
                    ▼
            AuthContext.register()
                    │
                    ▼
            Set user in context
                    │
                    ▼
            Redirect to /client/dashboard
                    │
                    ▼
                Success!
                Can access
              protected routes


        ┌─ Existing User
        │
        ▼
    /login
        │
    ┌───┴───┬──────────────┐
    │       │              │
Backend    Frontend       Context
Verify     Validate       Update
├─ Email   ├─ Email       ├─ Store user
├─ Password├─ Password    └─ Redirect
└─ Create  └─ Not empty
  session
    │
    └───────────┬────────────┘
                │
                ▼
    AuthContext.login()
                │
                ▼
    Redirect based on role
    ├─ admin → /admin/dashboard
    └─ client → /client/dashboard
                │
                ▼
            Success!
```

---

## TESTING CHECKLIST BY FEATURE

```
┌─────────────────────────────────────────────────────────────┐
│                  FEATURE TESTING CHECKLIST                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PUBLIC PAGES:                                              │
│  ├─ [ ] Home page loads                                    │
│  ├─ [ ] Navigation works                                   │
│  ├─ [ ] About page content shows                           │
│  ├─ [ ] Services list displays                             │
│  └─ [ ] Contact form submits                               │
│                                                             │
│  AUTHENTICATION:                                            │
│  ├─ [ ] Register with valid data                           │
│  ├─ [ ] Register validation errors show                    │
│  ├─ [ ] Login with correct credentials                     │
│  ├─ [ ] Login fails with wrong password                    │
│  ├─ [ ] Session persists on refresh                        │
│  └─ [ ] Logout clears session                              │
│                                                             │
│  CLIENT PROFILE:                                            │
│  ├─ [ ] Edit name saves                                    │
│  ├─ [ ] Change password works                              │
│  ├─ [ ] Add address creates UUID                           │
│  ├─ [ ] UUID displays correctly                            │
│  └─ [ ] Address updates work                               │
│                                                             │
│  CLIENT PAYMENTS:                                           │
│  ├─ [ ] View payments list                                 │
│  ├─ [ ] Create mock payment                                │
│  ├─ [ ] Filter by month works                              │
│  ├─ [ ] Filter by year works                               │
│  └─ [ ] Filter by status works                             │
│                                                             │
│  CLIENT MESSAGES:                                           │
│  ├─ [ ] Send message to admin                              │
│  ├─ [ ] Receive message from admin                         │
│  ├─ [ ] Mark message as read                               │
│  └─ [ ] Message list updates                               │
│                                                             │
│  ADMIN CLIENTS:                                             │
│  ├─ [ ] View all clients                                   │
│  ├─ [ ] Filter by email                                    │
│  ├─ [ ] Filter by UUID                                     │
│  ├─ [ ] View client details                                │
│  ├─ [ ] Edit client                                        │
│  └─ [ ] Delete client                                      │
│                                                             │
│  ADMIN PAYMENTS:                                            │
│  ├─ [ ] View all payments                                  │
│  ├─ [ ] Filter by month                                    │
│  ├─ [ ] Filter by year                                     │
│  ├─ [ ] Filter by UUID                                     │
│  ├─ [ ] Filter by email                                    │
│  ├─ [ ] Filter by status                                   │
│  ├─ [ ] Update payment status                              │
│  └─ [ ] Export CSV downloads                               │
│                                                             │
│  ADMIN MESSAGES:                                            │
│  ├─ [ ] View all messages                                  │
│  ├─ [ ] Send message to client                             │
│  ├─ [ ] Delete message                                     │
│  └─ [ ] Filter by user ID                                  │
│                                                             │
│  RESPONSIVE DESIGN:                                         │
│  ├─ [ ] Mobile (375px) - all pages readable                │
│  ├─ [ ] Tablet (768px) - layout correct                    │
│  └─ [ ] Desktop (1920px) - full layout                     │
│                                                             │
│  ERROR HANDLING:                                            │
│  ├─ [ ] Network error shows message                        │
│  ├─ [ ] Invalid input shows error                          │
│  ├─ [ ] 404 pages redirect correctly                       │
│  └─ [ ] No console errors                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## BUILD TIMELINE SUMMARY

```
DAY 1 (Jan 12):  8 hours
├─ Hours 1-2:    Setup & Configuration
├─ Hours 3-5:    Public Pages
├─ Hours 6-8:    Auth Pages
└─ Result:       Basic app working

DAY 2 (Jan 13):  8 hours
├─ Hours 9-10:   Profile Page
├─ Hours 11-12:  Payments Page
├─ Hours 13-14:  Messages Page
├─ Hours 15-16:  Dashboard Home
└─ Result:       Full client dashboard

DAY 3 (Jan 14):  8 hours
├─ Hours 17-18:  Admin Dashboard
├─ Hours 19-20:  Clients Management
├─ Hours 21-22:  Payments Management
├─ Hours 23-24:  Messages Management
└─ Result:       Full admin dashboard

DAY 4 (Jan 15):  8 hours
├─ Hours 25-26:  E2E Testing
├─ Hours 27-28:  Performance & Mobile
├─ Hours 29-30:  Documentation
├─ Hours 31-32:  Deployment
└─ Result:       LIVE IN PRODUCTION ✅
```

---

**Status: 🟢 READY TO BUILD**
**All code provided - Just copy & paste!**

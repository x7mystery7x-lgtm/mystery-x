# 🧪 COMPLETE TESTING GUIDE - PSP Project

**Date:** January 12, 2026  
**Status:** Frontend LIVE on http://localhost:5174  
**Backend:** LIVE on http://localhost:5000  
**Database:** Connected to MongoDB Atlas

---

## ✅ PROJECT STATUS

```
✅ BACKEND:        COMPLETE (35 endpoints, 6 models)
✅ FRONTEND:       COMPLETE (18 pages, full routing)
✅ DATABASE:       CONNECTED (MongoDB Atlas)
📊 TOTAL FILES:    25+ created
🚀 READY FOR:      TESTING & DEPLOYMENT
```

---

## 🎯 QUICK START TESTING

### Step 1: Access Frontend
- **URL:** http://localhost:5174
- **Should See:** PSP Company homepage with navigation

### Step 2: Test Public Pages (No Login Required)
```
1. Home       → Shows hero section + features
2. About      → Shows mission/vision/values
3. Services   → Shows list of services
4. Contact    → Shows contact form + info
```

### Step 3: Register New Account
```
Flow:
1. Click "Register" button
2. Fill in:
   - Full Name: John Doe
   - Email: john@example.com
   - Password: Password123
   - Confirm: Password123
3. Click "Register"
4. Should auto-login → Redirect to /client/dashboard
```

### Step 4: Test Client Dashboard
After registration, you should see:
```
- Welcome message
- Three cards: Profile, Payments, Messages
- Quick Stats showing account status
```

### Step 5: Test Profile Management
```
1. Click "Profile" card
2. Edit Name → Click Edit → Change name → Save
3. Change Password → Enter new password → Click Update
4. Add Address:
   - Fill house number, street, state, country
   - Click "Save Address"
   - Should display UUID (unique identifier)
```

### Step 6: Test Payments
```
1. Go to Payments page
2. Click "+ Create Mock Payment"
   - Month: 1
   - Year: 2025
   - Should appear in table with status "unpaid"
3. Try filters:
   - Filter by month=1 → Should show payment
   - Filter by status=unpaid → Should show payment
```

### Step 7: Test Messaging
```
1. Go to Messages page
2. Send message to admin:
   - Subject: "Help"
   - Body: "I have a question"
   - Click "Send"
3. Message should appear in list below

Admin will receive this message.
```

### Step 8: Logout & Login
```
1. Click "Logout" in navbar
2. Should redirect to home page
3. Click "Login"
4. Enter same email & password
5. Should login successfully → Client Dashboard
```

---

## 👨‍💼 ADMIN TESTING

### Get Admin Credentials
From `adminSeed.js` in the project:
```
Email: admin@psp.com
Password: AdminPassword123
```

### Admin Login Flow
```
1. Go to /login (or click Login)
2. Enter admin credentials
3. Should redirect to /admin/dashboard (not /client/dashboard)
```

### Step 1: Admin Dashboard
```
Should see:
- 4 cards: Clients, Payments, Messages, Settings
- Quick Actions list
- System Info showing role: admin
```

### Step 2: Clients Management
```
1. Click "Clients" card
2. Should see list of all registered clients
3. Search/Filter:
   - Filter by email
   - Filter by UUID
   - Click "Apply Filters"
4. Click "View" on a client:
   - See details: name, email, role, verified status
   - Edit name
   - Delete client
5. Click "Back to List"
```

### Step 3: Payments Management
```
1. Click "Payments" card
2. Should see all payments from all clients
3. Advanced filters (5 options):
   - Month (1-12)
   - Year
   - UUID
   - Email
   - Status (paid/unpaid)
4. Try filters:
   - Filter by month=1 → Should show payments
   - Filter by status=unpaid → Show unpaid only
5. Update status:
   - Click dropdown on a payment
   - Change to "paid"
   - Should update immediately
6. Export CSV:
   - Click "Export CSV"
   - payments.csv should download
   - Open in Excel to verify data
```

### Step 4: Messages Management
```
1. Click "Messages" card
2. Should see all messages from clients
3. Send message to client:
   - Enter client user ID (from client list)
   - Subject: "Payment Received"
   - Body: "Your payment has been processed"
   - Click "Send"
4. Message should appear in list
5. Delete message:
   - Click "Delete" on a message
   - Should be removed
6. Filter by User ID:
   - Enter a client ID
   - Click "Apply Filter"
   - Should show only that user's messages
```

---

## 🔄 FULL END-TO-END WORKFLOW

### Complete User Journey (20 minutes)

```
STEP 1: As CLIENT
├─ Register account
├─ Fill profile with address
├─ Create mock payment
├─ Send message to admin
└─ Verify UUID displays in profile

STEP 2: As ADMIN
├─ Login with admin account
├─ View newly registered client in list
├─ Filter payments by that client's UUID
├─ Update payment status to "paid"
├─ Read client message
├─ Send reply message
└─ Export payments CSV
```

---

## 📋 DETAILED TEST CHECKLIST

### Public Pages
- [ ] Home page loads with hero section
- [ ] Navigation bar visible
- [ ] About page shows content
- [ ] Services page displays services
- [ ] Contact page shows form
- [ ] All links work correctly

### Authentication
- [ ] Register with valid data → Login successful
- [ ] Register rejects weak password → Error shows
- [ ] Register rejects mismatched passwords → Error shows
- [ ] Login with wrong password → Error shows
- [ ] Login successful → Redirects to /client/dashboard
- [ ] Admin login → Redirects to /admin/dashboard
- [ ] Logout works → Redirects to home
- [ ] Session persists on refresh

### Client Profile
- [ ] Edit name → Saves successfully
- [ ] Change password → Works with validation
- [ ] Add address → UUID generated automatically
- [ ] UUID displays in blue box
- [ ] Update address → Works without changing UUID
- [ ] All fields required for address

### Client Payments
- [ ] Create mock payment → Appears in table
- [ ] Filter by month → Works correctly
- [ ] Filter by year → Works correctly
- [ ] Filter by status → Shows paid/unpaid
- [ ] Multiple filters combine → Correct results
- [ ] Status badge color changes (green=paid, red=unpaid)

### Client Messages
- [ ] Send message → Subject & body required
- [ ] Message appears in list
- [ ] Multiple messages show in list
- [ ] Mark as read → Changes styling
- [ ] Empty state shows when no messages

### Admin Clients
- [ ] All clients display in table
- [ ] Can filter by email
- [ ] Can filter by UUID
- [ ] Can search by name
- [ ] Click View → Shows client details
- [ ] Edit client name → Saves
- [ ] Delete client → Removed from list
- [ ] Back button works

### Admin Payments
- [ ] All payments display
- [ ] Filter by month → Works
- [ ] Filter by year → Works
- [ ] Filter by UUID → Works
- [ ] Filter by email → Works
- [ ] Filter by status → Works
- [ ] Change status dropdown → Updates
- [ ] Export CSV → File downloads
- [ ] CSV has correct columns

### Admin Messages
- [ ] All messages display
- [ ] Send message form appears
- [ ] Send requires all fields
- [ ] Message sent → Appears in list
- [ ] Delete message → Removed
- [ ] Filter by user ID → Works
- [ ] Message shows sender email & timestamp

### Responsive Design
- [ ] Mobile (375px) → All pages readable
- [ ] Tablet (768px) → Layout correct
- [ ] Desktop (1920px) → Full layout
- [ ] Buttons clickable on all sizes
- [ ] Tables scroll on mobile

### Error Handling
- [ ] Network error → Shows message
- [ ] Invalid input → Shows validation error
- [ ] 404 page → Redirects to home
- [ ] No console errors
- [ ] Loading states work

---

## 🧩 TESTING BY USER ROLE

### CLIENT (Standard User)
```
Access:
✅ /                          (home)
✅ /about, /services, /contact (public pages)
✅ /login, /register          (auth)
✅ /client/dashboard          (after login)
✅ /client/profile
✅ /client/payments
✅ /client/messages
❌ /admin/* pages             (BLOCKED)

Restrictions:
- Can only see own data
- Cannot modify other clients
- Cannot access admin features
```

### ADMIN (Administrator)
```
Access:
✅ All public pages
✅ /admin/dashboard
✅ /admin/clients
✅ /admin/payments
✅ /admin/messages
❌ /client/* pages (can navigate but different view)

Permissions:
- See all clients
- View all payments
- Filter payments by 5 criteria
- Send messages to clients
- Export data as CSV
- Update payment status
```

---

## 🐛 DEBUGGING TIPS

### If Page Doesn't Load
```
1. Check browser console (F12)
2. Check network tab for failed requests
3. Verify backend on http://localhost:5000
4. Check frontend on http://localhost:5174
5. Hard refresh: Ctrl+Shift+R
```

### If API Calls Fail
```
1. Check backend logs (terminal)
2. Verify MongoDB is connected
3. Check .env file has API_BASE correct
4. Test API with Postman
```

### If Login Doesn't Work
```
1. Clear browser cookies
2. Check user exists in MongoDB
3. Verify password is correct
4. Check backend /api/public/login is working
```

### If UUID Doesn't Show
```
1. Check address was created
2. Verify API returned uuid field
3. Check console for errors
4. Create new address to test
```

---

## ⏱️ PERFORMANCE CHECKLIST

- [ ] Pages load in < 3 seconds
- [ ] No memory leaks
- [ ] No lag on interactions
- [ ] Smooth scrolling
- [ ] Fast form submissions
- [ ] CSV export quick (< 5 sec)

---

## 🎉 SUCCESS CRITERIA

✅ When all tests pass:
1. All 18 pages load correctly
2. All forms validate properly
3. All API calls work
4. Admin filters work with 5 criteria
5. CSV export works
6. Messaging works both ways
7. Role-based access works
8. No console errors
9. Responsive on mobile/tablet/desktop
10. Ready for production deployment

---

## 📍 NEXT STEPS

After successful testing:

1. **Fix any bugs** found during testing
2. **Build for production:** `npm run build`
3. **Deploy to Vercel/Netlify**
4. **Final production testing**
5. **Demo/Handover**

---

**Testing Status:** 🟡 IN PROGRESS  
**Start Time:** Jan 12, 2026, 1:00 PM  
**Target Completion:** Jan 13, 2026, 12:00 PM  

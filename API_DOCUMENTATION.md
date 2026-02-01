# PSP Backend API Documentation

**Base URL:** `http://localhost:5000/api`  
**Default Content-Type:** `application/json`

---

## Authentication

Session-based authentication using Express-session. After login, the server sets `connect.sid` cookie.

**Required for all endpoints except public ones:**

- Session cookie (`connect.sid`) in request headers
- User role validation for admin endpoints

---

## Public Routes (`/public`)

### Register User

**Endpoint:** `POST /public/register`

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "houseNumber": "123",
  "street": "Main Street",
  "state": "Lagos",
  "country": "Nigeria"
}
```

**Response (201 Created):**

```json
{
  "sucess": true,
  "message": "Registration successfull. Please log in."
}
```

**Error Responses:**

- `400` - Missing required fields
- `409` - Email already in use

---

### Login

**Endpoint:** `POST /public/login`

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Logged in",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "role": "user"
  }
}
```

**Error Responses:**

- `400` - Missing email or password
- `401` - Invalid credentials

---

### Logout

**Endpoint:** `POST /public/logout`

**Response (200 OK):**

```json
{
  "message": "logged out"
}
```

---

### Get Services

**Endpoint:** `GET /public/service`

**Response (200 OK):**

```json
{
  "service": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Environmental Cleanup",
      "description": "Comprehensive waste management",
      "price": 5000,
      "createdAt": "2025-12-17T...",
      "updatedAt": "2025-12-17T..."
    }
  ]
}
```

---

### Get Company Info

**Endpoint:** `GET /public/info`

**Response (200 OK):**

```json
{
  "company": "Lawman Nigeria PSP",
  "description": "Environmental Waste Management Service Provider",
  "contact": {
    "email": "support@lawmanigeria.com",
    "phone": "+234-816-945-3274"
  },
  "message": "Welcome to our public API. View our services or register to make payments."
}
```

---

## User Routes (`/user`) - Authenticated

### Get Own Profile

**Endpoint:** `GET /user/me`

**Response (200 OK):**

```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "account": "550e8400-e29b-41d4-a716-446655440000",
    "houseNumber": "123",
    "street": "Main Street",
    "state": "Lagos",
    "country": "Nigeria",
    "outstanding": 0,
    "isVerified": false,
    "createdAt": "2025-12-17T...",
    "updatedAt": "2025-12-17T..."
  }
}
```

---

### Get Other Profile

**Endpoint:** `GET /user/profile/:id`

**Parameters:**

- `id` (path) - User ID

**Response (200 OK):** Same as get own profile

**Requires:** Owner or Admin role

---

### Update Profile

**Endpoint:** `PATCH /user/me/profile`

**Request Body:**

```json
{
  "name": "John Updated Doe"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": { ... }
}
```

**Error Responses:**

- `400` - Name is required
- `404` - User not found

---

### Change Password

**Endpoint:** `PATCH /user/me/password`

**Request Body:**

```json
{
  "currentPassword": "OldPass123",
  "newPassword": "NewPass456",
  "confirmPassword": "NewPass456"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

**Error Responses:**

- `400` - Missing fields / Passwords don't match / Too short
- `401` - Current password incorrect

---

### Delete Profile

**Endpoint:** `DELETE /user/profile/:id`

**Parameters:**

- `id` (path) - User ID

**Response (200 OK):**

```json
{
  "message": "User deleted successfully"
}
```

**Requires:** Owner or Admin role

---

## Address Routes (`/user`) - Authenticated

### Create Address

**Endpoint:** `POST /user/me/address`

**Request Body:**

```json
{
  "houseNumber": "456",
  "street": "Oak Avenue",
  "state": "Abuja",
  "country": "Nigeria"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Address created successfully",
  "address": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "houseNumber": "456",
    "street": "Oak Avenue",
    "state": "Abuja",
    "country": "Nigeria",
    "uuid": "550e8400-e29b-41d4-a716-446655440001",
    "createdAt": "2025-12-17T...",
    "updatedAt": "2025-12-17T..."
  }
}
```

**Error Responses:**

- `400` - Missing required fields
- `409` - Address already exists (use PATCH to update)

---

### Get Address

**Endpoint:** `GET /user/me/address`

**Response (200 OK):**

```json
{
  "success": true,
  "address": { ... }
}
```

**Error Responses:**

- `404` - Address not found

---

### Update Address

**Endpoint:** `PATCH /user/me/address`

**Request Body:**

```json
{
  "state": "Lagos"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Address updated successfully",
  "address": { ... }
}
```

**Error Responses:**

- `400` - At least one field required
- `404` - Address not found

---

### Delete Address

**Endpoint:** `DELETE /user/me/address`

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Address deleted successfully"
}
```

---

## Payment Routes (`/payments`) - Authenticated

### Create Mock Payment

**Endpoint:** `POST /payments/me/payments/mock-pay`

**Request Body:**

```json
{
  "month": 12,
  "year": 2025,
  "addressUuid": "550e8400-e29b-41d4-a716-446655440001",
  "amount": 5000,
  "notes": "December payment"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Payment recorded successfully",
  "payment": {
    "_id": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439011",
    "addressUuid": "550e8400-e29b-41d4-a716-446655440001",
    "month": 12,
    "year": 2025,
    "amount": 5000,
    "status": "paid",
    "paymentDate": "2025-12-17T...",
    "notes": "December payment",
    "createdAt": "2025-12-17T...",
    "updatedAt": "2025-12-17T..."
  }
}
```

**Error Responses:**

- `400` - Missing required fields / Invalid month
- `409` - Payment already exists for this month/year

---

### Get Own Payments

**Endpoint:** `GET /payments/me/payments`

**Query Parameters:**

- `month` (optional) - Filter by month (1-12)
- `year` (optional) - Filter by year
- `status` (optional) - Filter by status (paid/unpaid)

**Example:** `GET /payments/me/payments?month=12&year=2025&status=paid`

**Response (200 OK):**

```json
{
  "success": true,
  "count": 1,
  "payments": [ ... ]
}
```

---

### Get Specific Payment

**Endpoint:** `GET /payments/me/payments/:id`

**Parameters:**

- `id` (path) - Payment ID

**Response (200 OK):**

```json
{
  "success": true,
  "payment": { ... }
}
```

---

## Admin Payment Routes (`/payments`) - Admin Only

### Get All Payments

**Endpoint:** `GET /payments/admin/payments`

**Query Parameters:**

- `month` (optional) - Filter by month (1-12)
- `year` (optional) - Filter by year
- `uuid` (optional) - Filter by addressUuid
- `email` (optional) - Filter by client email (regex)
- `status` (optional) - Filter by status (paid/unpaid)

**Example:** `GET /payments/admin/payments?month=12&status=paid`

**Response (200 OK):**

```json
{
  "success": true,
  "count": 5,
  "payments": [
    {
      "_id": "...",
      "userId": {
        "_id": "...",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "addressUuid": "...",
      "month": 12,
      "year": 2025,
      "amount": 5000,
      "status": "paid",
      "paymentDate": "2025-12-17T...",
      "notes": "December payment",
      "createdAt": "2025-12-17T...",
      "updatedAt": "2025-12-17T..."
    }
  ]
}
```

---

### Get Payment by ID

**Endpoint:** `GET /payments/admin/payments/:id`

**Parameters:**

- `id` (path) - Payment ID

**Response (200 OK):**

```json
{
  "success": true,
  "payment": { ... }
}
```

---

### Update Payment Status

**Endpoint:** `PATCH /payments/admin/payments/:id`

**Request Body:**

```json
{
  "status": "paid",
  "notes": "Payment verified"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Payment updated successfully",
  "payment": { ... }
}
```

---

### Delete Payment

**Endpoint:** `DELETE /payments/admin/payments/:id`

**Parameters:**

- `id` (path) - Payment ID

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Payment deleted successfully"
}
```

---

## Message Routes (`/messages`) - Authenticated

### Send Message to Admin

**Endpoint:** `POST /messages/me/messages`

**Request Body:**

```json
{
  "subject": "Payment Query",
  "body": "I need help with my December payment"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "fromUserId": "507f1f77bcf86cd799439011",
    "toUserId": "507f1f77bcf86cd799439999",
    "subject": "Payment Query",
    "body": "I need help with my December payment",
    "readAt": null,
    "createdAt": "2025-12-17T...",
    "updatedAt": "2025-12-17T..."
  }
}
```

---

### Get My Messages

**Endpoint:** `GET /messages/me/messages`

**Query Parameters:**

- `unreadOnly` (optional) - Set to "true" to get only unread messages

**Response (200 OK):**

```json
{
  "success": true,
  "count": 5,
  "messages": [
    {
      "_id": "...",
      "fromUserId": {
        "_id": "...",
        "name": "Admin",
        "email": "admin@example.com",
        "role": "admin"
      },
      "toUserId": { ... },
      "subject": "...",
      "body": "...",
      "readAt": null,
      "createdAt": "2025-12-17T...",
      "updatedAt": "2025-12-17T..."
    }
  ]
}
```

---

### Mark Message as Read

**Endpoint:** `PATCH /messages/me/messages/:id/read`

**Parameters:**

- `id` (path) - Message ID

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Message marked as read",
  "data": { ... }
}
```

---

## Admin Message Routes (`/messages`) - Admin Only

### Get All Messages

**Endpoint:** `GET /messages/admin/messages`

**Query Parameters:**

- `userId` (optional) - Filter by specific user
- `unreadOnly` (optional) - Set to "true" for unread only

**Response (200 OK):** Similar to client messages list

---

### Send Message to Client

**Endpoint:** `POST /messages/admin/messages`

**Request Body:**

```json
{
  "toUserId": "507f1f77bcf86cd799439011",
  "subject": "Payment Confirmation",
  "body": "Your December payment has been confirmed"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": { ... }
}
```

**Error Responses:**

- `400` - Missing fields
- `404` - Client not found

---

### Get Message by ID

**Endpoint:** `GET /messages/admin/messages/:id`

**Response (200 OK):**

```json
{
  "success": true,
  "data": { ... }
}
```

---

### Delete Message

**Endpoint:** `DELETE /messages/admin/messages/:id`

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Message deleted successfully"
}
```

---

## Admin Routes (`/admin`) - Admin Only

### List Clients

**Endpoint:** `GET /admin/clients`

**Query Parameters:**

- `email` (optional) - Filter by email (regex)
- `uuid` (optional) - Filter by account UUID
- `search` (optional) - Search by name, email, or uuid

**Response (200 OK):**

```json
{
  "success": true,
  "count": 10,
  "clients": [ ... ]
}
```

---

### Get Client Details

**Endpoint:** `GET /admin/clients/:id`

**Response (200 OK):**

```json
{
  "success": true,
  "client": { ... }
}
```

---

### Update Client

**Endpoint:** `PATCH /admin/clients/:id`

**Request Body:**

```json
{
  "name": "Updated Name",
  "isVerified": true
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Client updated successfully",
  "client": { ... }
}
```

---

### Delete Client

**Endpoint:** `DELETE /admin/clients/:id`

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Client deleted successfully"
}
```

---

## Error Handling

All errors follow this format:

```json
{
  "error": "Error message",
  "success": false
}
```

**Common HTTP Status Codes:**

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Server Error

---

**API Status:** ✅ All endpoints tested and working  
**Last Updated:** December 17, 2025

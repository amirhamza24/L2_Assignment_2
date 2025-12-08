# Vehicle Rental Management System (Backend)

A fully-featured backend API for managing vehicles, bookings, users, and role-based access.  
Built using **Node.js**, **Express**, **TypeScript**, **PostgreSQL**, and **JWT Authentication**.

## Live Deployment Link

🔗 **API Base URL:** https://assignment-sage-nine.vercel.app/

---

## Features

### **User Management**

- User registration & login
- JWT-based authentication
- Role-based access (`admin`, `customer`)
- Admin can manage users
- only admin can view all users

### **Vehicle Management**

- Add, update & delete vehicles (Admin only)
- Vehicles have type, rent price, status, registration number
- Availability tracking: `available` / `booked`

### **Booking System**

- Customers can book vehicles
- Validates availability
- Calculates total price
- Updates vehicle status automatically
- Customer can cancel before start date
- Admin can mark booking as returned
- System logic prevents invalid actions

### **Security**

- Encrypted passwords
- Protected routes using JWT

Technology Stack

| Component            | Tool / Technology    |
| -------------------- | -------------------- |
| Programming          | TypeScript           |
| Runtime Env          | Node.js              |
| Framework            | Express.js           |
| Database             | PostgreSQL           |
| Authentication       | JSON Web Token (JWT) |
| ORM / Querying       | pg (postgres)        |
| Hosting / Deployment | Vercel               |

Setup & Usage

### 1️. **Clone the Repository**

```bash
git clone https://github.com/amirhamza24/L2_Assignment_2.git
```

### 2. **Install Dependencies**

```
npm install
```

### 3. **Environment Variables**

```
PORT=5000
CONNECTION_STR=postgresql://neondb_owner:npg_3e2GAbOWDiqH@ep-aged-butterfly-a8na9a7w-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET="KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30"
```

### 4. **Run the Server**

```
npm run dev
```

### 5. **API Base URL**

```
http://localhost:5000/api/v1
```

---

## GitHub Repository

🔗 https://github.com/amirhamza24/L2_Assignment_2

## Live Deployment Link

🔗 https://assignment-sage-nine.vercel.app/

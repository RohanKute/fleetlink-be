# FleetLink Backend 🚚

Backend service for **FleetLink** – a logistics vehicle booking system for B2B clients.  
This service handles vehicle management, availability checking, and booking operations.

---

## 🛠 Tech Stack

- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [MongoDB](https://www.mongodb.com/)
- [Jest](https://jestjs.io/) – Unit testing

---

## ⚙️ Setup & Development

### 1. **Clone the repo**
```bash
git clone https://github.com/your-username/fleetlink-backend.git
cd fleetlink-backend
````

### 2. **Install dependencies**

```bash
npm install
```

### 3. **Set up environment**

Create a `.env` file:

```env
DATABASE_URL="mongodb://localhost:27017/fleetlink"
PORT=5000
```

### 4. **Generate Prisma client**

```bash
npx prisma generate
```

### 5. **Sync Prisma schema with DB**

```bash
npx prisma db push
```

### 6. **Start the server**

```bash
npm run dev
```

API will run at: `http://localhost:5000`

---

## 📦 API Endpoints

### ➕ `POST /api/vehicles`

Add a new vehicle
**Body**:

```json
{ "name": "Truck A", "capacityKg": 1000, "tyres": 6 }
```

---

### 🔍 `GET /api/vehicles/available`

Find available vehicles for a route and time
**Query params**:

```
capacityRequired, fromPincode, toPincode, startTime (ISO)
```

---

### 📦 `POST /api/bookings`

Book a specific vehicle
**Body**:

```json
{
  "vehicleId": "vehicle123",
  "fromPincode": "400001",
  "toPincode": "401501",
  "startTime": "2025-07-20T10:00:00Z",
  "customerId": "customer-1"
}
```

Handles booking conflict validation.

---

## 🧪 Running Tests

Unit tests cover:

* Booking conflict detection
* Vehicle creation
* Availability logic

```bash
npm test
```

> ⚠️ Tests assume a separate test DB (or that dev DB can be cleared).
> You can create `.env.test` for isolated environments.

---

## 📌 Notes

* Simplified ride duration logic:
  `duration = abs(from - to) % 24`
* Booking logic re-verifies availability before creation (prevents race conditions)
* MongoDB used via Prisma’s Mongo connector

---

## 🔗 Related Repos

* Frontend: [FleetLink React App](https://github.com/RohanKute/fleetlink-fe)



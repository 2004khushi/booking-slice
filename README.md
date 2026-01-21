## 🧠 Design Decisions, Trade-offs & Assumptions

### 1. Monolithic + Serverless Architecture

**Decision:**  
The system is built using a single **Next.js** application that handles both UI and backend APIs.

**Why:**
- Simplifies deployment and local development
- Reduces infrastructure overhead
- Ideal for demonstrating core business logic in a small slice

**Trade-off:**
- Not suitable for very large-scale systems without further decomposition into services

---

### 2. Explicit State Machine for Bookings

**Decision:**  
All booking status updates go through a centralized state transition function instead of ad-hoc updates.

**Why:**
- Prevents invalid state transitions
- Makes business rules explicit
- Easier to reason about failures and retries

**Trade-off:**
- Slightly more code than direct updates
- Requires upfront design thinking

---

### 3. Event-Based Observability (Audit Log)

**Decision:**  
Every state transition is recorded in a `booking_events` table.

**Why:**
- Enables full booking history and timeline view
- Helps with debugging, ops intervention, and audits
- Mirrors real-world production systems

**Trade-off:**
- Additional storage usage
- Slightly more complexity than overwriting status only

---

### 4. Role-Based Status Updates

**Decision:**  
Booking updates are role-driven:
- Customers can only create and cancel
- Providers can accept or reject
- Admin / Ops can override states
- Providers can accept or reject assigned bookings


**Why:**
- Prevents unauthorized state mutation
- Matches real-world marketplace behavior

**Trade-off:**
- Requires more validation logic
- UI must respect backend constraints

---

### 5. Admin Override with Guardrails

**Decision:**  
Admin overrides are allowed for operational recovery, but normal lifecycle transitions are enforced by the state machine.

**Why:**
- Allows operational recovery
- Prevents data corruption

**Trade-off:**
- Admin power must be carefully constrained
- Requires both backend and UI-level checks

---

### 6. Minimal UI by Design

**Decision:**  
The UI is intentionally simple and functional.

**Why:**
- The assignment focuses on system behavior, not UI polish
- Keeps attention on backend correctness

**Assumption:**
- Authentication and authorization are out of scope for this assignment

---

### 7. Assumptions Made
- Authentication is not implemented
- Provider availability matching is mocked
- Payments, pricing, and notifications are out of scope
- Single-region deployment is assumed
- Provider rejection unassigns the booking and requires re-assignment before acceptance
---

## ▶️ How to Run the Project Locally

### Prerequisites
- Node.js ≥ 18
- npm or yarn
- Supabase account

---

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd booking_slice
```


### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables

Create a .env.local file in the project root:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

```

### 4. Setup Database

In the Supabase SQL editor, create the following:

***bookings*** table

***booking_events*** table

***transition_booking*** RPC function

See the schema and SQL definitions in the README above.

### 5. Run the Development Server
```bash 
npm run dev
```
Open the application at:
```bash
http://localhost:3000
```

### 🖥️ UI Screens Mapping

This project includes simple but complete UI screens that satisfy the assignment requirements.
Each screen is mapped to a concrete route for clarity and easy verification.

## 1️⃣ Screen to Create a Booking

***URL:***

```bash 
http://localhost:3000
```
Description:
- Landing page for the application 
- Allows a customer to create a new booking request 
- On successful creation, returns a booking ID that can be used to track the booking

Purpose:
- Demonstrates customer-initiated booking creation 
- Entry point to the booking lifecycle

### 2️⃣ Screen to View / Track Booking Status

***URL:***

```bash 
http://localhost:3000/bookings/[bookingId]
```



***Example:***
```bash
http://localhost:3000/bookings/8acd5a5d-7652-43d3-bc7a-cc1784b1db13
```



Description:
- Displays the current status of a booking
- Shows assigned provider (if any)
- Displays a full timeline of state transitions (event log)

Purpose:
- Provides observability into booking lifecycle
- Allows users and ops to track progress and history
- Satisfies the “view booking status” requirement

***Note:***
***Status updates are performed through role-specific actions (system, provider, admin), while this screen focuses on visibility and auditability.***


### 3️⃣ Admin / Ops Panel

***important***
-> can change the setting of admin to do any abstract thing; but I have restricted it to some constraints.
If want to give all the access then can just remove this line->
```bash 
if (!ADMIN_ALLOWED_TRANSITIONS[booking.status].includes(nextStatus)) {
throw new Error('Admin cannot transition booking from this state');
}
 ```
from ***/lib/bookingService.ts***

***URL:***
```bash
http://localhost:3000/admin
```
***Description:***
- Internal operations panel for managing bookings
- Allows admin / ops to:
- Assign a provider
- Override booking status (completed, cancelled, failed)
- Mark provider no-show
- Cancel bookings manually
- UI guardrails disable invalid actions for terminal states

***Purpose:***
- Demonstrates manual intervention and operational control
- Supports recovery from edge cases and failures
- Fulfills the “admin / ops panel” requirement

### 6. Useful URLs
   URL	Purpose
   /	Create booking
   /bookings/[id]	View booking status & timeline
   /admin	Admin / Ops panel

### 7.Testing APIs
```bash 
Use the browser UI

Or Postman / curl for API testing

Use the Supabase SQL editor for observability queries

```

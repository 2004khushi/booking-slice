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

# 🏠 On-Demand Home Services Booking System (Core Slice)

This project implements the **core booking lifecycle** for an on-demand home services marketplace, where customers create service requests and providers fulfill them.

The focus is on **correct system behavior, state management, observability, and ops workflows**, rather than UI polish.

---

## ✨ Features Implemented

### ✅ Booking Lifecycle
- Create a booking (`pending`)
- Assign a provider (`assigned`)
- Move through service states:
    - `pending → assigned → in_progress → completed`

---

### ✅ Provider & Partner Workflow
Providers can:
- View assigned bookings (via `provider_id`)
- Accept bookings (progress through lifecycle)
- Reject bookings (cancel / no-show)

> Implemented at the backend level (UI not required by assignment)

---

### ✅ Failure Handling
- Customer cancellations
- Provider cancellations
- Provider no-shows
- Failed bookings with retry capability

---

### ✅ Admin / Ops Intervention
- Manual provider assignment
- Status overrides (controlled)
- Mark no-show
- Cancel bookings

> Admin overrides bypass normal flow **only when explicitly allowed**

---

### ✅ Observability & Audit Logs
- Every state change is logged
- Full booking timeline including:
    - `from → to` status
    - Actor (`customer / provider / system / admin`)
    - Timestamp
    - Metadata (reason, provider info, retry context, etc.)

---

## 🧠 System Design Overview

### Architecture
- **Framework:** Next.js (App Router)
- **Backend:** API routes inside Next.js
- **Database:** Supabase (PostgreSQL)
- **State Management:** Explicit state machine
- **Audit Logging:** Event-based (`booking_events` table)

---

### Design Principles
- Single source of truth (`bookings` table)
- Append-only audit log (`booking_events`)
- Role-based actions (customer / provider / admin)
- Terminal state protection
- Defensive backend + UI validation

---

## 🗃 Database Schema (Core Tables)

### `bookings`
| Column        | Description                         |
|---------------|-------------------------------------|
| id            | Booking UUID                        |
| status        | Current booking status              |
| customer_id   | Customer who created the booking    |
| provider_id   | Assigned provider (nullable)        |
| created_at    | Creation timestamp                  |
| updated_at    | Last update timestamp               |

---

### `booking_events`
| Column        | Description                                          |
|---------------|------------------------------------------------------|
| booking_id    | Related booking                                      |
| from_status   | Previous state                                       |
| to_status     | New state                                            |
| actor_type    | customer / provider / admin / system                 |
| actor_id      | Optional actor UUID                                  |
| metadata      | JSON context (reason, retry, provider info, etc.)    |
| created_at    | Event timestamp                                      |

---

## 🔁 State Machine

### Normal Transitions
pending → assigned → in_progress → completed


### Failure Transitions
assigned → cancelled
assigned → no_show
in_progress → failed


### Terminal States
- `completed`
- `cancelled`
- `no_show`

Once a booking reaches a terminal state:
- Provider assignment is blocked
- Lifecycle cannot continue
- Only admin override is allowed (if explicitly forced)

---

## 🛠 Admin / Ops Panel

**URL:** `/admin`

Admin can:
- Assign provider (only for non-terminal bookings)
- Override booking status
- Cancel bookings
- Mark no-shows

> UI dynamically disables invalid actions based on booking state

---

## 👁 Booking Timeline & Observability

**URL:** `/bookings/[id]`

Displays:
- Current booking status
- Assigned provider (if any)
- Full event timeline

**Example:**
pending → assigned (system)
assigned → no_show (system)


---

## 🔐 Role Responsibilities

| Role     | Allowed Actions                                  |
|----------|--------------------------------------------------|
| Customer | Create booking, cancel                           |
| Provider | View, accept, reject                             |
| Admin    | Assign, override, cancel, mark no-show           |
| System   | Automated transitions                            |

---

## 🧪 Testing

All flows can be tested via:
- Browser UI
- Postman / curl
- Supabase SQL editor

**Example Scenarios:**
- Assign provider
- Reject booking
- Admin override
- View audit timeline

---


## 🚀 Notes
- Authentication is intentionally omitted (out of scope)
- UI is minimal by design
- Focus is on **correct backend behavior and system design**

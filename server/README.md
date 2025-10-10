# Travel Tour Backend (Node.js + Express + PostgreSQL)

This service powers authentication, wallet management, catalog inventory, and bookings for the Travel Tour application. It uses PostgreSQL for persistence and issues JWTs for front-end sessions.

## Prerequisites

- Node.js 18+
- PostgreSQL 13+
- `DATABASE_URL` pointing to a PostgreSQL instance (development defaults in `.env.example`).

## Setup

```bash
cd server
cp .env.example .env
npm install
psql "$DATABASE_URL" -f sql/schema.sql
psql "$DATABASE_URL" -f sql/seed.sql
npm run dev
```

The dev server listens on port `4000` by default. Adjust `PORT` in `.env` if needed.

## Key Environment Variables

- `DATABASE_URL`: PostgreSQL connection string.
- `JWT_SECRET`: Secret used to sign JWT access tokens.
- `CORS_ORIGIN`: Comma-separated list of origins allowed by CORS (default `http://localhost:5173`).
- `SOCIAL_REDIRECT_URL`: Front-end page to receive the JWT after social login.
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`: Credentials for Google OAuth 2.0 (optional).
- `FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET`, `FACEBOOK_CALLBACK_URL`: Credentials for Facebook OAuth 2.0 (optional).

## API Overview

### Auth

| Method | Path        | Description                  |
| ------ | ----------- | ---------------------------- |
| POST   | `/auth/register` | Create a new customer account. |
| POST   | `/auth/login`    | Issue a JWT for valid credentials. |
| GET    | `/auth/me`       | Return the authenticated profile. |
| GET    | `/auth/google`   | Redirect to Google OAuth (if configured). |
| GET    | `/auth/facebook` | Redirect to Facebook OAuth (if configured). |

Successful social logins redirect to `SOCIAL_REDIRECT_URL?token=...`. If the provider denies access, an `error` query parameter will be present instead.

### Catalog (requires auth)

| Method | Path                 | Description                      |
| ------ | -------------------- | -------------------------------- |
| GET    | `/catalog/:category` | List products by category (`tour`, `transport`, `stay`). |

### Wallet (customer only)

| Method | Path              | Description                    |
| ------ | ----------------- | ------------------------------ |
| POST   | `/wallet/topups`  | Request a wallet top-up.       |
| GET    | `/wallet/transactions` | View wallet transactions. |

### Orders / Bookings

| Method | Path                    | Description                            |
| ------ | ----------------------- | -------------------------------------- |
| POST   | `/orders/bookings`      | Deduct balance and create a booking.   |
| GET    | `/orders/bookings`      | Customer: own bookings; Admin: all.    |

### Admin (requires `admin` role)

| Method | Path                              | Description                           |
| ------ | --------------------------------- | ------------------------------------- |
| GET    | `/admin/topups`                  | List top-up requests.                 |
| POST   | `/admin/topups/:id/approve`      | Approve & credit a top-up request.    |
| POST   | `/admin/topups/:id/reject`       | Reject a top-up request.              |
| GET    | `/admin/bookings`                | View all bookings with customer info. |

## Front-end Integration Notes

- Replace the current mock `AuthContext` with API calls (e.g., using `fetch` or Axios).
- Store the `token` returned by `/auth/login` & `/auth/register` and send it in the `Authorization: Bearer <token>` header for protected requests.
- Handle HTTP status 401/403 by redirecting users to the login page or showing an appropriate message.
- Update customer/admin dashboards to load data from these endpoints instead of hard-coded content.

> **Note:** the schema enables the `citext` extension for case-insensitive emails. Ensure your PostgreSQL user has privileges to run `CREATE EXTENSION`.

## Testing

You can use tools like `curl`, Postman, or Thunder Client to exercise the endpoints. Example request:

```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@traveltour.com","password":"admin123"}'
```

This returns a JWT you can use for admin-protected routes.

## Roadmap

- OAuth social login (Google/Facebook) via Passport.js or Firebase Authentication.
- Payment provider integration for top-ups.
- Refresh tokens & email verification.
- Automated tests (Jest / Supertest).

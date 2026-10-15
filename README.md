# IT Service Desk Tracker

A full-stack support-ticket tracker built as a personal learning project. It lets you create, view, edit, delete, filter, and search IT support tickets, and shows a dashboard with ticket counts by status.

I built it to practice connecting a React + TypeScript frontend to a Java Spring Boot REST API backed by MySQL, coming from a JavaScript/Node.js background. It is a learning project, **not production-ready** (see [Limitations](#limitations)).

## Features

- Create, view, edit, and delete support tickets
- Each ticket has a title, description, category, priority (Low / Medium / High), status (Open / In Progress / Resolved), and creation date
- Filter by status and priority, and search by title (case-insensitive)
- Dashboard with the total number of tickets and a count for each status
- Validation on both the frontend and the backend, with clear error messages shown next to the fields
- Loading, empty-result, and error states, including a message when the backend cannot be reached
- Responsive layout: the ticket table turns into cards on small screens

## Tech stack

**Backend:** Java 17, Spring Boot 4.1.x, Spring Web, Spring Data JPA, Bean Validation, Maven
**Database:** MySQL
**Frontend:** React, TypeScript, Vite, React Router, plain CSS

## Project structure

```
service-desk-tracker/
├── database/                 SQL scripts (schema + sample data)
├── service-desk-backend/     Spring Boot REST API
│   └── src/main/java/com/servicedesk/tracker/
│       ├── controller/       HTTP endpoints
│       ├── service/          Application logic
│       ├── repository/       Database access (Spring Data JPA)
│       ├── model/            Ticket entity and enums
│       ├── dto/              Request and summary objects
│       └── exception/        Error handling
└── service-desk-frontend/    React + TypeScript app
    └── src/
        ├── api/              All calls to the backend
        ├── components/       Reusable UI pieces
        ├── pages/            List, detail, and create/edit pages
        ├── types/            TypeScript types
        └── utils/            Helpers
```

## Prerequisites

- Java 17 or newer
- Node.js (current LTS) and npm
- MySQL Community Server
- Git

This project was developed and run against MySQL 26.7 on Windows. Other MySQL versions have not been tested.

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/dieaikhlayel/service-desk-tracker.git
cd service-desk-tracker
```

### 2. Create the database

Start the MySQL client and run the scripts from the project root:

```bash
mysql -u root -p
```

Then, at the `mysql>` prompt:

```sql
source database/schema.sql
source database/seed.sql
```

`schema.sql` creates the `servicedesk_db` database and the `tickets` table. `seed.sql` adds 8 sample tickets and is optional.

### 3. Run the backend

The database password is **not** stored in the project. The backend reads it from environment variables.

**Windows PowerShell:**

```powershell
cd service-desk-backend
$env:DB_USERNAME = "Diea"
$env:DB_PASSWORD = "root"
.\mvnw.cmd spring-boot:run
```

**macOS / Linux / Git Bash:**

```bash
cd service-desk-backend
export DB_USERNAME=Diea
export DB_PASSWORD=root
./mvnw spring-boot:run
```

The API runs at `http://localhost:8080`. If `DB_USERNAME` is not set, it defaults to `root`.

### 4. Run the frontend

In a second terminal:

```bash
cd service-desk-frontend
npm install
npm run dev
```

Open `http://localhost:5173`. During development, Vite forwards requests starting with `/api` to the backend on port 8080, so no CORS setup is needed.

## API documentation

Base URL: `http://localhost:8080/api/tickets`

| Method | Endpoint | Description | Success |
|---|---|---|---|
| GET | `/api/tickets` | List tickets (newest first). Optional query parameters: `status`, `priority`, `search` | `200` |
| GET | `/api/tickets/{id}` | Get one ticket | `200` |
| POST | `/api/tickets` | Create a ticket | `201` |
| PUT | `/api/tickets/{id}` | Update a ticket | `200` |
| DELETE | `/api/tickets/{id}` | Delete a ticket | `204` |
| GET | `/api/tickets/summary` | Total and per-status counts | `200` |

Example: `GET /api/tickets?status=OPEN&priority=HIGH&search=printer`

**Allowed values**

- `status`: `OPEN`, `IN_PROGRESS`, `RESOLVED`
- `priority`: `LOW`, `MEDIUM`, `HIGH`
- `category`: `HARDWARE`, `SOFTWARE`, `NETWORK`, `ACCOUNT_ACCESS`, `OTHER`

**Request body (POST and PUT)**

```json
{
  "title": "Printer not working",
  "description": "Floor 2 printer shows offline.",
  "category": "HARDWARE",
  "priority": "MEDIUM",
  "status": "OPEN"
}
```

- `title`: required, 3 to 100 characters
- `description`: required, up to 2000 characters
- `category` and `priority`: required
- `status`: optional. A new ticket defaults to `OPEN`; on update, a missing status keeps the current one.

**Ticket response**

```json
{
  "id": 1,
  "title": "Printer not working",
  "description": "Floor 2 printer shows offline.",
  "category": "HARDWARE",
  "priority": "MEDIUM",
  "status": "OPEN",
  "createdAt": "2026-10-15T10:30:00"
}
```

**Summary response**

```json
{ "total": 8, "open": 4, "inProgress": 2, "resolved": 2 }
```

**Error responses**

| Status | When | Body |
|---|---|---|
| `400` | Validation failed | `{ "status": 400, "message": "Validation failed", "errors": { "title": "Title is required" } }` |
| `400` | Malformed JSON, an invalid enum value, or a bad URL value | `{ "status": 400, "message": "..." }` |
| `404` | Ticket does not exist | `{ "status": 404, "message": "Ticket with id 99 not found" }` |
| `503` | Database unavailable | `{ "status": 503, "message": "The database is currently unavailable. Please try again later." }` |

## Testing

<!-- Edit this section so it lists only what you actually tested. -->
I verified the application manually by running the full stack locally on Windows. There are no automated tests yet.

## Limitations

This is a learning project, so some things are deliberately simple:

- No login or user accounts. Anyone who can reach the app can create, edit, and delete tickets.
- The database schema is managed by Hibernate (`ddl-auto=update`) plus a SQL script, not by a migration tool.
- No pagination: all matching tickets are returned at once.
- Deleting uses a browser confirmation dialog.
- No automated tests.
- Only tested in development mode on Windows; there is no production build or deployment setup.

## Possible next steps

- Automated tests for the service layer and API
- Pagination and sorting
- User accounts and roles
- Docker setup for easier running

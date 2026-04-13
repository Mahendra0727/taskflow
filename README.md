# Taskflow

Taskflow is a lightweight task management application with authentication, project-based task boards, assignee support, and drag-and-drop task movement across status columns.

## Overview

Taskflow allows users to:

- Register and log in
- View projects
- Create, edit, delete, and assign tasks
- Move tasks across `To Do`, `In Progress`, and `Done` columns using drag and drop
- Persist task updates to the local API/database

### Tech Stack

- Frontend: React, TypeScript, Vite
- UI: Material UI (MUI)
- Drag and Drop: `@dnd-kit`
- Routing: React Router
- Mock API / Local persistence: `json-server`
- Containerization: Docker + Docker Compose

---

## Architecture Decisions

I structured the project as a frontend-first application with a simple service layer and hooks-based data access.

### Why this structure

- `components/` contains reusable UI pieces such as task cards, task columns, dialogs, and layout components.
- `pages/` contains route-level screens like login, register, dashboard, and project detail.
- `hooks/` holds data-fetching and state management logic such as `useTasks`, `useProjects`, and `useAuth`.
- `services/` is responsible for API communication, which keeps components cleaner and makes requests easier to change later.
- `types/` centralizes shared TypeScript types for better consistency and safer refactoring.

### Main decisions

- I used `json-server` instead of a real backend to keep the implementation lightweight and easy to review locally.
- I used `dnd-kit` for drag-and-drop because it gives good control over sortable boards and works well with React.
- I kept authentication simple and seed-based so the reviewer can log in immediately without extra setup.
- I separated UI state from API logic so drag-and-drop interactions remain responsive while still persisting changes.

### Tradeoffs

- This project uses a mock backend, so auth and data persistence are development-oriented rather than production-grade.
- There is no full RBAC/permissions model.
- Error handling is practical but not exhaustive.
- Real-time collaboration and conflict handling are intentionally out of scope.

### What I intentionally left out

- Production database and real backend authentication
- Role-based access control
- Audit logs / activity history
- File attachments / comments on tasks
- Advanced test coverage
- CI/CD pipeline

These were left out to keep the project focused on the core requirements: authentication, project and task management, assignees, drag-and-drop task flow, and local reproducibility.

---

## Running Locally

Assumption: the reviewer has Docker and Docker Compose available, and nothing else installed.

### 1. Clone the repository

```bash
git clone https://github.com/mahendra0727/taskflow.git
cd taskflow
```

### 2. Create environment file

If your project uses an environment file, copy it like this:

```bash
cp .env.example .env
```

If you are not using environment variables yet, you can skip this step.

### 3. Start the application

```bash
docker compose up --build
```

### 4. Open in the browser

- Frontend: http://localhost:5173
- Mock API (`json-server`): http://localhost:3001

If your Docker setup exposes different ports, update the values above to match your `docker-compose.yml`.

---

## Running Migrations

This project currently uses `json-server` with seeded `db.json`, so there are no SQL migrations.

For the current version:

- No manual migrations are required
- Seed data is already available through `db.json`

If this project is later migrated to a real backend and database, this section would include the exact migration commands.

---

## Test Credentials

Use the seeded account below to log in immediately:

- Email: test@example.com
- Password: password123

You can also add additional seed users in `db.json` if needed.

---

## API Reference

Base URL:

```txt
http://localhost:3001
```

### Auth

#### Login

```http
POST /login
```

Request:

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "id": "1",
  "name": "Test User",
  "email": "test@example.com"
}
```

#### Register

```http
POST /register
```

Request:

```json
{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "id": "2",
  "name": "New User",
  "email": "newuser@example.com"
}
```

---

### Users

#### Get all users

```http
GET /users
```

Response:

```json
[
  {
    "id": "1",
    "name": "Test User",
    "email": "test@example.com"
  }
]
```

#### Get user by id

```http
GET /users/:id
```

---

### Projects

#### Get all projects

```http
GET /projects
```

Response:

```json
[
  {
    "id": "1",
    "name": "Project - 1",
    "description": "Task Management Flow"
  }
]
```

#### Get project by id

```http
GET /projects/:id
```

---

### Tasks

#### Get tasks by project

```http
GET /tasks?projectId=1
```

Response:

```json
[
  {
    "id": "1",
    "title": "Project Task-1",
    "description": "Task management flow",
    "status": "in_progress",
    "priority": "high",
    "projectId": "1",
    "assignee_id": "1",
    "due_date": "2026-04-14",
    "created_at": "2026-04-13T04:00:00.000Z",
    "updated_at": "2026-04-13T04:00:00.000Z"
  }
]
```

#### Create task

```http
POST /tasks
```

Request:

```json
{
  "title": "New Task",
  "description": "Task details",
  "status": "todo",
  "priority": "medium",
  "projectId": "1",
  "assignee_id": "1",
  "due_date": "2026-04-20"
}
```

#### Update task

```http
PATCH /tasks/:id
```

Request:

```json
{
  "status": "done"
}
```

You can also update any editable field such as:

```json
{
  "title": "Updated Task",
  "description": "Updated description",
  "priority": "high",
  "assignee_id": "2",
  "due_date": "2026-04-25"
}
```

#### Delete task

```http
DELETE /tasks/:id
```

---

## What I'd Do With More Time

If I had more time, I would improve the project in the following ways.

### Product improvements

- Add task comments, activity logs, and subtasks
- Add filtering by assignee, due date, and priority
- Add search and sorting across the task board
- Add project creation and editing from the UI
- Add better empty states and more polished loading skeletons

### Technical improvements

- Replace `json-server` with a real backend and proper database
- Add migrations and seed scripts
- Add refresh-token based authentication
- Add stronger form validation and schema validation
- Add integration and component tests
- Add optimistic update rollback patterns for all task actions
- Add centralized API error handling
- Add environment-specific Docker configs for development and production

### Quality tradeoffs / shortcuts I took

- I used a mock backend for speed and simplicity.
- Authentication is intentionally lightweight and not production-secure.
- The API contract is simple and local-only.
- Drag-and-drop persistence is implemented for the task board, but the surrounding system is still intentionally minimal.

I prioritized clarity, core functionality, and local reproducibility over production hardening.

---

## Notes

If the app does not start on the first try, run:

```bash
docker compose down
docker compose up --build
```

If ports are already in use, update them in `docker-compose.yml`.

If you want to inspect the mock database directly, open:

```txt
http://localhost:3001
```

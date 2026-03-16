# REST API Microservice: User Auth, Rate Limiting, Item CRUD

## Overview
A production-grade REST API microservice built with Node.js, TypeScript, Express, Prisma (PostgreSQL), and Redis. Features JWT-based authentication, global & per-user rate limiting, secure password hashing, and CRUD for `Item` resources. Fully tested with Jest & Supertest.

---

## Features
- **User Registration & Login** (JWT, bcrypt)
- **JWT Refresh & Logout** (rotating refresh tokens)
- **CRUD for Items** (per-user ownership)
- **Global (IP) & Per-User Rate Limiting** (Redis-backed)
- **Input Validation** (Zod)
- **Comprehensive Error Handling & Logging**
- **Database Models & Migrations** (Prisma)
- **100% Passing Unit & Integration Tests** (Jest, Supertest)
- **Container Ready** (Docker)

---

## Tech Stack
- Node.js 20.x
- TypeScript 5.x
- Express 4.21.x
- Prisma 5.x + PostgreSQL 13+
- Redis 7+
- bcrypt 5.x
- jsonwebtoken 9.x (RS256)
- Zod 3.x
- Jest 29.x, Supertest 6.x

---

## Prerequisites
- Node.js v20+
- PostgreSQL 13+
- Redis 7+

---

## Local Development

1. **Clone the repo:**
   ```sh
   git clone <repo-url>
   cd <repo>
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Configure environment:**
   - Copy `.env.example` to `.env` and fill in values.
4. **Setup database:**
   ```sh
   npx prisma migrate deploy
   npx prisma generate
   ```
5. **Run the app:**
   ```sh
   npm run dev
   ```
6. **Run tests:**
   ```sh
   npm test
   ```

---

## Docker Usage

1. **Build and run with Docker Compose:**
   ```sh
   docker-compose up --build
   ```
   - The app will be available at `http://localhost:4000`.
   - PostgreSQL at `localhost:5432`, Redis at `localhost:6379`.
   - Place your JWT keys in the `keys/` directory (see `.env.example`).

2. **Health Check:**
   - `GET /health` returns `{ status: 'ok' }` if running.

---

## CI/CD Pipeline
- Automated with GitHub Actions:
  - Build & test on PRs and pushes to `main`.
  - Runs DB migrations and tests.
  - Builds and pushes Docker image to DockerHub.
  - Deploy step placeholder (customize as needed).

---

## Environment Variables
See `.env.example` for all required variables. Use Docker secrets or CI/CD secrets for sensitive values in production.

---

## Database Migration
- Prisma migrations are run automatically on container start (`npx prisma migrate deploy`).

---

## Production Settings
- `NODE_ENV=production` in Docker.
- Health check endpoint for orchestration.
- Secure JWT key management (mount `keys/` as read-only).
- Rate limiting and error handling enabled by default.

---

## License
MIT

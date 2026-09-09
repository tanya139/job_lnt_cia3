# Job Portal & Recruitment Management System

## Problem statement
Students and recruiters need one simple system to publish jobs, submit applications, and track hiring stages. This project demonstrates those workflows for the CIA-3 academic submission.

## Objectives
- Provide JWT-based authentication for candidates, recruiters, and administrators.
- Allow recruiters to manage companies and jobs.
- Allow candidates to search, save, apply, and track jobs.
- Demonstrate a controlled applicant pipeline, interviews, offers, and reports.

## Features
Authentication, role-based access, company profiles, job CRUD, job search, candidate profile metadata, applications, workflow stages, interview scheduling, recruiter applicant view, saved jobs, in-app job alerts, offers, and admin reports.

## Tech stack
Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, express-validator, dotenv, cors, HTML, CSS, JavaScript, and Bootstrap CDN.

## Structure
```text
config/       Database connection
models/       Mongoose schemas
controllers/  Business logic
routes/       REST route definitions
middleware/   Authentication, roles, validation, errors
public/       Simple frontend pages and scripts
postman/      API collection
seed.js       Demo data
server.js     Application entry point
```

## Collections and relationships
```text
Users
 |
 +-- CandidateProfile
 +-- Company --< JobPosting --< Application --< Interview
                                      |
                                      +-- Offer
Users (Candidate) --< Application
Users (Candidate) --< SavedJob
Users (Candidate) --< JobAlert
```

References are used for records that are updated independently: users, companies, jobs, applications, interviews, and offers. Small arrays such as skills and recruiterIds are embedded because they belong directly to their parent record. Resume files are intentionally not uploaded; only metadata is stored.

## Installation
1. Install Node.js and MongoDB.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and set `JWT_SECRET`.
4. Start MongoDB locally.
5. Run `npm run seed` for demo records.
6. Run `npm start` and open http://localhost:5000.

For development, use `npm run dev`.

## Environment variables
```text
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/job_portal
JWT_SECRET=replace_with_your_secret
JWT_EXPIRES_IN=1d
```

## Sample users
These are local demo credentials created by `npm run seed`:

| Role | Email | Password |
|---|---|---|
| Admin | admin@example.com | Admin@123 |
| Recruiter | recruiter@example.com | Recruiter@123 |
| Candidate | candidate@example.com | Candidate@123 |

To use the administrator dashboard locally, run `npm run seed` and sign in with `admin@example.com` and `Admin@123`. Public registration intentionally offers only Candidate and Recruiter roles; production administrator accounts should be created by a trusted setup process.

## Main API endpoints
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register`, `/api/auth/login` | Public |
| GET | `/api/jobs/search`, `/api/jobs/:id` | Public |
| POST/PUT | `/api/companies`, `/api/companies/:id` | Recruiter/Admin |
| POST/GET/PUT/DELETE | `/api/jobs` and `/api/jobs/:id` | Recruiter/Admin |
| GET/PUT | `/api/candidates/profile` | Candidate |
| POST | `/api/applications` | Candidate |
| PUT | `/api/applications/:id/stage` | Recruiter/Admin |
| POST | `/api/interviews` | Recruiter |
| GET | `/api/recruiter/applicants` | Recruiter/Admin |
| POST/GET/DELETE | `/api/saved-jobs` | Candidate |
| POST/GET | `/api/job-alerts` | Candidate |
| POST/PUT | `/api/offers`, `/api/offers/:id/status` | Recruiter/Candidate |
| GET | `/api/admin/reports/funnel`, `/api/admin/reports/jobs` | Admin |

Use `Authorization: Bearer <token>` on protected endpoints. The full sample request set is in `postman/Job-Portal-API.postman_collection.json`.

## Demonstration flow
Seed the database, log in as the candidate, search and apply to a job, then log in as the recruiter and move the application through `Shortlisted`, `Interview`, and `Offered`. Create an offer, accept it as the candidate, mark it `Hired` as the recruiter, and view the admin funnel report.

## Status codes
- `200` successful read/update
- `201` successful create
- `400` validation or business rule failure
- `401` missing or invalid token
- `403` wrong role or ownership
- `404` record or route not found
- `409` duplicate record
- `500` unexpected server error

## Frontend workflows
Candidate, recruiter, and admin dashboards expose the supported API workflows in the browser. Candidates can manage saved jobs and alerts and review interviews and offers. Recruiters can manage companies and jobs, progress applicants, schedule interviews, and create offers. Administrators can review users, companies, jobs, applications, and reports.

## Known limitations
This is an academic demonstration. It does not upload real resumes, send email/SMS alerts, include pagination, or provide production deployment configuration. Admin accounts are created only by trusted setup or seed data; public registration is limited to Candidate and Recruiter roles.

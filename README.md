# Blonde-Tomato

# Dissertation Registration Web Application

This project is a complete **Single Page Application (SPA)** designed to streamline the dissertation registration and coordination process between students and coordinating professors.

---

## Technology Stack

### Frontend (SPA)

| Component     | Technology   | Description                                               |
| :------------ | :----------- | :-------------------------------------------------------- |
| **Framework** | **React.js** | Component-based SPA interface.                            |
| **Language**  | JavaScript   | Primary language for frontend logic.                      |
| **Tooling**   | Vite         | Used for fast development server and production bundling. |

### Backend (RESTful API)

| Component             | Technology     | Description                                                            |
| :-------------------- | :------------- | :--------------------------------------------------------------------- |
| **Platform**          | **Node.js**    | JavaScript runtime environment.                                        |
| **Framework**         | **Express.js** | Flexible Node.js web application framework for building the REST API.  |
| **Database**          | **PostgreSQL** | Chosen relational database for data persistence.                       |
| **ORM / Persistence** | **Prisma**     | Object-Relational Mapper for type-safe database access and migrations. |

---

## Core Features (Minimal Functionality)

The application supports two primary user roles: **Students** and **Professors**.

### Professor Workflow

- **Registration Sessions:** Professors define non-overlapping time slots when they accept requests.
- **Coordination Limit:** Approval is strictly limited to a predefined maximum number of students per professor.
- **Decision Making:** Professors can **Approve** a request or **Reject** it with a required justification.
- **Document Feedback:** Professors can upload a response file or reject the final signed request, requiring the student to upload a new one.

### Student Workflow

- **Multiple Requests:** Students can address preliminary requests to multiple professors.
- **Single Approval Rule:** A student, once approved by one professor, **cannot be approved** by any other.
- **Document Upload:** After preliminary approval, the student uploads the signed dissertation request file.

---

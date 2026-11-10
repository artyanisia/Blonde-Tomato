<div align="center">

# 🍅 Blonde-Tomato
### Dissertation & Thesis Registration System

A full-stack Single Page Application (SPA) engineered to streamline the academic thesis registration workflow, automate supervisor assignment logic, and manage document revision lifecycles between students and faculty advisors.

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-State-764ABC?logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Node.js](https://img.shields.io/badge/Node.js-REST_API-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express-Backend-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Sequelize](https://img.shields.io/badge/Sequelize-ORM-52B0E7?logo=sequelize&logoColor=white)](https://sequelize.org/)

</div>

---

## 📌 Overview

Coordinating bachelor's and master's dissertation approvals across academic departments often involves fragmented email threads, schedule collisions, and manual document tracking. 

**Blonde-Tomato** automates this lifecycle by implementing strict role-based dashboards, slot capacity checks, atomic state changes upon request acceptance, and a document review loop for formal PDF submissions.

---

## 🛠️ Tech Stack

### Frontend
* **Core:** React.js (SPA architecture)
* **State Management:** Redux Toolkit (Authentication, active sessions, request queues)
* **UI & Components:** PrimeReact & PrimeIcons
* **Routing & Security:** React Router with client-side **Protected Routes**

### Backend
* **Runtime & API:** Node.js & Express.js (REST architecture)
* **Database & ORM:** PostgreSQL with Sequelize ORM
* **Authentication:** Stateless JSON Web Tokens (JWT) & bcrypt for salt-hashed passwords
* **Storage & Uploads:** Multer for multipart form handling and PDF ingestion

---

## ✨ Key Features

### 1. Role-Based Access Control (RBAC) & Authentication
* **Dedicated User Journeys:** Clear authentication pipelines for `Student` and `Professor` roles.
* **Route Guards:** Client-side and server-side authorization middleware ensuring isolated operational surfaces.

### 2. Session & Capacity Management (Professors)
* **Availability Windows:** Configurable time-slot sessions for proposal submissions.
* **Conflict Detection:** Automated validation preventing overlapping time blocks per supervisor (`409 Conflict`).
* **Hard Caps:** Enforced maximum student capacity (`maxStudents`) per advisor.

### 3. Thesis Request Lifecycle
* **Discovery & Application:** Students browse eligible supervisors' active submission windows and propose thesis titles.
* **Atomic Coordinator Lock:** When an advisor accepts a candidate, the system automatically marks the student as paired and cancels all competing pending requests sent to other faculty members.
* **Quota Safeguards:** Acceptance actions are disabled once supervisor capacity is reached.

### 4. Document Review & Revision Loop
* **Document Upload:** Students submit signed paperwork via a dedicated PDF upload portal.
* **Supervisory Auditing:** Advisors review materials and toggle submission states:
  * `ReuploadNeeded`: Flags discrepancies, requests revisions, and dispatches detailed feedback to the student.
  * `Final`: Marks the document as verified and counter-signed for institutional archival.
* **Immediate Feedback:** Real-time **Toast alerts** for all transactional updates and errors.

---

## 🔌 API Reference

| Endpoint | Method | Access | Description |
| :--- | :---: | :---: | :--- |
| `/api/auth/register` | `POST` | Public | Atomic creation of user credentials and role assignment |
| `/api/auth/login` | `POST` | Public | Validates credentials and returns a signed JWT |
| `/api/sessions` | `POST` | Professor | Creates a non-overlapping scheduling interval |
| `/api/requests/create` | `POST` | Student | Dispatches a thesis coordination proposal |
| `/api/requests/:requestId/accept` | `PUT` | Professor | Approves student request subject to capacity availability |
| `/api/requests/:requestId/rejectThesis` | `PUT` | Professor | Requests document remediation (`ReuploadNeeded`) |

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v16.0.0 or higher)
* [PostgreSQL](https://www.postgresql.org/) (Local instance or cloud-hosted via [Neon.tech](https://neon.tech))

### 1. Clone the Repository
```bash
git clone [https://github.com/artyanisia/Blonde-Tomato.git](https://github.com/artyanisia/Blonde-Tomato.git)
cd Blonde-Tomato

# Blonde-Tomato

# Dissertation Registration Web Application

This project is a complete **Single Page Application (SPA)** designed to streamline the dissertation registration and coordination process between students and coordinating professors.

---

## Technology Stack & Architecture

| Component              | Technology               | Status | Description                                                               |
| :--------------------- | :----------------------- | :----- | :------------------------------------------------------------------------ |
| **Platform**           | **Node.js**              | ✅     | JavaScript runtime environment.                                           |
| **Framework**          | **Express.js**           | ✅     | Modular web application framework for API routing and middleware.         |
| **Database**           | **PostgreSQL**           | ✅     | Relational database for data persistence.                                 |
| **ORM / Persistence**  | **Sequelize**            | ✅     | Object-Relational Mapper used for all database interactions.              |
| **Security**           | **JWT & bcrypt**         | ✅     | Used for secure authentication and password hashing.                      |

---

## Servicii RESTful Implementate (Etapa 06.12.2025)

The service is organized using the **Route $\rightarrow$ Controller** pattern, ensuring high code quality and clear separation of concerns.

### 1. Autentificare și Managementul Identității

| Calea                | Metoda | Rolul  | Securitate | Logica de Business                                                                                            |
| :------------------- | :----- | :----- | :--------- | :------------------------------------------------------------------------------------------------------------ |
| `/api/auth/register` | `POST` | Public | N/A        | Creates `User` and the corresponding role (`Professor` or `Student`) atomically using Sequelize transactions. |
| `/api/auth/login`    | `POST` | Public | N/A        | Verifies credentials, returns `200 OK`, and issues a **JWT Token**.                                           |

### 2. Managementul Sesiunilor (Logica Critică)

| Calea           | Metoda | Rolul    | Securitate                                       | Logica de Business                                                                                                                                                     |
| :-------------- | :----- | :------- | :----------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/api/sessions` | `POST` | Profesor | **JWT Authenticated & Authorized** (`Professor`) | **Non-Overlapping Constraint:** Checks existing sessions using Sequelize operators (`Op.and`, `Op.gt`, `Op.lt`). Returns `409 Conflict` if a time overlap is detected. |
| `/api/sessions` | `GET`  | Profesor | **JWT Authenticated & Authorized** (`Professor`) | Lists all enrollment sessions created by the authenticated professor.                                                                                                  |

### 3. Utilități DB

| Calea       | Metoda | Rolul       | Descriere                                                                                                                                         |
| :---------- | :----- | :---------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/api/sync` | `PUT`  | Development | **Database Synchronization:** Executes `sequelize.sync({ force: true })` to drop and recreate all tables. **Must be run once for initial setup.** |

---

## Instrucțiuni de Rulare și Setup

### 1. Precondiții

- **Node.js** (recomandat v16+)
- **PostgreSQL** Server running (configured to use port **5433** if you experienced conflicts).
- **Postman** (for API testing).

### 2. Instalarea și Configurarea Bazei de Date

1.  **Clonează Repository-ul** și navighează în directorul rădăcină (`BLONDE-TOMATO/`).
2.  **Instalează Dependențele:**
    ```bash
    npm install
    ```
3.  **Configurare PostgreSQL:** Create the database **`projecttw_db`** in pgAdmin.
4.  **Configurează `.env`:** Create or update the **`.env`** file in the root directory:

    ```dotenv
    # Conexiunea la PostgreSQL (Portul 5433)
    # ATENȚIE: Schimbați parola și verificați portul (5433)
    DATABASE_URL="postgresql://postgres:[parola_ta]@localhost:5433/projecttw_db"

    # Cheia Secreta pentru JWT (Obligatoriu pentru securitate)
    JWT_SECRET="o_cheie_secreta_unica_si_complexa"
    PORT=3000
    ```

### 3. Pornirea Serverului și Sincronizarea Schemei

1.  **Pornirea Serverului Express:**
    ```bash
    npm run dev
    ```
2.  **Sincronizarea Tabelelor (OBLIGATORIU PRIMA DATĂ):**
    Folosește Postman pentru a crea schema DB:
    - **Metoda:** `PUT`
    - **URL:** `http://localhost:3000/api/sync`
    - **Răspuns Așteptat:** **`204 No Content`**.

### 4. Fluxul de Testare de Bază (Postman)

1.  **Înregistrare:** `POST /api/auth/register` (Creează un utilizator cu `role: "Professor"`).
2.  **Autentificare:** `POST /api/auth/login` (Obține token-ul JWT).
3.  **Creare Sesiune:** `POST /api/sessions` (Trimite intervalul orar, folosind token-ul de la pasul 2 în header-ul `Authorization: Bearer [token]`).

#  Blonde-Tomato: Dissertation Registration System
O aplicație web Full-Stack (SPA) modernă concepută pentru a eficientiza procesul de înscriere la licență/disertație și coordonarea dintre studenți și profesorii coordonatori.
---
##  Tehnologii Utilizate
### Frontend
- **React.js**: Bibliotecă pentru interfața cu utilizatorul.
- **Redux Toolkit**: Managementul stării globale (Auth, Sesiuni, Cereri).
- **PrimeReact**: Componente UI premium pentru o experiență utilizator de top.
- **React Router**: Navigare SPA cu **Protected Routes** (securitate la nivel de rută).
### Backend
- **Node.js & Express**: Server RESTful API robust.
- **Sequelize ORM**: Gestionarea bazei de date relaționale.
- **PostgreSQL**: Persistența datelor.
- **JWT & bcrypt**: Autentificare securizată și criptarea parolelor.
- **Multer**: Gestionarea încărcării fișierelor PDF.
---
##  Funcționalități Principale
### 1. Sistem de Autentificare & Roluri
- **Înregistrare/Login**: Diferențiere clară între `Student` și `Profesor`.
- **Securitate**: Accesul la dashboard-uri este restricționat prin rute protejate. Un student nu poate accesa interfața de profesor și invers.
### 2. Managementul Sesiunilor (Profesor)
- Crearea de sesiuni de înscriere cu interval orar.
- **Validare Logică**: Sistemul previne suprapunerea intervalelor orare pentru același profesor (Conflict 409).
- Setarea unei limite maxime de studenți (`maxStudents`).
### 3. Fluxul de Cerere Teză (Student & Profesor)
- **Student**: Vizualizează sesiunile active și aplică cu un titlu de teză.
- **Profesor**: Aprobă sau respinge cererile primite.
- **Restricție**: Un student poate avea un singur coordonator. La aprobare, toate celelalte cereri ale studentului sunt respinse automat.
- **Capacitate**: Profesorul nu poate accepta studenți peste limita setată.
### 4. Managementul Documentelor (Workflow Revizie)
- **Student**: Încarcă fișierul semnat (PDF).
- **Profesor**:
  - Descarcă și verifică documentul.
  - **Revision Needed**: Poate cere revizuirea documentului (status `ReuploadNeeded`), trimițând un motiv studentului.
  - **Final**: Încarcă varianta finală semnată după ce totul este corect.
- **Feedback**: Notificări tip **Toast** în timp real pentru orice acțiune (succes/eroare).
---
## Instalare și Configurare Locală
### 1. Precondiții
- Node.js (v16+)
- PostgreSQL (instalat local sau Neon.tech)
### 2. Clonare și Dependențe
```bash
git clone https://github.com/artyanisia/Blonde-Tomato.git
cd Blonde-Tomato
npm install          # Instalează dependințele pentru rădăcină (Prettier, etc.)
cd backend && npm install
cd ../frontend && npm install
```
### 3. Configurare Environment (.env)
Creați un fișier `.env` în folderul `backend/`:
```dotenv
DATABASE_URL="postgresql://user:password@localhost:5432/db_name"
JWT_SECRET="cheie_secreta_pentru_token"
PORT=5000
```
### 4. Pornirea Aplicației
**Backend:**
```bash
cd backend
npm start
```
**Frontend:**
```bash
cd frontend
npm start
```
---

##  Servicii RESTful (Sumar API)
| Calea                                   | Metoda | Rol      | Descriere                                       |
| :-------------------------------------- | :----- | :------- | :---------------------------------------------- |
| `/api/auth/register`                    | `POST` | Public   | Creează utilizator și rol (tranzacție atomică). |
| `/api/auth/login`                       | `POST` | Public   | Emite JWT Token.                                |
| `/api/sessions`                         | `POST` | Profesor | Creare sesiune (non-overlapping).               |
| `/api/requests/create`                  | `POST` | Student  | Trimite cerere de coordonare.                   |
| `/api/requests/:requestId/accept`       | `PUT`  | Profesor | Aprobă student (verifică limita max).           |
| `/api/requests/:requestId/rejectThesis` | `PUT`  | Profesor | Cere revizuirea documentului PDF.               |
---

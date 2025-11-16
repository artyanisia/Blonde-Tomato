# Specificații detaliate, planul de proiect, prezența unui proiect în git

## Funcționalități (minime)

Aplicația are două feluri de utilizatori, studenți și profesori
Un profesor are o serie de sesiuni de înscriere, care nu se pot suprapune
În cadrul unei sesiuni de înscriere, un student poate face o cerere preliminară unui profesor
Profesorul poate aproba cererea unui student în limita unui număr prestabilit
Profesorul poate de asemenea respinge cererea cu o justificare
Un student poate face adresa cereri mai multor profesori, dar dacă a fost aprobat de unul dintre ei, nu mai poate fi aprobat de un al doilea
După aprobarea cererii preliminare, studentul poate încărca un fișier (cererea semnată)
Ca răspuns la cerere, profesorul poate încărca un fișier sau respinge cererea, caz în care studentul va trebui să încarce o nouă cerere

--

## Funcționalități adaugate

Abilitatea de a filtra cererile (de către Profesor) sau profesorii (de către Student) după status (Approved, Pending) sau după nume.
UI compatibil cu Mobile/Tablet
Notificari in aplicatie
Afisare procent locuri ocupate cu o bara de progres la profesori

--

## Technologii folosite

### Front-end (SPA - Single Page Application):

Framework: React.js (pentru interfața bazată pe componente).
Tooling: Vite (pentru bundling și dezvoltare rapidă).
Limbaj: JavaScript (sau TypeScript).

### Back-end (API RESTful):

Platformă: Node.js (pentru rularea serverului).
Framework API: Express.js (pentru definirea rutelor REST).
ORM (Persistență): Prisma (pentru acces tipizat și migrații la baza de date).

### Baza de Date & Unelte:

DBMS: PostgreSQL (baza de date relațională).
Manager Pachete: npm (sau pnpm, pentru gestionarea dependențelor Node.js).
IDE: Visual Studio Code (VS Code).
Control Versiuni: Git (cu GitHub sau GitLab ca repository online).
Plan de proiect

---

## Plan de proiect

### Săptămâna 1: Fundație și Baza de Date

Accentul se pune pe configurarea mediului, structura de date (Prisma Schema) și logica de bază.
Sarcini:
Instalarea și configurarea PostgreSQL și Prisma.
Definirea schemei de date Prisma (e.g., modelele User, Professor, Student, EnrollmentSession, Request).
Cheie: Asigură-te că sesiunile au câmpuri clare de dată/oră de început și sfârșit.
Crearea rutelor CRUD (Create, Read, Update, Delete) simple pentru modelul User și EnrollmentSession.
Finalizarea funcționalității de bază a sesiunilor de înscriere (creare și verificare suprapunere)

### Săptămâna 2: Autentificare și Logica Principală

Se trece la implementarea securității și a logicii complexe de business. Autentificarea, Logica cererii preliminare, Logica aprobare/ respingere, Roluri si permisiuni
Sarcini:
Implementarea înregistrării și login-ului utilizatorilor (hash-uirea parolei cu bcrypt).
Generarea și validarea JWT (JSON Web Tokens) pentru a proteja rutele API.
Implementarea rutei pentru ca Studentul să trimită o cerere preliminară unui profesor.
Implementarea logicii de Aprobare/Respingere de către profesor, incluzând:
Verificarea limitei maxime de studenți la aprobare.
Logica ce blochează aprobarea unui student dacă acesta este deja aprobat de alt profesor.

### Săptămâna 3: Interfața Utilizator (Front-end)

Dedicată dezvoltării aplicației React și integrării complete cu API-ul creat.
Sarcini:
Configurarea proiectului React (Vite/Webpack).
Crearea paginilor de Login și Register.
Dezvoltarea Dashboard-ului Profesorului: Listă de sesiuni, vizualizare cereri (Aprobate/Pending/Respinse), butoane de Acțiune (Aprobă/Respinge).
Dezvoltarea Dashboard-ului Studentului: Lista profesorilor și sesiunilor disponibile, formular de cerere, statusul cererilor.
Conectarea tuturor formularelor FE cu rutele BE (trimiterea de date și gestionarea răspunsurilor).

### Saptămâna 4: File Upload, Notificări și Finalizare

Se adaugă funcționalitățile avansate (cum ar fi File Uploads), se integrează un serviciu extern (email) și se finalizează documentația/testarea.
Sarcini:
Implementarea logicii de File Upload pe server (folosind multer și stocarea temporară).
Rute dedicate pentru încărcarea fișierului semnat de către student.
Rute dedicate pentru încărcarea răspunsului de către profesor.
Integrarea serviciului de email (ex: Nodemailer) pentru a trimite Notificări (ex: "Cererea ta a fost aprobată").
Adăugarea funcțiilor de Filtrare și Căutare (profesorii caută cereri, studenții caută profesori).
Revizuirea codului (refactorizare) și rezolvarea bug-urilor.
Pregătirea Documentației (README.md, diagrame de arhitectură).

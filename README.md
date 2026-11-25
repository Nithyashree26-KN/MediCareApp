# 🏥 MediCare — Patient Admission Management App

A full-stack web app for hospital staff to manage admitted patients.

## Tech Stack

| Layer    | Technology               |
|----------|--------------------------|
| Frontend | React.js (Vite)          |
| Backend  | Java 17 + Spring Boot 3  |
| Database | MySQL 8                  |
| ORM      | Spring Data JPA          |

---

## Prerequisites

- Java 17+
- MySQL 8 running locally
- Node.js 18+ (for frontend)
- Eclipse IDE with m2e (Maven) plugin

---

## ⚙️ Setup & Run

### 1. Create MySQL Database

```sql
CREATE DATABASE patient_db;
```

> The app auto-creates the `patients` table on first run.

### 2. Configure Password

Open `backend/src/main/resources/application.properties` and set your MySQL password:

```properties
spring.datasource.password=your_mysql_password
```

### 3. Run Backend (Eclipse)

1. Open Eclipse
2. `File → Import → Existing Maven Projects`
3. Browse to the `backend/` folder → Finish
4. Wait for Maven to download dependencies
5. Right-click `PatientManagementApplication.java` → `Run As → Java Application`
6. Backend starts at **http://localhost:8080**

### 4. Run Frontend

```bash
cd frontend
npm install       # (already done — skip if node_modules exists)
npm run dev
```

Frontend opens at **http://localhost:5173**

---

## REST API Endpoints

| Method | Endpoint                        | Description             |
|--------|---------------------------------|-------------------------|
| GET    | `/api/patients`                 | List all patients       |
| GET    | `/api/patients?ward=ICU`        | Filter by ward          |
| GET    | `/api/patients?search=John`     | Search by name          |
| POST   | `/api/patients`                 | Add a patient           |
| PUT    | `/api/patients/{id}`            | Edit a patient          |
| DELETE | `/api/patients/{id}`            | Delete a patient        |
| PATCH  | `/api/patients/{id}/discharge`  | Mark as discharged      |

---

## Features

- ✅ Add / Edit / Delete patients
- ✅ Filter by Ward, Department, Doctor
- ✅ Search by name (real-time)
- ✅ Mark patient as Discharged
- ✅ Delete with confirmation modal
- ✅ Validation on both frontend AND backend
- ✅ Responsive (mobile, tablet, desktop)
- ✅ Toast notifications for all actions

## Validation Rules

| Field          | Rule                              |
|----------------|-----------------------------------|
| Name           | Required, letters + spaces only   |
| Age            | Required, 0–120                   |
| Gender         | Required, from allowed list       |
| Ward           | Required, from allowed list       |
| Department     | Required, from allowed list       |
| Doctor         | Required, from allowed list       |
| Admission Date | Required, cannot be future date   |

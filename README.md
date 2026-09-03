# Employee Attendance Management System

A simple MERN stack project for employee attendance, leave balance, and HR attendance viewing.

## Tech Stack

- React with functional components and hooks
- Node.js and Express
- MongoDB with Mongoose
- JWT authentication
- bcrypt password hashing

## Project Structure

```bash
/backend
  /models
  /routes
  /controllers
  /middleware
  server.js
/frontend
  /src
    /components
    /pages
    /context
    App.js
```

## Backend Setup

```bash
cd backend
copy .env.example .env
npm install
npm run dev
```

Make sure MongoDB is running locally, or update `MONGO_URI` in `.env`.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on the Vite URL shown in the terminal, usually `http://localhost:5173`.

## Main API Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/attendance/check-in`
- `POST /api/attendance/check-out`
- `GET /api/attendance/my`
- `POST /api/leave/apply`
- `GET /api/hr/employees`
- `GET /api/hr/attendance?date=YYYY-MM-DD&employeeId=USER_ID`
- `PUT /api/hr/leave/ATTENDANCE_ID`

## Notes

- Employees and HR users both register from the same registration page.
- Each user starts with 12 leaves.
- Check-in and check-out are limited to once per day.
- Working hours are calculated during check-out.
- Employees can add a short reason while applying for leave.
- Leave requests are created as `Pending`.
- HR can approve or reject leave requests from the HR dashboard.
- Rejected leaves are marked `Absent` and the employee gets that leave balance back.
- Attendance status becomes `Half Day` when working hours are less than 4, otherwise `Present`.

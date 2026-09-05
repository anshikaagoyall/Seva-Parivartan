# SevaParivartan

A full-stack community service and volunteer management platform that connects citizens, volunteers, and administrators to identify local problems, create social causes, and collaborate for meaningful community impact.

## Features

### User Features
- User Registration and Login
- Secure JWT Authentication
- Strong Password Validation
- Profile Creation and Management
- Find Community Causes
- Post Local Problems
- Volunteer Participation
- Dashboard with Activity Overview

### Admin Features
- Admin Dashboard
- User Management
- Role-Based Access Control
- Cause Moderation
- Problem Approval and Resolution
- Community Monitoring

### Security Features
- JWT Authentication
- bcrypt Password Hashing
- Protected Routes
- Role-Based Authorization
- Input Validation
- Express Middleware Security

## Tech Stack

### Frontend
- React
- Vite
- React Router
- CSS/Tailwind (depending on project setup)

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt

### Database
- MongoDB Community Edition
- MongoDB Compass

## Project Structure

```text
SevaParivartan/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── server.js
│   ├── package.json
│   └── .env
│
└── README.md
```

## Installation

### Prerequisites

- Node.js (v18 or later)
- MongoDB Community Server
- MongoDB Compass
- Git
- VS Code

### Clone the Repository

```bash
git clone https://github.com/yourusername/SevaParivartan.git
cd SevaParivartan
```

## Backend Setup

Navigate to the backend folder.

```bash
cd backend
npm install
```

Create a `.env` file.

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/sevaparivartan
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Start the backend.

```bash
npm run dev
```

The backend runs at:

```text
http://localhost:5000
```

## Frontend Setup

Open another terminal.

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

## MongoDB Setup

1. Install MongoDB Community Server.
2. Start the MongoDB service.
3. Connect using MongoDB Compass.

Connection string:

```text
mongodb://127.0.0.1:27017
```

Database:

```text
sevaparivartan
```

## Authentication Flow

### User

1. Register
2. Create Profile
3. Login
4. Access User Dashboard

### Admin

1. Login with an Admin account
2. Access Admin Dashboard
3. Manage Users
4. Moderate Causes and Problems

## Password Requirements

Passwords must contain:

- Minimum 8 characters
- One uppercase letter
- One lowercase letter
- One number
- One special character

## User Roles

| Role | Access |
|------|--------|
| Guest | Home, Login, Signup |
| User | Dashboard, Profile, Causes, Problems |
| Admin | User Management, Admin Dashboard, Moderation |

## API Overview

### Authentication

| Method | Endpoint |
|--------|----------|
| POST | `/api/auth/register` |
| POST | `/api/auth/login` |
| POST | `/api/auth/logout` |
| GET | `/api/auth/me` |

### Profile

| Method | Endpoint |
|--------|----------|
| GET | `/api/profile` |
| PUT | `/api/profile` |

### Admin

| Method | Endpoint |
|--------|----------|
| GET | `/api/admin/dashboard` |
| GET | `/api/admin/users` |
| PUT | `/api/admin/users/:id` |
| DELETE | `/api/admin/users/:id` |

## Screens Included

- Home Page
- Sign Up
- Sign In
- User Dashboard
- Profile Page
- Admin Dashboard
- Cause Listings
- Problem Submission
- User Management

## Development Notes

- Hot Reload enabled through Vite.
- MongoDB stores user profiles, authentication data, causes, and community problems.
- JWT is used for secure authentication.
- Passwords are hashed using bcrypt before storage.

## Future Enhancements

- Email Verification
- Password Reset
- File Uploads
- Live Notifications
- Volunteer Certificates
- Analytics Dashboard
- Dark Mode
- Mobile App Support

## Contributors

**Anshika Goyal**

## License

This project is created for educational and community service purposes.

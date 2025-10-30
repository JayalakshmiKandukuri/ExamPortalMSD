# Online Exam System - MERN Stack

A complete online examination system built with MongoDB, Express.js, React, and Node.js. This application supports student and admin roles with features for exam management, question banks, exam taking, and automatic grading.

## Features

### Student Features
- **User Registration/Login** - Secure authentication for students
- **Dashboard** - View available exams and recent results
- **Take Exams** - Interactive exam interface with timer
- **View Results** - Detailed result analysis with correct/incorrect answers
- **Real-time Timer** - Auto-submit when time expires

### Admin Features
- **User Registration/Login** - Secure authentication for admins
- **Dashboard** - Overview of exams, questions, and student performance
- **Question Management** - Create, edit, and delete MCQ questions
- **Exam Management** - Create and schedule exams
- **Results Management** - View all student results and statistics
- **Question Bank** - Filter questions by subject and difficulty

### System Features
- **Auto-grading** - Automatic evaluation of MCQ answers
- **Role-based Access** - Separate interfaces for students and admins
- **Responsive Design** - Modern, mobile-friendly UI
- **Secure Authentication** - JWT-based authentication
- **MongoDB Database** - Scalable data storage

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

### Frontend
- React 18
- React Router v6
- Axios for API calls
- Lucide React for icons
- Custom CSS with modern design

## Prerequisites

Before running this project, make sure you have:
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn package manager

## Installation

### 1. Clone the repository
```bash
cd ProjectMSD
```

### 2. Backend Setup

Navigate to the backend folder:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the backend folder:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/online-exam-system
JWT_SECRET=your_secret_key_change_this_in_production
NODE_ENV=development
```

**Important:** Change `JWT_SECRET` to a secure random string in production.

### 3. Frontend Setup

Navigate to the frontend folder:
```bash
cd ../frontend
```

Install dependencies:
```bash
npm install
```

## Running the Application

### Start MongoDB
Make sure MongoDB is running on your system:
```bash
# For local MongoDB
mongod
```

Or use MongoDB Atlas connection string in the `.env` file.

### Start Backend Server
```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:5000`

### Start Frontend Development Server
Open a new terminal:
```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000`

## Usage Guide

### First Time Setup

1. **Register as Admin**
   - Go to `http://localhost:3000/register`
   - Fill in your details
   - Select "Admin" as role
   - Click Register

2. **Create Questions**
   - Login as admin
   - Click "Manage Questions"
   - Add multiple-choice questions with 4 options
   - Specify subject and difficulty level

3. **Create an Exam**
   - From admin dashboard, click "Create Exam"
   - Fill in exam details (title, subject, duration, marks)
   - Select questions from the question bank
   - Set scheduled date and end date
   - Click "Create Exam"

4. **Student Registration**
   - Students can register at `/register`
   - Select "Student" as role

5. **Take Exam**
   - Students login and see available exams
   - Click "Start Exam" to begin
   - Answer questions one by one
   - Submit before time expires

6. **View Results**
   - Students can view their results immediately after submission
   - Admins can view all student results from the dashboard

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Questions (Admin Only)
- `GET /api/questions` - Get all questions
- `POST /api/questions` - Create question
- `PUT /api/questions/:id` - Update question
- `DELETE /api/questions/:id` - Delete question
- `GET /api/questions/subjects` - Get unique subjects

### Exams
- `GET /api/exams` - Get all exams (Admin)
- `GET /api/exams/available` - Get available exams (Student)
- `GET /api/exams/:id` - Get exam by ID
- `POST /api/exams` - Create exam (Admin)
- `PUT /api/exams/:id` - Update exam (Admin)
- `DELETE /api/exams/:id` - Delete exam (Admin)

### Results
- `POST /api/results/submit` - Submit exam (Student)
- `GET /api/results/my-results` - Get student's results
- `GET /api/results/:id` - Get result by ID
- `GET /api/results/exam/:examId` - Get exam results (Admin)
- `GET /api/results/all` - Get all results (Admin)

## Project Structure

```
ProjectMSD/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── examController.js
│   │   ├── questionController.js
│   │   └── resultController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Question.js
│   │   ├── Exam.js
│   │   └── Result.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── examRoutes.js
│   │   ├── questionRoutes.js
│   │   └── resultRoutes.js
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   └── PrivateRoute.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.js
│   │   │   │   ├── CreateExam.js
│   │   │   │   ├── ManageQuestions.js
│   │   │   │   └── ViewExamResults.js
│   │   │   ├── student/
│   │   │   │   ├── StudentDashboard.js
│   │   │   │   ├── TakeExam.js
│   │   │   │   └── ViewResult.js
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   ├── App.js
│   │   ├── index.css
│   │   └── index.js
│   └── package.json
└── README.md
```

## Features in Detail

### Auto-Grading System
- Automatic evaluation of MCQ answers
- Instant result calculation
- Score, percentage, and pass/fail status
- Detailed answer review with correct/incorrect marking

### Exam Timer
- Real-time countdown timer
- Auto-submit when time expires
- Visual warning when time is running low

### Question Bank
- Create unlimited questions
- Categorize by subject and difficulty
- Reuse questions across multiple exams
- Filter and search functionality

### Security
- Password hashing with bcrypt
- JWT token authentication
- Protected routes
- Role-based access control

## Default Credentials

After registration, you can create your own admin and student accounts.

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check the connection string in `.env`
- For MongoDB Atlas, whitelist your IP address

### Port Already in Use
- Change the PORT in backend `.env` file
- Update proxy in frontend `package.json`

### CORS Errors
- Backend CORS is configured to allow all origins in development
- For production, update CORS settings in `server.js`

## Future Enhancements

- Email notifications for exam schedules
- PDF export of results
- Question import/export
- Exam analytics and reports
- Multiple question types (True/False, Fill in the blanks)
- Image support in questions
- Exam categories and tags

## License

This project is open source and available for educational purposes.

## Support

For issues and questions, please create an issue in the repository.

---

**Built with ❤️ using MERN Stack**

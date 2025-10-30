# 🚀 START HERE - Quick Start Guide

Welcome to the **Online Exam System**! Follow these simple steps to get started.

---

## ⚡ Quick Start (5 Minutes)

### Step 1: Install Dependencies (First Time Only)

Open PowerShell in the ProjectMSD folder and run:

```powershell
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
cd ..
```

### Step 2: Setup Environment File (First Time Only)

1. Go to the `backend` folder
2. Create a new file named `.env` (copy from `.env.example`)
3. Add this content:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/online-exam-system
JWT_SECRET=my_secret_key_12345_change_this
NODE_ENV=development
```

### Step 3: Start MongoDB

**Option A - Local MongoDB:**
```powershell
mongod
```

**Option B - MongoDB Atlas (Cloud):**
- Use your MongoDB Atlas connection string in the `.env` file

### Step 4: Run the Application

**Open 2 PowerShell windows:**

**Window 1 - Backend:**
```powershell
cd backend
npm run dev
```

Wait for: `✓ Server running on port 5000` and `✓ MongoDB Connected`

**Window 2 - Frontend:**
```powershell
cd frontend
npm start
```

Browser will open at: `http://localhost:3000`

---

## 🎯 First Time Setup

### 1. Create Admin Account
- Go to Register page
- Fill in your details
- **Select "Admin" role**
- Click Register

### 2. Add Questions (Admin)
- Login as admin
- Click **"Manage Questions"**
- Click **"Add Question"**
- Fill in:
  - Question text
  - 4 options
  - Correct answer
  - Subject (e.g., Math, Science)
  - Difficulty
- Add at least 5-10 questions

### 3. Create Exam (Admin)
- Go to Admin Dashboard
- Click **"Create Exam"**
- Fill exam details:
  - Title
  - Subject
  - Duration (minutes)
  - Marks
  - Dates
- Select questions
- Click **"Create Exam"**

### 4. Test as Student
- Logout
- Register with **"Student" role**
- Login
- See available exams
- Click **"Start Exam"**
- Take exam
- View results

---

## 📂 Important Files

| File | Purpose |
|------|---------|
| `README.md` | Complete documentation |
| `SETUP.md` | Detailed setup guide |
| `INSTALLATION_STEPS.txt` | Step-by-step installation |
| `PROJECT_SUMMARY.md` | Project overview |
| `backend/.env.example` | Environment template |

---

## 🔗 URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **MongoDB:** mongodb://localhost:27017

---

## 🆘 Common Issues

### MongoDB Connection Error
```
✗ Solution: Make sure MongoDB is running
  Run: mongod
```

### Port Already in Use
```
✗ Solution: Close other apps or change port in .env
```

### npm install fails
```
✗ Solution: Delete node_modules and run npm install again
```

### Cannot see questions/exams
```
✗ Solution: Make sure you're logged in with correct role
  Admin - for creating
  Student - for taking exams
```

---

## 📱 Features Overview

### For Students:
- ✅ Register and Login
- ✅ View available exams
- ✅ Take exams with timer
- ✅ View results instantly
- ✅ See detailed answers

### For Admins:
- ✅ Register and Login
- ✅ Create questions (MCQs)
- ✅ Create and schedule exams
- ✅ View all student results
- ✅ Manage question bank

---

## 🎓 Test Data Suggestion

Create this test data to explore all features:

**Questions:**
- 10 Math questions (Easy, Medium, Hard)
- 10 Science questions (Easy, Medium, Hard)

**Exams:**
- Math Quiz - 5 questions, 10 minutes
- Science Test - 10 questions, 20 minutes

**Users:**
- 1 Admin account
- 2-3 Student accounts

---

## 💻 Development Commands

### Backend
```powershell
cd backend
npm run dev      # Start with auto-reload
npm start        # Start production mode
```

### Frontend
```powershell
cd frontend
npm start        # Start development server
npm run build    # Build for production
```

---

## 🎨 Tech Stack

- **Frontend:** React, React Router, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Auth:** JWT (JSON Web Tokens)
- **UI:** Custom CSS with modern design

---

## ✨ What Makes This Special?

1. **Auto-Grading** - Instant results, no manual checking
2. **Real-time Timer** - Auto-submit when time's up
3. **Modern UI** - Beautiful, responsive design
4. **Role-based** - Separate student and admin views
5. **Secure** - JWT authentication, password hashing
6. **Complete** - Full MERN stack implementation

---

## 📞 Need Help?

1. Check `README.md` for detailed docs
2. See `INSTALLATION_STEPS.txt` for troubleshooting
3. Review `PROJECT_SUMMARY.md` for architecture

---

## 🎉 You're All Set!

The system is ready to use. Start by creating an admin account and adding some questions!

**Happy Examining! 🎓**

---

*Built with MERN Stack - MongoDB, Express, React, Node.js*

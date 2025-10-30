# Quick Setup Guide

Follow these steps to get the Online Exam System running on your machine.

## Step 1: Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## Step 2: Configure Environment Variables

Create a `.env` file in the `backend` folder with the following content:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/online-exam-system
JWT_SECRET=my_super_secret_jwt_key_change_in_production_12345
NODE_ENV=development
```

**Note:** You can copy from `.env.example` and modify as needed.

## Step 3: Start MongoDB

### Option A: Local MongoDB
Make sure MongoDB is installed and running:
```bash
mongod
```

### Option B: MongoDB Atlas (Cloud)
1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get your connection string
4. Replace `MONGODB_URI` in `.env` with your Atlas connection string

## Step 4: Run the Application

### Terminal 1 - Start Backend
```bash
cd backend
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB Connected: localhost
```

### Terminal 2 - Start Frontend
```bash
cd frontend
npm start
```

The browser will automatically open at `http://localhost:3000`

## Step 5: Create Your First Admin Account

1. Go to `http://localhost:3000/register`
2. Fill in the registration form
3. **Important:** Select "Admin" as the role
4. Click Register

## Step 6: Add Questions

1. Login with your admin account
2. Click "Manage Questions" button
3. Click "Add Question"
4. Fill in:
   - Question text
   - 4 options
   - Correct answer
   - Subject (e.g., Mathematics, Science)
   - Difficulty level
5. Click "Add Question"
6. Repeat to add more questions

## Step 7: Create an Exam

1. From admin dashboard, click "Create Exam"
2. Fill in exam details:
   - Title (e.g., "Mathematics Final Exam")
   - Subject
   - Duration in minutes
   - Total marks
   - Passing marks
   - Scheduled date and time
   - End date and time
3. Select questions by clicking on them
4. Click "Create Exam"

## Step 8: Test as Student

1. Logout from admin account
2. Register a new account with "Student" role
3. Login as student
4. You'll see available exams on the dashboard
5. Click "Start Exam" to take the exam
6. Answer questions and submit
7. View your results immediately

## Troubleshooting

### MongoDB Connection Failed
- Check if MongoDB is running
- Verify the connection string in `.env`
- For Windows: MongoDB might be installed as a service

### Port 3000 or 5000 Already in Use
- Close other applications using these ports
- Or change the ports in configuration files

### Cannot Login
- Make sure backend is running
- Check browser console for errors
- Verify MongoDB connection

### Questions Not Showing
- Make sure you're logged in as admin
- Check if questions were created successfully
- Refresh the page

## Quick Test Data

For testing, you can create:
- 5-10 questions in different subjects
- 2-3 exams with different difficulty levels
- 2-3 student accounts to test exam taking

## Next Steps

- Explore the admin dashboard
- Create multiple exams
- Test the exam-taking experience
- View results and analytics

## Need Help?

Check the main README.md for detailed documentation and API endpoints.

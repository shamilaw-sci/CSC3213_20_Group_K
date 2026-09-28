# FuturePath AI — Career Guidance System

Complete full-stack application with MongoDB integration.

## 🚀 Quick Start

### Backend Setup
```bash
cd backend
npm install
npm run mongo-test          # Test MongoDB connection
npm run migrate:careers     # Migrate career data
npm run dev                 # Start development server (http://localhost:5000)
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev                 # Start development server (http://localhost:5173)
```

## 📦 Architecture

```
frontend/                    # React + Vite
├── src/
│   ├── pages/              # React pages (StudentProfile, Recommendations, etc)
│   ├── components/         # Reusable components (ProfileForm, CareerCard)
│   └── api/                # API client (recommendationApi.js)
│
backend/                     # Node.js + Express
├── config/                 # Database configuration (db.js)
├── models/                 # Mongoose models (Career.js, StudentProfile.js)
├── controllers/            # Request handlers
├── routes/                 # API routes
├── scripts/                # Utilities (migrate-career-data.js)
└── server.js              # Main Express app
```

## 🗄️ Database Schema

### Career Model
```javascript
{
  title: String,
  category: "Full-Time" | "Part-Time" | "Freelance",
  workArea: String,
  relatedSkills: [String],
  educationLevels: [String],
  description: String,
  averageSalary: String,
  createdAt: Date,
  updatedAt: Date
}
```

### StudentProfile Model
```javascript
{
  name: String,
  skills: [String],
  interests: [String],
  educationLevel: String,
  preferredJobType: "Full-Time" | "Part-Time" | "Freelance",
  preferredWorkArea: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Endpoints

### Recommendations
- **POST** `/api/recommendations`
  - Request: Student profile data
  - Response: Array of career recommendations with match percentages

### Student Profiles
- **POST** `/api/students` — Create new profile
- **GET** `/api/students` — Get all profiles
- **GET** `/api/students/:id` — Get profile by ID
- **PUT** `/api/students/:id` — Update profile
- **DELETE** `/api/students/:id` — Delete profile

## 🔑 Environment Variables

Create `.env` in backend folder:
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=career-guidance-cluster
```

## ✅ Testing

### Test Recommendations API
```bash
curl -X POST http://localhost:5000/api/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "skills": ["JavaScript", "React"],
    "interests": ["Web Development"],
    "educationLevel": "Bachelor'\''s Degree",
    "preferredJobType": "Full-Time",
    "preferredWorkArea": "Technology"
  }'
```

### Test Student Profile Creation
```bash
curl -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane",
    "skills": ["Python", "Data Analysis"],
    "interests": ["AI"],
    "educationLevel": "Master'\''s Degree",
    "preferredJobType": "Full-Time",
    "preferredWorkArea": "Technology"
  }'
```

## 🚢 Deployment

### Backend (Node.js)
Recommended platforms:
- **Render.com** - Free tier available
- **Railway.app** - Pay-as-you-go
- **AWS Elastic Beanstalk**
- **Heroku** (paid)

Environment variables needed on deployment:
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `PORT` - Server port (optional, defaults to 5000)

### Frontend (React)
Recommended platforms:
- **Vercel** - Optimized for Vite/React
- **Netlify** - Easy deployment
- **GitHub Pages** - Static hosting

Build command:
```bash
npm run build   # Creates dist/ folder
```

## 📝 Features Implemented

✅ MongoDB integration for career data persistence
✅ Student profile creation and management
✅ Career recommendation algorithm (skill, interest, education matching)
✅ Full REST API with CRUD operations
✅ Frontend integration with backend
✅ Error handling and validation
✅ Loading states and user feedback
✅ Responsive UI

## 🔄 Data Flow

1. User fills out profile form (frontend)
2. Profile saved to MongoDB via `/api/students` (backend)
3. Frontend retrieves recommendations via `/api/recommendations`
4. Backend queries Career collection from MongoDB
5. Scores and filters careers based on matching algorithm
6. Returns sorted recommendations to frontend
7. User views recommendations with match percentages

## 🛠️ Development Commands

### Backend
```bash
npm run dev              # Start with nodemon
npm start               # Start production
npm run mongo-test      # Test MongoDB
npm run migrate:careers # Populate careers collection
```

### Frontend
```bash
npm run dev             # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Run ESLint
```

## 📞 Support

For issues or questions:
1. Check MongoDB Atlas whitelist includes your IP
2. Ensure `.env` file has correct credentials
3. Verify both servers are running on correct ports
4. Check browser console and terminal for errors

---

**Built with ❤️ by the FuturePath AI Team**

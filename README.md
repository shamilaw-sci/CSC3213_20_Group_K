# CSC3213_20_Group_K — FuturePath AI Career Guidance System

A full-stack career recommendation application powered by React, Node.js, Express, and MongoDB.

## 🎯 Overview

FuturePath AI analyzes student profiles and recommends personalized career paths based on:
- **Skills** - Technical and soft skills
- **Interests** - Career interests and preferences
- **Education Level** - Diploma to PhD
- **Job Type** - Full-Time, Part-Time, or Freelance
- **Work Area** - Technology, Design, Marketing, Business, etc.

## ⚡ Quick Start

### Prerequisites
- Node.js v20+
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### 1. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=career-guidance-cluster
```

Start backend:
```bash
npm run dev                 # Development with nodemon
npm run mongo-test         # Test MongoDB connection
npm run migrate:careers    # Populate career data
```

Backend runs at: **http://localhost:5000**

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

## 📂 Project Structure

```
.
├── backend/
│   ├── config/              # Database & environment setup
│   ├── models/              # Mongoose schemas (Career, StudentProfile)
│   ├── controllers/         # Business logic
│   ├── routes/              # API routes
│   ├── scripts/             # Migration scripts
│   ├── server.js            # Express app
│   ├── package.json
│   └── .env                 # Environment variables (not in git)
│
├── frontend/
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable components
│   │   ├── api/             # API client
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── Dockerfile.backend       # Backend container
├── Dockerfile.frontend      # Frontend container
├── docker-compose.yml       # Full stack orchestration
├── DEPLOYMENT.md            # Deployment guide
└── README.md               # This file
```

## 🔌 API Documentation

### Recommendations Endpoint
**POST** `/api/recommendations`

Request:
```json
{
  "name": "John Doe",
  "skills": ["JavaScript", "React", "Python"],
  "interests": ["Web Development", "AI"],
  "educationLevel": "Bachelor's Degree",
  "preferredJobType": "Full-Time",
  "preferredWorkArea": "Technology"
}
```

Response:
```json
{
  "success": true,
  "studentName": "John Doe",
  "totalResults": 8,
  "recommendations": [
    {
      "_id": "...",
      "title": "Software Engineer",
      "matchPercentage": 85,
      "reason": "Your skills in javascript, react match this career...",
      "category": "Full-Time",
      "workArea": "Technology",
      "averageSalary": "$95,000 - $140,000"
    }
  ]
}
```

### Student Profile Endpoints
- **POST** `/api/students` - Create profile
- **GET** `/api/students` - Get all profiles
- **GET** `/api/students/:id` - Get by ID
- **PUT** `/api/students/:id` - Update profile
- **DELETE** `/api/students/:id` - Delete profile

## 🗄️ Database Models

### Career
```javascript
{
  _id: ObjectId,
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

### StudentProfile
```javascript
{
  _id: ObjectId,
  name: String,
  skills: [String],
  interests: [String],
  educationLevel: String,
  preferredJobType: String,
  preferredWorkArea: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing

### Test API with curl
```bash
curl -X POST http://localhost:5000/api/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Test User",
    "skills":["JavaScript"],
    "interests":["Programming"],
    "educationLevel":"Bachelor'\''s Degree",
    "preferredJobType":"Full-Time",
    "preferredWorkArea":"Technology"
  }'
```

### Test MongoDB Connection
```bash
cd backend
npm run mongo-test
```

## 🚀 Deployment

### Using Docker
```bash
docker-compose up --build
```

Services:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- MongoDB: localhost:27017

### Manual Deployment

**Backend (Render.com, Railway, Heroku, AWS)**
1. Push code to GitHub
2. Connect repository
3. Set environment variables (MONGODB_URI, PORT)
4. Deploy

**Frontend (Vercel, Netlify, GitHub Pages)**
1. Connect repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## 🔐 Security

- ✅ MongoDB Atlas IP whitelist configured
- ✅ Environment variables in `.env` (not committed)
- ✅ Input validation on all endpoints
- ✅ CORS enabled for frontend-backend communication
- ⚠️ Never commit `.env` file
- ⚠️ Rotate database password after development

## 📊 Recommendation Algorithm

Scoring System (100 points total):
- **Skill Match**: 40 points (matching student skills with job requirements)
- **Interest Match**: 25 points (alignment with career interests)
- **Education Match**: 15 points (education level compatibility)
- **Job Type Match**: 10 points (preferred job type match)
- **Work Area Match**: 10 points (preferred work area match)

Careers are filtered to only show matches > 0% and sorted by match percentage.

## ✨ Features

- ✅ Full-stack MongoDB integration
- ✅ Student profile CRUD operations
- ✅ 10 pre-loaded career options
- ✅ Intelligent matching algorithm
- ✅ Responsive React UI
- ✅ REST API with Express
- ✅ Error handling & validation
- ✅ Loading states & user feedback
- ✅ Docker support
- ✅ Environment-based configuration

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit pull request

## 📝 License

ISC

## 👥 Team

Group K - CSC3213 Course Project

## 📞 Support

For issues:
1. Check MongoDB connection string
2. Verify both servers are running
3. Check browser console for errors
4. Review terminal output for logs

---

**Built with Node.js, Express, React, and MongoDB** ✨

import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// Public pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// User pages
import Dashboard from "./pages/Dashboard";
import CareerDetails from "./pages/CareerDetails";
import AIRecommendation from "./pages/AIRecommendation";
import AIChat from "./pages/AIChat";
import LearningPath from "./pages/LearningPath";
import SkillGap from "./pages/SkillGap";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import ResumeHistory from "./pages/ResumeHistory";
import Profile from "./pages/Profile";
import CareerReport from "./pages/CareerReport";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import CareerManagement from "./pages/admin/CareerManagement";
import CvAnalysisManagement from "./pages/admin/CvAnalysisManagement";
import RecommendationHistory from "./pages/admin/RecommendationHistory";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/"         element={<Home />} />
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected user routes */}
      <Route path="/dashboard"        element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/career-details"   element={<ProtectedRoute><CareerDetails /></ProtectedRoute>} />
      <Route path="/ai-recommendation"element={<ProtectedRoute><AIRecommendation /></ProtectedRoute>} />
      <Route path="/ai-chat"          element={<ProtectedRoute><AIChat /></ProtectedRoute>} />
      <Route path="/learning-path"    element={<ProtectedRoute><LearningPath /></ProtectedRoute>} />
      <Route path="/skill-gap"        element={<ProtectedRoute><SkillGap /></ProtectedRoute>} />
      <Route path="/resume-analyzer"  element={<ProtectedRoute><ResumeAnalyzer /></ProtectedRoute>} />
      <Route path="/resume-history"   element={<ProtectedRoute><ResumeHistory /></ProtectedRoute>} />
      <Route path="/profile"          element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/career-report"    element={<ProtectedRoute><CareerReport /></ProtectedRoute>} />

      {/* Admin routes */}
      <Route path="/admin"         element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/users"   element={<AdminRoute><UserManagement /></AdminRoute>} />
      <Route path="/admin/careers" element={<AdminRoute><CareerManagement /></AdminRoute>} />
      <Route path="/admin/cv-analyses" element={<AdminRoute><CvAnalysisManagement /></AdminRoute>} />
      <Route path="/admin/recommendations" element={<AdminRoute><RecommendationHistory /></AdminRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

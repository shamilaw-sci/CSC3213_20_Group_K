import { Routes, Route, Navigate } from "react-router-dom";

import Home            from "./pages/Home";
import Login           from "./pages/Login";
import Register        from "./pages/Register";
import Dashboard       from "./pages/Dashboard";
import CareerDetails   from "./pages/CareerDetails";
import LearningPath    from "./pages/LearningPath";
import AIRecommendation from "./pages/AIRecommendation";
import AIChat          from "./pages/AIChat";
import Profile         from "./pages/Profile";
import ResumeAnalyzer  from "./pages/ResumeAnalyzer";
import ResumeHistory   from "./pages/ResumeHistory";
import SkillGap        from "./pages/SkillGap";
import ProtectedRoute  from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/"         element={<Home />} />
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route path="/dashboard"       element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/career-details"  element={<ProtectedRoute><CareerDetails /></ProtectedRoute>} />
      <Route path="/learning-path"   element={<ProtectedRoute><LearningPath /></ProtectedRoute>} />
      <Route path="/learning-path/:career" element={<ProtectedRoute><LearningPath /></ProtectedRoute>} />
      <Route path="/ai-recommendation" element={<ProtectedRoute><AIRecommendation /></ProtectedRoute>} />
      <Route path="/skill-gap"       element={<ProtectedRoute><SkillGap /></ProtectedRoute>} />
      <Route path="/ai-chat"         element={<ProtectedRoute><AIChat /></ProtectedRoute>} />
      <Route path="/resume-analyzer" element={<ProtectedRoute><ResumeAnalyzer /></ProtectedRoute>} />
      <Route path="/resume-history"  element={<ProtectedRoute><ResumeHistory /></ProtectedRoute>} />
      <Route path="/profile"         element={<ProtectedRoute><Profile /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

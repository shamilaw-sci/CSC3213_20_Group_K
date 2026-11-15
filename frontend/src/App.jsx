import { Navigate, Route, Routes } from "react-router-dom";
import AIChat from "./pages/AIChat";
import AIRecommendation from "./pages/AIRecommendation";
import CareerDetails from "./pages/CareerDetails";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import LearningPath from "./pages/LearningPath";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import ResumeHistory from "./pages/ResumeHistory";
import SkillGap from "./pages/SkillGap";
import GuidePortal from "./guide/GuidePortal";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Career exploration and student-to-guide scheduling */}
      <Route path="/career" element={<CareerDetails />} />
      <Route path="/career-details" element={<CareerDetails />} />
      <Route path="/career-details/:career" element={<CareerDetails />} />
      <Route path="/learning-path" element={<LearningPath />} />
      <Route path="/learning-path/:career" element={<LearningPath />} />
      <Route path="/guide/*" element={<GuidePortal />} />

      {/* Signed-in student tools */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/ai-recommendation" element={<ProtectedRoute><AIRecommendation /></ProtectedRoute>} />
      <Route path="/skill-gap" element={<ProtectedRoute><SkillGap /></ProtectedRoute>} />
      <Route path="/ai-chat" element={<ProtectedRoute><AIChat /></ProtectedRoute>} />
      <Route path="/resume-analyzer" element={<ProtectedRoute><ResumeAnalyzer /></ProtectedRoute>} />
      <Route path="/resume-history" element={<ProtectedRoute><ResumeHistory /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

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
import AdminPortalPending from "./pages/AdminPortalPending";

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
      <Route path="/guide/*" element={<ProtectedRoute allowedRoles={["guide"]}><GuidePortal /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminPortalPending /></ProtectedRoute>} />

      {/* Signed-in student tools */}
      <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["student"]}><Dashboard /></ProtectedRoute>} />
      <Route path="/ai-recommendation" element={<ProtectedRoute allowedRoles={["student"]}><AIRecommendation /></ProtectedRoute>} />
      <Route path="/skill-gap" element={<ProtectedRoute allowedRoles={["student"]}><SkillGap /></ProtectedRoute>} />
      <Route path="/ai-chat" element={<ProtectedRoute allowedRoles={["student"]}><AIChat /></ProtectedRoute>} />
      <Route path="/resume-analyzer" element={<ProtectedRoute allowedRoles={["student"]}><ResumeAnalyzer /></ProtectedRoute>} />
      <Route path="/resume-history" element={<ProtectedRoute allowedRoles={["student"]}><ResumeHistory /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute allowedRoles={["student"]}><Profile /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

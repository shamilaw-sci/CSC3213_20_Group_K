
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CareerDetails from "./pages/CareerDetails";
import LearningPath from "./pages/LearningPath";
import GuidePortal from "./guide/GuidePortal";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default homepage */}
        <Route
          path="/"
          element={<Navigate to="/career" replace />}
        />

        {/* Career Details Page */}
        <Route
          path="/career"
          element={<CareerDetails />}
        />

        {/* Learning Path Page */}
        <Route
          path="/learning-path"
          element={<LearningPath />}
        />

        {/* Temporary development access for the independent Guide Portal */}
        <Route
          path="/guide/*"
          element={<GuidePortal />}
        />

        {/* Handle unknown routes */}
        <Route
          path="*"
          element={<Navigate to="/career" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

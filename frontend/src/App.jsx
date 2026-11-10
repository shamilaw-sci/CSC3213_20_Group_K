
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CareerDetails from "./pages/CareerDetails";
import LearningPath from "./pages/LearningPath";

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

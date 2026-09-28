import { BrowserRouter, Routes, Route } from "react-router-dom";
import CareerDetails from "./pages/CareerDetails";
import LearningPath from "./pages/LearningPath";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/career"
          element={<CareerDetails />}
        />

        <Route
          path="/learning-path"
          element={<LearningPath />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
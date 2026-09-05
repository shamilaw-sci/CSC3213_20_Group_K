import { BrowserRouter, Routes, Route } from "react-router-dom";
import CareerDetails from "./pages/CareerDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/career"
          element={<CareerDetails />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
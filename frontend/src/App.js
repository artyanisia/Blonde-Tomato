import "./App.css";
import Auth from "./components/auth/Auth";
import StudentDashboard from "./components/StudentDashboard";
import ProfessorDashboard from "./components/ProfessorDashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />}></Route>
        <Route path="/student/dashboard" element={<StudentDashboard />}></Route>
        <Route path="/professor/dashboard" element={<ProfessorDashboard />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

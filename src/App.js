import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SG from "./pages/SG";
import IAM from "./pages/IAM";
import IAM_USERACCESSKEY from "./pages/IAM_USERACCESSKEY";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <Routes>

        {/* Default route → Dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* Pages */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sg" element={<SG />} />
        <Route path="/iam" element={<IAM />} />
        <Route path="/iam_useraccesskey" element={<IAM_USERACCESSKEY />} />

      </Routes>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SG from "./pages/SG";
import IAM from "./pages/IAM";

function App() {
  return (
    <Router>
      <div className="p-4">
        <nav className="flex gap-4 bg-gray-100 p-3 rounded">
          <Link to="/sg" className="text-blue-600">Security Groups</Link>
          <Link to="/iam" className="text-blue-600">IAM</Link>
        </nav>

        <Routes>
          <Route path="/sg" element={<SG />} />
          <Route path="/iam" element={<IAM />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

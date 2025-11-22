import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SG from "./pages/SG";
import IAM from "./pages/IAM";
import IAM_USERACCESSKEY from "./pages/IAM_USERACCESSKEY";

function App() {
  return (
    <Router>
      <div className="p-4">
        <nav className="flex gap-4 bg-gray-100 p-3 rounded">
          <Link to="/sg" className="text-blue-600">Security Groups</Link>
          <Link to="/iam" className="text-blue-600">IAM</Link>
          <Link to="/iam_useraccesskey" className="text-blue-600">IAM_USERACCESSKEY</Link>
        </nav>

        <Routes>
          <Route path="/sg" element={<SG />} /> #element is a component point to SG.js
          <Route path="/iam" element={<IAM />} />
          <Route path="/iam_useraccesskey" element={<IAM_USERACCESSKEY />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

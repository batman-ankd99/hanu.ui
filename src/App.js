import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import EC2 from "./pages/EC2";
import SG from "./pages/SG";
import S3 from "./pages/S3";
import IAM from "./pages/IAM";

function App() {
  return (
    <Router>
      <div className="p-4">
        <nav className="flex gap-4 bg-gray-100 p-3 rounded">
          <Link to="/ec2" className="text-blue-600">EC2</Link>
          <Link to="/sg" className="text-blue-600">Security Groups</Link>
          <Link to="/s3" className="text-blue-600">S3</Link>
          <Link to="/iam" className="text-blue-600">IAM</Link>
        </nav>

        <Routes>
          <Route path="/ec2" element={<EC2 />} />
          <Route path="/sg" element={<SG />} />
          <Route path="/s3" element={<S3 />} />
          <Route path="/iam" element={<IAM />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

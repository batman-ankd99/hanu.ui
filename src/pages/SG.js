import React, { useEffect, useState } from "react";

export default function SG() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/analyzer/sg")
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  if (!data) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="mt-4">
      <h1 className="text-2xl font-bold">Security Group Risks</h1>
      <pre className="bg-black text-green-400 p-4 rounded mt-2 overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

import React, { useEffect, useState } from "react";

export default function EC2() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/analyzer/ec2")
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="mt-4">
      <h1 className="text-2xl font-bold">EC2 Risk Report</h1>
      <pre className="bg-black text-green-400 p-4 rounded mt-2 overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

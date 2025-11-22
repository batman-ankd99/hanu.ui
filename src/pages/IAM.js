import React, { useEffect, useState } from "react";

export default function IAM() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://18.208.201.41:5000/analyzer/iam")
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="mt-4">
      <h1 className="text-2xl font-bold">IAM Policy Audit</h1>
      <pre className="bg-black text-green-400 p-4 rounded mt-2">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

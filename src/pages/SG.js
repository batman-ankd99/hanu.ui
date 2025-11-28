import React, { useEffect, useState } from "react";

function SG() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://44.222.86.59:5000/analyzer/sg")
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch SG analytics");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-5">Loading SG analytics...</div>;
  if (error) return <div className="p-5 text-red-600">{error}</div>;

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Security Group Analytics</h1>
      <p className="mb-4">Total Risky SG Records: {data.count}</p>

      {data.records.map((sg, index) => (
        <div key={index} className="border p-4 mb-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold">{sg.group_name}</h2>
          <p className="text-gray-600 mb-2">Group ID: {sg.group_id}</p>

          {/* Inbound rules */}
          <h3 className="font-semibold mt-2">Inbound Rules:</h3>
          {sg.inbound_rules.length === 0 ? (
            <p>No inbound rules</p>
          ) : (
            <ul className="list-disc ml-6">
              {sg.inbound_rules.map((rule, i) => (
                <li key={i}>
                  {rule.cidr} → {rule.protocol} ({rule.from_port} - {rule.to_port})
                </li>
              ))}
            </ul>
          )}

          {/* Outbound rules */}
          <h3 className="font-semibold mt-2">Outbound Rules:</h3>
          {sg.outbound_rules.length === 0 ? (
            <p>No outbound rules</p>
          ) : (
            <ul className="list-disc ml-6">
              {sg.outbound_rules.map((rule, i) => (
                <li key={i}>
                  {rule.cidr} → {rule.protocol} ({rule.from_port} - {rule.to_port})
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

export default SG;

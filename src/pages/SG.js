import React, { useEffect, useState } from "react";

function SG() {
  const [data, setData] = useState(null);
  const [findings, setFindings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    // -------------------
    // OLD SG DATA
    // -------------------
    fetch("http://32.196.114.165:5000/analyzer/sg")
      .then((res) => res.json())
      .then((result) => {
        setData(result);
      })
      .catch(() => {
        setError("Failed to fetch SG analytics");
      });

    // -------------------
    // NEW: FINDINGS API
    // -------------------
    fetch("http://32.196.114.165:5000/findings")
      .then((res) => res.json())
      .then((result) => {
        setFindings(result.findings || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });

  }, []);

  if (loading) return <div className="p-5">Loading SG analytics...</div>;
  if (error) return <div className="p-5 text-red-600">{error}</div>;

  return (
    <div className="p-5">

      <h1 className="text-2xl font-bold mb-4">Security Group Analytics</h1>

      {/* ---------------- PRISMA STYLE FINDINGS ---------------- */}
      <div className="mb-6 p-4 border rounded bg-gray-50">
        <h2 className="text-xl font-semibold mb-2">Security Findings</h2>

        {findings.length === 0 ? (
          <p>No security issues found</p>
        ) : (
          findings.map((f, i) => (
            <div key={i} className="border p-2 mb-2 rounded">
              <p><b>Rule:</b> {f.rule_id}</p>
              <p><b>Severity:</b> {f.severity}</p>
              <p><b>Description:</b> {f.description}</p>
              <p><b>Resource:</b> {f.resource_id}</p>
            </div>
          ))
        )}
      </div>

      {/* ---------------- OLD SG DATA ---------------- */}
      <p className="mb-4">Total SG Records: {data?.count}</p>

      {data?.records?.map((sg, index) => (
        <div key={index} className="border p-4 mb-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold">{sg.group_name}</h2>
          <p className="text-gray-600 mb-2">Group ID: {sg.group_id}</p>

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

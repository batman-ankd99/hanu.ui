import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const [findings, setFindings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://32.196.114.165:5000/findings")
      .then((res) => res.json())
      .then((data) => {
        setFindings(data.findings || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-4">Loading Security Dashboard...</p>;

  // ---------------- METRICS ----------------
  const total = findings.length;

  const high = findings.filter(f => f.severity === "HIGH").length;
  const medium = findings.filter(f => f.severity === "MEDIUM").length;
  const low = findings.filter(f => f.severity === "LOW").length;

  // top risky resources
  const topResources = findings.reduce((acc, f) => {
    acc[f.resource_id] = (acc[f.resource_id] || 0) + 1;
    return acc;
  }, {});

  const sortedResources = Object.entries(topResources)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Security Posture Dashboard
      </h1>

      {/* ---------------- CARDS ---------------- */}
      <div className="grid grid-cols-4 gap-4 mb-6">

        <div className="p-4 border rounded shadow">
          <h2 className="text-lg font-semibold">Total Issues</h2>
          <p className="text-2xl">{total}</p>
        </div>

        <div className="p-4 border rounded shadow bg-red-50">
          <h2 className="text-lg font-semibold text-red-600">High</h2>
          <p className="text-2xl">{high}</p>
        </div>

        <div className="p-4 border rounded shadow bg-yellow-50">
          <h2 className="text-lg font-semibold text-yellow-600">Medium</h2>
          <p className="text-2xl">{medium}</p>
        </div>

        <div className="p-4 border rounded shadow bg-green-50">
          <h2 className="text-lg font-semibold text-green-600">Low</h2>
          <p className="text-2xl">{low}</p>
        </div>

      </div>

      {/* ---------------- TOP RISKY RESOURCES ---------------- */}
      <div className="p-4 border rounded">
        <h2 className="text-xl font-semibold mb-3">
          Top Risky Resources
        </h2>

        {sortedResources.map(([resource, count], idx) => (
          <div key={idx} className="flex justify-between border-b py-2">
            <span>{resource}</span>
            <span className="font-bold">{count} issues</span>
          </div>
        ))}
      </div>

    </div>
  );
}

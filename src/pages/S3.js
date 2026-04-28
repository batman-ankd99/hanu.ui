import React, { useEffect, useState } from "react";

export default function S3() {
  const [data, setData] = useState(null);
  const [findings, setFindings] = useState([]);

  useEffect(() => {

    // ---------------- S3 ANALYZER ----------------
    fetch("http://32.196.114.165:5000/analyzer/s3")
      .then(res => res.json())
      .then(data => setData(data));

    // ---------------- FINDINGS API ----------------
    fetch("http://32.196.114.165:5000/findings")
      .then(res => res.json())
      .then(data => setFindings(data.findings || []))
      .catch(() => {});

  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="mt-4">

      <h1 className="text-2xl font-bold">S3 Bucket Risks</h1>

      {/* ---------------- PRISMA STYLE FINDINGS ---------------- */}
      <div className="mt-4 p-4 border rounded bg-gray-50">
        <h2 className="text-xl font-semibold mb-2">Security Findings</h2>

        {findings.filter(f => f.resource_id?.includes("s3")).length === 0 ? (
          <p>No S3 security issues found</p>
        ) : (
          findings
            .filter(f => f.resource_id?.includes("s3"))
            .map((f, idx) => (
              <div key={idx} className="border p-2 mb-2 rounded">
                <p><b>Rule:</b> {f.rule_id}</p>
                <p><b>Severity:</b> {f.severity}</p>
                <p><b>Description:</b> {f.description}</p>
                <p><b>Resource:</b> {f.resource_id}</p>
              </div>
            ))
        )}
      </div>

      {/* ---------------- RAW DATA ---------------- */}
      <pre className="bg-black text-green-400 p-4 rounded mt-4">
        {JSON.stringify(data, null, 2)}
      </pre>

    </div>
  );
}

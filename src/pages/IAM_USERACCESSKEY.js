import React, { useEffect, useState } from "react";

export default function IAMAccessKeys() {
  const [iamKeys, setIamKeys] = useState([]);
  const [findings, setFindings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    // ---------------- IAM ACCESS KEY ANALYTICS ----------------
    fetch("http://32.196.114.165:5000/analyzer/iam_useraccesskey")
      .then((res) => res.json())
      .then((data) => {
        setIamKeys(data.records || []);
      })
      .catch((err) => {
        console.error("Error fetching IAM User Access Key analytics:", err);
      });

    // ---------------- FINDINGS API ----------------
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

  if (loading) return <p className="p-4 text-lg">Loading IAM Access Key Analytics...</p>;

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        IAM Access Key Analysis, older than 10 Days
      </h1>

      {/* ---------------- PRISMA STYLE FINDINGS ---------------- */}
      <div className="mb-6 p-4 border rounded bg-gray-50">
        <h2 className="text-xl font-semibold mb-2">Security Findings</h2>

        {/* SAFE FIX APPLIED HERE */}
        {findings.filter(f =>
          String(f.resource_id || "").includes("iam")
        ).length === 0 ? (
          <p>No IAM credential risks found</p>
        ) : (
          findings
            .filter(f =>
              String(f.resource_id || "").includes("iam")
            )
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

      {/* ---------------- RAW ACCESS KEY DATA ---------------- */}
      {iamKeys.length === 0 ? (
        <p className="text-lg text-green-500">
          No access keys older than 90 days found.
        </p>
      ) : (
        <div className="space-y-4">
          {iamKeys.map((key, idx) => (
            <div key={idx} className="bg-white border rounded-lg shadow p-4">
              <p><strong>UserName:</strong> {key.UserName}</p>
              <p><strong>AccessKeyId:</strong> {key.AccessKeyId}</p>
              <p><strong>Age (days):</strong> {key.Age}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

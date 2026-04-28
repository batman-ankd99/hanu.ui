import React, { useEffect, useState } from "react";

export default function IAM() {
  const [iamData, setIamData] = useState([]);
  const [findings, setFindings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    // ---------------- IAM ANALYTICS ----------------
    fetch("http://32.196.114.165:5000/analyzer/iam")
      .then((res) => res.json())
      .then((data) => {
        setIamData(data.records || []);
      })
      .catch((err) => {
        console.error("Error fetching IAM analytics:", err);
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

  if (loading) return <p className="p-4 text-lg">Loading IAM Analytics...</p>;

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">IAM Policy Analysis</h1>

      {/* ---------------- PRISMA STYLE FINDINGS ---------------- */}
      <div className="mb-6 p-4 border rounded bg-gray-50">
        <h2 className="text-xl font-semibold mb-2">Security Findings</h2>

        {/* SAFE FIX APPLIED HERE */}
        {findings.filter(f =>
          String(f.resource_id || "").includes("iam")
        ).length === 0 ? (
          <p>No IAM security issues found</p>
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

      {/* ---------------- IAM DATA ---------------- */}
      {iamData.length === 0 ? (
        <p className="text-lg text-red-500">No risky IAM policies found.</p>
      ) : (
        <div className="space-y-6">
          {iamData.map((iam, idx) => {
            let attached = {};
            try {
              attached = JSON.parse(iam.attached_entities);
            } catch (err) {}

            return (
              <div
                key={idx}
                className="bg-white border rounded-lg shadow p-4"
              >
                <h2 className="text-xl font-semibold mb-2">
                  Policy: {iam.policy_name}
                </h2>

                <p><strong>Policy ID:</strong> {iam.id}</p>
                <p><strong>Effect:</strong> {iam.effect}</p>
                <p><strong>Principal:</strong> {iam.principal || "None"}</p>

                <div className="mt-3">
                  <strong>Actions:</strong>
                  <ul className="ml-6 list-disc">
                    {iam.actions?.map((action, i) => (
                      <li key={i}>{action}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-3">
                  <strong>Attached To:</strong>
                  <div className="mt-2 bg-gray-100 p-3 rounded">
                    <p><strong>Users:</strong> {attached.Users?.join(", ") || "None"}</p>
                    <p><strong>Groups:</strong> {attached.Groups?.join(", ") || "None"}</p>
                    <p><strong>Roles:</strong> {attached.Roles?.join(", ") || "None"}</p>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

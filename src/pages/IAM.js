import React, { useEffect, useState } from "react";

export default function IAM() {

  const [iamData, setIamData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://18.208.201.41:5000/analyzer/iam")
      .then((res) => res.json())
      .then((data) => {
        setIamData(data.records || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching IAM analytics:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-lg p-4">Loading IAM Analytics...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">IAM Policy Analysis</h1>

      {iamData.length === 0 ? (
        <p className="text-red-500 text-lg">No risky IAM policies found.</p>
      ) : (
        <div className="space-y-6">
          {iamData.map((iam, idx) => (
            <div
              key={idx}
              className="border rounded-lg shadow p-4 bg-white"
            >
              <h2 className="text-xl font-semibold mb-2">
                Policy ID: {iam.id}
              </h2>

              <p className="mb-1">
                <strong>Effect:</strong> {iam.effect}
              </p>

              <p className="mb-1">
                <strong>Principal:</strong>{" "}
                {typeof iam.principal === "object"
                  ? JSON.stringify(iam.principal, null, 2)
                  : iam.principal}
              </p>

              <div className="mb-2">
                <strong>Actions:</strong>
                <ul className="list-disc ml-6">
                  {Array.isArray(iam.actions) ? (
                    iam.actions.map((action, i) => (
                      <li key={i}>{action}</li>
                    ))
                  ) : (
                    <li>{iam.actions}</li>
                  )}
                </ul>
              </div>

              {iam.resource && (
                <p className="mb-1">
                  <strong>Resource:</strong> {iam.resource}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

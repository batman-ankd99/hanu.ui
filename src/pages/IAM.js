import { useEffect, useState } from "react";
import { getFindings } from "../api/api";

export default function IAM() {

  const [findings, setFindings] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);

      const res = await getFindings();
      setFindings(res.data.findings || []);

    } catch (err) {
      console.error("IAM load failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter only IAM-related findings
  const iamFindings = findings.filter(f =>
    (f.service === "iam" || f.resource_type === "iam_policy")
  );

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        IAM Security Findings
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : iamFindings.length === 0 ? (
        <p className="text-green-500">
          No IAM security issues found
        </p>
      ) : (
        <div className="space-y-3">

          {iamFindings.map((f, idx) => (
            <div
              key={idx}
              className="p-4 bg-gray-900 text-white rounded border-l-4 border-red-500"
            >
              <p><b>Severity:</b> {f.severity}</p>
              <p><b>Finding:</b> {f.finding}</p>
              <p><b>Resource:</b> {f.resource_id}</p>
              <p className="text-gray-400 mt-1">
                {f.recommendation}
              </p>
            </div>
          ))}

        </div>
      )}

    </div>
  );
}

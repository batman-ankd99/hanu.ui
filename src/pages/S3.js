import { useEffect, useState } from "react";
import { getFindings } from "../api/api";

export default function S3() {

  const [findings, setFindings] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);

      const res = await getFindings();
      setFindings(res.data.findings || []);

    } catch (err) {
      console.error("S3 load failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // filter only S3-related findings
  const s3Findings = findings.filter(f =>
    f.service === "s3" || f.resource_type === "s3_bucket"
  );

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        S3 Security Findings
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : s3Findings.length === 0 ? (
        <p className="text-green-500">
          No S3 security issues found
        </p>
      ) : (
        <div className="space-y-3">

          {s3Findings.map((f, idx) => (
            <div
              key={idx}
              className="p-4 bg-gray-900 text-white rounded border-l-4 border-yellow-500"
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

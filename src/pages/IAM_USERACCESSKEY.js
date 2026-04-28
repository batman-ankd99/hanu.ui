import { useEffect, useState } from "react";
import { getFindings } from "../api/api";

export default function IAMAccessKeys() {

  const [findings, setFindings] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);

      const res = await getFindings();
      setFindings(res.data.findings || []);

    } catch (err) {
      console.error("IAM Access Key load failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // filter only IAM access key issues
  const keyFindings = findings.filter(f =>
    f.service === "iam" &&
    f.finding?.toLowerCase().includes("access key")
  );

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        IAM Access Key Risks
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : keyFindings.length === 0 ? (
        <p className="text-green-500">
          No IAM access key risks found
        </p>
      ) : (
        <div className="space-y-3">

          {keyFindings.map((f, i) => (
            <div
              key={i}
              className="p-4 bg-gray-900 text-white rounded border-l-4 border-yellow-500"
            >
              <p><b>Severity:</b> {f.severity}</p>
              <p><b>Finding:</b> {f.finding}</p>
              <p><b>User/Resource:</b> {f.resource_id}</p>
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

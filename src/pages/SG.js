import { useEffect, useState } from "react";
import { getFindings } from "../api/api";

export default function SG() {

  const [findings, setFindings] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);

      const res = await getFindings();
      setFindings(res.data.findings || []);

    } catch (err) {
      console.error("SG load failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ONLY SG-related findings
  const sgFindings = findings.filter(f =>
    f.service === "sg" || f.resource_type === "security_group"
  );

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        Security Group Findings
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : sgFindings.length === 0 ? (
        <p className="text-green-500">
          No Security Group issues found
        </p>
      ) : (
        <div className="space-y-3">

          {sgFindings.map((f, i) => (
            <div
              key={i}
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

import { useEffect, useState } from "react";
import { getSummary, getFindings, runScan } from "../api/api";

// ---------------- CARD COMPONENT ----------------
function Card({ title, value, color }) {
  return (
    <div className="p-4 bg-gray-900 rounded border-l-4" style={{ borderColor: color }}>
      <h3 className="text-gray-400">{title}</h3>
      <p className="text-2xl font-bold">{value ?? 0}</p>
    </div>
  );
}

export default function Dashboard() {

  const [summary, setSummary] = useState({
    CRITICAL: 0,
    HIGH: 0,
    MEDIUM: 0,
    LOW: 0
  });

  const [findings, setFindings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);

  // ---------------- LOAD DATA ----------------
  const loadData = async () => {
    try {
      setLoading(true);

      const s = await getSummary();
      const f = await getFindings();

      // 🔥 DEBUG (remove later)
      console.log("SUMMARY API:", s.data);
      console.log("FINDINGS API:", f.data);

      // ✅ FIX (important)
      setSummary(s.data?.risk_summary || {
        CRITICAL: 0,
        HIGH: 0,
        MEDIUM: 0,
        LOW: 0
      });

      setFindings(f.data?.findings || []);

    } catch (err) {
      console.error("Dashboard load failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- RUN SCAN ----------------
  const handleScan = async () => {
    try {
      setScanning(true);
      await runScan();
      await loadData();
    } catch (err) {
      console.error("Scan failed:", err);
    } finally {
      setScanning(false);
    }
  };

  // ---------------- INIT ----------------
  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">

      {/* Sidebar */}
      <div className="w-60 bg-gray-900 p-4">
        <h2 className="text-xl font-bold">Cloud Audit</h2>
        <p className="text-gray-400 mt-2">Security Dashboard</p>
      </div>

      {/* Main */}
      <div className="flex-1 p-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>

          <button
            onClick={handleScan}
            className="bg-blue-600 px-4 py-2 rounded disabled:opacity-50"
            disabled={scanning}
          >
            {scanning ? "Scanning..." : "Run Scan"}
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-4 gap-4 mt-6">

          <Card title="CRITICAL" value={summary.CRITICAL} color="red" />
          <Card title="HIGH" value={summary.HIGH} color="orange" />
          <Card title="MEDIUM" value={summary.MEDIUM} color="yellow" />
          <Card title="LOW" value={summary.LOW} color="green" />

        </div>

        {/* Findings */}
        <div className="mt-8">

          <h2 className="text-xl mb-2">
            Findings {loading && "(Loading...)"}
          </h2>

          <table className="w-full text-left bg-gray-900 rounded">
            <thead>
              <tr className="text-gray-400">
                <th className="p-2">Severity</th>
                <th>Finding</th>
                <th>Resource</th>
              </tr>
            </thead>

            <tbody>

              {/* ✅ EMPTY STATE FIX */}
              {findings.length === 0 && !loading && (
                <tr>
                  <td colSpan="3" className="p-4 text-center text-gray-400">
                    No findings available
                  </td>
                </tr>
              )}

              {findings.map((f, i) => (
                <tr key={i} className="border-t border-gray-800">
                  <td className="p-2">{f.severity}</td>
                  <td>{f.finding}</td>
                  <td>{f.resource_id}</td>
                </tr>
              ))}

            </tbody>
          </table>

        </div>

      </div>
    </div>
  );
}

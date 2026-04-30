import { useEffect, useState } from "react";
import { getSummary, getFindings, runScan } from "../api/api";

// ---------------- CARD COMPONENT ----------------
function Card({ title, value, color }) {
  return (
    <div
      className="p-4 bg-gray-900 rounded border-l-4"
      style={{ borderColor: color }}
    >
      <h3 className="text-gray-400">{title}</h3>
      <p className="text-2xl font-bold">{value ?? 0}</p>
    </div>
  );
}

export default function Dashboard() {

  const [view, setView] = useState("dashboard");

  const [summary, setSummary] = useState({
    CRITICAL: 0,
    HIGH: 0,
    MEDIUM: 0,
    LOW: 0,
  });

  const [findings, setFindings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [pci, setPci] = useState(null);

  // ---------------- LOAD DATA ----------------
  const loadData = async () => {
    try {
      setLoading(true);

      const s = await getSummary();
      const f = await getFindings();

      setSummary(
        s.data?.risk_summary || {
          CRITICAL: 0,
          HIGH: 0,
          MEDIUM: 0,
          LOW: 0,
        }
      );

      setFindings(f.data?.findings || []);

      // PCI optional
      try {
        const pciRes = await fetch("http://localhost:5000/pci-summary");
        setPci(pciRes.ok ? await pciRes.json() : null);
      } catch {
        setPci(null);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- SCAN ----------------
  const handleScan = async () => {
    try {
      setScanning(true);
      await runScan();
      await loadData();
    } finally {
      setScanning(false);
    }
  };

  // ---------------- CSV ----------------
  const downloadCSV = () => {
    if (!findings.length) return;

    let csv = "Severity,Finding,Resource\n";

    findings.forEach((f) => {
      csv += `${f.severity},"${(f.finding || "").replace(/"/g, '""')}",${f.resource_id}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "vulnerabilities.csv";
    a.click();

    window.URL.revokeObjectURL(url);
  };

  // ---------------- FILTER ----------------
  const filteredFindings = () => {
    if (view === "dashboard") return findings;
    if (view === "sg") return findings.filter(f => f.resource_type === "sg");
    if (view === "iam") return findings.filter(f => f.resource_type === "iam_policy");
    if (view === "keys") return findings.filter(f => f.resource_type === "iam_mfa");
    return findings;
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">

      {/* SIDEBAR */}
      <div className="w-60 bg-gray-900 p-4">

        <h2 className="text-xl font-bold">Cloud Audit</h2>

        <div className="mt-6 flex flex-col gap-2">

          <button
            onClick={() => setView("dashboard")}
            className={`text-left p-2 rounded ${view === "dashboard" ? "bg-blue-600" : "hover:bg-gray-800"}`}
          >
            📊 Dashboard
          </button>

          <button
            onClick={() => setView("sg")}
            className={`text-left p-2 rounded ${view === "sg" ? "bg-blue-600" : "hover:bg-gray-800"}`}
          >
            🔐 Security Groups
          </button>

          <button
            onClick={() => setView("iam")}
            className={`text-left p-2 rounded ${view === "iam" ? "bg-blue-600" : "hover:bg-gray-800"}`}
          >
            👤 IAM Policies
          </button>

          <button
            onClick={() => setView("keys")}
            className={`text-left p-2 rounded ${view === "keys" ? "bg-blue-600" : "hover:bg-gray-800"}`}
          >
            🔑 IAM Access Keys
          </button>

        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{view.toUpperCase()}</h1>

          <div className="flex gap-2">
            <button
              onClick={downloadCSV}
              className="bg-green-600 px-4 py-2 rounded"
            >
              Download CSV
            </button>

            <button
              onClick={handleScan}
              className="bg-blue-600 px-4 py-2 rounded"
              disabled={scanning}
            >
              {scanning ? "Scanning..." : "Run Scan"}
            </button>
          </div>
        </div>

        {/* SUMMARY */}
        {view === "dashboard" && (
          <div className="grid grid-cols-4 gap-4 mt-6">

            <Card title="CRITICAL" value={summary.CRITICAL} color="red" />

            {/* 🔥 ORANGE FIX HERE */}
            <Card title="HIGH" value={summary.HIGH} color="orange" />

            <Card title="MEDIUM" value={summary.MEDIUM} color="yellow" />
            <Card title="LOW" value={summary.LOW} color="green" />
          </div>
        )}

        {/* PCI */}
        {view === "dashboard" && (
          <div className="mt-6 p-4 bg-purple-900 rounded border-l-4 border-purple-500">
            <h3 className="text-lg font-bold">PCI Compliance</h3>
            <p className="text-2xl font-bold mt-1">
              {pci?.pci_score ?? 0} / 100
            </p>
            <p>Status: {pci?.compliance_status ?? "UNKNOWN"}</p>
          </div>
        )}

        {/* FINDINGS TABLE */}
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

              {filteredFindings().length === 0 && !loading && (
                <tr>
                  <td colSpan="3" className="p-4 text-center text-gray-400">
                    No findings available
                  </td>
                </tr>
              )}

              {filteredFindings().map((f, i) => (
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

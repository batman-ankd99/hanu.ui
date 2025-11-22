import React, { useEffect, useState } from "react";

export default function IAMAccessKeys() {
  const [iamKeys, setIamKeys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://18.208.201.41:5000/analyzer/iam_useraccesskey")
      .then((res) => res.json())
      .then((data) => {
        setIamKeys(data.records || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching IAM User Access Key analytics:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-4 text-lg">Loading IAM Access Key Analytics...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">IAM Access Key Analysis</h1>

      {iamKeys.length === 0 ? (
        <p className="text-lg text-green-500">No access keys older than 90 days found.</p>
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

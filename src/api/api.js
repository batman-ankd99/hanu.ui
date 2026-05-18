import axios from "axios";

// 🔥 IMPORTANT: change this if frontend is NOT on same machine
const API = "http://32.198.50.43:5000";
// Example for EC2 / server:
// const API = "http://10.0.6.175:5000";

const client = axios.create({
  baseURL: API,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 10000
});

// ---------------- SUMMARY ----------------
export const getSummary = async () => {
  try {
    const res = await client.get("/risk-summary");
    console.log("API /risk-summary:", res.data);   // 🔍 debug
    return res;
  } catch (err) {
    console.error("getSummary failed:", err);
    throw err;
  }
};

// ---------------- FINDINGS ----------------
export const getFindings = async () => {
  try {
    const res = await client.get("/findings");
    console.log("API /findings:", res.data);   // 🔍 debug
    return res;
  } catch (err) {
    console.error("getFindings failed:", err);
    throw err;
  }
};

// ---------------- RUN SCAN ----------------
export const runScan = async () => {
  try {
    const res = await client.post("/scan");
    console.log("API /scan:", res.data);   // 🔍 debug
    return res;
  } catch (err) {
    console.error("runScan failed:", err);
    throw err;
  }
};

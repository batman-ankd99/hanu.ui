import axios from "axios";

const API = "http://localhost:5000";

export const getSummary = () => axios.get(`${API}/risk-summary`);
export const getFindings = () => axios.get(`${API}/findings`);
export const runScan = () => axios.post(`${API}/scan`);

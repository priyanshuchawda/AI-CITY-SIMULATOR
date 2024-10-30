import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const getCityData = () => axios.get(`${API_URL}/city/data`);
export const evaluateAIDecision = (decision, context) => axios.post(`${API_URL}/ai-ethics/evaluate`, { decision, context });
export const deploy5G = (area) => axios.post(`${API_URL}/5g/deploy`, { area });
export const get5GStatus = (timeOfDay) => axios.get(`${API_URL}/5g/status`, { params: { timeOfDay } });
export const upgradeQuantumComputer = (qubits) => axios.post(`${API_URL}/quantum/upgrade`, { qubits });
export const runQuantumAlgorithm = (algorithm, problemSize) => axios.post(`${API_URL}/quantum/run-algorithm`, { algorithm, problemSize });
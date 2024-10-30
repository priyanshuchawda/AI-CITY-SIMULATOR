import axios from 'axios';

export const runQuantumAlgorithm = async (algorithm, problemSize) => {
  try {
    const response = await axios.post('http://ai-service:3000/api/quantum/run-algorithm', { algorithm, problemSize });
    return response.data;
  } catch (error) {
    console.error('Error running quantum algorithm:', error);
    throw new Error('Failed to run quantum algorithm');
  }
};

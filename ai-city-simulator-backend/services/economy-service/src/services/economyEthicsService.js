import axios from 'axios';

export const evaluateDecision = async (decision, context) => {
  try {
    const response = await axios.post('http://ai-service:3000/api/evaluate-ethics', { decision, context });
    return response.data;
  } catch (error) {
    console.error('Error evaluating decision ethics:', error);
    throw new Error('Failed to evaluate decision ethics');
  }
};

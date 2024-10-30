import AIEthicsModule from '../utils/aiEthics.js';

const aiEthics = new AIEthicsModule();

const evaluateDecision = (decision, context) => {
  return aiEthics.evaluateDecision(decision, context);
};

export { evaluateDecision };

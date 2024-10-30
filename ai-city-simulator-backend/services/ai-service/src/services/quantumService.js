import QuantumComputingSimulation from '../utils/quantumComputing.js';

const quantumComputing = new QuantumComputingSimulation();

const runQuantumAlgorithm = (algorithm, problemSize) => {
  return quantumComputing.runQuantumAlgorithm(algorithm, problemSize);
};

export { runQuantumAlgorithm };

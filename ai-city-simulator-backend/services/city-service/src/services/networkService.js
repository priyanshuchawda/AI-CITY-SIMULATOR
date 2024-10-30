import FiveGSimulation from '../../features/5gSimulation.js';

const fiveGSimulation = new FiveGSimulation();

export const deploy5GInfrastructure = (area) => {
  fiveGSimulation.deployInfrastructure(area);
  return fiveGSimulation.getNetworkStatus();
};

export const get5GNetworkLoad = (timeOfDay) => {
  return fiveGSimulation.simulateNetworkLoad(timeOfDay);
};

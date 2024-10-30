class FiveGSimulation {
  constructor() {
    this.coverageArea = 0;
    this.connectedDevices = 0;
    this.dataSpeed = 0;
  }

  deployInfrastructure(area) {
    this.coverageArea += area;
    this.connectedDevices += Math.floor(area * 1000); // Assuming 1000 devices per unit area
    this.dataSpeed = Math.min(20, this.dataSpeed + 1); // Max speed of 20 Gbps
  }

  simulateNetworkLoad(timeOfDay) {
    // Simulate network load based on time of day (0-23)
    const loadFactor = Math.sin((timeOfDay / 24) * Math.PI) * 0.5 + 0.5;
    const effectiveSpeed = this.dataSpeed * (1 - loadFactor * 0.7);
    return {
      connectedDevices: this.connectedDevices,
      averageSpeed: effectiveSpeed.toFixed(2),
      coverageArea: this.coverageArea
    };
  }

  getNetworkStatus() {
    return {
      coverageArea: this.coverageArea,
      connectedDevices: this.connectedDevices,
      maxDataSpeed: this.dataSpeed
    };
  }
}

export default new FiveGSimulation();

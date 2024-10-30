class TrafficService {
    private trafficLevel: number = 50; // 0-100 scale
  
    getTrafficLevel(): number {
      return this.trafficLevel;
    }
  
    simulateTraffic(): void {
      // Simple traffic simulation
      const change = Math.random() * 10 - 5; // Random change between -5 and 5
      this.trafficLevel = Math.max(0, Math.min(100, this.trafficLevel + change));
    }
  
    improveInfrastructure(): void {
      this.trafficLevel = Math.max(0, this.trafficLevel - 10);
    }
  
    loadTrafficData(data: { trafficLevel: number }): void {
      this.trafficLevel = data.trafficLevel;
    }
  
    getTrafficData() {
      return {
        trafficLevel: this.trafficLevel
      };
    }
}

export const trafficService = new TrafficService();
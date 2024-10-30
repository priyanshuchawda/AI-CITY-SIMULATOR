class HealthcareService {
    private healthcareQuality: number = 50; // 0-100 scale
    private hospitals: number = 2;
  
    getHealthcareQuality(): number {
      return this.healthcareQuality;
    }
  
    getHospitals(): number {
      return this.hospitals;
    }
  
    improveHealthcare(): void {
      this.healthcareQuality = Math.min(100, this.healthcareQuality + 5);
      this.hospitals += 1;
    }
  
    updateHealthcare(population: number): void {
      const targetHospitals = Math.floor(population / 25000);
      if (this.hospitals < targetHospitals) {
        this.healthcareQuality = Math.max(0, this.healthcareQuality - 1);
      } else {
        this.healthcareQuality = Math.min(100, this.healthcareQuality + 0.5);
      }
    }
  
    loadHealthcareData(data: { hospitals: number, healthcareQuality: number }): void {
      this.hospitals = data.hospitals;
      this.healthcareQuality = data.healthcareQuality;
    }
  
    getHealthcareData() {
      return {
        hospitals: this.hospitals,
        healthcareQuality: this.healthcareQuality
      };
    }
}

export const healthcareService = new HealthcareService();
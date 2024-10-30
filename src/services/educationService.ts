class EducationService {
    private educationLevel: number = 50; // 0-100 scale
    private schools: number = 5;
  
    getEducationLevel(): number {
      return this.educationLevel;
    }
  
    getSchools(): number {
      return this.schools;
    }
  
    improveEducation(): void {
      this.educationLevel = Math.min(100, this.educationLevel + 5);
      this.schools += 1;
    }
  
    updateEducation(population: number): void {
      const targetSchools = Math.floor(population / 5000);
      if (this.schools < targetSchools) {
        this.educationLevel = Math.max(0, this.educationLevel - 1);
      } else {
        this.educationLevel = Math.min(100, this.educationLevel + 0.5);
      }
    }
  
    loadEducationData(data: { schools: number, educationLevel: number }): void {
      this.schools = data.schools;
      this.educationLevel = data.educationLevel;
    }
  
    getEducationData() {
      return {
        schools: this.schools,
        educationLevel: this.educationLevel
      };
    }
}

export const educationService = new EducationService();
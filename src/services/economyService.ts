import { cityService } from './cityService';
import { zoningService, Building } from './zoningService';

export interface Industry {
  id: string;
  name: string;
  productionRate: number;
  consumptionRate: number;
  employmentRate: number;
  pollutionRate: number;
  taxRate: number;
}

export interface Resource {
  id: string;
  name: string;
  amount: number;
  price: number;
}

class EconomyService {
  private industries: Industry[] = [
    { id: 'agriculture', name: 'Agriculture', productionRate: 1, consumptionRate: 0.5, employmentRate: 0.8, pollutionRate: 0.2, taxRate: 0.05 },
    { id: 'manufacturing', name: 'Manufacturing', productionRate: 1.2, consumptionRate: 0.8, employmentRate: 1, pollutionRate: 0.6, taxRate: 0.08 },
    { id: 'services', name: 'Services', productionRate: 0.9, consumptionRate: 0.3, employmentRate: 1.2, pollutionRate: 0.1, taxRate: 0.07 },
    { id: 'technology', name: 'Technology', productionRate: 1.5, consumptionRate: 0.6, employmentRate: 1.5, pollutionRate: 0.3, taxRate: 0.1 },
  ];

  private resources: Resource[] = [
    { id: 'food', name: 'Food', amount: 1000, price: 10 },
    { id: 'goods', name: 'Goods', amount: 1000, price: 20 },
    { id: 'energy', name: 'Energy', amount: 1000, price: 15 },
  ];

  updateEconomy() {
    this.updateProduction();
    this.updateConsumption();
    this.updatePrices();
    this.collectTaxes();
    this.updateEmployment();
    this.updatePollution();
  }

  private updateProduction() {
    const buildings = zoningService.getAllBuildings();
    buildings.forEach(building => {
      const industry = this.getIndustryForBuilding(building);
      if (industry) {
        this.resources.forEach(resource => {
          const productionAmount = building.level * industry.productionRate;
          resource.amount += productionAmount;
        });
      }
    });
  }

  private updateConsumption() {
    const population = cityService.getPopulation();
    this.resources.forEach(resource => {
      const consumptionAmount = population * 0.01; // Base consumption per citizen
      resource.amount = Math.max(0, resource.amount - consumptionAmount);
    });

    const buildings = zoningService.getAllBuildings();
    buildings.forEach(building => {
      const industry = this.getIndustryForBuilding(building);
      if (industry) {
        this.resources.forEach(resource => {
          const consumptionAmount = building.level * industry.consumptionRate;
          resource.amount = Math.max(0, resource.amount - consumptionAmount);
        });
      }
    });
  }

  private updatePrices() {
    this.resources.forEach(resource => {
      const supplyDemandRatio = resource.amount / (cityService.getPopulation() * 10);
      resource.price = Math.max(1, resource.price * (2 - supplyDemandRatio));
    });
  }

  private collectTaxes() {
    let totalTax = 0;
    const buildings = zoningService.getAllBuildings();
    buildings.forEach(building => {
      const industry = this.getIndustryForBuilding(building);
      if (industry) {
        const buildingIncome = building.level * industry.productionRate * 100; // Arbitrary income calculation
        const tax = buildingIncome * industry.taxRate;
        totalTax += tax;
      }
    });
    cityService.updateFunds(totalTax);
  }

  private updateEmployment() {
    let totalJobs = 0;
    const buildings = zoningService.getAllBuildings();
    buildings.forEach(building => {
      const industry = this.getIndustryForBuilding(building);
      if (industry) {
        totalJobs += building.level * industry.employmentRate * 10; // 10 jobs per level as base
      }
    });
    const employmentRate = Math.min(1, totalJobs / cityService.getPopulation());
    cityService.updateEmploymentRate(employmentRate);
  }

  private updatePollution() {
    let totalPollution = 0;
    const buildings = zoningService.getAllBuildings();
    buildings.forEach(building => {
      const industry = this.getIndustryForBuilding(building);
      if (industry) {
        totalPollution += building.level * industry.pollutionRate;
      }
    });
    cityService.updatePollution(totalPollution);
  }

  private getIndustryForBuilding(building: Building): Industry | undefined {
    switch (building.type) {
      case 'farm':
        return this.industries.find(i => i.id === 'agriculture');
      case 'factory':
        return this.industries.find(i => i.id === 'manufacturing');
      case 'office':
        return this.industries.find(i => i.id === 'services');
      case 'techpark':
        return this.industries.find(i => i.id === 'technology');
      default:
        return undefined;
    }
  }

  getResourceLevels(): Resource[] {
    return this.resources.map(r => ({ ...r }));
  }

  getIndustryStats(): Industry[] {
    return this.industries.map(i => ({ ...i }));
  }
}

export const economyService = new EconomyService();
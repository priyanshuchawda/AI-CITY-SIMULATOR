import { cityService, economyService } from './index';

interface TechNode {
  id: string;
  name: string;
  description: string;
  cost: number;
  requiredTech: string[];
  unlocked: boolean;
  researched: boolean;
  effect: () => void;
}

class ResearchService {
  private techTree: TechNode[] = [
    {
      id: "advanced_education",
      name: "Advanced Education",
      description: "Improves overall education quality",
      cost: 500000,
      requiredTech: [],
      unlocked: true,
      researched: false,
      effect: () => {
        cityService.updateEducationLevel(10);
      }
    },
    {
      id: "smart_traffic_management",
      name: "Smart Traffic Management",
      description: "Reduces traffic congestion",
      cost: 750000,
      requiredTech: [],
      unlocked: true,
      researched: false,
      effect: () => {
        cityService.updateTrafficLevel(-15);
      }
    },
    {
      id: "renewable_energy",
      name: "Renewable Energy",
      description: "Increases happiness and reduces costs",
      cost: 1000000,
      requiredTech: ["advanced_education"],
      unlocked: false,
      researched: false,
      effect: () => {
        cityService.updateHappiness(5);
        cityService.updateFunds(100000);
      }
    },
    {
      id: "ai_healthcare",
      name: "AI-Powered Healthcare",
      description: "Significantly improves healthcare quality",
      cost: 1500000,
      requiredTech: ["advanced_education", "smart_traffic_management"],
      unlocked: false,
      researched: false,
      effect: () => {
        cityService.updateHealthcareQuality(20);
      }
    }
  ];

  getTechTree(): TechNode[] {
    return this.techTree;
  }

  researchTech(techId: string): boolean {
    const tech = this.techTree.find(t => t.id === techId);
    if (tech && tech.unlocked && !tech.researched && cityService.getFunds() >= tech.cost) {
      cityService.updateFunds(-tech.cost);
      tech.researched = true;
      tech.effect();
      this.unlockDependentTech(techId);
      return true;
    }
    return false;
  }

  private unlockDependentTech(researchedTechId: string) {
    this.techTree.forEach(tech => {
      if (tech.requiredTech.includes(researchedTechId)) {
        tech.unlocked = tech.requiredTech.every(reqTech => 
          this.techTree.find(t => t.id === reqTech)?.researched
        );
      }
    });
  }
}

export const researchService = new ResearchService();
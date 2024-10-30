import { cityService } from './cityService';
import { audioService } from './audioService';

export interface Disaster {
  id: string;
  name: string;
  description: string;
  severity: number;
  duration: number;
  effect: () => void;
}

class DisasterService {
  private activeDisasters: Disaster[] = [];
  private disasters: Disaster[] = [
    {
      id: 'earthquake',
      name: 'Earthquake',
      description: 'A sudden and violent shaking of the ground.',
      severity: 8,
      duration: 5,
      effect: () => {
        cityService.updateHappiness(-10);
        cityService.updateFunds(-500000);
        cityService.updatePopulation(-1000);
      }
    },
    {
      id: 'flood',
      name: 'Flood',
      description: 'An overflow of water that submerges land that is usually dry.',
      severity: 6,
      duration: 7,
      effect: () => {
        cityService.updateHappiness(-5);
        cityService.updateFunds(-300000);
        cityService.updatePopulation(-500);
      }
    },
    {
      id: 'hurricane',
      name: 'Hurricane',
      description: 'A large and powerful tropical storm.',
      severity: 9,
      duration: 3,
      effect: () => {
        cityService.updateHappiness(-15);
        cityService.updateFunds(-750000);
        cityService.updatePopulation(-2000);
      }
    }
  ];

  triggerRandomDisaster() {
    if (Math.random() < 0.01) { // 1% chance of disaster each update
      const disaster = this.disasters[Math.floor(Math.random() * this.disasters.length)];
      this.activeDisasters.push({ ...disaster });
      disaster.effect();
      audioService.playSoundEffect('disaster');
    }
  }

  updateActiveDisasters() {
    this.activeDisasters = this.activeDisasters.filter(disaster => {
      disaster.duration--;
      return disaster.duration > 0;
    });
  }

  getActiveDisasters(): Disaster[] {
    return this.activeDisasters;
  }

  respondToDisaster(disasterId: string) {
    const disasterIndex = this.activeDisasters.findIndex(d => d.id === disasterId);
    if (disasterIndex !== -1) {
      const disaster = this.activeDisasters[disasterIndex];
      const responseCost = disaster.severity * 50000;
      if (cityService.getFunds() >= responseCost) {
        cityService.updateFunds(-responseCost);
        cityService.updateHappiness(5);
        this.activeDisasters.splice(disasterIndex, 1);
        audioService.playSoundEffect('disaster_resolved');
        return true;
      }
    }
    return false;
  }
}

export const disasterService = new DisasterService();

import { EventEmitter } from 'events';
import { cityService } from './cityService';

interface Disaster {
  id: string;
  name: string;
  description: string;
  severity: number;
  impact: (city: any) => void;
}

class DisasterService extends EventEmitter {
  private disasters: Disaster[] = [
    {
      id: 'earthquake',
      name: 'Earthquake',
      description: 'A powerful earthquake shakes the city, damaging buildings and infrastructure.',
      severity: 0.7,
      impact: (city) => {
        city.infrastructure *= 0.9;
        city.funds -= 200000;
        city.happiness -= 0.2;
      }
    },
    // Add more disasters here
  ];

  triggerRandomDisaster() {
    const disaster = this.disasters[Math.floor(Math.random() * this.disasters.length)];
    disaster.impact(cityService.getCityData());
    this.emit('disasterOccurred', disaster);
  }
}

export const disasterService = new DisasterService();
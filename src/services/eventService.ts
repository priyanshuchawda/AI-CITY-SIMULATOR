import { timeService } from './timeService';
import { CityService } from './cityService'; // Import CityService type
import { EventEmitter } from 'events';
import { cityService } from './cityService';

interface CityEvent {
  id: string;
  name: string;
  description: string;
  impact: (city: any) => void;
}

class EventService extends EventEmitter {
  private events: CityEvent[] = [
    {
      id: 'economic_boom',
      name: 'Economic Boom',
      description: 'A sudden surge in economic activity boosts your city\'s finances.',
      impact: (city) => {
        city.funds += 100000;
        city.happiness += 0.1;
      }
    },
    // Add more events here
  ];

  triggerRandomEvent() {
    const event = this.events[Math.floor(Math.random() * this.events.length)];
    event.impact(cityService.getCityData());
    this.emit('eventOccurred', event);
  }
}

export const eventService = new EventService();
export interface CityEvent {
  id: string;
  name: string;
  description: string;
  duration: number;
  impact: {
    happiness?: number;
    population?: number;
    economy?: number;
    // Add more impact factors as needed
  };
}

class EventService {
  private currentEvent: CityEvent | null = null;
  private eventQueue: CityEvent[] = [];

  private events: CityEvent[] = [
    {
      id: 'festival',
      name: 'City Festival',
      description: 'A joyous celebration boosting citizen happiness!',
      duration: 3,
      impact: { happiness: 10, economy: 5 }
    },
    {
      id: 'economicBoom',
      name: 'Economic Boom',
      description: 'A surge in economic activity!',
      duration: 5,
      impact: { economy: 15, population: 5 }
    },
    {
      id: 'naturalDisaster',
      name: 'Natural Disaster',
      description: 'A challenging time for the city.',
      duration: 2,
      impact: { happiness: -15, economy: -10, population: -5 }
    },
    // Add more events
  ];

  private cityService!: CityService;

  setCityService(cityService: CityService) {
    this.cityService = cityService;
  }

  initialize(cityServiceInstance: CityService) {
    this.cityService = cityServiceInstance;
  }

  checkForNewEvent(): void {
    if (!this.currentEvent && Math.random() < 0.1) {
      this.triggerRandomEvent();
    }
  }

  private triggerRandomEvent(): void {
    const randomEvent = this.events[Math.floor(Math.random() * this.events.length)];
    this.currentEvent = { ...randomEvent, duration: randomEvent.duration };
    this.applyEventImpact();
  }

  private applyEventImpact(): void {
    if (this.currentEvent) {
      const { impact } = this.currentEvent;
      this.cityService.updateHappiness(impact.happiness || 0);
      this.cityService.updatePopulation(impact.population || 0);
      this.cityService.updateEconomy(impact.economy || 0);
    }
  }

  updateActiveEvent(): void {
    if (this.currentEvent) {
      this.currentEvent.duration--;
      if (this.currentEvent.duration <= 0) {
        this.currentEvent = null;
      }
    }
  }

  getCurrentEvent(): CityEvent | null {
    return this.currentEvent;
  }
}

export const eventService = new EventService();
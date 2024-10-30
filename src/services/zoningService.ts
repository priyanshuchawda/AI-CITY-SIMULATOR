import { cityService } from './cityService';
import { audioService } from './audioService';

export type ZoneType = 'residential' | 'commercial' | 'industrial' | 'park';

export interface Zone {
  id: string;
  type: ZoneType;
  size: number;
  buildings: Building[];
}

export interface Building {
  id: string;
  name: string;
  size: number;
  level: number;
  capacity: number;
  occupancy: number;
}

class ZoningService {
  private zones: Zone[] = [];
  private nextZoneId = 1;
  private nextBuildingId = 1;

  createZone(type: ZoneType, size: number): Zone | null {
    if (cityService.getFunds() >= this.getZoneCost(size)) {
      const newZone: Zone = {
        id: `zone_${this.nextZoneId++}`,
        type,
        size,
        buildings: []
      };
      this.zones.push(newZone);
      cityService.updateFunds(-this.getZoneCost(size));
      audioService.playSoundEffect('zone_created');
      return newZone;
    }
    return null;
  }

  addBuilding(zoneId: string, buildingType: string): Building | null {
    const zone = this.zones.find(z => z.id === zoneId);
    if (zone && this.canAddBuilding(zone)) {
      const newBuilding: Building = {
        id: `building_${this.nextBuildingId++}`,
        name: this.getBuildingName(zone.type, buildingType),
        size: 1,
        level: 1,
        capacity: this.getBuildingCapacity(zone.type, buildingType),
        occupancy: 0
      };
      zone.buildings.push(newBuilding);
      audioService.playSoundEffect('building_placed');
      return newBuilding;
    }
    return null;
  }

  upgradeBuilding(zoneId: string, buildingId: string): boolean {
    const zone = this.zones.find(z => z.id === zoneId);
    const building = zone?.buildings.find(b => b.id === buildingId);
    if (building && cityService.getFunds() >= this.getBuildingUpgradeCost(building)) {
      building.level++;
      building.capacity = Math.floor(building.capacity * 1.5);
      cityService.updateFunds(-this.getBuildingUpgradeCost(building));
      audioService.playSoundEffect('building_upgraded');
      return true;
    }
    return false;
  }

  getZones(): Zone[] {
    return this.zones;
  }

  private getZoneCost(size: number): number {
    return size * 10000;
  }

  private canAddBuilding(zone: Zone): boolean {
    const totalBuildingSize = zone.buildings.reduce((sum, building) => sum + building.size, 0);
    return totalBuildingSize < zone.size;
  }

  private getBuildingName(zoneType: ZoneType, buildingType: string): string {
    const names: { [key in ZoneType]: string[] } = {
      residential: ['House', 'Apartment', 'Condo'],
      commercial: ['Shop', 'Office', 'Mall'],
      industrial: ['Factory', 'Warehouse', 'Plant'],
      park: ['Playground', 'Garden', 'Sports Field']
    };
    return names[zoneType][Math.floor(Math.random() * names[zoneType].length)];
  }

  private getBuildingCapacity(zoneType: ZoneType, buildingType: string): number {
    const capacities: { [key in ZoneType]: number } = {
      residential: 4,
      commercial: 10,
      industrial: 20,
      park: 50
    };
    return capacities[zoneType];
  }

  private getBuildingUpgradeCost(building: Building): number {
    return building.level * 5000;
  }
}

export const zoningService = new ZoningService();
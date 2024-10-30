import { difficultyService, timeService, educationService, healthcareService, economyService, eventService, trafficService, disasterService } from './index';
import { EventService } from './eventService'; // Import EventService type
import { aiMayorService } from './aiMayorService';
import { aiService } from './aiService';

interface CityArea {
    id: number;
    name: string;
    isUnlocked: boolean;
    unlockCost: number;
    size: number; // Size of the area, e.g., 10x10
}

type CityData = {
    population: number;
    happiness: number;
    funds: number;
    educationLevel: number;
    healthcareQuality: number;
    trafficLevel: number;
    unemploymentRate: number;
    gdp: number;
    energyConsumption: number;
    crimeRate: number;
    maxPopulation: number;
    maxBuildings: number;
  };

interface HappinessFactors {
  employment: number;
  healthcare: number;
  education: number;
  environment: number;
  safety: number;
  leisure: number;
}

export class CityService {
    private cityData: CityData = {
        population: 10000,
        happiness: 75,
        funds: 1000000,
        educationLevel: 50,
        healthcareQuality: 50,
        trafficLevel: 50,
        unemploymentRate: 5,
        gdp: 5000000,
        energyConsumption: 1,
        crimeRate: 0.01,
        maxPopulation: 10000,
        maxBuildings: 100,
    };

    private cityAreas: CityArea[] = [
        { id: 1, name: "Downtown", isUnlocked: true, unlockCost: 0, size: 10 },
        { id: 2, name: "Suburbs", isUnlocked: false, unlockCost: 500000, size: 15 },
        { id: 3, name: "Industrial Zone", isUnlocked: false, unlockCost: 1000000, size: 20 },
        { id: 4, name: "Waterfront", isUnlocked: false, unlockCost: 2000000, size: 25 },
        { id: 5, name: "Green Belt", isUnlocked: false, unlockCost: 3000000, size: 30 },
    ];

    private eventService!: EventService; // Use definite assignment assertion

    setEventService(eventService: EventService) {
        this.eventService = eventService;
    }

    constructor() {
        const settings = difficultyService.getSettings();
        this.cityData = {
            population: 10000,
            happiness: 75,
            funds: settings.initialFunds,
            educationLevel: 50,
            healthcareQuality: 50,
            trafficLevel: 50,
            unemploymentRate: 5,
            gdp: 5000000,
            energyConsumption: 1,
            crimeRate: 0.01,
            maxPopulation: 10000,
            maxBuildings: 100,
        };
        aiService.initModels();
    }

    getCityData(): CityData {
        return { ...this.cityData };
    }

    getCityAreas(): CityArea[] {
        return this.cityAreas;
    }

    unlockArea(areaId: number): boolean {
        const area = this.cityAreas.find(a => a.id === areaId);
        if (area && !area.isUnlocked && this.cityData.funds >= area.unlockCost) {
            area.isUnlocked = true;
            this.cityData.funds -= area.unlockCost;
            this.cityData.maxPopulation += area.size * 1000; // Increase max population
            return true;
        }
        return false;
    }

    getTotalUnlockedSize(): number {
        return this.cityAreas.reduce((total, area) => area.isUnlocked ? total + area.size : total, 0);
    }

    updatePopulation(change: number): void {
        this.cityData.population += change;
    }

    updateHappiness(change: number): void {
        this.cityData.happiness = Math.max(0, Math.min(100, this.cityData.happiness + change));
    }

    updateFunds(change: number): void {
        this.cityData.funds += change;
    }

    updateEducationLevel(change: number): void {
        this.cityData.educationLevel = Math.min(100, Math.max(0, this.cityData.educationLevel + change));
    }

    updateTrafficLevel(change: number): void {
        this.cityData.trafficLevel = Math.min(100, Math.max(0, this.cityData.trafficLevel + change));
    }

    updateHealthcareQuality(change: number): void {
        this.cityData.healthcareQuality = Math.min(100, Math.max(0, this.cityData.healthcareQuality + change));
    }

    private calculateHappiness(): number {
        const economyData = economyService.getEconomyData();
        const unemploymentFactor = 1 - economyData.unemploymentRate;
        const gdpFactor = Math.min(economyData.gdp / 1000000, 1); // Assume 1M GDP is perfect score

        // You can add more factors here, like pollution, crime rate, etc.
        const happiness = (unemploymentFactor + gdpFactor) / 2 * 100;
        return Math.min(Math.max(happiness, 0), 100); // Ensure happiness is between 0 and 100
    }

    simulateCity(): void {
        const time = timeService.getTime();
        const isNight = time < 0.25 || time > 0.75;

        // Adjust city metrics based on time of day
        if (isNight) {
            this.cityData.energyConsumption *= 1.2; // Higher energy consumption at night
            this.cityData.crimeRate *= 1.1; // Slightly higher crime rate at night
        } else {
            this.cityData.energyConsumption *= 0.9; // Lower energy consumption during day
            this.cityData.crimeRate *= 0.95; // Slightly lower crime rate during day
        }

        educationService.updateEducation(this.cityData.population);
        healthcareService.updateHealthcare(this.cityData.population);
        economyService.updateEconomy();
        eventService.checkForRandomEvent();

        const educationImpact = (educationService.getEducationLevel() - 50) / 1000;
        const healthcareImpact = (healthcareService.getHealthcareQuality() - 50) / 1000;
        const trafficImpact = (50 - trafficService.getTrafficLevel()) / 1000;
        const economicImpact = (5 - economyService.getUnemploymentRate()) / 100;

        this.updatePopulation(Math.floor(this.cityData.population * (0.001 + educationImpact + healthcareImpact + economicImpact)));
        this.updateHappiness(educationImpact + healthcareImpact + trafficImpact + economicImpact);
        this.updateFunds(Math.floor(economyService.getGDP() * 0.1)); // 10% of GDP goes to city funds

        // Adjust max buildings based on unlocked areas
        this.cityData.maxBuildings = this.getTotalUnlockedSize() * 10; // 10 buildings per size unit

        this.cityData.educationLevel = educationService.getEducationLevel();
        this.cityData.healthcareQuality = healthcareService.getHealthcareQuality();
        this.cityData.trafficLevel = trafficService.getTrafficLevel();
        this.cityData.unemploymentRate = economyService.getUnemploymentRate();
        this.cityData.gdp = economyService.getGDP();
        this.cityData.happiness = this.calculateHappiness();

        // Check for disasters
        disasterService.triggerRandomDisaster();
        disasterService.updateActiveDisasters();

        // Update AI Mayor
        aiMayorService.updateAIMayor();

        // Recalculate city metrics after AI Mayor's actions
        this.recalculateCityMetrics();
    }

    updateGDP(gdp: number): void {
        this.cityData.gdp = gdp;
    }

    setCityData(cityData: CityData): void {
        this.cityData = cityData;
    }

    loadCityData(data: CityData): void {
        this.cityData = { ...data };
    }

    updateEducation(amount: number): void {
        // Implement education improvement logic
    }

    updateHealthcare(amount: number): void {
        // Implement healthcare improvement logic
    }

    updateInfrastructure(amount: number): void {
        // Implement infrastructure improvement logic
    }

    private happinessFactors: HappinessFactors = {
        employment: 50,
        healthcare: 50,
        education: 50,
        environment: 50,
        safety: 50,
        leisure: 50
    };

    updateHappinessFactor(factor: keyof HappinessFactors, value: number) {
        this.happinessFactors[factor] = Math.max(0, Math.min(100, this.happinessFactors[factor] + value));
        this.recalculateHappiness();
    }

    private recalculateHappiness() {
        const factors = Object.values(this.happinessFactors);
        this.happiness = factors.reduce((sum, factor) => sum + factor, 0) / factors.length;
    }

    getHappinessFactors(): HappinessFactors {
        return { ...this.happinessFactors };
    }

    private employmentRate: number = 0.5;
    private pollution: number = 0;

    updateEmploymentRate(rate: number) {
        this.employmentRate = rate;
        this.updateHappiness();
    }

    updatePollution(amount: number) {
        this.pollution = amount;
        this.updateHappiness();
    }

    private updateHappiness() {
        // Update happiness based on various factors including employment and pollution
        const baseHappiness = 50;
        const employmentFactor = this.employmentRate * 30;
        const pollutionFactor = Math.min(20, this.pollution / 10);
        this.happiness = Math.min(100, Math.max(0, baseHappiness + employmentFactor - pollutionFactor));
    }

    getEmploymentRate(): number {
        return this.employmentRate;
    }

    getPollution(): number {
        return this.pollution;
    }

    private recalculateCityMetrics() {
        // Recalculate city metrics after AI Mayor's actions
        // This could include updating population, happiness, funds, etc.
    }

    generateSyntheticData(numSamples: number) {
        return aiService.generateSyntheticCityData(numSamples);
    }

    processCitizenQuery(query: string): string {
        return aiService.processCitizenQuery(query);
    }
}

export const cityService = new CityService();
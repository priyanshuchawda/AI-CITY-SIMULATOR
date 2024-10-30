export * from './cityService';
export * from './economyService';
export * from './educationService';
export * from './healthcareService';
export * from './trafficService';
export * from './disasterService';
export * from './researchService';
export * from './aiService';
export * from './aiMayorService';
export * from './environmentService';

// Import and re-export individual services
import { cityService } from './cityService';
import { economyService } from './economyService';
import { educationService } from './educationService';
import { healthcareService } from './healthcareService';
import { trafficService } from './trafficService';
import { disasterService } from './disasterService';
import { researchService } from './researchService';
import { aiService } from './aiService';
import { aiMayorService } from './aiMayorService';
import { environmentService } from './environmentService';

export {
  cityService,
  economyService,
  educationService,
  healthcareService,
  trafficService,
  disasterService,
  researchService,
  aiService,
  aiMayorService,
  environmentService
};
import { cityService } from './cityService';
import { eventService } from './eventService';

// Set up the circular dependency
cityService.setEventService(eventService);
eventService.setCityService(cityService);

// Set up intervals for event checking and updating
setInterval(() => eventService.checkForNewEvent(), 60000); // Check for new event every minute
setInterval(() => eventService.updateActiveEvent(), 1000); // Update active event every second

export { cityService, eventService };
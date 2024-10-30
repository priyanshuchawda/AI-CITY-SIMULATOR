import { EventEmitter } from 'events';

export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  target?: string; // CSS selector for the element to highlight
  action?: string; // Action that needs to be performed to complete this step
}

class TutorialService extends EventEmitter {
  private steps: TutorialStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to AI City Simulator',
      content: 'In this game, you'll build and manage your own city with the help of AI. Let\'s get started!',
    },
    {
      id: 'create_zone',
      title: 'Creating Zones',
      content: 'Start by creating a residential zone. Click the "Create Zone" button in the Zoning Manager.',
      target: '#zoning-manager .create-zone-button',
      action: 'create_zone',
    },
    {
      id: 'add_building',
      title: 'Adding Buildings',
      content: 'Great! Now add a building to your new zone. Click the "Add Building" button.',
      target: '#zoning-manager .add-building-button',
      action: 'add_building',
    },
    {
      id: 'manage_economy',
      title: 'Managing Economy',
      content: 'Check out the Economy Manager to see your city\'s financial status and implement economic policies.',
      target: '#economy-manager',
    },
    {
      id: 'research_tech',
      title: 'Researching Technologies',
      content: 'Use the Tech Tree to research new technologies that will improve your city.',
      target: '#tech-tree',
    },
    {
      id: 'handle_disasters',
      title: 'Handling Disasters',
      content: 'Be prepared for disasters! Use the Disaster Manager to respond to emergencies.',
      target: '#disaster-manager',
    },
    {
      id: 'ai_mayor',
      title: 'Competing with AI Mayor',
      content: 'Keep an eye on the AI Mayor\'s actions. Try to outperform the AI in managing your city!',
      target: '#ai-mayor-dashboard',
    },
    {
      id: 'city_ranking',
      title: 'City Ranking',
      content: 'Your city is now ranked based on various factors like population, happiness, and achievements. Try to improve your rank by developing your city!',
      target: '#city-ranking',
    },
    {
      id: 'economy_overview',
      title: 'Economy Overview',
      content: 'The economy of your city is now more complex. Pay attention to supply and demand of resources, and how they affect prices.',
      target: '#economy-overview',
    },
    {
      id: 'industry_management',
      title: 'Industry Management',
      content: 'You can invest in different industries to increase their production levels. Balance your investments to meet the needs of your city.',
      target: '#economy-details',
    },
    {
      id: 'conclusion',
      title: 'You\'re Ready!',
      content: 'Great job! You now know the basics of AI City Simulator. Keep exploring and have fun building your city!',
    },
  ];

  private currentStepIndex: number = -1;
  private isActive: boolean = false;

  startTutorial() {
    this.currentStepIndex = 0;
    this.isActive = true;
    this.emitUpdate();
  }

  nextStep() {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
      this.emitUpdate();
    } else {
      this.endTutorial();
    }
  }

  previousStep() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.emitUpdate();
    }
  }

  endTutorial() {
    this.isActive = false;
    this.currentStepIndex = -1;
    this.emitUpdate();
  }

  getCurrentStep(): TutorialStep | null {
    return this.isActive ? this.steps[this.currentStepIndex] : null;
  }

  isActiveTutorial(): boolean {
    return this.isActive;
  }

  completeAction(action: string) {
    const currentStep = this.getCurrentStep();
    if (currentStep && currentStep.action === action) {
      this.nextStep();
    }
  }

  private emitUpdate() {
    this.emit('update');
  }
}

export const tutorialService = new TutorialService();





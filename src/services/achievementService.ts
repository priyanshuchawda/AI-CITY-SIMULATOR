import { EventEmitter } from 'events';
import { cityService } from './cityService';
import { economyService } from './economyService';

export interface Achievement {
    id: string;
    name: string;
    description: string;
    isUnlocked: boolean;
    progress: number;
    maxProgress: number;
}

export interface Challenge {
    id: string;
    name: string;
    description: string;
    isCompleted: boolean;
    progress: number;
    maxProgress: number;
    reward: number;
}

class AchievementService extends EventEmitter {
    private achievements: Achievement[] = [
        {
            id: 'population_1000',
            name: 'Small Town',
            description: 'Reach a population of 1,000',
            isUnlocked: false,
            progress: 0,
            maxProgress: 1000,
        },
        {
            id: 'happiness_90',
            name: 'Happy Citizens',
            description: 'Achieve 90% happiness',
            isUnlocked: false,
            progress: 0,
            maxProgress: 90,
        },
        // Add more achievements here
    ];

    private challenges: Challenge[] = [
        {
            id: 'rapid_growth',
            name: 'Rapid Growth',
            description: 'Increase population by 500 in 30 days',
            isCompleted: false,
            progress: 0,
            maxProgress: 500,
            reward: 100000,
        },
        {
            id: 'economic_boom',
            name: 'Economic Boom',
            description: 'Reach $1,000,000 in city funds',
            isCompleted: false,
            progress: 0,
            maxProgress: 1000000,
            reward: 250000,
        },
        // Add more challenges here
    ];

    constructor() {
        super();
        setInterval(() => this.updateAchievements(), 5000);
        setInterval(() => this.updateChallenges(), 5000);
    }

    private updateAchievements() {
        this.achievements.forEach(achievement => {
            if (!achievement.isUnlocked) {
                switch (achievement.id) {
                    case 'population_1000':
                        achievement.progress = cityService.getPopulation();
                        break;
                    case 'happiness_90':
                        achievement.progress = cityService.getHappiness();
                        break;
                    // Add more cases for other achievements
                }

                if (achievement.progress >= achievement.maxProgress) {
                    achievement.isUnlocked = true;
                    this.emit('achievementUnlocked', achievement);
                }
            }
        });
    }

    private updateChallenges() {
        this.challenges.forEach(challenge => {
            if (!challenge.isCompleted) {
                switch (challenge.id) {
                    case 'rapid_growth':
                        challenge.progress = cityService.getPopulation() - challenge.progress;
                        break;
                    case 'economic_boom':
                        challenge.progress = cityService.getFunds();
                        break;
                    // Add more cases for other challenges
                }

                if (challenge.progress >= challenge.maxProgress) {
                    challenge.isCompleted = true;
                    cityService.updateFunds(challenge.reward);
                    this.emit('challengeCompleted', challenge);
                }
            }
        });
    }

    getAchievements(): Achievement[] {
        return this.achievements;
    }

    getChallenges(): Challenge[] {
        return this.challenges;
    }
}

export const achievementService = new AchievementService();
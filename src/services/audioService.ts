import { Howl, Howler } from 'howler';
import { environmentService, WeatherCondition } from './environmentService';

class AudioService {
    private backgroundMusic: Howl;
    private ambientSounds: {[key: string]: Howl} = {};
    private weatherSounds: {[key: string]: Howl} = {};
    private soundEffects: {[key: string]: Howl} = {};
    private currentAmbient: Howl | null = null;
    private currentWeather: Howl | null = null;
    private isMuted: boolean = false;

    constructor() {
        this.loadSounds();
        setInterval(() => this.updateAudio(), 10000); // Update every 10 seconds
    }

    private loadSounds() {
        this.backgroundMusic = new Howl({ src: ['/audio/background_music.mp3'], loop: true, volume: 0.5 });

        this.ambientSounds = {
            day: new Howl({ src: ['/sounds/day_ambient.mp3'], loop: true, volume: 0.5 }),
            night: new Howl({ src: ['/sounds/night_ambient.mp3'], loop: true, volume: 0.5 }),
        };

        this.weatherSounds = {
            clear: new Howl({ src: ['/sounds/clear_weather.mp3'], loop: true, volume: 0.3 }),
            cloudy: new Howl({ src: ['/sounds/cloudy_weather.mp3'], loop: true, volume: 0.3 }),
            rainy: new Howl({ src: ['/sounds/rain.mp3'], loop: true, volume: 0.5 }),
            snowy: new Howl({ src: ['/sounds/snow.mp3'], loop: true, volume: 0.4 }),
        };

        this.soundEffects = {
            build: new Howl({ src: ['/audio/build_sound.mp3'] }),
            upgrade: new Howl({ src: ['/audio/upgrade_sound.mp3'] }),
            error: new Howl({ src: ['/audio/error_sound.mp3'] }),
            success: new Howl({ src: ['/audio/success_sound.mp3'] }),
        };
    }

    private updateAudio() {
        if (!this.isMuted) {
            const time = environmentService.getTime();
            const weather = environmentService.getWeather();

            this.updateAmbientSound(time);
            this.updateWeatherSound(weather);
        }
    }

    private updateAmbientSound(time: number) {
        const newAmbient = time >= 6 && time < 20 ? this.ambientSounds.day : this.ambientSounds.night;

        if (this.currentAmbient !== newAmbient) {
            if (this.currentAmbient) {
                this.currentAmbient.fade(0.5, 0, 2000);
                setTimeout(() => this.currentAmbient?.stop(), 2000);
            }
            this.currentAmbient = newAmbient;
            this.currentAmbient.fade(0, 0.5, 2000);
            this.currentAmbient.play();
        }
    }

    private updateWeatherSound(weather: WeatherCondition) {
        const newWeather = this.weatherSounds[weather.type];

        if (this.currentWeather !== newWeather) {
            if (this.currentWeather) {
                this.currentWeather.fade(this.currentWeather.volume(), 0, 2000);
                setTimeout(() => this.currentWeather?.stop(), 2000);
            }
            this.currentWeather = newWeather;
            this.currentWeather.fade(0, weather.intensity * 0.5, 2000);
            this.currentWeather.play();
        } else if (this.currentWeather) {
            this.currentWeather.volume(weather.intensity * 0.5);
        }
    }

    playBackgroundMusic(): void {
        if (!this.isMuted) {
            this.backgroundMusic.play();
        }
    }

    stopBackgroundMusic(): void {
        this.backgroundMusic.stop();
    }

    playSoundEffect(effect: 'build' | 'upgrade' | 'error' | 'success'): void {
        if (!this.isMuted && this.soundEffects[effect]) {
            this.soundEffects[effect].play();
        }
    }

    setVolume(volume: number): void {
        const clampedVolume = Math.max(0, Math.min(1, volume));
        Howler.volume(clampedVolume);
    }

    mute(): void {
        this.isMuted = true;
        Howler.mute(true);
    }

    unmute(): void {
        this.isMuted = false;
        Howler.mute(false);
    }

    toggleMute(): void {
        this.isMuted = !this.isMuted;
        Howler.mute(this.isMuted);
    }
}

export const audioService = new AudioService();
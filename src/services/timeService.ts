class TimeService {
    private time: number = 0;
    private speed: number = 1;
    private callbacks: (() => void)[] = [];
  
    constructor() {
      setInterval(() => {
        this.time = (this.time + 0.001 * this.speed) % 1;
        this.callbacks.forEach(callback => callback());
      }, 16); // ~60 FPS
    }
  
    getTime(): number {
      return this.time;
    }
  
    setSpeed(speed: number): void {
      this.speed = speed;
    }
  
    addCallback(callback: () => void): void {
      this.callbacks.push(callback);
    }
  
    removeCallback(callback: () => void): void {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    }
  
    getFormattedTime(): string {
      const hours = Math.floor(this.time * 24);
      const minutes = Math.floor((this.time * 24 * 60) % 60);
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
  }
  
  export const timeService = new TimeService();
  
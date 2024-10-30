import { EventEmitter } from 'events';
import { cityService, CityData } from './cityService';

interface Player {
  id: string;
  name: string;
  cityData: CityData;
}

interface TradeOffer {
  fromPlayerId: string;
  toPlayerId: string;
  resource: string;
  amount: number;
}

class MultiplayerService extends EventEmitter {
  private players: Map<string, Player> = new Map();
  private games: Map<string, Set<string>> = new Map(); // gameId -> Set of playerIds

  createGame(playerName: string): string {
    const gameId = this.generateUniqueId();
    const playerId = this.addPlayer(gameId, playerName);
    this.games.set(gameId, new Set([playerId]));
    return gameId;
  }

  joinGame(gameId: string, playerName: string): string | null {
    if (!this.games.has(gameId)) {
      return null;
    }
    const playerId = this.addPlayer(gameId, playerName);
    this.games.get(gameId)!.add(playerId);
    this.emit('playerJoined', { gameId, playerId });
    return playerId;
  }

  private addPlayer(gameId: string, playerName: string): string {
    const playerId = this.generateUniqueId();
    const player: Player = {
      id: playerId,
      name: playerName,
      cityData: cityService.getCityData()
    };
    this.players.set(playerId, player);
    return playerId;
  }

  proposeTradeOffer(offer: TradeOffer) {
    if (this.players.has(offer.fromPlayerId) && this.players.has(offer.toPlayerId)) {
      this.emit('tradeOfferProposed', offer);
    }
  }

  acceptTradeOffer(offer: TradeOffer) {
    const fromPlayer = this.players.get(offer.fromPlayerId);
    const toPlayer = this.players.get(offer.toPlayerId);
    if (fromPlayer && toPlayer) {
      // Implement resource transfer logic here
      this.emit('tradeCompleted', offer);
    }
  }

  updateLeaderboard(gameId: string) {
    const gamePlayers = Array.from(this.games.get(gameId) || [])
      .map(playerId => this.players.get(playerId)!)
      .filter(Boolean);

    const leaderboard = gamePlayers.map(player => ({
      name: player.name,
      score: this.calculateScore(player.cityData)
    })).sort((a, b) => b.score - a.score);

    this.emit('leaderboardUpdated', { gameId, leaderboard });
  }

  private calculateScore(cityData: CityData): number {
    return cityData.population * cityData.happiness + cityData.funds / 1000;
  }

  private generateUniqueId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

export const multiplayerService = new MultiplayerService();